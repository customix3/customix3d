import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import type { SavedAddress } from '@/utils/addressRules';

const MAX = 8;

export async function loadUserAddresses(userId: string): Promise<SavedAddress[]> {
  if (!db || !userId) return [];
  const snap = await getDoc(doc(db, 'users', userId));
  if (!snap.exists()) return [];
  const data = snap.data();
  const list = Array.isArray(data.addresses) ? data.addresses : [];
  return list
    .map((a: Record<string, string>) => ({
      id: String(a.id || ''),
      label: String(a.label || 'Home'),
      line1: String(a.line1 || ''),
      line2: String(a.line2 || ''),
      city: String(a.city || ''),
      state: String(a.state || ''),
      pincode: String(a.pincode || ''),
    }))
    .filter((a: SavedAddress) => a.id && a.line1);
}

export async function saveUserAddress(
  userId: string,
  addr: Omit<SavedAddress, 'id'> & { id?: string }
): Promise<SavedAddress[]> {
  if (!db || !userId) throw new Error('Not signed in');
  const existing = await loadUserAddresses(userId);
  const id = addr.id || 'addr_' + Date.now().toString(36);
  const row: SavedAddress = {
    id,
    label: (addr.label || 'Home').trim().slice(0, 30),
    line1: addr.line1.trim(),
    line2: (addr.line2 || '').trim(),
    city: addr.city.trim(),
    state: addr.state.trim(),
    pincode: addr.pincode.replace(/\D/g, '').slice(0, 6),
  };
  const without = existing.filter((a) => a.id !== id);
  const next = [row, ...without].slice(0, MAX);
  await setDoc(
    doc(db, 'users', userId),
    { addresses: next, updatedAt: serverTimestamp() },
    { merge: true }
  );
  return next;
}

export async function deleteUserAddress(userId: string, addressId: string): Promise<SavedAddress[]> {
  if (!db || !userId) throw new Error('Not signed in');
  const existing = await loadUserAddresses(userId);
  const next = existing.filter((a) => a.id !== addressId);
  await setDoc(
    doc(db, 'users', userId),
    { addresses: next, updatedAt: serverTimestamp() },
    { merge: true }
  );
  return next;
}
