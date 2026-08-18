import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/firebase/config';

function col(name: string) {
  if (!db) throw new Error('Firestore not configured');
  return collection(db, name);
}

// ——— Custom orders ———

export type CustomOrderStatus = 'New' | 'Quoted' | 'Accepted' | 'Printing' | 'Shipped' | 'Done' | 'Rejected';

export type CustomOrder = {
  id: string;
  name: string;
  whatsapp: string;
  email?: string;
  fileName: string;
  notes: string;
  status: CustomOrderStatus;
  quote?: number;
  createdAt: string;
};

export function subscribeCustomOrders(
  onData: (list: CustomOrder[]) => void,
  onError?: (e: Error) => void
) {
  if (!db) {
    onData([]);
    return () => {};
  }
  return onSnapshot(
    col('customOrders'),
    (snap) => {
      const list: CustomOrder[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name || '',
          whatsapp: data.whatsapp || '',
          email: data.email || '',
          fileName: data.fileName || '',
          notes: data.notes || '',
          status: (data.status as CustomOrderStatus) || 'New',
          quote: data.quote != null ? Number(data.quote) : undefined,
          createdAt:
            data.createdAt?.toDate?.()?.toISOString?.() ||
            data.createdAtIso ||
            new Date().toISOString(),
        };
      });
      list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      onData(list);
    },
    (err) => {
      console.error(err);
      onError?.(err);
      onData([]);
    }
  );
}

export async function createCustomOrder(input: {
  name: string;
  whatsapp: string;
  email?: string;
  fileName: string;
  notes: string;
}): Promise<CustomOrder> {
  if (!db) throw new Error('Firestore not configured');
  const id = 'CO-' + Date.now().toString(36).toUpperCase();
  const createdAtIso = new Date().toISOString();
  await setDoc(doc(db, 'customOrders', id), {
    ...input,
    status: 'New',
    createdAt: serverTimestamp(),
    createdAtIso,
  });
  return {
    id,
    ...input,
    status: 'New',
    createdAt: createdAtIso,
  };
}

export async function patchCustomOrder(
  id: string,
  patch: { status?: CustomOrderStatus; quote?: number; notes?: string }
): Promise<void> {
  if (!db) throw new Error('Firestore not configured');
  await updateDoc(doc(db, 'customOrders', id), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

// ——— Offers ———

export type Offer = {
  id: string;
  code: string;
  discountPercent: number;
  active: boolean;
  description: string;
};

export function subscribeOffers(onData: (list: Offer[]) => void) {
  if (!db) {
    onData([]);
    return () => {};
  }
  return onSnapshot(col('offers'), (snap) => {
    onData(
      snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          code: data.code || '',
          discountPercent: Number(data.discountPercent) || 0,
          active: data.active !== false,
          description: data.description || '',
        };
      })
    );
  });
}

export async function saveOffer(input: Omit<Offer, 'id'> & { id?: string }): Promise<void> {
  if (!db) throw new Error('Firestore not configured');
  const id = input.id || 'off_' + Date.now().toString(36);
  await setDoc(
    doc(db, 'offers', id),
    {
      code: input.code.toUpperCase().trim(),
      discountPercent: input.discountPercent,
      active: input.active,
      description: input.description,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function deleteOffer(id: string): Promise<void> {
  if (!db) throw new Error('Firestore not configured');
  await deleteDoc(doc(db, 'offers', id));
}

// ——— Reviews ———

export type Review = {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
};

export function subscribeReviews(onData: (list: Review[]) => void) {
  if (!db) {
    onData([]);
    return () => {};
  }
  return onSnapshot(col('reviews'), (snap) => {
    const list = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        productName: data.productName || '',
        customerName: data.customerName || '',
        rating: Number(data.rating) || 5,
        comment: data.comment || '',
        approved: data.approved === true,
        createdAt:
          data.createdAt?.toDate?.()?.toISOString?.() ||
          data.createdAtIso ||
          new Date().toISOString(),
      };
    });
    list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    onData(list);
  });
}

export async function patchReview(id: string, approved: boolean): Promise<void> {
  if (!db) throw new Error('Firestore not configured');
  await updateDoc(doc(db, 'reviews', id), { approved, updatedAt: serverTimestamp() });
}

export async function deleteReview(id: string): Promise<void> {
  if (!db) throw new Error('Firestore not configured');
  await deleteDoc(doc(db, 'reviews', id));
}
