import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root: Element | null = null;
  rootMargin: string = '0px';
  thresholds: number[] = [0];

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    if (options) {
      this.root = options.root instanceof Element ? options.root : null;
      this.rootMargin = options.rootMargin ?? '0px';
      this.thresholds = Array.isArray(options.threshold)
        ? options.threshold
        : [options.threshold ?? 0];
    }
  }

  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};
