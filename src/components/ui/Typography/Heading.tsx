import React from 'react';
import styled from '@emotion/styled';
import type { Property } from 'csstype';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type HeadingWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type HeadingAlign = 'left' | 'center' | 'right';

const sizeToScale: Record<HeadingSize, string> = {
  xs: 'sm',
  sm: 'md',
  md: 'lg',
  lg: 'xl',
  xl: '2xl',
  '2xl': '2xl',
  '3xl': '3xl',
};

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * HTML heading level
   * @default "h2"
   */
  as?: HeadingLevel;

  /**
   * Visual size of the heading
   * @default "md"
   */
  size?: HeadingSize;

  /**
   * Font weight
   * @default "semibold"
   */
  weight?: HeadingWeight;

  /**
   * Text alignment
   * @default "left"
   */
  align?: HeadingAlign;

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

const StyledHeading = styled.h2<{
  $size: HeadingSize;
  $weight: HeadingWeight;
  $align: HeadingAlign;
  $noMargin: boolean;
  $truncate: boolean;
}>`
  margin: ${({ $noMargin }) => ($noMargin ? '0' : '0 0 0.5em')};
  color: ${({ theme }) => theme.text.primary};
  font-family: ${({ theme }) => theme.tokens.typography.family.sans};
  font-size: ${({ theme, $size }) => theme.tokens.typography.scale[sizeToScale[$size]]};
  font-weight: ${({ theme, $weight }) => theme.tokens.typography.weight[$weight]};
  line-height: ${({ $size }) => ($size === '3xl' || $size === '2xl' ? 1.125 : 1.25)};
  text-align: ${({ $align }) => $align};

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

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      as = 'h2',
      size = 'md',
      weight = 'semibold',
      align = 'left',
      noMargin = false,
      truncate = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <StyledHeading
        ref={ref}
        as={as}
        $size={size}
        $weight={weight}
        $align={align}
        $noMargin={noMargin}
        $truncate={truncate}
        {...props}
      >
        {children}
      </StyledHeading>
    );
  }
);

Heading.displayName = 'Heading';
