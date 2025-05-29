import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { FilterProvider, useFilters } from '../FilterContext';
import type { Filters } from '../FilterContext';

const wrapper = ({
  children,
  initialFilters,
}: {
  children: ReactNode;
  initialFilters?: Filters;
}) => <FilterProvider initialFilters={initialFilters}>{children}</FilterProvider>;

describe('FilterContext', () => {
  it('should initialize with default values when no initialFilters provided', () => {
    const { result } = renderHook(() => useFilters(), {
      wrapper: ({ children }) => wrapper({ children }),
    });

    expect(result.current.filters).toEqual({
      testType: '',
      dateRange: '',
      trend: undefined,
      significance: undefined,
    });
  });

  it('should initialize with provided initialFilters', () => {
    const initialFilters: Filters = {
      testType: 'blood',
      dateRange: 'last-week',
      trend: 'increasing',
      significance: 'abnormal',
    };

    const { result } = renderHook(() => useFilters(), {
      wrapper: ({ children }) => wrapper({ children, initialFilters }),
    });

    expect(result.current.filters).toEqual(initialFilters);
  });

  it('should update filters when setFilters is called', () => {
    const { result } = renderHook(() => useFilters(), {
      wrapper: ({ children }) => wrapper({ children }),
    });

    const newFilters: Filters = {
      testType: 'urine',
      dateRange: 'last-month',
      trend: 'stable',
      significance: 'normal',
    };

    act(() => {
      result.current.setFilters(newFilters);
    });

    expect(result.current.filters).toEqual(newFilters);
  });

  it('should partially update filters', () => {
    const initialFilters: Filters = {
      testType: 'blood',
      dateRange: 'last-week',
      trend: 'increasing',
      significance: 'abnormal',
    };

    const { result } = renderHook(() => useFilters(), {
      wrapper: ({ children }) => wrapper({ children, initialFilters }),
    });

    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        testType: 'imaging',
        significance: 'critical',
      });
    });

    expect(result.current.filters).toEqual({
      ...initialFilters,
      testType: 'imaging',
      significance: 'critical',
    });
  });

  it('should throw error when used outside of FilterProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useFilters());
    }).toThrow('useFilters must be used within a FilterProvider');

    consoleError.mockRestore();
  });

  it('should maintain filter state between re-renders', () => {
    const { result, rerender } = renderHook(() => useFilters(), {
      wrapper: ({ children }) => wrapper({ children }),
    });

    const newFilters: Filters = {
      testType: 'blood',
      dateRange: 'last-month',
      trend: 'decreasing',
      significance: 'significant',
    };

    act(() => {
      result.current.setFilters(newFilters);
    });

    rerender();

    expect(result.current.filters).toEqual(newFilters);
  });
});
