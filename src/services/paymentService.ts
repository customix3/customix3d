export type PaymentResult = { paymentId: string; orderId: string };

export const paymentService = {
  async createPayment(input: {
    amount: number;
    currency: string;
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  }): Promise<{ paymentId: string }> {
    // TEST / demo provider — swap for Razorpay / Cashfree later
    await new Promise((r) => setTimeout(r, 400));
    return { paymentId: 'pay_demo_' + Date.now() };
  },

  async handlePaymentSuccess(input: { paymentId: string; orderId: string }): Promise<PaymentResult> {
    await new Promise((r) => setTimeout(r, 200));
    return { paymentId: input.paymentId, orderId: input.orderId };
  },
};
