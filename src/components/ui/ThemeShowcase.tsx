import React from 'react';
import { styled } from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ThemePreview } from './ThemePreview';

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.tokens.spacing.scale.lg};
  max-width: ${({ theme }) => theme.tokens.spacing.layout.maxWidth};
  margin: 0 auto;
  padding: ${({ theme }) => theme.tokens.spacing.scale.xl};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.tokens.spacing.scale.md};

  @media (max-width: ${({ theme }) => theme.tokens.breakpoints.md}) {
    flex-direction: column;
  }
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.tokens.typography.fontFamily};
  font-size: ${({ theme }) => theme.tokens.typography.scale.h2};
  color: ${({ theme }) => theme.tokens.colors.text.primary};
  margin: 0;
`;

export function ThemeShowcase() {
  return (
    <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Header>
        <Title>Theme Showcase</Title>
        <ThemeSwitcher />
      </Header>

      <AnimatePresence mode="wait">
        <ThemePreview />
      </AnimatePresence>
    </Container>
  );
}
