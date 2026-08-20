import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveUserProfile } from '@/services/firestoreAdmin';

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    const u: User = {
      id: 'u_' + email.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name: email.split('@')[0],
      email: email.trim().toLowerCase(),
      whatsapp: '',
    };
    setUser(u);
    localStorage.setItem(KEY, JSON.stringify(u));
    try {
      await saveUserProfile(u);
    } catch (e) {
      console.warn('save user profile', e);
    }
  };

  const signup = async (name: string, email: string, _password: string, whatsapp: string) => {
    const u: User = {
      id: 'u_' + email.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name: name.trim(),
      email: email.trim().toLowerCase(),
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem(KEY);
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
