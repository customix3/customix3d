import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase/config';

/** Upload image file to Firebase Storage; falls back to data-URL if Storage fails */
export async function uploadProductImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files allowed');
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error('Image must be under 8MB');
  }

  if (storage) {
    try {
      const path = `products/${Date.now()}_${Math.random().toString(36).slice(2)}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const r = ref(storage, path);
      await uploadBytes(r, file, { contentType: file.type });
      return await getDownloadURL(r);
    } catch (e) {
      console.warn('Storage upload failed, using local data URL', e);
    }
  }

  // Fallback: embed as data URL (works without Storage rules)
  return await fileToDataUrl(file);
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
