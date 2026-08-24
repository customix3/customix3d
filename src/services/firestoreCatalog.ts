import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import type { Product } from '@/types/product';
import { DEMO_PRODUCTS } from '@/data/demoProducts';

const PRODUCTS = 'products';
const ORDERS = 'orders';

function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (v === null || typeof v !== 'object' || Array.isArray(v)) return false;
  if ('_methodName' in (v as object)) return false;
  if (typeof (v as { toDate?: unknown }).toDate === 'function') return false;
  return Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === null;
}

function clean(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (isPlainObject(v)) out[k] = clean(v);
    else if (Array.isArray(v)) {
      out[k] = v.map((item) => {
        if (item === undefined) return null;
        if (isPlainObject(item)) return clean(item);
        return item;
      });
    } else out[k] = v;
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
  const stock = data.stock != null && data.stock !== '' ? Number(data.stock) : 99;
  let textBox: Product['textBox'] | undefined;
  if (data.textBox && typeof data.textBox === 'object') {
    const tb = data.textBox as Record<string, unknown>;
    textBox = {
      x: Number(tb.x) || 50,
      y: Number(tb.y) || 55,
      width: Number(tb.width) || 70,
      fontSize: Number(tb.fontSize) || 8,
    };
  }
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
    stock: Number.isFinite(stock) ? stock : 99,
    personalizable: data.personalizable === true,
    baseImage: data.baseImage ? String(data.baseImage) : undefined,
    textBox,
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
          name: p.name,
          price: p.price,
          compareAtPrice: p.compareAtPrice ?? null,
          image: p.image,
          images: [p.image],
          category: p.category,
          description: p.description,
          active: true,
          stock: 25,
          personalizable: (p as { personalizable?: boolean }).personalizable === true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      )
    )
  );
}

export function subscribeProducts(onData: (list: Product[]) => void, onError?: (e: Error) => void) {
  if (!db) {
    onData(DEMO_PRODUCTS.map((p) => ({ ...p, images: [p.image], active: true, stock: 25 })));
    return () => {};
  }
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
      onData(DEMO_PRODUCTS.map((p) => ({ ...p, images: [p.image], active: true, stock: 25 })));
    }
  );
}

export async function createProduct(input: Omit<Product, 'id'>): Promise<Product> {
  if (!db) throw new Error('Firestore not configured');
  const id = 'p_' + Date.now().toString(36);
  const images = (input.images?.length ? input.images : input.image ? [input.image] : []).slice(0, 10);
  const image = images[0] || input.image || '';
  const stock = input.stock != null ? Number(input.stock) : 10;
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
      stock,
      personalizable: input.personalizable === true,
      baseImage: input.baseImage || null,
      textBox: input.textBox || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );
  return {
    ...input,
    id,
    image,
    images,
    active: input.active !== false,
    stock,
    personalizable: input.personalizable === true,
  };
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
  if (patch.stock !== undefined) data.stock = Number(patch.stock);
  if (patch.personalizable !== undefined) data.personalizable = patch.personalizable === true;
  if (patch.baseImage !== undefined) data.baseImage = patch.baseImage || null;
  if (patch.textBox !== undefined) data.textBox = patch.textBox || null;
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
          paymentId: data.paymentId ? String(data.paymentId) : undefined,
          razorpayOrderId: data.razorpayOrderId ? String(data.razorpayOrderId) : undefined,
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
  const payload: Record<string, unknown> = {
    customerName: String(input.customerName || ''),
    customerEmail: String(input.customerEmail || ''),
    customerWhatsapp: String(input.customerWhatsapp || ''),
    address: String(input.address || ''),
    city: String(input.city || ''),
    pincode: String(input.pincode || ''),
    items: (input.items || []).map((i) => {
      const row: Record<string, unknown> = {
        id: String(i.id || ''),
        name: String(i.name || ''),
        price: Number(i.price) || 0,
        quantity: Number(i.quantity) || 1,
      };
      if (i.image) row.image = String(i.image);
      return row;
    }),
    total: Number(input.total) || 0,
    status: String(input.status || 'Paid'),
    createdAt: serverTimestamp(),
    createdAtIso,
  };
  if (input.paymentId && String(input.paymentId).trim()) payload.paymentId = String(input.paymentId);
  if (input.razorpayOrderId && String(input.razorpayOrderId).trim()) {
    payload.razorpayOrderId = String(input.razorpayOrderId);
  }
  await setDoc(doc(db, ORDERS, id), payload);
  return {
    id,
    createdAt: createdAtIso,
    customerName: String(input.customerName || ''),
    customerEmail: String(input.customerEmail || ''),
    customerWhatsapp: String(input.customerWhatsapp || ''),
    address: String(input.address || ''),
    city: String(input.city || ''),
    pincode: String(input.pincode || ''),
    items: input.items || [],
    total: Number(input.total) || 0,
    status: String(input.status || 'Paid'),
    paymentId: input.paymentId ? String(input.paymentId) : undefined,
    razorpayOrderId: input.razorpayOrderId ? String(input.razorpayOrderId) : undefined,
  };
}

export async function patchOrderStatus(id: string, status: string): Promise<void> {
  if (!db) throw new Error('Firestore not configured');
  await updateDoc(doc(db, ORDERS, id), { status, updatedAt: serverTimestamp() });
}
