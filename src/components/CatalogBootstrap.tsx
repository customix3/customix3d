import { useEffect } from 'react';
import { useProducts } from '@/store/productsStore';
import { useOrders } from '@/store/ordersStore';
import { useCustomOrders } from '@/store/customOrdersStore';

/** Loads products, orders & custom orders from Firestore */
export default function CatalogBootstrap() {
  const initProducts = useProducts((s) => s.init);
  const initOrders = useOrders((s) => s.init);
  const initCustom = useCustomOrders((s) => s.init);

  useEffect(() => {
    const u1 = initProducts();
    const u2 = initOrders();
    const u3 = initCustom();
    return () => {
      u1?.();
      u2?.();
      u3?.();
    };
  }, [initProducts, initOrders, initCustom]);

  return null;
}
