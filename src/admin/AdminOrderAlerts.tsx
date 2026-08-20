import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Bell, BellOff, Volume2 } from 'lucide-react';
import { useOrders } from '@/store/ordersStore';
import { useCustomOrders } from '@/store/customOrdersStore';

const SEEN_ORDERS = 'cmx_seen_order_ids';
const SEEN_CUSTOM = 'cmx_seen_custom_ids';
const ALERTS_ON = 'cmx_admin_alerts_on';

function loadSeen(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch {
    /* ignore */
  }
  return new Set();
}

function saveSeen(key: string, set: Set<string>) {
  const arr = Array.from(set).slice(0, 500);
  localStorage.setItem(key, JSON.stringify(arr));
}

/** Loud repeating siren-style alert (Web Audio — no external file) */
function playSiren(seconds = 4) {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.35, now + 0.05);

    // Alternating high/low tones like a siren
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, now);
    for (let t = 0; t < seconds; t += 0.35) {
      osc.frequency.setValueAtTime(880, now + t);
      osc.frequency.setValueAtTime(554, now + t + 0.18);
    }
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + seconds);
    gain.gain.setValueAtTime(0.35, now + seconds - 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + seconds);

    // Extra ding dings
    for (let i = 0; i < 6; i++) {
      const ding = ctx.createOscillator();
      const g2 = ctx.createGain();
      ding.type = 'sine';
      ding.frequency.value = 1200;
      g2.gain.setValueAtTime(0.2, now + i * 0.45);
      g2.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.45 + 0.3);
      ding.connect(g2);
      g2.connect(ctx.destination);
      ding.start(now + i * 0.45);
      ding.stop(now + i * 0.45 + 0.35);
    }
  } catch (e) {
    console.warn('siren failed', e);
  }
}

function notifyBrowser(title: string, body: string, href: string) {
  try {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'granted') {
      const n = new Notification(title, {
        body,
        tag: 'cmx-order-' + Date.now(),
        requireInteraction: true,
      });
      n.onclick = () => {
        window.focus();
        window.location.href = href;
        n.close();
      };
    }
  } catch {
    /* ignore */
  }
}

export default function AdminOrderAlerts() {
  const orders = useOrders((s) => s.orders);
  const custom = useCustomOrders((s) => s.items);
  const ordersLoading = useOrders((s) => s.loading);
  const customLoading = useCustomOrders((s) => s.loading);

  const [enabled, setEnabled] = useState(() => {
    const v = localStorage.getItem(ALERTS_ON);
    return v !== '0';
  });
  const [banner, setBanner] = useState<{ title: string; href: string } | null>(null);
  const primed = useRef(false);
  const seenOrders = useRef<Set<string>>(loadSeen(SEEN_ORDERS));
  const seenCustom = useRef<Set<string>>(loadSeen(SEEN_CUSTOM));

  // First snapshot = baseline (don't siren for old orders)
  useEffect(() => {
    if (ordersLoading || customLoading) return;
    if (primed.current) return;
    orders.forEach((o) => seenOrders.current.add(o.id));
    custom.forEach((c) => seenCustom.current.add(c.id));
    saveSeen(SEEN_ORDERS, seenOrders.current);
    saveSeen(SEEN_CUSTOM, seenCustom.current);
    primed.current = true;
  }, [orders, custom, ordersLoading, customLoading]);

  useEffect(() => {
    if (!primed.current || !enabled) return;

    const newOrders = orders.filter((o) => !seenOrders.current.has(o.id));
    const newCustom = custom.filter((c) => !seenCustom.current.has(c.id));

    if (newOrders.length === 0 && newCustom.length === 0) return;

    newOrders.forEach((o) => seenOrders.current.add(o.id));
    newCustom.forEach((c) => seenCustom.current.add(c.id));
    saveSeen(SEEN_ORDERS, seenOrders.current);
    saveSeen(SEEN_CUSTOM, seenCustom.current);

    if (newOrders.length > 0) {
      const o = newOrders[0];
      const title = `🚨 New order ${o.id}`;
      const body = `${o.customerName} · ₹${o.total} · ${o.items?.length || 0} item(s)`;
      playSiren(5);
      toast.success(title + ' — ' + body, { duration: 12000, icon: '🔔' });
      notifyBrowser(title, body, '/admin/orders');
      setBanner({ title: `${title} · ${body}`, href: '/admin/orders' });
    } else if (newCustom.length > 0) {
      const c = newCustom[0];
      const title = `🚨 New custom request ${c.id}`;
      const body = `${c.name} · ${c.whatsapp}`;
      playSiren(4);
      toast.success(title + ' — ' + body, { duration: 12000, icon: '🔔' });
      notifyBrowser(title, body, '/admin/custom-orders');
      setBanner({ title: `${title} · ${body}`, href: '/admin/custom-orders' });
    }
  }, [orders, custom, enabled]);

  const toggle = async () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem(ALERTS_ON, next ? '1' : '0');
    if (next) {
      // Unlock audio + notifications after user click
      playSiren(0.6);
      if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      toast.success('Order alerts ON — you will hear a siren on new orders');
    } else {
      toast('Order alerts OFF');
    }
  };

  const test = () => {
    playSiren(3);
    toast.success('Test siren 🚨', { duration: 4000 });
    notifyBrowser('Test alert', 'CustoMix3D admin siren works', '/admin/orders');
  };

  return (
    <>
      {banner && (
        <div className="fixed inset-x-0 top-0 z-[100] animate-pulse bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg">
          <Link to={banner.href} className="underline" onClick={() => setBanner(null)}>
            {banner.title}
          </Link>
          <button
            type="button"
            className="ml-3 rounded bg-white/20 px-2 py-0.5 text-xs"
            onClick={() => setBanner(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-[90] flex flex-col gap-2">
        <button
          type="button"
          onClick={() => void toggle()}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-lg ${
            enabled
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-700 text-white'
          }`}
          title="Toggle order siren alerts"
        >
          {enabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          {enabled ? 'Alerts ON' : 'Alerts OFF'}
        </button>
        {enabled && (
          <button
            type="button"
            onClick={test}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium shadow"
          >
            <Volume2 className="h-3.5 w-3.5" /> Test siren
          </button>
        )}
      </div>
    </>
  );
}
