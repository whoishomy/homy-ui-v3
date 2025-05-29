'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { LabResultTrend } from '@/types/lab-results';

export interface Filters {
  testType: string;
  dateRange: string;
  trend: LabResultTrend | undefined;
  significance?: 'critical' | 'significant' | 'abnormal' | 'normal';
}

interface FilterContextType {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

interface FilterProviderProps {
  children: ReactNode;
  initialFilters?: Filters;
}

export function FilterProvider({ children, initialFilters }: FilterProviderProps) {
  const [filters, setFilters] = useState<Filters>(
    initialFilters || {
      testType: '',
      dateRange: '',
      trend: undefined,
      significance: undefined,
    }
  );

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>{children}</FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
