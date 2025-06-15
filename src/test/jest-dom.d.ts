/// <reference types="@testing-library/jest-dom" />

declare namespace Jest {
  interface Matchers<R = void> extends jest.Matchers<void, R> {}
}

declare module '@testing-library/jest-dom' {
  export * from '@testing-library/jest-dom';
}
