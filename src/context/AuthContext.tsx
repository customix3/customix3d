import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { saveUserProfile, findUserByEmail, getUserProfile } from '@/services/firestoreAdmin';

export interface User {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, whatsapp: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const KEY = 'customix3d-user';

function digits(s: string) {
  return (s || '').replace(/\D/g, '');
}

function clearLocal() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    clearLocal();
  }, []);

  /** If account was deleted in Firebase → force logout (no manual clear needed) */
  const validateSession = useCallback(
    async (u: User) => {
      try {
        let profile = await getUserProfile(u.id);
        if (!profile && u.email) profile = await findUserByEmail(u.email);
        if (!profile || !profile.whatsapp) {
          logout();
          return null;
        }
        const synced: User = {
          id: profile.id,
          name: profile.name || u.name,
          email: profile.email || u.email,
          whatsapp: profile.whatsapp,
        };
        setUser(synced);
        localStorage.setItem(KEY, JSON.stringify(synced));
        return synced;
      } catch {
        // network error — keep local session
        return u;
      }
    },
    [logout]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = localStorage.getItem(KEY);
        if (!raw) {
          if (!cancelled) setLoading(false);
          return;
        }
        const parsed = JSON.parse(raw) as User;
        if (!cancelled) setUser(parsed);
        // Auto logout if wiped from Firebase
        await validateSession(parsed);
      } catch {
        clearLocal();
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [validateSession]);

  // Re-check every 45s while logged in (catches admin “Delete all users”)
  useEffect(() => {
    if (!user) return;
    const id = window.setInterval(() => {
      void validateSession(user);
    }, 45000);
    return () => clearInterval(id);
  }, [user, validateSession]);

  // Re-check when tab becomes visible again
  useEffect(() => {
    if (!user) return;
    const onVis = () => {
      if (document.visibilityState === 'visible') void validateSession(user);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [user, validateSession]);

  const login = async (email: string, _password: string) => {
    const emailNorm = email.trim().toLowerCase();
    const id = 'u_' + emailNorm.replace(/[^a-z0-9]/g, '_');

    let profile = await findUserByEmail(emailNorm);
    if (!profile) profile = await getUserProfile(id);

    if (!profile || !profile.whatsapp) {
      throw new Error(
        'Account not found or no WhatsApp. Please sign up with your WhatsApp number.'
      );
    }

    const u: User = {
      id: profile.id,
      name: profile.name || emailNorm.split('@')[0],
      email: profile.email || emailNorm,
      whatsapp: profile.whatsapp,
    };

    setUser(u);
    localStorage.setItem(KEY, JSON.stringify(u));
  };

  const signup = async (name: string, email: string, _password: string, whatsapp: string) => {
    const phone = digits(whatsapp);
    if (phone.length < 10) {
      throw new Error('Enter a valid 10-digit WhatsApp number');
    }
    const emailNorm = email.trim().toLowerCase();
    const u: User = {
      id: 'u_' + emailNorm.replace(/[^a-z0-9]/g, '_'),
      name: name.trim(),
      email: emailNorm,
      whatsapp: whatsapp.trim(),
    };
    setUser(u);
    localStorage.setItem(KEY, JSON.stringify(u));
    try {
      await saveUserProfile(u);
    } catch (e) {
      console.warn('save user profile', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
