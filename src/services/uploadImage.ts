import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase/config';

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

async function uploadToStorage(file: File, folder: string): Promise<string> {
  if (file.size > 8 * 1024 * 1024) {
    throw new Error('File must be under 8MB');
  }

  if (storage) {
    try {
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}_${safe}`;
      const r = ref(storage, path);
      await uploadBytes(r, file, { contentType: file.type || 'application/octet-stream' });
      return await getDownloadURL(r);
    } catch (e) {
      console.warn('Storage upload failed, using data URL', e);
    }
  }

  return await fileToDataUrl(file);
}

/** Product gallery images */
export async function uploadProductImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files allowed');
  }
  return uploadToStorage(file, 'products');
}

/** Custom order reference images (JPG, PNG, WebP, GIF, etc.) */
export async function uploadCustomOrderImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please upload an image (JPG, PNG, WebP, etc.)');
  }
  return uploadToStorage(file, 'custom-orders');
}
