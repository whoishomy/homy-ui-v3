'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface PatientMeta {
  name: string;
  age: number;
  riskLevel: string;
}

interface LabResult {
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  referenceRange: string;
}

interface TayfunContextType {
  isLoggedIn: boolean;
  meta: PatientMeta;
  labResults: LabResult[];
  login: () => void;
  logout: () => void;
}

const defaultMeta: PatientMeta = {
  name: 'Tayfun Erbilen',
  age: 45,
  riskLevel: 'Yüksek Risk',
};

const defaultLabResults: LabResult[] = [
  {
    name: 'Glukoz',
    value: 190,
    unit: 'mg/dL',
    status: 'critical',
    referenceRange: '70-100 mg/dL',
  },
  {
    name: 'Kreatinin',
    value: 2.1,
    unit: 'mg/dL',
    status: 'warning',
    referenceRange: '0.7-1.3 mg/dL',
  },
  {
    name: 'HbA1c',
    value: 8.4,
    unit: '%',
    status: 'critical',
    referenceRange: '4.0-5.6%',
  },
];

const TayfunContext = createContext<TayfunContextType | undefined>(undefined);

export function TayfunProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check localStorage on initial load
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tayfun_isLoggedIn') === 'true';
    }
    return false;
  });

  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem('tayfun_isLoggedIn', 'true');
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('tayfun_isLoggedIn', 'false');
  };

  return (
    <TayfunContext.Provider
      value={{
        isLoggedIn,
        meta: defaultMeta,
        labResults: defaultLabResults,
        login,
        logout,
      }}
    >
      {children}
    </TayfunContext.Provider>
  );
}

export function useTayfun() {
  const context = useContext(TayfunContext);
  if (context === undefined) {
    throw new Error('useTayfun must be used within a TayfunProvider');
  }
  return context;
}
