import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { CATEGORIES as DEMO_CATS } from '@/data/demoProducts';

export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  image: string;
  enabled: boolean;
  order: number;
};

export const DEFAULT_CATEGORIES: CategoryItem[] = DEMO_CATS.map((c, i) => ({
  id: c.slug,
  name: c.name,
  slug: c.slug,
  image: c.image,
  enabled: true,
  order: i,
}));

function normalize(list: CategoryItem[]): CategoryItem[] {
  return [...list]
    .map((c, i) => ({
      id: c.id || c.slug || `cat-${i}`,
      name: c.name || 'Category',
      slug: (c.slug || c.name || 'category')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),
      image: c.image || '',
      enabled: c.enabled !== false,
      order: typeof c.order === 'number' ? c.order : i,
    }))
    .sort((a, b) => a.order - b.order);
}

export function subscribeCategories(onData: (list: CategoryItem[]) => void) {
  if (!db) {
    onData(DEFAULT_CATEGORIES);
    return () => {};
  }
  return onSnapshot(
    doc(db, 'settings', 'categories'),
    (snap) => {
      const d = snap.data();
      if (d?.items && Array.isArray(d.items) && d.items.length) {
        onData(normalize(d.items as CategoryItem[]));
      } else {
        onData(DEFAULT_CATEGORIES);
      }
    },
    () => onData(DEFAULT_CATEGORIES)
  );
}

export async function saveCategories(items: CategoryItem[]): Promise<void> {
  if (!db) throw new Error('Firestore not configured');
  const normalized = normalize(items).map((c, i) => ({ ...c, order: i }));
  await setDoc(
    doc(db, 'settings', 'categories'),
    { items: normalized, updatedAt: serverTimestamp() },
    { merge: true }
  );
}
