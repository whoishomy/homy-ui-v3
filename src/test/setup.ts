import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock window.URL
const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();

// Setup mocks
beforeAll(() => {
  global.ResizeObserver = ResizeObserverMock;
  global.URL.createObjectURL = mockCreateObjectURL;
  global.URL.revokeObjectURL = mockRevokeObjectURL;
});

// Reset mocks after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock window.analytics for tests
const mockAnalytics = {
  track: vi.fn(),
};

// Extend window object with analytics mock
Object.defineProperty(window, 'analytics', {
  value: mockAnalytics,
  writable: true,
});

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  mockAnalytics.track.mockClear();
});

expect.extend(matchers);
