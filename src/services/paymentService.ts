export interface PaymentResult {
  success: boolean
  transactionId?: string
  message?: string
}

export class DemoPaymentProvider {
  async pay(amount: number): Promise<PaymentResult> {
    await new Promise((r) => setTimeout(r, 800))
    return {
      success: true,
      transactionId: 'demo_' + Date.now(),
      message: `Demo payment of ₹${amount} successful`,
    }
  }
}

export const paymentService = new DemoPaymentProvider()
