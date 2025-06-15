import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

export interface ContentAreaProps {
  /**
   * Content
   */
  children: React.ReactNode;

  /**
   * Whether to show padding
   * @default true
   */
  hasPadding?: boolean;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Animation variants
   */
  variants?: any;
}

const ContentContainer = styled(motion.main)<{ $hasPadding: boolean }>`
  min-height: calc(100vh - 72px);
  padding: ${({ theme, $hasPadding }) => ($hasPadding ? theme.tokens.spacing.scale.lg : 0)};
  background: ${({ theme }) =>
    theme.colorMode === 'dark' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.5)'};
  backdrop-filter: blur(4px);
  border-radius: ${({ theme }) => theme.tokens.borderRadius.lg};
`;

export function ContentArea({
  children,
  hasPadding = true,
  className,
  variants,
}: ContentAreaProps) {
  return (
    <ContentContainer
      className={className}
      $hasPadding={hasPadding}
      variants={variants}
      role="main"
    >
      {children}
    </ContentContainer>
  );
}
