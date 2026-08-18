import { useEffect } from 'react';
import { useProducts } from '@/store/productsStore';
import { useOrders } from '@/store/ordersStore';
import { useCustomOrders } from '@/store/customOrdersStore';

/** Loads products, orders & custom orders from Firestore once */
export default function CatalogBootstrap() {
  const initProducts = useProducts((s) => s.init);
  const initOrders = useOrders((s) => s.init);
  const initCustom = useCustomOrders((s) => s.init);

  useEffect(() => {
    initProducts();
    initOrders();
    initCustom();
  }, [initProducts, initOrders, initCustom]);

  return null;
}
