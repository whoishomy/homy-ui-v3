import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

export interface HeaderProps {
  /**
   * Header content
   */
  children: React.ReactNode;

  /**
   * Whether to show blur effect
   * @default true
   */
  hasBlur?: boolean;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Animation variants
   */
  variants?: any;
}

const HeaderContainer = styled(motion.header)<{ $hasBlur: boolean }>`
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: ${({ $hasBlur }) => ($hasBlur ? 'blur(10px)' : 'none')};
  border-bottom: 1px solid
    ${({ theme }) =>
      theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  background: ${({ theme }) =>
    theme.colorMode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
`;

const HeaderInner = styled.div`
  padding: ${({ theme }) => theme.tokens.spacing.scale.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.tokens.spacing.scale.md};
`;

export function Header({ children, hasBlur = true, className, variants }: HeaderProps) {
  return (
    <HeaderContainer className={className} $hasBlur={hasBlur} variants={variants} role="banner">
      <HeaderInner>{children}</HeaderInner>
    </HeaderContainer>
  );
}
