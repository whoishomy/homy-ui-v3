import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import type { TrademarkTheme } from '@/types/TrademarkTheme';

export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type GridSpacing = keyof TrademarkTheme['tokens']['spacing']['scale'];
export type GridAlignment = 'start' | 'center' | 'end' | 'stretch';
export type GridJustify = 'start' | 'center' | 'end' | 'between' | 'around';

export interface GridProps extends HTMLMotionProps<'div'> {
  /**
   * Number of columns in the grid
   * @default 12
   */
  columns?: GridColumns | Record<'sm' | 'md' | 'lg', GridColumns>;

  /**
   * Space between grid items
   * @default "md"
   */
  spacing?: GridSpacing | Record<'sm' | 'md' | 'lg', GridSpacing>;

  /**
   * Minimum width of each column before wrapping
   * @default "200px"
   */
  minChildWidth?: string;

  /**
   * Alignment of items along the vertical axis
   * @default "stretch"
   */
  align?: GridAlignment;

  /**
   * Alignment of items along the horizontal axis
   * @default "start"
   */
  justify?: GridJustify;

  /**
   * Whether to flow items by column instead of row
   * @default false
   */
  flowColumn?: boolean;

  /**
   * Whether to automatically fit columns to available space
   * @default false
   */
  autoFit?: boolean;

  /**
   * Whether to automatically fill columns to available space
   * @default false
   */
  autoFill?: boolean;

  /**
   * HTML element to render
   * @default "div"
   */
  as?: keyof JSX.IntrinsicElements;

  /**
   * Children to render inside the grid
   */
  children: React.ReactNode;
}

interface StyledGridProps extends Omit<GridProps, 'spacing' | 'columns'> {
  $spacing: GridProps['spacing'];
  $columns: GridProps['columns'];
}

const getResponsiveSpacing = (spacing: GridProps['spacing'], theme: TrademarkTheme) => {
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

const getResponsiveColumns = (columns: GridProps['columns'], theme: TrademarkTheme) => {
  if (typeof columns === 'number' || !columns) {
    return `repeat(${columns || 12}, minmax(0, 1fr))`;
  }

  const breakpoints = Object.keys(columns) as Array<keyof typeof columns>;
  return breakpoints
    .map((bp) => {
      const value = columns[bp];
      const breakpoint = theme.breakpoints[bp];
      return `
        @media (min-width: ${breakpoint}) {
          grid-template-columns: repeat(${value}, minmax(0, 1fr));
        }
      `;
    })
    .join('\n');
};

const StyledGrid = styled(motion.div)<StyledGridProps>`
  display: grid;
  box-sizing: border-box;

  ${({ $spacing, theme }) => css`
    gap: ${getResponsiveSpacing($spacing, theme)};
  `}

  ${({ $columns, minChildWidth, autoFit, autoFill, theme }) => {
    if (minChildWidth) {
      return css`
        grid-template-columns: repeat(
          ${autoFit ? 'auto-fit' : autoFill ? 'auto-fill' : 'auto-fit'},
          minmax(${minChildWidth}, 1fr)
        );
      `;
    }

    return css`
      grid-template-columns: ${getResponsiveColumns($columns, theme)};
    `;
  }}

  ${({ flowColumn }) =>
    flowColumn &&
    css`
      grid-auto-flow: column;
    `}

  ${({ align = 'stretch' }) => {
    const alignments = {
      start: 'start',
      center: 'center',
      end: 'end',
      stretch: 'stretch',
    };

    return css`
      align-items: ${alignments[align]};
    `;
  }}

  ${({ justify = 'start' }) => {
    const justifications = {
      start: 'start',
      center: 'center',
      end: 'end',
      between: 'space-between',
      around: 'space-around',
    };

    return css`
      justify-content: ${justifications[justify]};
    `;
  }}
`;

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      children,
      columns = 12,
      spacing = 'md',
      minChildWidth,
      align = 'stretch',
      justify = 'start',
      flowColumn = false,
      autoFit = false,
      autoFill = false,
      as,
      ...props
    },
    ref
  ) => {
    return (
      <StyledGrid
        ref={ref}
        as={as}
        $columns={columns}
        $spacing={spacing}
        minChildWidth={minChildWidth}
        align={align}
        justify={justify}
        flowColumn={flowColumn}
        autoFit={autoFit}
        autoFill={autoFill}
        {...props}
      >
        {children}
      </StyledGrid>
    );
  }
);

Grid.displayName = 'Grid';
