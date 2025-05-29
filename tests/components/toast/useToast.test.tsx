import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToast } from "@/components/toast/useToast";
import { toastStore } from "@/components/toast/store";

interface ToastOptions {
  message: string;
  duration?: number;
  type?: 'success' | 'error' | 'warning' | 'info';
}

interface PromiseToastOptions {
  loading: string;
  success: string;
  error: string;
}

describe("useToast", () => {
  beforeEach(() => {
    toastStore.getState().clear();
  });

  it("adds toast to store", () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.show({
        message: "Test toast",
        duration: 5000
      });
    });
    
    const toasts = toastStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toBe("Test toast");
  });

  it("removes toast from store", () => {
    const { result } = renderHook(() => useToast());
    let toastId: string;
    
    act(() => {
      toastId = result.current.show({
        message: "Remove test",
        duration: 5000
      });
    });
    
    expect(toastStore.getState().toasts).toHaveLength(1);
    
    act(() => {
      result.current.dismiss(toastId);
    });
    
    expect(toastStore.getState().toasts).toHaveLength(0);
  });

  it("updates existing toast", () => {
    const { result } = renderHook(() => useToast());
    let toastId: string;
    
    act(() => {
      toastId = result.current.show({
        message: "Original message",
        duration: 5000
      });
    });
    
    act(() => {
      result.current.update(toastId, {
        message: "Updated message"
      });
    });
    
    const toast = toastStore.getState().toasts[0];
    expect(toast.message).toBe("Updated message");
  });

  it("clears all toasts", () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.show({ message: "Toast 1", duration: 5000 });
      result.current.show({ message: "Toast 2", duration: 5000 });
      result.current.show({ message: "Toast 3", duration: 5000 });
    });
    
    expect(toastStore.getState().toasts).toHaveLength(3);
    
    act(() => {
      result.current.clearAll();
    });
    
    expect(toastStore.getState().toasts).toHaveLength(0);
  });

  it("handles toast promise state", async () => {
    const { result } = renderHook(() => useToast());
    const mockPromise = Promise.resolve("Success!");
    
    act(() => {
      result.current.promise(mockPromise, {
        loading: "Yükleniyor...",
        success: "Başarılı!",
        error: "Hata!"
      } as PromiseToastOptions);
    });
    
    // Loading durumu kontrolü
    expect(toastStore.getState().toasts[0].message).toBe("Yükleniyor...");
    
    // Promise resolve olduktan sonra
    await act(async () => {
      await mockPromise;
    });
    
    expect(toastStore.getState().toasts[0].message).toBe("Başarılı!");
  });

  it("handles toast promise error state", async () => {
    const { result } = renderHook(() => useToast());
    const mockPromise = Promise.reject(new Error("Failed!"));
    
    act(() => {
      result.current.promise(mockPromise, {
        loading: "Yükleniyor...",
        success: "Başarılı!",
        error: "Hata!"
      } as PromiseToastOptions);
    });
    
    // Loading durumu kontrolü
    expect(toastStore.getState().toasts[0].message).toBe("Yükleniyor...");
    
    // Promise reject olduktan sonra
    await act(async () => {
      try {
        await mockPromise;
      } catch (e) {
        // Error bekleniyor
      }
    });
    
    expect(toastStore.getState().toasts[0].message).toBe("Hata!");
  });

  it("respects custom duration", () => {
    const { result } = renderHook(() => useToast());
    const customDuration = 10000;
    
    act(() => {
      result.current.show({
        message: "Custom duration",
        duration: customDuration
      } as ToastOptions);
    });
    
    const toast = toastStore.getState().toasts[0];
    expect(toast.duration).toBe(customDuration);
  });
}); 