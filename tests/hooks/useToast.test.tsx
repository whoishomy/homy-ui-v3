import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToast } from "@/hooks/useToast";

describe("useToast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe("Toast Queue Management", () => {
    it("should handle multiple toasts with same ID by updating existing toast", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ message: "First message" }, { id: "test-1" });
        result.current.toast({ message: "Updated message" }, { id: "test-1" });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe("Updated message");
    });

    it("should respect MAX_TOASTS limit", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        for (let i = 0; i < 7; i++) {
          result.current.toast({ message: `Message ${i}` });
        }
      });

      expect(result.current.toasts).toHaveLength(5);
      expect(result.current.toasts[0].message).toBe("Message 6");
    });

    it("should maintain FIFO order when queue is full", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        for (let i = 0; i < 6; i++) {
          result.current.toast({ message: `Message ${i}` });
        }
      });

      const messages = result.current.toasts.map(t => t.message);
      expect(messages).toEqual([
        "Message 5",
        "Message 4",
        "Message 3",
        "Message 2",
        "Message 1"
      ]);
    });
  });

  describe("Duration and Dismissal", () => {
    it("should auto-dismiss toast after duration", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ message: "Test message" }, { duration: 1000 });
      });

      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it("should not auto-dismiss toast with duration 0", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ message: "Persistent message" }, { duration: 0 });
      });

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(result.current.toasts).toHaveLength(1);
    });

    it("should manually dismiss specific toast", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ message: "First" }, { id: "1" });
        result.current.toast({ message: "Second" }, { id: "2" });
      });

      act(() => {
        result.current.dismiss("1");
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].id).toBe("2");
    });

    it("should clear all toasts", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ message: "One" });
        result.current.toast({ message: "Two" });
        result.current.toast({ message: "Three" });
      });

      act(() => {
        result.current.dismissAll();
      });

      expect(result.current.toasts).toHaveLength(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid toast creation and dismissal", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.toast({ message: `Message ${i}` });
          if (i % 2 === 0) {
            result.current.dismissAll();
          }
        }
      });

      expect(result.current.toasts).toHaveLength(2); // Last two messages
    });

    it("should cleanup timeouts on unmount", () => {
      const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");
      const { result, unmount } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ message: "Test 1" }, { duration: 1000 });
        result.current.toast({ message: "Test 2" }, { duration: 2000 });
      });

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
    });

    it("should handle toast updates during auto-dismiss period", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ message: "Original" }, { id: "test", duration: 2000 });
      });

      act(() => {
        vi.advanceTimersByTime(1000);
        result.current.toast({ message: "Updated" }, { id: "test", duration: 2000 });
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe("Updated");

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.toasts).toHaveLength(0);
    });
  });
}); 