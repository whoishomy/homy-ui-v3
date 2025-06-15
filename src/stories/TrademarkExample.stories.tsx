import type { Meta, StoryObj } from '@storybook/react';
import styled from '@emotion/styled';
import { TrademarkExample } from '../components/ui/TrademarkExample';
import { TrademarkText } from '../components/ui/TrademarkText';
import { TrademarkThemeProvider } from '../context/TrademarkThemeContext';
import { brandVariants } from '../types/TrademarkTheme';
import { FlexColumn, FlexColumnWide, HintText } from './styles';

const exampleMeta: Meta<typeof TrademarkExample> = {
  title: 'UI/Trademark',
  component: TrademarkExample,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Trademark Styling System v1.0

A comprehensive system for applying HOMY™ trademark styles across the application.

## Features

- 🎨 Responsive typography and spacing
- 🌗 Dark mode support
- 🔄 Dynamic style updates
- 📱 Breakpoint-aware
- ♿️ Accessibility-friendly

## Usage

\`\`\`tsx
// Container component
<TrademarkExample />

// Inline text
<TrademarkText variant="title">HOMY</TrademarkText>
<TrademarkText variant="body">Powered by HOMY</TrademarkText>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default exampleMeta;
type ExampleStory = StoryObj<typeof TrademarkExample>;

// Container component stories
export const ExampleDefault: ExampleStory = {};

export const CustomStyles: ExampleStory = {
  args: {
    options: {
      visualIdentity: {
        colors: {
          primary: '#FF0000',
        },
        typography: {
          fontSize: '24px',
        },
        spacing: {
          padding: '2rem',
        },
      },
    },
  },
};

// Text component stories
export const InlineText: StoryObj<typeof TrademarkText> = {
  render: () => (
    <FlexColumn>
      <TrademarkText variant="title">HOMY</TrademarkText>
      <TrademarkText variant="subtitle">Health Optimization</TrademarkText>
      <TrademarkText variant="body" showSymbol={false}>
        Powered by HOMY
      </TrademarkText>
    </FlexColumn>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Inline text components with different variants',
      },
    },
  },
};

const trademarkTextMeta: Meta<typeof TrademarkText> = {
  title: 'Typography/TrademarkText',
  component: TrademarkText,
  decorators: [
    (Story) => (
      <TrademarkThemeProvider>
        <Story />
      </TrademarkThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# HOMY™ Typography & Trademark Visual Engine v1.0

A comprehensive system for applying brand-specific trademark styles across the application.

## Features

- 🎨 Multi-brand support (HOMY™, Neuro™, Lab™)
- 🌗 Dark mode with brand-specific colors
- 📱 Responsive typography and spacing
- 🔄 Dynamic theme switching
- ♿️ Accessibility-friendly

## Usage

\`\`\`tsx
// Wrap your app with the theme provider
<TrademarkThemeProvider>
  <App />
</TrademarkThemeProvider>

// Use the TrademarkText component
<TrademarkText variant="title">HOMY</TrademarkText>

// Switch brands dynamically
const { switchBrand } = useTrademarkTheme();
switchBrand('neuro');
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['title', 'subtitle', 'body'],
      defaultValue: 'body',
    },
    showSymbol: {
      control: 'boolean',
      defaultValue: true,
    },
    options: {
      control: 'object',
    },
  },
};

type TextStory = StoryObj<typeof TrademarkText>;

// Basic examples
export const TextDefault: TextStory = {
  args: {
    children: 'HOMY',
    variant: 'title',
  },
};

// Brand variants
export const BrandVariants: StoryObj<typeof TrademarkText> = {
  render: () => (
    <FlexColumnWide>
      {brandVariants.map((brand) => (
        <FlexColumn key={brand} gap="1rem">
          <TrademarkText variant="title">{brand.toUpperCase()}</TrademarkText>
          <TrademarkText variant="subtitle">Health Optimization</TrademarkText>
          <TrademarkText variant="body" showSymbol={false}>
            Powered by {brand.toUpperCase()}
          </TrademarkText>
        </FlexColumn>
      ))}
    </FlexColumnWide>
  ),
};

// Responsive example
export const ResponsiveText: StoryObj<typeof TrademarkText> = {
  render: () => (
    <FlexColumn gap="1.5rem">
      <TrademarkText
        variant="title"
        options={{
          visualIdentity: {
            colors: {},
            spacing: {},
            typography: {
              fontSize: {
                sm: '24px',
                md: '32px',
                lg: '48px',
                xl: '64px',
              },
            },
          },
        }}
      >
        HOMY
      </TrademarkText>
      <HintText>Resize the window to see responsive typography in action</HintText>
    </FlexColumn>
  ),
};

// Dark mode example
export const DarkModeAware: StoryObj<typeof TrademarkText> = {
  render: () => (
    <FlexColumn>
      <TrademarkText variant="title">HOMY</TrademarkText>
      <HintText>Toggle system dark mode to see color adaptation</HintText>
    </FlexColumn>
  ),
};
