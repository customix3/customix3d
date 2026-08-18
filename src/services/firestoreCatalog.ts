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

function clean(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (v !== null && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date)) {
      out[k] = clean(v as Record<string, unknown>);
    } else if (Array.isArray(v)) {
      out[k] = v.map((item) =>
        item !== null && typeof item === 'object'
          ? clean(item as Record<string, unknown>)
          : item === undefined
            ? null
            : item
      );
    } else {
      out[k] = v;
    }
  }
  return out;
}

export function productsRef() {
  if (!db) throw new Error('Firestore not configured');
  return collection(db, PRODUCTS);
}

export function ordersRef() {
  if (!db) throw new Error('Firestore not configured');
  return collection(db, ORDERS);
}

function mapProduct(id: string, data: Record<string, unknown>): Product {
  const images = Array.isArray(data.images)
    ? (data.images as string[]).filter(Boolean).slice(0, 10)
    : data.image
      ? [String(data.image)]
      : [];
  const image = images[0] || String(data.image || '');
  return {
    id,
    name: String(data.name || ''),
    price: Number(data.price) || 0,
    compareAtPrice: data.compareAtPrice != null ? Number(data.compareAtPrice) : undefined,
    image,
    images,
    category: String(data.category || 'home-decor'),
    description: String(data.description || ''),
    active: data.active !== false,
  };
}

export async function seedProductsIfEmpty(): Promise<void> {
  if (!db) return;
  const snap = await getDocs(productsRef());
  if (!snap.empty) return;
  await Promise.all(
    DEMO_PRODUCTS.map((p) =>
      setDoc(
        doc(db!, PRODUCTS, p.id),
        clean({
          ...p,
          images: [p.image],
          active: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      )
    )
  );
}

export function subscribeProducts(onData: (list: Product[]) => void, onError?: (e: Error) => void) {
  if (!db) {
    onData(DEMO_PRODUCTS.map((p) => ({ ...p, images: [p.image], active: true })));
    return () => {};
  }
  // No orderBy required — avoids missing-index failures
  return onSnapshot(
    productsRef(),
    (snap) => {
      const list = snap.docs.map((d) => mapProduct(d.id, d.data() as Record<string, unknown>));
      list.sort((a, b) => a.name.localeCompare(b.name));
      onData(list);
    },
    (err) => {
      console.error('products subscribe', err);
      onError?.(err);
      onData(DEMO_PRODUCTS.map((p) => ({ ...p, images: [p.image], active: true })));
    }
  );
}

export async function createProduct(input: Omit<Product, 'id'>): Promise<Product> {
  if (!db) throw new Error('Firestore not configured');
  const id = 'p_' + Date.now().toString(36);
  const images = (input.images?.length ? input.images : input.image ? [input.image] : []).slice(0, 10);
  const image = images[0] || input.image || '';
  await setDoc(
    doc(db, PRODUCTS, id),
    clean({
      name: input.name,
      price: input.price,
      compareAtPrice: input.compareAtPrice ?? null,
      image,
      images,
      category: input.category,
      description: input.description,
      active: input.active !== false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );
  return { ...input, id, image, images, active: input.active !== false };
}

export async function patchProduct(id: string, patch: Partial<Product>): Promise<void> {
  if (!db) throw new Error('Firestore not configured');
  const data: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (patch.name !== undefined) data.name = patch.name;
  if (patch.price !== undefined) data.price = patch.price;
  if (patch.compareAtPrice !== undefined) data.compareAtPrice = patch.compareAtPrice ?? null;
  if (patch.images !== undefined) {
    const images = patch.images.filter(Boolean).slice(0, 10);
    data.images = images;
    data.image = images[0] || '';
  } else if (patch.image !== undefined) {
    data.image = patch.image;
  }
  if (patch.category !== undefined) data.category = patch.category;
  if (patch.description !== undefined) data.description = patch.description;
  if (patch.active !== undefined) data.active = patch.active;
  await updateDoc(doc(db, PRODUCTS, id), data);
}

export async function removeProduct(id: string): Promise<void> {
  if (!db) throw new Error('Firestore not configured');
  await deleteDoc(doc(db, PRODUCTS, id));
}

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
          createdAt:
            data.createdAt?.toDate?.()?.toISOString?.() ||
            data.createdAtIso ||
            new Date().toISOString(),
          customerName: data.customerName || '',
          customerEmail: data.customerEmail || '',
          customerWhatsapp: data.customerWhatsapp || '',
          address: data.address || '',
          city: data.city || '',
          pincode: data.pincode || '',
          items: data.items || [],
          total: Number(data.total) || 0,
          status: data.status || 'Paid',
          paymentId: data.paymentId || undefined,
          razorpayOrderId: data.razorpayOrderId || undefined,
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

export async function createOrderFs(
  input: Omit<FsOrder, 'id' | 'createdAt'> & { status?: string }
): Promise<FsOrder> {
  if (!db) throw new Error('Firestore not configured');
  const id = 'ORD-' + Date.now().toString(36).toUpperCase();
  const createdAtIso = new Date().toISOString();
  const payload = clean({
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerWhatsapp: input.customerWhatsapp,
    address: input.address,
    city: input.city,
    pincode: input.pincode,
    items: input.items.map((i) =>
      clean({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image ?? null,
      })
    ),
    total: input.total,
    status: input.status || 'Paid',
    paymentId: input.paymentId ?? null,
    razorpayOrderId: input.razorpayOrderId ?? null,
    createdAt: serverTimestamp(),
    createdAtIso,
  });
  await setDoc(doc(db, ORDERS, id), payload);
  return {
    ...input,
    id,
    createdAt: createdAtIso,
    status: input.status || 'Paid',
  };
}

export async function patchOrderStatus(id: string, status: string): Promise<void> {
  if (!db) throw new Error('Firestore not configured');
  await updateDoc(doc(db, ORDERS, id), { status, updatedAt: serverTimestamp() });
}
