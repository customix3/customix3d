import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';

export type HomeSectionId =
  | 'hero'
  | 'ticker'
  | 'categories'
  | 'featured'
  | 'customBand'
  | 'liveOrders';

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
  sectionOrder: HomeSectionId[];
  hiddenSections: HomeSectionId[];
  featuredProductIds: string[];
};

export const DEFAULT_SECTION_ORDER: HomeSectionId[] = [
  'hero',
  'ticker',
  'categories',
  'featured',
  'customBand',
  'liveOrders',
];

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
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  hiddenSections: [],
  featuredProductIds: [],
};

function mergeHome(d: Record<string, unknown>): HomepageCms {
  const order = Array.isArray(d.sectionOrder)
    ? (d.sectionOrder as HomeSectionId[])
    : DEFAULT_HOME.sectionOrder;
  const hidden = Array.isArray(d.hiddenSections)
    ? (d.hiddenSections as HomeSectionId[])
    : [];
  const featured = Array.isArray(d.featuredProductIds)
    ? (d.featuredProductIds as string[]).map(String)
    : [];
  return {
    badge: String(d.badge ?? DEFAULT_HOME.badge),
    headline1: String(d.headline1 ?? DEFAULT_HOME.headline1),
    headline2: String(d.headline2 ?? DEFAULT_HOME.headline2),
    subtitle: String(d.subtitle ?? DEFAULT_HOME.subtitle),
    ctaPrimary: String(d.ctaPrimary ?? DEFAULT_HOME.ctaPrimary),
    ctaSecondary: String(d.ctaSecondary ?? DEFAULT_HOME.ctaSecondary),
    heroImage: String(d.heroImage ?? DEFAULT_HOME.heroImage),
    customTitle: String(d.customTitle ?? DEFAULT_HOME.customTitle),
    customSubtitle: String(d.customSubtitle ?? DEFAULT_HOME.customSubtitle),
    showLiveOrders: d.showLiveOrders !== false,
    sectionOrder: order.length ? order : [...DEFAULT_SECTION_ORDER],
    hiddenSections: hidden,
    featuredProductIds: featured,
  };
}

export function subscribeHomepage(onData: (h: HomepageCms) => void) {
  if (!db) {
    onData(DEFAULT_HOME);
    return () => {};
  }
  return onSnapshot(
    doc(db, 'settings', 'homepage'),
    (snap) => onData(mergeHome((snap.data() || {}) as Record<string, unknown>)),
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
