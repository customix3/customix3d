import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase/config';

/** Resize + compress on device so upload is much smaller/faster */
export async function compressImage(
  file: File,
  maxSide = 1600,
  quality = 0.72
): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') {
    return file;
  }

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

  if (!blob || blob.size >= file.size) {
    // compression didn't help — keep original
    return file;
  }

  const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
  return new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() });
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
  percent: number; // 0–100
};

async function uploadToStorage(
  file: File,
  folder: string,
  onProgress?: (p: UploadProgress) => void
): Promise<string> {
  onProgress?.({ phase: 'compress', percent: 5 });
  const compressed = await compressImage(file);
  onProgress?.({ phase: 'compress', percent: 15 });

  if (compressed.size > 6 * 1024 * 1024) {
    throw new Error('Image still too large after compress — try a smaller photo');
  }

  if (storage) {
    try {
      const safe = compressed.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${safe}`;
      const r = ref(storage, path);
      const task = uploadBytesResumable(r, compressed, {
        contentType: compressed.type || 'image/jpeg',
        cacheControl: 'public,max-age=31536000',
      });

      const url = await new Promise<string>((resolve, reject) => {
        task.on(
          'state_changed',
          (snap) => {
            const pct =
              15 + Math.round((snap.bytesTransferred / Math.max(snap.totalBytes, 1)) * 80);
            onProgress?.({ phase: 'upload', percent: Math.min(95, pct) });
          },
          (err) => reject(err),
          async () => {
            try {
              const u = await getDownloadURL(task.snapshot.ref);
              onProgress?.({ phase: 'done', percent: 100 });
              resolve(u);
            } catch (e) {
              reject(e);
            }
          }
        );
      });
      return url;
    } catch (e) {
      console.warn('Storage upload failed, using data URL', e);
    }
  }

  onProgress?.({ phase: 'upload', percent: 50 });
  const dataUrl = await fileToDataUrl(compressed);
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
