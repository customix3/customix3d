import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase/config';

/** Resize + compress on device so upload is much smaller/faster */
export async function compressImage(
  file: File,
  maxSide = 1400,
  quality = 0.7
): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;
    const scale = Math.min(1, maxSide / Math.max(width, height));
    width = Math.round(width * scale);
    height = Math.round(height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/jpeg', quality)
    );

    if (!blob) return file;
    // Prefer compressed if smaller OR original was huge
    if (blob.size < file.size || file.size > 800_000) {
      const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
      return new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() });
    }
    return file;
  } catch {
    return file;
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export type UploadProgress = {
  phase: 'compress' | 'upload' | 'done';
  percent: number;
};

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timed out`)), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

/** Try Firebase Storage; abandon after timeout so UI never freezes */
async function tryStorageUpload(
  file: File,
  folder: string,
  onProgress?: (p: UploadProgress) => void
): Promise<string> {
  if (!storage) throw new Error('No storage');

  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${safe}`;
  const r = ref(storage, path);
  const task = uploadBytesResumable(r, file, {
    contentType: file.type || 'image/jpeg',
    cacheControl: 'public,max-age=31536000',
  });

  const uploadPromise = new Promise<string>((resolve, reject) => {
    let settled = false;
    task.on(
      'state_changed',
      (snap) => {
        const pct =
          20 + Math.round((snap.bytesTransferred / Math.max(snap.totalBytes, 1)) * 75);
        onProgress?.({ phase: 'upload', percent: Math.min(95, pct) });
      },
      (err) => {
        if (!settled) {
          settled = true;
          reject(err);
        }
      },
      async () => {
        try {
          const u = await getDownloadURL(task.snapshot.ref);
          if (!settled) {
            settled = true;
            resolve(u);
          }
        } catch (e) {
          if (!settled) {
            settled = true;
            reject(e);
          }
        }
      }
    );
  });

  // 12s max — if Storage rules block or hang, fall through
  return withTimeout(uploadPromise, 12000, 'Storage upload');
}

async function uploadToStorage(
  file: File,
  folder: string,
  onProgress?: (p: UploadProgress) => void
): Promise<string> {
  onProgress?.({ phase: 'compress', percent: 8 });
  const compressed = await compressImage(file);
  onProgress?.({ phase: 'compress', percent: 18 });

  // 1) Fast path: Firebase Storage
  try {
    onProgress?.({ phase: 'upload', percent: 22 });
    const url = await tryStorageUpload(compressed, folder, onProgress);
    onProgress?.({ phase: 'done', percent: 100 });
    return url;
  } catch (e) {
    console.warn('Storage upload skipped/failed, using local optimized image', e);
  }

  // 2) Fallback: compressed data URL (works offline rules; image still submits)
  onProgress?.({ phase: 'upload', percent: 55 });
  // If still large, compress harder
  let final = compressed;
  if (compressed.size > 900_000) {
    final = await compressImage(file, 1000, 0.55);
  }
  onProgress?.({ phase: 'upload', percent: 80 });
  const dataUrl = await fileToDataUrl(final);
  onProgress?.({ phase: 'done', percent: 100 });
  return dataUrl;
}

export async function uploadProductImage(
  file: File,
  onProgress?: (p: UploadProgress) => void
): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Only image files allowed');
  return uploadToStorage(file, 'products', onProgress);
}

export async function uploadCustomOrderImage(
  file: File,
  onProgress?: (p: UploadProgress) => void
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please upload an image (JPG, PNG, WebP, etc.)');
  }
  return uploadToStorage(file, 'custom-orders', onProgress);
}
