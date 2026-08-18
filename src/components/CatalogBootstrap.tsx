import { useEffect } from 'react';
import { useProducts } from '@/store/productsStore';
import { useOrders } from '@/store/ordersStore';

/** Loads products & orders from Firestore once at app root */
export default function CatalogBootstrap() {
  const initProducts = useProducts((s) => s.init);
  const initOrders = useOrders((s) => s.init);

  useEffect(() => {
    const u1 = initProducts();
    const u2 = initOrders();
    return () => {
      u1?.();
      u2?.();
    };
  }, [initProducts, initOrders]);

  return null;
}
