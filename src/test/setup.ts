import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import { toHaveNoViolations } from 'jest-axe';
import 'jest-axe/extend-expect';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock theme store
jest.mock('@/store/themeStore', () => ({
  useThemeStore: jest.fn(() => ({
    brand: 'homy',
    colorMode: 'light',
    isSystemPreference: false,
    setBrand: jest.fn(),
    setColorMode: jest.fn(),
    toggleSystemPreference: jest.fn(),
    reset: jest.fn(),
  })),
}));

// Mock matchMedia
const mockMatchMedia = (query: string): MediaQueryList => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: (event: Event) => true,
});

window.matchMedia = mockMatchMedia as unknown as (query: string) => MediaQueryList;

// Mock ResizeObserver
class ResizeObserverMock implements ResizeObserver {
  constructor(callback: ResizeObserverCallback) {}
  observe(target: Element, options?: ResizeObserverOptions) {}
  unobserve(target: Element) {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

// Mock IntersectionObserver
class IntersectionObserverMock implements IntersectionObserver {
  root: Element | null = null;
  rootMargin: string = '0px';
  thresholds: ReadonlyArray<number> = [0];

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {}
  observe(target: Element) {}
  unobserve(target: Element) {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

window.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(callback, 0);
};

// Mock cancelAnimationFrame
global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id);
};

// Mock window.fetch
const mockResponse = {
  json: () => Promise.resolve({}),
  ok: true,
  status: 200,
  statusText: 'OK',
  blob: () => Promise.resolve(new Blob()),
} as Response;

const mockFetch = jest.fn().mockImplementation(() => Promise.resolve(mockResponse));
global.fetch = mockFetch as unknown as typeof fetch;

// Mock URL APIs
window.URL.createObjectURL = jest.fn(() => 'mock-url');
window.URL.revokeObjectURL = jest.fn();

// Mock clipboard API
const mockClipboard = {
  writeText: (text: string) => Promise.resolve(),
  write: (items: ClipboardItems) => Promise.resolve(),
  readText: () => Promise.resolve('mock text'),
  read: () => Promise.resolve([new ClipboardItem({})]),
};

Object.defineProperty(navigator, 'clipboard', {
  value: mockClipboard,
  writable: true,
  configurable: true,
});

// Mock DataTransfer
class DataTransferMock implements DataTransfer {
  private data: { [key: string]: string } = {};
  dropEffect: 'none' | 'copy' | 'link' | 'move' = 'none';
  effectAllowed:
    | 'none'
    | 'copy'
    | 'copyLink'
    | 'copyMove'
    | 'link'
    | 'linkMove'
    | 'move'
    | 'all'
    | 'uninitialized' = 'all';
  files: FileList = Object.create({ length: 0 });
  items: DataTransferItemList = Object.create({ length: 0 });
  types: string[] = [];

  setData(format: string, data: string) {
    this.data[format] = data;
    if (!this.types.includes(format)) {
      this.types.push(format);
    }
  }

  getData(format: string) {
    return this.data[format] || '';
  }

  clearData(format?: string) {
    if (format) {
      delete this.data[format];
      this.types = this.types.filter((type) => type !== format);
    } else {
      this.data = {};
      this.types = [];
    }
  }

  setDragImage(image: Element, x: number, y: number) {
    // No-op implementation for testing
  }
}

// Mock ClipboardEvent
class ClipboardEventMock extends Event implements ClipboardEvent {
  clipboardData: DataTransfer;

  constructor(type: string, eventInitDict?: ClipboardEventInit) {
    super(type, eventInitDict);
    this.clipboardData = new DataTransferMock();
  }
}

global.ClipboardEvent = ClipboardEventMock as unknown as typeof ClipboardEvent;
global.DataTransfer = DataTransferMock as unknown as typeof DataTransfer;

// Set timezone for consistent date/time testing
process.env.TZ = 'UTC';

// Suppress console errors during tests
global.console.error = jest.fn();

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});
