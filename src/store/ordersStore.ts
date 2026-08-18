import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export type Order = {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  address: string;
  city: string;
  pincode: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentId?: string;
  razorpayOrderId?: string;
};

interface OrdersState {
  orders: Order[];
  addOrder: (o: Omit<Order, 'id' | 'createdAt' | 'status'> & { status?: OrderStatus; paymentId?: string }) => Order;
  updateStatus: (id: string, status: OrderStatus) => void;
}

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (input) => {
        const order: Order = {
          ...input,
          id: 'ORD-' + Date.now().toString(36).toUpperCase(),
          createdAt: new Date().toISOString(),
          status: input.status || 'Paid',
        };
        set({ orders: [order, ...get().orders] });
        return order;
      },
      updateStatus: (id, status) => {
        set({
          orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)),
        });
      },
    }),
    { name: 'customix3d-orders' }
  )
);
