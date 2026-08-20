import React, { createContext, useContext, useState, useEffect } from 'react';
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
    const emailNorm = email.trim().toLowerCase();
    const id = 'u_' + emailNorm.replace(/[^a-z0-9]/g, '_');

    // Prefer registered profile in Firebase (has WhatsApp)
    let profile = await findUserByEmail(emailNorm);
    if (!profile) profile = await getUserProfile(id);

    const u: User = {
      id: profile?.id || id,
      name: profile?.name || emailNorm.split('@')[0],
      email: profile?.email || emailNorm,
      whatsapp: profile?.whatsapp || '',
    };

    if (!u.whatsapp) {
      throw new Error(
        'No WhatsApp on this account. Sign up again with your WhatsApp number, or update profile.'
      );
    }

    setUser(u);
    localStorage.setItem(KEY, JSON.stringify(u));
    try {
      await saveUserProfile(u);
    } catch (e) {
      console.warn('save user profile', e);
    }
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
