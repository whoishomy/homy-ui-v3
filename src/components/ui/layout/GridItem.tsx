import React from 'react';
import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import type { ResponsiveValue } from '@/types/ResponsiveValue';

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: ResponsiveValue<number>;
  offset?: ResponsiveValue<number>;
  order?: ResponsiveValue<number>;
  colStart?: ResponsiveValue<number>;
  colEnd?: ResponsiveValue<number>;
  fill?: boolean;
}

const getResponsiveValue = (
  theme: Theme,
  value?: ResponsiveValue<number>,
  defaultValue: number = 1
): string => {
  if (!value) return `span ${defaultValue}`;
  if (typeof value === 'number') return `span ${value}`;

  return Object.entries(value)
    .map(([breakpoint, val]) => {
      const mediaQuery = theme.breakpoints[breakpoint as keyof typeof theme.breakpoints];
      return `
        @media (min-width: ${mediaQuery}) {
          grid-column: span ${val};
        }
      `;
    })
    .join('\n');
};

const StyledGridItem = styled.div<GridItemProps>`
  grid-column: ${({ theme, span }) => getResponsiveValue(theme, span)};
  grid-column-start: ${({ colStart }) => colStart && `${colStart}`};
  grid-column-end: ${({ colEnd }) => colEnd && `${colEnd}`};
  margin-left: ${({ theme, offset }) =>
    offset && `calc(${(Number(offset) / 12) * 100}% + ${theme.tokens.spacing.scale.md})`};
  order: ${({ order }) => order};
  height: ${({ fill }) => (fill ? '100%' : 'auto')};
  min-width: 0;
`;

export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ children, ...props }, ref) => {
    return (
      <StyledGridItem ref={ref} {...props}>
        {children}
      </StyledGridItem>
    );
  }
);
