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
  init: () => void;
  refresh: () => void;
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

function startSub(set: (p: Partial<State>) => void) {
  if (unsub) {
    try {
      unsub();
    } catch {
      /* ignore */
    }
    unsub = null;
  }
  set({ loading: true, error: null });
  unsub = subscribeCustomOrders(
    (items) => set({ items, loading: false, error: null }),
    (err) => set({ loading: false, error: err.message })
  );
}

export const useCustomOrders = create<State>((set, get) => ({
  items: [],
  loading: true,
  error: null,

  init: () => startSub(set),
  refresh: () => startSub(set),

  submit: async (input) => {
    const row = await createCustomOrder(input);
    const exists = get().items.some((i) => i.id === row.id);
    if (!exists) set({ items: [row, ...get().items] });
    return row;
  },

  setStatus: async (id, status, quote) => {
    await patchCustomOrder(id, {
      status,
      ...(quote != null && !Number.isNaN(quote) ? { quote } : {}),
    });
    set({
      items: get().items.map((i) =>
        i.id === id
          ? { ...i, status, ...(quote != null && !Number.isNaN(quote) ? { quote } : {}) }
          : i
      ),
    });
  },
}));

export type { CustomOrder, CustomOrderStatus };
