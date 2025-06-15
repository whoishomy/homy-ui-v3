import React from 'react';

interface MockMotionProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const createMockComponent = (displayName: string) => {
  const MockComponent = ({ children, ...props }: MockMotionProps): JSX.Element => (
    <div data-testid={`motion-${displayName}`} {...props}>
      {children}
    </div>
  );
  MockComponent.displayName = `Mock${displayName}`;
  return MockComponent;
};

// Motion components
export const motion = new Proxy(
  {},
  {
    get: (_, prop) => createMockComponent(prop.toString()),
  }
);

// AnimatePresence
export const AnimatePresence = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <>{children}</>
);

// Hooks
export const useAnimation = jest.fn(() => ({
  start: jest.fn(),
  stop: jest.fn(),
  set: jest.fn(),
}));

export const useMotionValue = jest.fn((initial) => ({
  get: () => initial,
  set: jest.fn(),
  onChange: jest.fn(),
}));

export const useTransform = jest.fn((input, inputRange, outputRange) => ({
  get: () => outputRange[0],
  set: jest.fn(),
}));

export const useCycle = jest.fn((...args) => [args[0], jest.fn()]);

// Utilities
export const transform = {
  interpolate: jest.fn((input, inputRange, outputRange) => outputRange[0]),
};

// Types
export const MotionConfig = createMockComponent('MotionConfig');
export const LayoutGroup = createMockComponent('LayoutGroup');

// Variants
export const Variants = {};
export const Variant = {};
export const Target = {};

// Gestures
export const useGesture = jest.fn();
export const useDragControls = jest.fn(() => ({
  start: jest.fn(),
  set: jest.fn(),
}));

// Spring
export const spring = jest.fn();
export const useSpring = jest.fn((initial) => ({
  get: () => initial,
  set: jest.fn(),
}));
