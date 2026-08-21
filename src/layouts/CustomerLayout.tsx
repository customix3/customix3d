import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PromoPopup from '@/components/PromoPopup';
import LiveOrdersTicker from '@/components/LiveOrdersTicker';
import FloatingSarcasm from '@/components/FloatingSarcasm';
import { subscribeHomepage, DEFAULT_HOME } from '@/services/homepageCms';

export default function CustomerLayout() {
  const [showLive, setShowLive] = useState(DEFAULT_HOME.showLiveOrders);

  useEffect(() => subscribeHomepage((h) => setShowLive(h.showLiveOrders !== false)), []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <PromoPopup />
      {showLive && <LiveOrdersTicker />}
      <FloatingSarcasm />
    </div>
  );
}
