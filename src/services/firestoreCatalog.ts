import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import type { Product } from '@/types/product';
import { DEMO_PRODUCTS } from '@/data/demoProducts';

const PRODUCTS = 'products';
const ORDERS = 'orders';

export function productsRef() {
  if (!db) throw new Error('Firestore not configured');
  return collection(db, PRODUCTS);
}

export function ordersRef() {
  if (!db) throw new Error('Firestore not configured');
  return collection(db, ORDERS);
}

function mapProduct(id: string, data: Record<string, unknown>): Product {
  return {
    id,
    name: String(data.name || ''),
    price: Number(data.price) || 0,
    compareAtPrice: data.compareAtPrice != null ? Number(data.compareAtPrice) : undefined,
    image: String(data.image || ''),
    category: String(data.category || 'home-decor'),
    description: String(data.description || ''),
    active: data.active !== false,
  };
}

/** One-time seed if collection empty */
export async function seedProductsIfEmpty(): Promise<void> {
  if (!db) return;
  const snap = await getDocs(productsRef());
  if (!snap.empty) return;
  await Promise.all(
    DEMO_PRODUCTS.map((p) =>
      setDoc(doc(db!, PRODUCTS, p.id), {
        ...p,
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    )
  );
}

export function subscribeProducts(onData: (list: Product[]) => void, onError?: (e: Error) => void) {
  if (!db) {
    onData(DEMO_PRODUCTS.map((p) => ({ ...p, active: true })));
    return () => {};
  }
  const q = query(productsRef(), orderBy('name'));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => mapProduct(d.id, d.data() as Record<string, unknown>));
      onData(list);
    },
    (err) => {
      console.error('products subscribe', err);
      onError?.(err);
      onData(DEMO_PRODUCTS.map((p) => ({ ...p, active: true })));
    }
  );
}

export async function createProduct(input: Omit<Product, 'id'>): Promise<Product> {
  if (!db) throw new Error('Firestore not configured');
  const id = 'p_' + Date.now().toString(36);
  const data = {
    name: input.name,
    price: input.price,
    compareAtPrice: input.compareAtPrice ?? null,
    image: input.image,
    category: input.category,
    description: input.description,
    active: input.active !== false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, PRODUCTS, id), data);
  return { ...input, id, active: input.active !== false };
}

export async function patchProduct(id: string, patch: Partial<Product>): Promise<void> {
  if (!db) throw new Error('Firestore not configured');
  const data: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (patch.name !== undefined) data.name = patch.name;
  if (patch.price !== undefined) data.price = patch.price;
  if (patch.compareAtPrice !== undefined) data.compareAtPrice = patch.compareAtPrice ?? null;
  if (patch.image !== undefined) data.image = patch.image;
  if (patch.category !== undefined) data.category = patch.category;
  if (patch.description !== undefined) data.description = patch.description;
  if (patch.active !== undefined) data.active = patch.active;
  await updateDoc(doc(db, PRODUCTS, id), data);
}

export async function removeProduct(id: string): Promise<void> {
  if (!db) throw new Error('Firestore not configured');
  await deleteDoc(doc(db, PRODUCTS, id));
}

// ——— Orders ———

export type FsOrder = {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  address: string;
  city: string;
  pincode: string;
  items: { id: string; name: string; price: number; quantity: number; image?: string }[];
  total: number;
  status: string;
  paymentId?: string;
  razorpayOrderId?: string;
};

export function subscribeOrders(onData: (list: FsOrder[]) => void, onError?: (e: Error) => void) {
  if (!db) {
    onData([]);
    return () => {};
  }
  return onSnapshot(
    ordersRef(),
    (snap) => {
      const list: FsOrder[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAtIso || new Date().toISOString(),
          customerName: data.customerName || '',
          customerEmail: data.customerEmail || '',
          customerWhatsapp: data.customerWhatsapp || '',
          address: data.address || '',
          city: data.city || '',
          pincode: data.pincode || '',
          items: data.items || [],
          total: Number(data.total) || 0,
          status: data.status || 'Paid',
          paymentId: data.paymentId,
          razorpayOrderId: data.razorpayOrderId,
        };
      });
      list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      onData(list);
    },
    (err) => {
      console.error('orders subscribe', err);
      onError?.(err);
      onData([]);
    }
  );
}

export async function createOrderFs(input: Omit<FsOrder, 'id' | 'createdAt'> & { status?: string }): Promise<FsOrder> {
  if (!db) throw new Error('Firestore not configured');
  const id = 'ORD-' + Date.now().toString(36).toUpperCase();
  const createdAtIso = new Date().toISOString();
  await setDoc(doc(db, ORDERS, id), {
    ...input,
    status: input.status || 'Paid',
    createdAt: serverTimestamp(),
    createdAtIso,
  });
  return { ...input, id, createdAt: createdAtIso, status: input.status || 'Paid' };
}

export async function patchOrderStatus(id: string, status: string): Promise<void> {
  if (!db) throw new Error('Firestore not configured');
  await updateDoc(doc(db, ORDERS, id), { status, updatedAt: serverTimestamp() });
}
