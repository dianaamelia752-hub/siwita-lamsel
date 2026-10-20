'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserSession } from './types';

interface AuthContextType {
  user: UserSession | null;
  setUser: (user: UserSession | null) => void;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}

const DEMO_ACCOUNTS: Record<UserRole, UserSession> = {
  WISATAWAN: {
    id: 'user-wisatawan-1',
    name: 'Budi Santoso',
    email: 'wisatawan@siwita.id',
    role: 'WISATAWAN',
  },
  PETUGAS: {
    id: 'user-petugas-1',
    name: 'Ahmad Yani (Petugas Gate)',
    email: 'petugas@siwita.id',
    role: 'PETUGAS',
    siteId: 'site-pasir-putih',
    assignedSiteName: 'Pantai Pasir Putih Lampung',
  },
  ADMIN: {
    id: 'user-admin-1',
    name: 'Siti Rahma, S.E.',
    email: 'admin@siwita.id',
    role: 'ADMIN',
  },
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loginAs: () => {},
  logout: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Muat session tersimpan atau default ke Wisatawan
    const saved = localStorage.getItem('siwita_session');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        setUser(DEMO_ACCOUNTS.WISATAWAN);
      }
    } else {
      setUser(DEMO_ACCOUNTS.WISATAWAN);
    }
    setIsLoading(false);
  }, []);

  const loginAs = (role: UserRole) => {
    const acc = DEMO_ACCOUNTS[role];
    setUser(acc);
    localStorage.setItem('siwita_session', JSON.stringify(acc));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('siwita_session');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loginAs, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
