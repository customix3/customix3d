import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';

/** Delete every document in Firestore users collection */
export async function deleteAllUsers(): Promise<number> {
  if (!db) throw new Error('Firestore not configured');
  const snap = await getDocs(collection(db, 'users'));
  let n = 0;
  for (const d of snap.docs) {
    await deleteDoc(doc(db, 'users', d.id));
    n += 1;
  }
  return n;
}
