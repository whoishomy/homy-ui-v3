import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

export interface SidebarProps {
  /**
   * Sidebar content
   */
  children: React.ReactNode;

  /**
   * Whether the sidebar is collapsed
   * @default false
   */
  isCollapsed?: boolean;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Animation variants
   */
  variants?: any;
}

const SidebarContainer = styled(motion.aside)<{ $isCollapsed: boolean }>`
  position: sticky;
  top: 72px; // Header height + spacing
  height: calc(100vh - 72px);
  overflow-y: auto;
  width: ${({ $isCollapsed }) => ($isCollapsed ? '80px' : '280px')};
  transition: width 0.3s ease-in-out;
  background: ${({ theme }) =>
    theme.colorMode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.8)'};
  border-right: 1px solid
    ${({ theme }) =>
      theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  backdrop-filter: blur(8px);

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) =>
      theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
    border-radius: ${({ theme }) => theme.tokens.borderRadius.pill};
  }
`;

const SidebarInner = styled.div<{ $isCollapsed: boolean }>`
  padding: ${({ theme }) => theme.tokens.spacing.scale.md};
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0.8 : 1)};
  transition: opacity 0.2s ease-in-out;
`;

export function Sidebar({ children, isCollapsed = false, className, variants }: SidebarProps) {
  return (
    <SidebarContainer
      className={className}
      $isCollapsed={isCollapsed}
      variants={variants}
      role="complementary"
    >
      <SidebarInner $isCollapsed={isCollapsed}>{children}</SidebarInner>
    </SidebarContainer>
  );
}
