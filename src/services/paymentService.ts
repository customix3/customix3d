/** Razorpay TEST key — key_secret must NEVER ship in frontend */
export const RAZORPAY_KEY_ID = 'rzp_test_TRAqhKGvLnsCHg';

export type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
};

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (resp: unknown) => void) => void;
    };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout(input: {
  amountRupees: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description?: string;
}): Promise<RazorpaySuccess> {
  const ok = await loadRazorpayScript();
  if (!ok || !window.Razorpay) {
    throw new Error('Razorpay SDK failed to load');
  }

  const amountPaise = Math.round(input.amountRupees * 100);

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: RAZORPAY_KEY_ID,
      amount: amountPaise,
      currency: 'INR',
      name: 'CustoMix3D',
      description: input.description || 'Order payment',
      image: '/favicon.svg',
      prefill: {
        name: input.customerName,
        email: input.customerEmail,
        contact: input.customerPhone.replace(/\s/g, ''),
      },
      theme: { color: '#0f172a' },
      handler: (response: RazorpaySuccess) => {
        resolve(response);
      },
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled')),
      },
    });

    rzp.on('payment.failed', (resp: unknown) => {
      reject(new Error('Payment failed'));
      console.error('Razorpay failed', resp);
    });

    rzp.open();
  });
}
