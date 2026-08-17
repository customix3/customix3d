import React, { createContext, useContext, useEffect, useState } from 'react';

interface SiteContextType {
  maintenanceMode: boolean;
  setMaintenanceMode: (v: boolean) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);
const KEY = 'customix3d-maintenance';

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [maintenanceMode, setMaintenanceModeState] = useState(() => {
    if (typeof window === 'undefined') return false;
    const v = localStorage.getItem(KEY);
    return v === null ? false : v === '1';
  });

  const setMaintenanceMode = (v: boolean) => {
    setMaintenanceModeState(v);
    localStorage.setItem(KEY, v ? '1' : '0');
  };

  useEffect(() => {
    localStorage.setItem(KEY, maintenanceMode ? '1' : '0');
  }, [maintenanceMode]);

  return (
    <SiteContext.Provider value={{ maintenanceMode, setMaintenanceMode }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within SiteProvider');
  return ctx;
}
