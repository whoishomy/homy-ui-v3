import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import styled from '@emotion/styled';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { TrademarkText } from '@/components/ui/TrademarkText';
import { Button } from '@/components/ui/button/Button';
import { Card } from '@/components/ui/Card';
import { Grid } from '@/components/ui/layout/Grid';
import { GridItem } from '@/components/ui/layout/GridItem';

// Styled components
const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.tokens.spacing.scale.md};
`;

interface DemoBoxProps {
  $height?: string;
}

const DemoBox = styled.div<DemoBoxProps>`
  padding: ${({ theme }) => theme.tokens.spacing.scale.md};
  background: ${({ theme }) => theme.tokens.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.tokens.borderRadius.md};
  height: ${({ $height }) => $height || 'auto'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.tokens.spacing.scale.sm};
  padding: ${({ theme }) => theme.tokens.spacing.scale.md};
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

const meta: Meta<typeof DashboardLayout> = {
  title: 'Layout/DashboardLayout',
  component: DashboardLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Dashboard Layout

A flexible layout component for building dashboard interfaces. Features:

- Responsive sidebar with collapsible support
- Sticky header with blur effect
- Dark mode support
- Framer Motion animations
- Grid-based content area
- Semantic HTML structure

## Usage

\`\`\`tsx
<DashboardLayout
  header={<Header />}
  sidebar={<Sidebar />}
  isSidebarCollapsed={false}
>
  <Content />
</DashboardLayout>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DashboardLayout>;

// Basic example
export const Basic: Story = {
  render: () => (
    <DashboardLayout
      header={
        <HeaderContainer>
          <TrademarkText variant="title">HOMY™</TrademarkText>
          <ThemeSwitcher />
        </HeaderContainer>
      }
      sidebar={
        <SidebarNav>
          <NavItem href="#">Dashboard</NavItem>
          <NavItem href="#">Analytics</NavItem>
          <NavItem href="#">Settings</NavItem>
        </SidebarNav>
      }
    >
      <Grid columns={{ sm: 1, md: 2, lg: 3 }} spacing="lg">
        {Array.from({ length: 6 }).map((_, i) => (
          <GridItem key={i}>
            <Card>
              <DemoBox $height="200px">Card {i + 1}</DemoBox>
            </Card>
          </GridItem>
        ))}
      </Grid>
    </DashboardLayout>
  ),
};

// With collapsed sidebar
export const CollapsedSidebar: Story = {
  render: () => (
    <DashboardLayout
      header={
        <HeaderContainer>
          <TrademarkText variant="title">HOMY™</TrademarkText>
          <ThemeSwitcher />
        </HeaderContainer>
      }
      sidebar={
        <SidebarNav>
          <NavItem href="#">📊</NavItem>
          <NavItem href="#">📈</NavItem>
          <NavItem href="#">⚙️</NavItem>
        </SidebarNav>
      }
      isSidebarCollapsed
    >
      <Grid columns={{ sm: 1, md: 2, lg: 4 }} spacing="md">
        {Array.from({ length: 8 }).map((_, i) => (
          <GridItem key={i}>
            <Card>
              <DemoBox $height="150px">Card {i + 1}</DemoBox>
            </Card>
          </GridItem>
        ))}
      </Grid>
    </DashboardLayout>
  ),
};

// Without sidebar
export const NoSidebar: Story = {
  render: () => (
    <DashboardLayout
      header={
        <HeaderContainer>
          <TrademarkText variant="title">HOMY™</TrademarkText>
          <ThemeSwitcher />
        </HeaderContainer>
      }
    >
      <Grid columns={{ sm: 1, md: 2, lg: 3 }} spacing="lg">
        {Array.from({ length: 6 }).map((_, i) => (
          <GridItem key={i}>
            <Card>
              <DemoBox $height="200px">Card {i + 1}</DemoBox>
            </Card>
          </GridItem>
        ))}
      </Grid>
    </DashboardLayout>
  ),
};

// Complex layout
export const ComplexLayout: Story = {
  render: () => (
    <DashboardLayout
      header={
        <HeaderContainer>
          <TrademarkText variant="title">HOMY™</TrademarkText>
          <HeaderActions>
            <Button variant="outline">New Report</Button>
            <ThemeSwitcher />
          </HeaderActions>
        </HeaderContainer>
      }
      sidebar={
        <SidebarNav>
          <NavItem href="#">Dashboard</NavItem>
          <NavItem href="#">Analytics</NavItem>
          <NavItem href="#">Reports</NavItem>
          <NavItem href="#">Settings</NavItem>
          <NavItem href="#">Help</NavItem>
        </SidebarNav>
      }
    >
      <Grid columns={12} spacing="lg">
        <GridItem span={12}>
          <Card>
            <DemoBox $height="200px">Overview Chart</DemoBox>
          </Card>
        </GridItem>
        <GridItem span={{ sm: 12, md: 8 }}>
          <Card>
            <DemoBox $height="400px">Detailed Analytics</DemoBox>
          </Card>
        </GridItem>
        <GridItem span={{ sm: 12, md: 4 }}>
          <Grid columns={1} spacing="md">
            <GridItem>
              <Card>
                <DemoBox $height="180px">Summary 1</DemoBox>
              </Card>
            </GridItem>
            <GridItem>
              <Card>
                <DemoBox $height="180px">Summary 2</DemoBox>
              </Card>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </DashboardLayout>
  ),
};
