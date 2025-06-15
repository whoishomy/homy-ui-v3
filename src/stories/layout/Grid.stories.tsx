import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import styled from '@emotion/styled';
import { Grid } from '@/components/ui/layout/Grid';
import { GridItem } from '@/components/ui/layout/GridItem';
import { Button } from '@/components/ui/button/Button';
import { Card } from '@/components/ui/Card';
import { useColors, useSpacing } from '@/hooks/useThemeTokens';

const StoryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
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

const meta: Meta<typeof Grid> = {
  title: 'Layout/Grid',
  component: Grid,
  decorators: [
    (Story: React.ComponentType) => (
      <StoryContainer>
        <Story />
      </StoryContainer>
    ),
  ],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

// Basic Grid
export const Basic: Story = {
  render: () => (
    <Grid columns={3} spacing="md">
      {Array.from({ length: 3 }).map((_, i: number) => (
        <GridItem key={i}>
          <DemoBox>Column {i + 1}</DemoBox>
        </GridItem>
      ))}
    </Grid>
  ),
};

// Responsive Grid
export const Responsive: Story = {
  render: () => (
    <Grid columns={{ sm: 1, md: 2, lg: 3 }} spacing="lg">
      {Array.from({ length: 6 }).map((_, i: number) => (
        <GridItem key={i}>
          <DemoBox>Responsive Item {i + 1}</DemoBox>
        </GridItem>
      ))}
    </Grid>
  ),
};

// Dashboard Layout
export const DashboardLayout: Story = {
  render: () => (
    <Grid columns={12} spacing="lg">
      <GridItem span={12}>
        <DemoBox>Header</DemoBox>
      </GridItem>
      <GridItem span={{ sm: 12, md: 3 }}>
        <DemoBox $height="400px">Sidebar</DemoBox>
      </GridItem>
      <GridItem span={{ sm: 12, md: 9 }}>
        <Grid columns={{ sm: 1, md: 2, lg: 3 }} spacing="md">
          {Array.from({ length: 6 }).map((_, i: number) => (
            <GridItem key={i}>
              <Card>
                <DemoBox $height="200px">Dashboard Card {i + 1}</DemoBox>
              </Card>
            </GridItem>
          ))}
        </Grid>
      </GridItem>
    </Grid>
  ),
};

// Auto-fit Gallery
export const AutoFitGallery: Story = {
  render: () => (
    <Grid minChildWidth="200px" autoFit spacing="sm">
      {Array.from({ length: 8 }).map((_, i: number) => (
        <GridItem key={i}>
          <DemoBox $height="150px">Gallery Item {i + 1}</DemoBox>
        </GridItem>
      ))}
    </Grid>
  ),
};

// Complex Layout with Order
export const ComplexLayout: Story = {
  render: () => (
    <Grid columns={12} spacing="md">
      <GridItem span={12}>
        <DemoBox>Header</DemoBox>
      </GridItem>
      <GridItem span={{ sm: 12, md: 8 }} order={{ sm: 2, md: 1 }}>
        <DemoBox $height="300px">Main Content</DemoBox>
      </GridItem>
      <GridItem span={{ sm: 12, md: 4 }} order={{ sm: 1, md: 2 }}>
        <DemoBox $height="300px">Sidebar</DemoBox>
      </GridItem>
      <GridItem span={12} order={3}>
        <Grid columns={{ sm: 1, md: 3, lg: 3 }} spacing="sm">
          {Array.from({ length: 3 }).map((_, i: number) => (
            <GridItem key={i}>
              <Button variant="outline" isFullWidth>
                Action Button {i + 1}
              </Button>
            </GridItem>
          ))}
        </Grid>
      </GridItem>
    </Grid>
  ),
};

// Nested Grids
export const NestedGrids: Story = {
  render: () => (
    <Grid columns={2} spacing="lg">
      <GridItem>
        <DemoBox>Main Content</DemoBox>
        <Grid columns={2} spacing="sm" style={{ marginTop: '1rem' }}>
          <GridItem>
            <DemoBox>Nested 1</DemoBox>
          </GridItem>
          <GridItem>
            <DemoBox>Nested 2</DemoBox>
          </GridItem>
        </Grid>
      </GridItem>
      <GridItem>
        <Grid columns={1} spacing="md">
          <GridItem>
            <DemoBox>Sidebar Top</DemoBox>
          </GridItem>
          <GridItem>
            <DemoBox>Sidebar Bottom</DemoBox>
          </GridItem>
        </Grid>
      </GridItem>
    </Grid>
  ),
};
