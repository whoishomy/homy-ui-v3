import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import styled from '@emotion/styled';
import { ContentArea } from '@/components/layout/ContentArea';
import { Grid } from '@/components/ui/layout/Grid';
import { GridItem } from '@/components/ui/layout/GridItem';
import { Card } from '@/components/ui/Card';
import { TrademarkText } from '@/components/ui/TrademarkText';

const DemoBox = styled.div<{ $height?: string }>`
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

const WelcomeText = styled.p`
  margin-top: ${({ theme }) => theme.tokens.spacing.scale.md};
`;

const FullWidthContainer = styled.div`
  background: rgba(0, 0, 0, 0.05);
  padding: ${({ theme }) => theme.tokens.spacing.scale.xl};
`;

// ... existing meta ...

// Basic example
export const Basic: Story = {
  render: () => (
    <ContentArea>
      <TrademarkText variant="title">Welcome to Dashboard</TrademarkText>
      <WelcomeText>This is a basic content area example.</WelcomeText>
    </ContentArea>
  ),
};

// Without padding
export const WithoutPadding: Story = {
  render: () => (
    <ContentArea hasPadding={false}>
      <FullWidthContainer>
        <TrademarkText variant="title">Full Width Content</TrademarkText>
        <WelcomeText>This content area has no padding.</WelcomeText>
      </FullWidthContainer>
    </ContentArea>
  ),
};

// ... rest of the stories ...
