import { describe, it, expect, jest, beforeEach  } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useToast } from '../useToast';
import type { Toast } from '@/types/toast';

describe('useToast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Clear all toasts before each test
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.dismissAll();
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('adds a toast with default options', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.toast('Test message');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      message: 'Test message',
      type: 'info',
    });
  });

  it('adds a toast with custom options', () => {
    const { result } = renderHook(() => useToast());
    const customToast = {
      message: 'Custom toast',
      type: 'success' as const,
      variant: 'success' as const,
      duration: 3000,
    };
    
    act(() => {
      result.current.toast(customToast);
    });

    expect(result.current.toasts[0]).toMatchObject(customToast);
  });

  it('removes a toast after duration', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.toast('Test message', { duration: 1000 });
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('dismisses a specific toast', () => {
    const { result } = renderHook(() => useToast());
    let toastId: string;
    
    act(() => {
      toastId = result.current.toast('First toast');
      result.current.toast('Second toast');
    });

    expect(result.current.toasts).toHaveLength(2);

    act(() => {
      result.current.dismiss(toastId);
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Second toast');
  });

  it('dismisses all toasts', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.toast('First toast');
      result.current.toast('Second toast');
      result.current.toast('Third toast');
    });

    expect(result.current.toasts).toHaveLength(3);

    act(() => {
      result.current.dismissAll();
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('limits the number of toasts to MAX_TOASTS', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      for (let i = 0; i < 7; i++) {
        result.current.toast(`Toast ${i + 1}`);
      }
    });

    expect(result.current.toasts).toHaveLength(5); // MAX_TOASTS is 5
    expect(result.current.toasts[0].message).toBe('Toast 7'); // Newest first
  });

  it('updates an existing toast when id is provided', () => {
    const { result } = renderHook(() => useToast());
    const toastId = 'test-id';
    
    act(() => {
      result.current.toast('Initial message', { id: toastId });
    });

    act(() => {
      result.current.toast('Updated message', { id: toastId });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      id: toastId,
      message: 'Updated message',
    });
  });
}); 