import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import styled from '@emotion/styled';
import { Header } from '@/components/layout/Header';
import { TrademarkText } from '@/components/ui/TrademarkText';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { Button } from '@/components/ui/button/Button';

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.tokens.spacing.scale.md};
`;

const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.tokens.spacing.scale.md};
`;

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Header Component

A flexible header component for dashboard layouts with the following features:

- 🎨 Theme-aware styling
- 🌗 Dark mode support
- 🌫️ Optional blur effect
- 📱 Responsive design
- ♿️ ARIA compliant
- ✨ Framer Motion animations

## Usage

\`\`\`tsx
<Header>
  <TrademarkText>Brand</TrademarkText>
  <HeaderActions>
    <Button>Action</Button>
  </HeaderActions>
</Header>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    hasBlur: {
      control: 'boolean',
      description: 'Whether to show blur effect',
      defaultValue: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

// Basic example
export const Basic: Story = {
  render: () => (
    <Header>
      <TrademarkText variant="title">HOMY™</TrademarkText>
    </Header>
  ),
};

// With actions
export const WithActions: Story = {
  render: () => (
    <Header>
      <TrademarkText variant="title">HOMY™</TrademarkText>
      <HeaderActions>
        <Button variant="outline">Settings</Button>
        <Button>New Project</Button>
      </HeaderActions>
    </Header>
  ),
};

// With theme switcher
export const WithThemeSwitcher: Story = {
  render: () => (
    <Header>
      <TrademarkText variant="title">HOMY™</TrademarkText>
      <ThemeSwitcher />
    </Header>
  ),
};

// Without blur
export const WithoutBlur: Story = {
  render: () => (
    <Header hasBlur={false}>
      <TrademarkText variant="title">HOMY™</TrademarkText>
      <HeaderActions>
        <Button variant="outline">Settings</Button>
        <ThemeSwitcher />
      </HeaderActions>
    </Header>
  ),
};

// Complex example
export const Complex: Story = {
  render: () => (
    <Header>
      <NavGroup>
        <TrademarkText variant="title">HOMY™</TrademarkText>
        <Button variant="ghost" size="sm">
          Dashboard
        </Button>
        <Button variant="ghost" size="sm">
          Analytics
        </Button>
        <Button variant="ghost" size="sm">
          Settings
        </Button>
      </NavGroup>
      <HeaderActions>
        <Button variant="outline">Help</Button>
        <Button variant="outline">Account</Button>
        <ThemeSwitcher />
      </HeaderActions>
    </Header>
  ),
};

// Mobile responsive
export const MobileResponsive: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <Header>
      <TrademarkText variant="title">HOMY™</TrademarkText>
      <HeaderActions>
        <Button size="sm" variant="outline">
          Menu
        </Button>
        <ThemeSwitcher />
      </HeaderActions>
    </Header>
  ),
};
