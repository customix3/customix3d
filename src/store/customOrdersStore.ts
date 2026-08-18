import { create } from 'zustand';
import {
  subscribeCustomOrders,
  createCustomOrder,
  patchCustomOrder,
  type CustomOrder,
  type CustomOrderStatus,
} from '@/services/firestoreAdmin';

interface State {
  items: CustomOrder[];
  loading: boolean;
  error: string | null;
  init: () => () => void;
  submit: (input: {
    name: string;
    whatsapp: string;
    email?: string;
    fileName: string;
    notes: string;
  }) => Promise<CustomOrder>;
  setStatus: (id: string, status: CustomOrderStatus, quote?: number) => Promise<void>;
}

let unsub: (() => void) | null = null;

export const useCustomOrders = create<State>((set) => ({
  items: [],
  loading: true,
  error: null,
  init: () => {
    if (unsub) return unsub;
    unsub = subscribeCustomOrders(
      (items) => set({ items, loading: false, error: null }),
      (err) => set({ loading: false, error: err.message })
    );
    return () => {
      unsub?.();
      unsub = null;
    };
  },
  submit: async (input) => createCustomOrder(input),
  setStatus: async (id, status, quote) => {
    await patchCustomOrder(id, { status, ...(quote != null ? { quote } : {}) });
  },
}));

export type { CustomOrder, CustomOrderStatus };
