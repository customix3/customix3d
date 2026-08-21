import { useEffect, useState } from 'react';
import { useProducts } from '@/store/productsStore';
import PageLoader from '@/components/PageLoader';
import App from '@/App';

/** Handles the premium first-load experience. UI only. */
export default function AppShell() {
  const ready = useProducts((s) => s.ready);
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), 2200);
    return () => clearTimeout(t);
  }, []);

  const done = ready && minTimePassed;

  return (
    <>
      <PageLoader done={done} />
      <div className={done ? 'opacity-100' : 'opacity-0'} style={{ transition: 'opacity 0.4s ease' }}>
        <App />
      </div>
    </>
  );
}
