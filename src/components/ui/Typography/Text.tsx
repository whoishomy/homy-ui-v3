import React from 'react';
import styled from '@emotion/styled';

export type TextSize = 'xs' | 'sm' | 'md' | 'lg';
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type TextAlign = 'left' | 'center' | 'right';
export type TextVariant = 'default' | 'muted' | 'emphasized' | 'code';

const variantStyles = {
  default: (theme: any) => `
    color: ${theme.text.primary};
  `,
  muted: (theme: any) => `
    color: ${theme.text.secondary};
  `,
  emphasized: (theme: any) => `
    color: ${theme.text.primary};
    font-weight: ${theme.tokens.typography.weight.medium};
  `,
  code: (theme: any) => `
    color: ${theme.text.primary};
    font-family: ${theme.tokens.typography.family.mono};
    background: ${theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
    padding: 0.2em 0.4em;
    border-radius: ${theme.tokens.borderRadius.sm};
  `,
};

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * HTML element to render
   * @default "p"
   */
  as?: keyof JSX.IntrinsicElements;

  /**
   * Visual variant
   * @default "default"
   */
  variant?: TextVariant;

  /**
   * Text size
   * @default "md"
   */
  size?: TextSize;

  /**
   * Font weight
   * @default "normal"
   */
  weight?: TextWeight;

  /**
   * Text alignment
   * @default "left"
   */
  align?: TextAlign;

  /**
   * Whether to trim margin
   * @default false
   */
  noMargin?: boolean;

  /**
   * Whether to truncate text with ellipsis
   * @default false
   */
  truncate?: boolean;
}

const StyledText = styled.p<{
  $variant: TextVariant;
  $size: TextSize;
  $weight: TextWeight;
  $align: TextAlign;
  $noMargin: boolean;
  $truncate: boolean;
}>`
  margin: ${({ $noMargin }) => ($noMargin ? '0' : '0 0 1em')};
  font-size: ${({ theme, $size }) => theme.tokens.typography.scale[$size]};
  font-weight: ${({ theme, $weight }) => theme.tokens.typography.weight[$weight]};
  line-height: 1.5;
  text-align: ${({ $align }) => $align};

  ${({ theme, $variant }) => variantStyles[$variant](theme)}

  ${({ $truncate }) =>
    $truncate &&
    `
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `}

  &::selection {
    background: ${({ theme }) =>
      theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      as = 'p',
      variant = 'default',
      size = 'md',
      weight = 'normal',
      align = 'left',
      noMargin = false,
      truncate = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <StyledText
        ref={ref}
        as={as}
        $variant={variant}
        $size={size}
        $weight={weight}
        $align={align}
        $noMargin={noMargin}
        $truncate={truncate}
        {...props}
      >
        {children}
      </StyledText>
    );
  }
);

Text.displayName = 'Text';
