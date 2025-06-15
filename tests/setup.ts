import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import { cleanup } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock ResizeObserver
window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

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

// Extend Jest matchers
expect.extend({
  toHaveStyle(element: HTMLElement, style: Record<string, string>) {
    const computedStyle = window.getComputedStyle(element);
    const pass = Object.entries(style).every(([prop, value]) => {
      // Handle Tailwind classes
      const classNames = element.getAttribute('class')?.split(' ') || [];
      for (const className of classNames) {
        if (prop === 'color' && className.includes('text-')) {
          switch (className) {
            case 'text-green-500':
              return value === 'rgb(34, 197, 94)';
            case 'text-yellow-500':
              return value === 'rgb(234, 179, 8)';
            case 'text-red-500':
              return value === 'rgb(239, 68, 68)';
            default:
              break;
          }
        }
      }
      return computedStyle[prop as any] === value;
    });

    return {
      pass,
      message: () =>
        pass
          ? `Expected element not to have style: ${JSON.stringify(style)}`
          : `Expected element to have style: ${JSON.stringify(style)}`,
    };
  },
});

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock window.getComputedStyle
const mockStyles: Record<string, string> = {
  'text-gray-900': 'rgb(17, 24, 39)',
  'text-green-500': 'rgb(34, 197, 94)',
  'text-yellow-500': 'rgb(234, 179, 8)',
  'text-blue-500': 'rgb(59, 130, 246)',
  'bg-white': 'rgb(255, 255, 255)',
  'bg-gray-200': 'rgb(229, 231, 235)',
  'text-gray-700': 'rgb(55, 65, 81)',
  'bg-blue-700': 'rgb(29, 78, 216)',
};

Object.defineProperty(window, 'getComputedStyle', {
  value: (element: Element) => {
    // Get the color from style attribute if it exists
    const styleColor = element.getAttribute('style')?.match(/color:\s*(.*?);/)?.[1];

    return {
      getPropertyValue: (prop: string) => {
        if (prop === 'color' && styleColor) {
          return styleColor;
        }

        // Map Tailwind classes to their computed values
        const classNames = element.getAttribute('class')?.split(' ') || [];
        for (const className of classNames) {
          if (prop === 'color' && className.includes('text-')) {
            return mockStyles[className] || '';
          }
          if (prop === 'background-color' && className.includes('bg-')) {
            return mockStyles[className] || '';
          }
        }

        // Default values
        if (prop === 'color') {
          return mockStyles['text-gray-900'];
        }
        if (prop === 'background-color') {
          return mockStyles['bg-white'];
        }
        return '';
      },
      color: styleColor || mockStyles['text-gray-900'],
      backgroundColor: mockStyles['bg-white'],
    };
  },
});
