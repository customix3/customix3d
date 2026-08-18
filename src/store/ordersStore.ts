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
  addOrder: (
    o: Omit<Order, 'id' | 'createdAt' | 'status'> & { status?: OrderStatus; paymentId?: string }
  ) => Promise<Order>;
  updateStatus: (id: string, status: OrderStatus) => Promise<void>;
}

let unsub: (() => void) | null = null;

export const useOrders = create<OrdersState>((set) => ({
  orders: [],
  loading: true,
  error: null,

  init: () => {
    if (unsub) return unsub;
    set({ loading: true });
    unsub = subscribeOrders(
      (list) => {
        set({
          orders: list.map((o) => ({ ...o, status: o.status as OrderStatus })),
          loading: false,
          error: null,
        });
      },
      (err) => {
        set({ loading: false, error: err.message });
      }
    );
    return () => {
      unsub?.();
      unsub = null;
    };
  },

  addOrder: async (input) => {
    const order = await createOrderFs({
      ...input,
      status: input.status || 'Paid',
    });
    return { ...order, status: (order.status as OrderStatus) || 'Paid' };
  },

  updateStatus: async (id, status) => {
    await patchOrderStatus(id, status);
  },
}));
