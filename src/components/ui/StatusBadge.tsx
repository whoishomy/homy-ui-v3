import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useColorPresetClass } from '@/hooks/useColorPresetClass';
import type { ColorPreset } from '@/types/ColorPreset';

export interface StatusBadgeProps {
  /**
   * The status text to display
   */
  children: React.ReactNode;

  /**
   * The color preset to use
   * @default 'neutral'
   */
  preset?: ColorPreset;

  /**
   * Whether to use a ghost style (transparent background)
   * @default false
   */
  ghost?: boolean;

  /**
   * Whether to show a small dot indicator
   * @default false
   */
  withDot?: boolean;

  /**
   * Whether to make the badge interactive (clickable)
   * @default false
   */
  interactive?: boolean;

  /**
   * Optional click handler
   */
  onClick?: () => void;

  /**
   * Optional additional class names
   */
  className?: string;

  /**
   * Optional ARIA label
   * If not provided, children will be used
   */
  'aria-label'?: string;
}

const BadgeContainer = styled(motion.span)<{ $isInteractive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.tokens.spacing.scale.xs};
  padding: ${({ theme }) => `${theme.tokens.spacing.scale.xxs} ${theme.tokens.spacing.scale.sm}`};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.pill};
  font-size: ${({ theme }) => theme.tokens.typography.scale.sm};
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  cursor: ${({ $isInteractive }) => ($isInteractive ? 'pointer' : 'default')};
  user-select: none;
`;

const StatusDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
`;

export function StatusBadge({
  children,
  preset = 'neutral',
  ghost = false,
  withDot = false,
  interactive = false,
  onClick,
  className,
  'aria-label': ariaLabel,
}: StatusBadgeProps) {
  const colorClass = useColorPresetClass({
    preset,
    variant: 'solid',
    intensity: 'medium',
    isGhost: ghost,
    isInteractive: interactive,
  });

  const handleClick = () => {
    if (interactive && onClick) {
      onClick();
    }
  };

  const motionProps = interactive
    ? {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
      }
    : {};

  return (
    <BadgeContainer
      className={`${colorClass} ${className || ''}`}
      $isInteractive={interactive}
      onClick={handleClick}
      role={interactive ? 'button' : 'status'}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      tabIndex={interactive ? 0 : undefined}
      {...motionProps}
    >
      {withDot && <StatusDot />}
      {children}
    </BadgeContainer>
  );
}
