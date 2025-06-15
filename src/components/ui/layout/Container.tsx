import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export type ContainerMaxWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
export type ContainerPadding = 'none' | 'sm' | 'md' | 'lg';

export interface ContainerProps extends HTMLMotionProps<'div'> {
  /**
   * Maximum width of the container
   * @default "lg"
   */
  maxWidth?: ContainerMaxWidth;
  /**
   * Padding applied to the container
   * @default "md"
   */
  padding?: ContainerPadding;
  /**
   * Whether to center the container horizontally
   * @default true
   */
  center?: boolean;
  /**
   * HTML element to render
   * @default "div"
   */
  as?: keyof JSX.IntrinsicElements;
  /**
   * Children to render inside the container
   */
  children: React.ReactNode;
}

const StyledContainer = styled(motion.div)<ContainerProps>`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;

  ${({ maxWidth, theme }) => {
    const maxWidths = {
      xs: theme.tokens.container.maxWidth.xs,
      sm: theme.tokens.container.maxWidth.sm,
      md: theme.tokens.container.maxWidth.md,
      lg: theme.tokens.container.maxWidth.lg,
      xl: theme.tokens.container.maxWidth.xl,
      '2xl': theme.tokens.container.maxWidth['2xl'],
      full: '100%',
    };

    return css`
      max-width: ${maxWidths[maxWidth || 'lg']};
    `;
  }}

  ${({ padding, theme }) => {
    const paddings = {
      none: '0',
      sm: theme.tokens.spacing.scale.sm,
      md: theme.tokens.spacing.scale.md,
      lg: theme.tokens.spacing.scale.lg,
    };

    return css`
      padding-left: ${paddings[padding || 'md']};
      padding-right: ${paddings[padding || 'md']};
    `;
  }}

  ${({ center }) =>
    center &&
    css`
      margin-left: auto;
      margin-right: auto;
    `}
`;

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, maxWidth = 'lg', padding = 'md', center = true, as, ...props }, ref) => {
    return (
      <StyledContainer
        ref={ref}
        as={as}
        maxWidth={maxWidth}
        padding={padding}
        center={center}
        {...props}
      >
        {children}
      </StyledContainer>
    );
  }
);

Container.displayName = 'Container';
