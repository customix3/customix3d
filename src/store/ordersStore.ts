import { create } from 'zustand';
import {
  subscribeOrders,
  createOrderFs,
  patchOrderStatus,
  type FsOrder,
} from '@/services/firestoreCatalog';

export type OrderStatus =
  | 'Pending'
  | 'Paid'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type Order = FsOrder & { status: OrderStatus };

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  init: () => () => void;
  refresh: () => void;
  addOrder: (
    o: Omit<Order, 'id' | 'createdAt' | 'status'> & {
      status?: OrderStatus;
      paymentId?: string;
      razorpayOrderId?: string;
    }
  ) => Promise<Order>;
  updateStatus: (id: string, status: OrderStatus) => Promise<void>;
}

let unsub: (() => void) | null = null;

function startSub(set: (p: Partial<OrdersState>) => void) {
  if (unsub) {
    try {
      unsub();
    } catch {}
    unsub = null;
  }
  set({ loading: true, error: null });
  unsub = subscribeOrders(
    (list) => {
      set({
        orders: list.map((o) => ({ ...o, status: (o.status as OrderStatus) || 'Paid' })),
        loading: false,
        error: null,
      });
    },
    (err) => {
      set({ loading: false, error: err.message });
    }
  );
}

export const useOrders = create<OrdersState>((set, get) => ({
  orders: [],
  loading: true,
  error: null,

  init: () => {
    startSub(set);
    return () => {
      // keep live subscription for admin + customer (do not kill on layout remount)
    };
  },

  refresh: () => startSub(set),

  addOrder: async (input) => {
    const order = await createOrderFs({
      ...input,
      status: input.status || 'Paid',
    });
    const mapped: Order = { ...order, status: (order.status as OrderStatus) || 'Paid' };
    // Optimistic: show immediately in admin + customer before snapshot
    const exists = get().orders.some((o) => o.id === mapped.id);
    if (!exists) {
      set({ orders: [mapped, ...get().orders] });
    }
    return mapped;
  },

  updateStatus: async (id, status) => {
    await patchOrderStatus(id, status);
    set({
      orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)),
    });
  },
}));
