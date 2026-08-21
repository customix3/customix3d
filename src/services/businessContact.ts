import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';

export type BusinessContact = {
  whatsapp: string;
  email: string;
};

const DEFAULT: BusinessContact = {
  whatsapp: '+919999999999',
  email: 'support@customix3d.com',
};

export function subscribeBusinessContact(onData: (c: BusinessContact) => void) {
  if (!db) {
    onData(DEFAULT);
    return () => {};
  }
  return onSnapshot(
    doc(db, 'settings', 'businessContact'),
    (snap) => {
      const d = snap.data() || {};
      onData({
        whatsapp: (d.whatsapp as string) || DEFAULT.whatsapp,
        email: (d.email as string) || DEFAULT.email,
      });
    },
    () => onData(DEFAULT)
  );
}

export async function saveBusinessContact(c: BusinessContact): Promise<void> {
  if (!db) throw new Error('Firestore not configured');
  await setDoc(
    doc(db, 'settings', 'businessContact'),
    {
      whatsapp: c.whatsapp.trim(),
      email: c.email.trim(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
