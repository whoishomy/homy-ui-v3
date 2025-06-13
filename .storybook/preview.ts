import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
        {
          name: 'high-contrast',
          value: '#000000',
        },
      ],
    },
    themes: {
      default: 'light',
      list: [
        { name: 'light', class: '', color: '#ffffff', background: '#ffffff' },
        { name: 'dark', class: 'dark', color: '#ffffff', background: '#1a1a1a' },
        {
          name: 'high-contrast',
          class: 'high-contrast dark',
          color: '#ffffff',
          background: '#000000',
        },
      ],
    },
  },
};

export default preview;
