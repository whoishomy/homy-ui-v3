import '@testing-library/jest-dom';

// Mock next/font
jest.mock('next/font/google', () => ({
  Geist: () => ({
    className: 'geist',
    style: { fontFamily: 'Geist' },
  }),
  Geist_Mono: () => ({
    className: 'geist-mono',
    style: { fontFamily: 'Geist Mono' },
  }),
}));

// Mock canvas
jest.mock('canvas', () => {
  return {
    createCanvas: jest.fn(() => ({
      getContext: jest.fn(),
      toDataURL: jest.fn(),
      width: 0,
      height: 0,
    })),
    loadImage: jest.fn(),
  };
});

// Mock PDF renderer
jest.mock('@react-pdf/renderer', () => ({
  pdf: jest.fn(() => ({
    toBlob: jest.fn().mockResolvedValue(new Blob()),
    toBuffer: jest.fn().mockResolvedValue(Buffer.from([])),
  })),
  Document: 'Document',
  Page: 'Page',
  Text: 'Text',
  View: 'View',
  StyleSheet: {
    create: jest.fn().mockReturnValue({}),
  },
  Font: {
    register: jest.fn(),
  },
}));

// Mock crypto for UUID generation
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid',
  },
});

// Mock DOM environment for node
if (typeof window === 'undefined') {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true,
  });

  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;

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
}
