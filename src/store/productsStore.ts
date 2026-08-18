import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types/product';
import { DEMO_PRODUCTS } from '@/data/demoProducts';

interface ProductsState {
  products: Product[];
  addProduct: (p: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getById: (id: string) => Product | undefined;
}

export const useProducts = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: DEMO_PRODUCTS.map((p) => ({ ...p, active: true })),
      addProduct: (input) => {
        const product: Product = {
          ...input,
          id: 'p_' + Date.now().toString(36),
          active: input.active !== false,
        };
        set({ products: [product, ...get().products] });
        return product;
      },
      updateProduct: (id, patch) => {
        set({
          products: get().products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        });
      },
      deleteProduct: (id) => {
        set({ products: get().products.filter((p) => p.id !== id) });
      },
      getById: (id) => get().products.find((p) => p.id === id),
    }),
    { name: 'customix3d-products' }
  )
);
