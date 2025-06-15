import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { TokenViewer } from './TokenViewer';
import { ColorGrid } from './ColorGrid';
import { TypographyPreview } from './TypographyPreview';
import { ComponentShowcase } from './ComponentShowcase';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import type { Brand } from '@/types/TrademarkTheme';

const PlaygroundContainer = styled(motion.div)`
  display: grid;
  gap: ${({ theme }) => theme.tokens.spacing.scale.lg};
  padding: ${({ theme }) => theme.tokens.spacing.scale.lg};
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: ${({ theme }) => theme.tokens.breakpoints.lg}) {
    grid-template-columns: 300px 1fr;
  }
`;

const Sidebar = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.tokens.spacing.scale.md};
  padding: ${({ theme }) => theme.tokens.spacing.scale.md};
  background: ${({ theme }) =>
    theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  border: 1px solid
    ${({ theme }) =>
      theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.lg};
  backdrop-filter: blur(10px);
`;

const MainContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.tokens.spacing.scale.lg};
`;

const Section = styled(motion.section)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.tokens.spacing.scale.md};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.tokens.typography.scale['2xl']};
  font-weight: ${({ theme }) => theme.tokens.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary.base};
  margin: 0;
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

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function ThemePlayground() {
  const { brand, colorMode } = useTheme();
  const [selectedBrand, setSelectedBrand] = useState<Brand>(brand);

  return (
    <PlaygroundContainer variants={containerVariants} initial="hidden" animate="visible">
      <Sidebar variants={sectionVariants}>
        <Section>
          <SectionTitle>Theme Controls</SectionTitle>
          <ThemeSwitcher />
        </Section>
        <Section>
          <SectionTitle>Token Explorer</SectionTitle>
          <TokenViewer />
        </Section>
      </Sidebar>

      <MainContent>
        <Section variants={sectionVariants}>
          <SectionTitle>Color System</SectionTitle>
          <ColorGrid />
        </Section>

        <Section variants={sectionVariants}>
          <SectionTitle>Typography</SectionTitle>
          <TypographyPreview />
        </Section>

        <Section variants={sectionVariants}>
          <SectionTitle>Components</SectionTitle>
          <ComponentShowcase />
        </Section>
      </MainContent>
    </PlaygroundContainer>
  );
}
