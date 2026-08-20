/** Normalize phone for wa.me (digits only, keep country code) */
export function waPhone(raw: string): string {
  let d = (raw || '').replace(/\D/g, '');
  // If only 10 digits, assume India
  if (d.length === 10) d = '91' + d;
  return d;
}

export function waChatUrl(phone: string, text: string): string {
  const p = waPhone(phone);
  return `https://wa.me/${p}?text=${encodeURIComponent(text)}`;
}

export function shippedMessage(orderId: string, customerName: string): string {
  return `Hi ${customerName}, your CustoMix3D order *${orderId}* has been *Shipped*! Track status on our site under My Orders. Thank you!`;
}

export function refundMessage(orderId: string, customerName: string, total: number): string {
  return `Hi ${customerName}, your CustoMix3D order *${orderId}* (Rs ${total}) was cancelled. Refund is being processed and should reflect in 5-7 business days. Contact us if you need help.`;
}
