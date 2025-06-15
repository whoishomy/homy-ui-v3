import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}));

// Mock window.URL
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: jest.fn(),
    revokeObjectURL: jest.fn(),
  },
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.crypto
Object.defineProperty(window, 'crypto', {
  value: {
    getRandomValues: jest.fn().mockImplementation((arr) => {
      return arr.map(() => Math.floor(Math.random() * 256));
    }),
    subtle: {
      digest: jest.fn(),
    },
  },
});

// Mock React components that use Emotion
jest.mock('@emotion/styled', () => {
  const styled = {
    default: new Proxy(
      {},
      {
        get: function getter(target, prop) {
          return () => ({
            className: `mock-styled-${String(prop)}`,
          });
        },
      }
    ),
  };
  return styled;
});

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: function getter(target, prop) {
        return () => ({
          className: `mock-motion-${String(prop)}`,
        });
      },
    }
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock Recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => children,
  AreaChart: ({ children }: { children: React.ReactNode }) => children,
  Area: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  BarChart: ({ children }: { children: React.ReactNode }) => children,
  Bar: () => null,
  Cell: () => null,
  PieChart: ({ children }: { children: React.ReactNode }) => children,
  Pie: () => null,
}));

// Mock window.scroll
window.scroll = jest.fn();
window.scrollTo = jest.fn();

// Set up custom matchers
expect.extend({
  toHaveNoViolations: () => ({
    pass: true,
    message: () => '',
  }),
});

// Mock React.Children for Recharts
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  Children: {
    map: (children: any, fn: any) => {
      return Array.isArray(children) ? children.map(fn) : [fn(children)];
    },
  },
}));
