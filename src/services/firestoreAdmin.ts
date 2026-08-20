import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  getDocs,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/firebase/config';

function col(name: string) {
  if (!db) throw new Error('Firestore not configured');
  return collection(db, name);
}

export type CustomOrderStatus =
  | 'New'
  | 'Quoted'
  | 'Accepted'
  | 'Printing'
  | 'Shipped'
  | 'Done'
  | 'Rejected';

export type CustomOrder = {
  id: string;
  name: string;
  whatsapp: string;
  email?: string;
  customerId?: string;
  fileName: string;
  imageUrl?: string;
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
          customerId: data.customerId || undefined,
          fileName: data.fileName || '',
          imageUrl: data.imageUrl || undefined,
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
  customerId?: string;
  fileName: string;
  imageUrl?: string;
  notes: string;
}): Promise<CustomOrder> {
  if (!db) throw new Error('Firestore not configured');
  const id = 'CO-' + Date.now().toString(36).toUpperCase();
  const createdAtIso = new Date().toISOString();
  const payload: Record<string, unknown> = {
    name: String(input.name || ''),
    whatsapp: String(input.whatsapp || ''),
    fileName: String(input.fileName || ''),
    notes: String(input.notes || ''),
    status: 'New',
    createdAt: serverTimestamp(),
    createdAtIso,
  };
  if (input.email && input.email.trim()) payload.email = input.email.trim().toLowerCase();
  if (input.customerId) payload.customerId = input.customerId;
  if (input.imageUrl) payload.imageUrl = input.imageUrl;
  await setDoc(doc(db, 'customOrders', id), payload);
  return {
    id,
    name: String(input.name || ''),
    whatsapp: String(input.whatsapp || ''),
    email: input.email?.trim().toLowerCase() || undefined,
    customerId: input.customerId,
    fileName: String(input.fileName || ''),
    imageUrl: input.imageUrl,
    notes: String(input.notes || ''),
    status: 'New',
    createdAt: createdAtIso,
  };
}

export async function patchCustomOrder(
  id: string,
  patch: { status?: CustomOrderStatus; quote?: number; notes?: string }
): Promise<void> {
  if (!db) throw new Error('Firestore not configured');
  const data: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (patch.status !== undefined) data.status = patch.status;
  if (patch.quote !== undefined && !Number.isNaN(patch.quote)) data.quote = Number(patch.quote);
  if (patch.notes !== undefined) data.notes = patch.notes;
  await updateDoc(doc(db, 'customOrders', id), data);
}

export type FsUser = {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  createdAt: string;
};

export async function saveUserProfile(u: {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
}): Promise<void> {
  if (!db) return;
  await setDoc(
    doc(db, 'users', u.id),
    {
      name: u.name,
      email: u.email,
      whatsapp: u.whatsapp || '',
      createdAt: serverTimestamp(),
      createdAtIso: new Date().toISOString(),
    },
    { merge: true }
  );
}

/** Load registered user (incl. WhatsApp) from Firebase */
export async function getUserProfile(userId: string): Promise<FsUser | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, 'users', userId));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    name: data.name || '',
    email: data.email || '',
    whatsapp: data.whatsapp || '',
    createdAt:
      data.createdAt?.toDate?.()?.toISOString?.() ||
      data.createdAtIso ||
      new Date().toISOString(),
  };
}

export async function findUserByEmail(email: string): Promise<FsUser | null> {
  if (!db) return null;
  const target = email.trim().toLowerCase();
  const snap = await getDocs(col('users'));
  for (const d of snap.docs) {
    const data = d.data();
    if ((data.email || '').toLowerCase() === target) {
      return {
        id: d.id,
        name: data.name || '',
        email: data.email || '',
        whatsapp: data.whatsapp || '',
        createdAt:
          data.createdAt?.toDate?.()?.toISOString?.() ||
          data.createdAtIso ||
          new Date().toISOString(),
      };
    }
  }
  return null;
}

export function subscribeUsers(onData: (list: FsUser[]) => void) {
  if (!db) {
    onData([]);
    return () => {};
  }
  return onSnapshot(col('users'), (snap) => {
    const list = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        name: data.name || '',
        email: data.email || '',
        whatsapp: data.whatsapp || '',
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

export async function fetchUsersOnce(): Promise<FsUser[]> {
  if (!db) return [];
  const snap = await getDocs(col('users'));
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name || '',
      email: data.email || '',
      whatsapp: data.whatsapp || '',
      createdAt:
        data.createdAt?.toDate?.()?.toISOString?.() ||
        data.createdAtIso ||
        new Date().toISOString(),
    };
  });
}

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
      description: input.description || '',
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function deleteOffer(id: string): Promise<void> {
  if (!db) throw new Error('Firestore not configured');
  await deleteDoc(doc(db, 'offers', id));
}

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

/** Site promo popup (circular banner) */
export type PromoPopup = {
  enabled: boolean;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
};

export function subscribePromoPopup(onData: (p: PromoPopup) => void) {
  if (!db) {
    onData({ enabled: false, title: '', subtitle: '', imageUrl: '', link: '/products' });
    return () => {};
  }
  return onSnapshot(doc(db, 'settings', 'promoPopup'), (snap) => {
    const data = snap.data() || {};
    onData({
      enabled: data.enabled === true,
      title: data.title || 'Special offer',
      subtitle: data.subtitle || '',
      imageUrl: data.imageUrl || '',
      link: data.link || '/products',
    });
  });
}

export async function savePromoPopup(p: PromoPopup): Promise<void> {
  if (!db) throw new Error('Firestore not configured');
  await setDoc(
    doc(db, 'settings', 'promoPopup'),
    {
      enabled: p.enabled,
      title: p.title,
      subtitle: p.subtitle,
      imageUrl: p.imageUrl,
      link: p.link,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
