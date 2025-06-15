import '../src/styles/globals.css';
import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';

// Theme decorator configuration
export const decorators = [
  withThemeByClassName({
    themes: {
      light: 'theme-light',
      dark: 'theme-dark',
      'high-contrast': 'theme-hc',
    },
    defaultTheme: 'light',
    parentSelector: 'html', // Apply theme class to html element
  }),
];

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
  decorators,
};

export default preview;
