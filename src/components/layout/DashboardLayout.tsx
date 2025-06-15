import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Grid } from '../ui/layout/Grid';
import { GridItem } from '../ui/layout/GridItem';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ContentArea } from './ContentArea';

export interface DashboardLayoutProps {
  /**
   * Header content
   */
  header?: React.ReactNode;

  /**
   * Sidebar content
   */
  sidebar?: React.ReactNode;

  /**
   * Main content
   */
  children: React.ReactNode;

  /**
   * Whether the sidebar is collapsed
   * @default false
   */
  isSidebarCollapsed?: boolean;

  /**
   * Custom className for the container
   */
  className?: string;
}

const Container = styled(motion.div)`
  min-height: 100vh;
  background: ${({ theme }) =>
    theme.colorMode === 'dark' ? theme.tokens.colors.background : theme.tokens.colors.surface};
  color: ${({ theme }) =>
    theme.colorMode === 'dark' ? theme.tokens.colors.text.light : theme.tokens.colors.text.dark};
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const elementVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function DashboardLayout({
  header,
  sidebar,
  children,
  isSidebarCollapsed = false,
  className,
}: DashboardLayoutProps) {
  return (
    <Container
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {header && <Header variants={elementVariants}>{header}</Header>}

      <Grid columns={12} spacing="md">
        {sidebar && (
          <GridItem span={{ sm: 12, md: isSidebarCollapsed ? 1 : 3 }}>
            <Sidebar isCollapsed={isSidebarCollapsed} variants={elementVariants}>
              {sidebar}
            </Sidebar>
          </GridItem>
        )}

        <GridItem span={{ sm: 12, md: sidebar ? (isSidebarCollapsed ? 11 : 9) : 12 }}>
          <ContentArea variants={elementVariants}>{children}</ContentArea>
        </GridItem>
      </Grid>
    </Container>
  );
}
