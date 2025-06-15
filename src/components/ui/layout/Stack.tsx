import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import type { TrademarkTheme } from '@/types/TrademarkTheme';

export type StackDirection = 'vertical' | 'horizontal';
export type StackSpacing = keyof TrademarkTheme['tokens']['spacing']['scale'];
export type StackAlignment = 'start' | 'center' | 'end' | 'stretch';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around';

export interface StackProps extends HTMLMotionProps<'div'> {
  /**
   * Direction of the stack layout
   * @default "vertical"
   */
  direction?: StackDirection;

  /**
   * Whether to reverse the direction of items
   * @default false
   */
  reverse?: boolean;

  /**
   * Space between stack items
   * @default "md"
   */
  spacing?: StackSpacing | Record<'sm' | 'md' | 'lg', StackSpacing>;

  /**
   * Whether items should wrap when they run out of space
   * @default false
   */
  wrap?: boolean;

  /**
   * Whether to show dividers between items
   * @default false
   */
  divider?: boolean | React.ReactNode;

  /**
   * Alignment of items along the cross axis
   * @default "stretch"
   */
  align?: StackAlignment;

  /**
   * Alignment of items along the main axis
   * @default "start"
   */
  justify?: StackJustify;

  /**
   * HTML element to render
   * @default "div"
   */
  as?: keyof JSX.IntrinsicElements;

  /**
   * Children to render inside the stack
   */
  children: React.ReactNode;
}

interface StyledStackProps extends Omit<StackProps, 'spacing'> {
  $spacing: StackProps['spacing'];
}

const getResponsiveSpacing = (spacing: StackProps['spacing'], theme: TrademarkTheme) => {
  if (typeof spacing === 'string' || !spacing) {
    return theme.tokens.spacing.scale[spacing || 'md'];
  }

  const breakpoints = Object.keys(spacing) as Array<keyof typeof spacing>;
  return breakpoints
    .map((bp) => {
      const value = spacing[bp];
      const breakpoint = theme.breakpoints[bp];
      return `
        @media (min-width: ${breakpoint}) {
          gap: ${theme.tokens.spacing.scale[value]};
        }
      `;
    })
    .join('\n');
};

const StyledStack = styled(motion.div)<StyledStackProps>`
  display: flex;
  box-sizing: border-box;

  ${({ direction = 'vertical', reverse }) => css`
    flex-direction: ${direction === 'vertical'
      ? reverse
        ? 'column-reverse'
        : 'column'
      : reverse
      ? 'row-reverse'
      : 'row'};
  `}

  ${({ $spacing, theme }) => css`
    gap: ${getResponsiveSpacing($spacing, theme)};
  `}

  ${({ wrap }) =>
    wrap &&
    css`
      flex-wrap: wrap;
    `}

  ${({ align = 'stretch' }) => {
    const alignments = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      stretch: 'stretch',
    };

    return css`
      align-items: ${alignments[align]};
    `;
  }}

  ${({ justify = 'start' }) => {
    const justifications = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      between: 'space-between',
      around: 'space-around',
    };

    return css`
      justify-content: ${justifications[justify]};
    `;
  }}
`;

const Divider = styled.div<{ isVertical: boolean }>`
  background-color: ${({ theme }) =>
    theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  ${({ isVertical }) =>
    isVertical
      ? css`
          width: 1px;
          align-self: stretch;
        `
      : css`
          height: 1px;
          width: 100%;
        `}
`;

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      children,
      direction = 'vertical',
      spacing = 'md',
      wrap = false,
      divider = false,
      align = 'stretch',
      justify = 'start',
      reverse = false,
      as,
      ...props
    },
    ref
  ) => {
    const childrenArray = React.Children.toArray(children).filter(Boolean);

    const renderDivider = (index: number) => {
      if (!divider || index === childrenArray.length - 1) return null;

      if (React.isValidElement(divider)) {
        return React.cloneElement(divider as React.ReactElement, {
          key: `divider-${index}`,
          'aria-orientation': direction === 'horizontal' ? 'vertical' : 'horizontal',
        });
      }

      return (
        <Divider
          key={`divider-${index}`}
          isVertical={direction === 'horizontal'}
          role="separator"
          aria-orientation={direction === 'horizontal' ? 'vertical' : 'horizontal'}
        />
      );
    };

    return (
      <StyledStack
        ref={ref}
        as={as}
        direction={direction}
        $spacing={spacing}
        wrap={wrap}
        align={align}
        justify={justify}
        reverse={reverse}
        {...props}
      >
        {childrenArray.map((child, index) => (
          <React.Fragment key={index}>
            {child}
            {renderDivider(index)}
          </React.Fragment>
        ))}
      </StyledStack>
    );
  }
);

Stack.displayName = 'Stack';
