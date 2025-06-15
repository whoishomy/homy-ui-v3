'use client';

import React from 'react';
import styled from '@emotion/styled';
import { css, type SerializedStyles } from '@emotion/react';
import { motion, type HTMLMotionProps, type Variants } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import type { ColorPreset } from '@/types/ColorPreset';
import type { TrademarkTheme } from '@/types/TrademarkTheme';

export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'style' | 'children'> {
  /**
   * Color preset for the button
   * @default 'primary'
   */
  preset?: ColorPreset;

  /**
   * Visual variant of the button
   * @default 'solid'
   */
  variant?: ButtonVariant;

  /**
   * Size of the button
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Whether the button is in loading state
   * @default false
   */
  isLoading?: boolean;

  /**
   * Icon to show before the button text
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon to show after the button text
   */
  rightIcon?: React.ReactNode;

  /**
   * Whether to show full width button
   * @default false
   */
  isFullWidth?: boolean;

  /**
   * Whether to show interactive animations
   * @default true
   */
  interactive?: boolean;

  /**
   * Button content
   */
  children: React.ReactNode;
}

interface StyledButtonProps {
  $preset: ColorPreset;
  $variant: ButtonVariant;
  $size: ButtonSize;
  $isLoading: boolean;
  $isFullWidth: boolean;
  $interactive: boolean;
}

const sizeStyles: Record<ButtonSize, SerializedStyles> = {
  sm: css`
    height: 32px;
    padding: 0 12px;
    font-size: 0.875rem;
    gap: 6px;
  `,
  md: css`
    height: 40px;
    padding: 0 16px;
    font-size: 1rem;
    gap: 8px;
  `,
  lg: css`
    height: 48px;
    padding: 0 20px;
    font-size: 1.125rem;
    gap: 10px;
  `,
};

const StyledButton = styled(motion.button)<StyledButtonProps>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.tokens.borderRadius.md};
  font-weight: ${({ theme }) => theme.tokens.typography.weight.semibold};
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  outline: none;
  width: ${({ $isFullWidth }) => ($isFullWidth ? '100%' : 'auto')};

  ${({ $size }) => sizeStyles[$size]}

  ${({
    theme,
    $preset,
    $variant,
  }: {
    theme: TrademarkTheme;
    $preset: ColorPreset;
    $variant: ButtonVariant;
  }) => {
    const color = theme.tokens.colors[$preset];

    switch ($variant) {
      case 'solid':
        return css`
          background: ${color};
          color: ${theme.colorMode === 'dark' ? '#FFFFFF' : '#000000'};
          border: none;

          &:hover:not(:disabled) {
            filter: brightness(0.9);
          }

          &:active:not(:disabled) {
            filter: brightness(0.8);
          }
        `;
      case 'outline':
        return css`
          background: transparent;
          color: ${color};
          border: 2px solid ${color};

          &:hover:not(:disabled) {
            background: ${theme.colorMode === 'dark'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.05)'};
          }

          &:active:not(:disabled) {
            background: ${theme.colorMode === 'dark'
              ? 'rgba(255, 255, 255, 0.15)'
              : 'rgba(0, 0, 0, 0.1)'};
          }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: ${color};
          border: none;

          &:hover:not(:disabled) {
            background: ${theme.colorMode === 'dark'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.05)'};
          }

          &:active:not(:disabled) {
            background: ${theme.colorMode === 'dark'
              ? 'rgba(255, 255, 255, 0.15)'
              : 'rgba(0, 0, 0, 0.1)'};
          }
        `;
      case 'link':
        return css`
          background: transparent;
          color: ${color};
          border: none;
          padding: 0;
          height: auto;
          font-weight: ${theme.tokens.typography.weight.medium};
          text-decoration: underline;

          &:hover:not(:disabled) {
            filter: brightness(0.9);
          }

          &:active:not(:disabled) {
            filter: brightness(0.8);
          }
        `;
      default:
        return '';
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ $interactive }) =>
    $interactive &&
    css`
      &:hover:not(:disabled) {
        transform: translateY(-1px);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }
    `}

  ${({ $isLoading }) =>
    $isLoading &&
    css`
      cursor: wait;
      opacity: 0.8;
      pointer-events: none;
    `}
`;

const LoadingSpinner = styled(motion.div)`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
`;

const ContentWrapper = styled.div<{ $isLoading: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: inherit;
  opacity: ${({ $isLoading }) => ($isLoading ? 0 : 1)};
`;

const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export function Button({
  children,
  preset = 'primary',
  variant = 'solid',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  isFullWidth = false,
  interactive = true,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      $preset={preset}
      $variant={variant}
      $size={size}
      $isLoading={isLoading}
      $isFullWidth={isFullWidth}
      $interactive={interactive}
      disabled={disabled || isLoading}
      whileTap={interactive && !disabled ? { scale: 0.98 } : undefined}
      {...props}
    >
      {isLoading && (
        <LoadingSpinner variants={spinnerVariants} animate="animate" aria-label="Loading" />
      )}
      <ContentWrapper $isLoading={isLoading}>
        {leftIcon}
        {children}
        {rightIcon}
      </ContentWrapper>
    </StyledButton>
  );
}
