import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import styled from '@emotion/styled';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button/Button';
import { TrademarkText } from '@/components/ui/TrademarkText';

const NavContainer = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.tokens.spacing.scale.sm};
`;

const NavItem = styled.a`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.tokens.spacing.scale.sm};
  padding: ${({ theme }) => theme.tokens.spacing.scale.sm};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.md};
  color: ${({ theme }) =>
    theme.colorMode === 'dark' ? theme.tokens.colors.text.light : theme.tokens.colors.text.dark};
  text-decoration: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${({ theme }) =>
      theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const SectionHeader = styled.div`
  padding: ${({ theme }) => theme.tokens.spacing.scale.md};
  margin-bottom: ${({ theme }) => theme.tokens.spacing.scale.md};
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.tokens.spacing.scale.xl};
`;

const FooterContainer = styled.div`
  padding: ${({ theme }) => theme.tokens.spacing.scale.md};
  border-top: 1px solid
    ${({ theme }) =>
      theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const NavContainerFlex = styled(NavContainer)`
  flex: 1;
`;

const meta: Meta<typeof Sidebar> = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Sidebar Component

A flexible sidebar component for dashboard layouts with the following features:

- 🎨 Theme-aware styling
- 🌗 Dark mode support
- 📱 Collapsible design
- 🖱️ Custom scrollbar
- ♿️ ARIA compliant
- ✨ Framer Motion animations

## Usage

\`\`\`tsx
<Sidebar>
  <nav>
    <NavItem href="#">Dashboard</NavItem>
    <NavItem href="#">Settings</NavItem>
  </nav>
</Sidebar>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    isCollapsed: {
      control: 'boolean',
      description: 'Whether the sidebar is collapsed',
      defaultValue: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

// Basic example
export const Basic: Story = {
  render: () => (
    <Sidebar>
      <NavContainer>
        <NavItem href="#">Dashboard</NavItem>
        <NavItem href="#">Analytics</NavItem>
        <NavItem href="#">Settings</NavItem>
      </NavContainer>
    </Sidebar>
  ),
};

// Collapsed state
export const Collapsed: Story = {
  render: () => (
    <Sidebar isCollapsed>
      <NavContainer>
        <NavItem href="#">📊</NavItem>
        <NavItem href="#">📈</NavItem>
        <NavItem href="#">⚙️</NavItem>
      </NavContainer>
    </Sidebar>
  ),
};

// With header
export const WithHeader: Story = {
  render: () => (
    <Sidebar>
      <SectionHeader>
        <TrademarkText variant="subtitle">Navigation</TrademarkText>
      </SectionHeader>
      <NavContainer>
        <NavItem href="#">Dashboard</NavItem>
        <NavItem href="#">Analytics</NavItem>
        <NavItem href="#">Settings</NavItem>
      </NavContainer>
    </Sidebar>
  ),
};

// With sections
export const WithSections: Story = {
  render: () => (
    <Sidebar>
      <SectionContainer>
        <section>
          <SectionHeader>
            <TrademarkText variant="subtitle">Main</TrademarkText>
          </SectionHeader>
          <NavContainer>
            <NavItem href="#">Dashboard</NavItem>
            <NavItem href="#">Analytics</NavItem>
          </NavContainer>
        </section>

        <section>
          <SectionHeader>
            <TrademarkText variant="subtitle">Settings</TrademarkText>
          </SectionHeader>
          <NavContainer>
            <NavItem href="#">Profile</NavItem>
            <NavItem href="#">Preferences</NavItem>
          </NavContainer>
        </section>
      </SectionContainer>
    </Sidebar>
  ),
};

// With actions
export const WithActions: Story = {
  render: () => (
    <Sidebar>
      <FlexContainer>
        <NavContainerFlex>
          <NavItem href="#">Dashboard</NavItem>
          <NavItem href="#">Analytics</NavItem>
          <NavItem href="#">Settings</NavItem>
        </NavContainerFlex>
        <FooterContainer>
          <Button variant="outline" isFullWidth>
            Log Out
          </Button>
        </FooterContainer>
      </FlexContainer>
    </Sidebar>
  ),
};

// Long content with scroll
export const LongContent: Story = {
  render: () => (
    <Sidebar>
      <NavContainer>
        {Array.from({ length: 20 }).map((_, i) => (
          <NavItem key={i} href="#">
            Menu Item {i + 1}
          </NavItem>
        ))}
      </NavContainer>
    </Sidebar>
  ),
};
