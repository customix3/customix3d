import { create } from 'zustand';
import type { Product } from '@/types/product';
import { DEMO_PRODUCTS } from '@/data/demoProducts';
import {
  subscribeProducts,
  createProduct,
  patchProduct,
  removeProduct,
  seedProductsIfEmpty,
} from '@/services/firestoreCatalog';

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  ready: boolean;
  init: () => () => void;
  addProduct: (p: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: string, patch: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getById: (id: string) => Product | undefined;
}

let unsub: (() => void) | null = null;
let seeded = false;

export const useProducts = create<ProductsState>((set, get) => ({
  products: DEMO_PRODUCTS.map((p) => ({ ...p, active: true })),
  loading: true,
  error: null,
  ready: false,

  init: () => {
    if (unsub) return unsub;
    set({ loading: true, error: null });

    const run = async () => {
      try {
        if (!seeded) {
          seeded = true;
          await seedProductsIfEmpty();
        }
      } catch (e) {
        console.warn('seed products', e);
        set({
          error:
            'Firestore permission error. Publish rules for /products (see FIRESTORE_SETUP.md).',
        });
      }

      unsub = subscribeProducts(
        (list) => {
          set({
            products: list.length ? list : DEMO_PRODUCTS.map((p) => ({ ...p, active: true })),
            loading: false,
            ready: true,
            error: null,
          });
        },
        (err) => {
          set({
            loading: false,
            ready: true,
            error: err.message || 'Failed to load products from cloud',
          });
        }
      );
    };

    void run();

    return () => {
      unsub?.();
      unsub = null;
    };
  },

  addProduct: async (input) => {
    const product = await createProduct(input);
    // snapshot will refresh list
    return product;
  },

  updateProduct: async (id, patch) => {
    await patchProduct(id, patch);
  },

  deleteProduct: async (id) => {
    await removeProduct(id);
  },

  getById: (id) => get().products.find((p) => p.id === id),
}));
