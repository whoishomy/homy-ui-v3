import '../src/styles/globals.css';
import type { Preview } from '@storybook/nextjs';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    themes: {
      default: 'light',
      list: [
        { name: 'light', class: 'theme-light', color: '#ffffff' },
        { name: 'dark', class: 'theme-dark', color: '#1a1a1a' },
        { name: 'high-contrast', class: 'theme-hc', color: '#000000' },
      ],
    },
  },
};

export default preview;
