import { render, RenderOptions } from '@testing-library/react';
import * as React from 'react';
import { AllTheProviders } from '@/test/setup';

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
