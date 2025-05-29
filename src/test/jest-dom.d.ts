/// <reference types="@testing-library/jest-dom" />

declare namespace Vi {
  interface JestAssertion<T = any> extends jest.Matchers<void, T> {}
}

declare module '@testing-library/jest-dom' {
  export * from '@testing-library/jest-dom';
} 