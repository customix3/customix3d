import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SiteProvider } from './context/SiteContext';
import CatalogBootstrap from './components/CatalogBootstrap';
import AppShell from './components/AppShell';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SiteProvider>
        <AuthProvider>
          <CatalogBootstrap />
          <AppShell />
          <Toaster
            position="bottom-center"
            toastOptions={{
              className: 'font-sans text-sm font-medium',
              style: {
                background: '#12100e',
                color: '#fff',
                borderRadius: '9999px',
                border: '1px solid rgba(255,255,255,0.08)',
              },
            }}
          />
        </AuthProvider>
      </SiteProvider>
    </BrowserRouter>
  </React.StrictMode>
);
