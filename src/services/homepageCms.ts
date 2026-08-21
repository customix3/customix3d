import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';

export type HomepageCms = {
  badge: string;
  headline1: string;
  headline2: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  heroImage: string;
  customTitle: string;
  customSubtitle: string;
  showLiveOrders: boolean;
};

export const DEFAULT_HOME: HomepageCms = {
  badge: 'Miniature collectibles',
  headline1: 'Tiny worlds.',
  headline2: 'Huge presence.',
  subtitle:
    'Desk icons, shelf heroes, custom keepsakes — crafted like art, priced for everyday magic.',
  ctaPrimary: 'Explore collection',
  ctaSecondary: 'Make it custom',
  heroImage: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=900&q=80',
  customTitle: 'Your idea. Our craft. Your shelf.',
  customSubtitle:
    'Message a concept on WhatsApp — we quote, refine, and deliver a miniature that feels personal.',
  showLiveOrders: true,
};

export function subscribeHomepage(onData: (h: HomepageCms) => void) {
  if (!db) {
    onData(DEFAULT_HOME);
    return () => {};
  }
  return onSnapshot(
    doc(db, 'settings', 'homepage'),
    (snap) => {
      const d = snap.data() || {};
      onData({
        badge: d.badge ?? DEFAULT_HOME.badge,
        headline1: d.headline1 ?? DEFAULT_HOME.headline1,
        headline2: d.headline2 ?? DEFAULT_HOME.headline2,
        subtitle: d.subtitle ?? DEFAULT_HOME.subtitle,
        ctaPrimary: d.ctaPrimary ?? DEFAULT_HOME.ctaPrimary,
        ctaSecondary: d.ctaSecondary ?? DEFAULT_HOME.ctaSecondary,
        heroImage: d.heroImage ?? DEFAULT_HOME.heroImage,
        customTitle: d.customTitle ?? DEFAULT_HOME.customTitle,
        customSubtitle: d.customSubtitle ?? DEFAULT_HOME.customSubtitle,
        showLiveOrders: d.showLiveOrders !== false,
      });
    },
    () => onData(DEFAULT_HOME)
  );
}

export async function saveHomepage(h: HomepageCms): Promise<void> {
  if (!db) throw new Error('Firestore not configured');
  await setDoc(
    doc(db, 'settings', 'homepage'),
    { ...h, updatedAt: serverTimestamp() },
    { merge: true }
  );
}
