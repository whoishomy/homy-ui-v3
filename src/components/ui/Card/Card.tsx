import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import type { ColorPreset } from '@/types/TrademarkTheme';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual variant of the card
   * @default "elevated"
   */
  variant?: 'elevated' | 'outlined' | 'flat';

  /**
   * Color preset for the card
   * @default "neutral"
   */
  preset?: ColorPreset;

  /**
   * Whether the card is interactive (hoverable/clickable)
   * @default false
   */
  interactive?: boolean;

  /**
   * Whether to show full width card
   * @default false
   */
  isFullWidth?: boolean;

  /**
   * Custom padding size
   * @default "md"
   */
  padding?: 'sm' | 'md' | 'lg';

  /**
   * ARIA role for the card
   * @default "group"
   */
  role?: 'group' | 'region' | 'article';

  /**
   * Children elements
   */
  children: React.ReactNode;
}

const StyledCard = styled(motion.div)<
  Pick<CardProps, 'variant' | 'preset' | 'interactive' | 'isFullWidth' | 'padding'>
>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: ${({ isFullWidth }) => (isFullWidth ? '100%' : 'auto')};
  padding: ${({ theme, padding }) => {
    switch (padding) {
      case 'sm':
        return theme.tokens.spacing.scale.sm;
      case 'lg':
        return theme.tokens.spacing.scale.lg;
      default:
        return theme.tokens.spacing.scale.md;
    }
  }};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.lg};
  transition: all 0.2s ease-in-out;

  ${({ theme, variant, preset = 'neutral' }) => {
    const getPresetColor = (opacity = 1) =>
      preset === 'neutral'
        ? theme.colorMode === 'dark'
          ? `rgba(255, 255, 255, ${opacity})`
          : `rgba(0, 0, 0, ${opacity})`
        : theme.tokens.colors[preset];

    switch (variant) {
      case 'outlined':
        return `
          background: transparent;
          border: 1px solid ${getPresetColor(0.1)};
        `;
      case 'flat':
        return `
          background: ${getPresetColor(0.05)};
          border: none;
        `;
      default: // elevated
        return `
          background: ${theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white'};
          border: 1px solid ${getPresetColor(0.1)};
          box-shadow: ${theme.tokens.shadow.sm};
        `;
    }
  }}

  ${({ interactive, theme }) =>
    interactive &&
    `
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${theme.tokens.shadow.md};
    }

    &:active {
      transform: translateY(0);
    }
  `}
`;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'elevated',
      preset = 'neutral',
      interactive = false,
      isFullWidth = false,
      padding = 'md',
      role = 'group',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <StyledCard
        ref={ref}
        variant={variant}
        preset={preset}
        interactive={interactive}
        isFullWidth={isFullWidth}
        padding={padding}
        role={role}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        {...props}
      >
        {children}
      </StyledCard>
    );
  }
);

Card.displayName = 'Card';
