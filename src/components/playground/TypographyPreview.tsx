import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { StatusBadge } from '@/components/ui/StatusBadge';

const PreviewContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.tokens.spacing.scale.lg};
`;

const Section = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.tokens.spacing.scale.md};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.tokens.typography.scale.lg};
  font-weight: ${({ theme }) => theme.tokens.typography.fontWeight.semibold};
  margin: 0;
`;

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.tokens.spacing.scale.md};
`;

const PreviewItem = styled(motion.div)`
  display: grid;
  grid-template-columns: 200px 1fr;
  align-items: center;
  gap: ${({ theme }) => theme.tokens.spacing.scale.md};
  padding: ${({ theme }) => theme.tokens.spacing.scale.sm};
  background: ${({ theme }) =>
    theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.01)'};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.md};
`;

const PreviewInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.tokens.spacing.scale.xs};
  font-family: ${({ theme }) => theme.tokens.typography.fontFamily.mono};
  font-size: ${({ theme }) => theme.tokens.typography.scale.sm};
`;

const PreviewValue = styled.span`
  color: ${({ theme }) =>
    theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'};
`;

const PreviewText = styled.p<{
  $scale?: string;
  $weight?: number;
  $family?: string;
  $lineHeight?: number;
  $spacing?: string;
}>`
  margin: 0;
  font-size: ${({ $scale }) => $scale};
  font-weight: ${({ $weight }) => $weight};
  font-family: ${({ $family }) => $family};
  line-height: ${({ $lineHeight }) => $lineHeight};
  letter-spacing: ${({ $spacing }) => $spacing};
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface PreviewSectionProps {
  title: string;
  items: { name: string; value: string | number }[];
  renderPreview: (value: string | number) => React.ReactNode;
}

function PreviewSection({ title, items, renderPreview }: PreviewSectionProps) {
  return (
    <Section variants={itemVariants}>
      <SectionTitle>{title}</SectionTitle>
      <Grid>
        {items.map(({ name, value }) => (
          <PreviewItem key={name} variants={itemVariants}>
            <PreviewInfo>
              <StatusBadge preset="neutral" ghost>
                {name}
              </StatusBadge>
              <PreviewValue>{value}</PreviewValue>
            </PreviewInfo>
            {renderPreview(value)}
          </PreviewItem>
        ))}
      </Grid>
    </Section>
  );
}

const PREVIEW_TEXT = 'The quick brown fox jumps over the lazy dog';

export function TypographyPreview() {
  const { tokens } = useTheme();
  const { typography } = tokens;

  const scales = Object.entries(typography.scale).map(([name, value]) => ({
    name,
    value,
  }));

  const weights = Object.entries(typography.fontWeight).map(([name, value]) => ({
    name,
    value,
  }));

  const families = Object.entries(typography.fontFamily).map(([name, value]) => ({
    name,
    value,
  }));

  const lineHeights = Object.entries(typography.lineHeight).map(([name, value]) => ({
    name,
    value,
  }));

  const letterSpacings = Object.entries(typography.letterSpacing).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <PreviewContainer variants={containerVariants} initial="hidden" animate="visible">
      <PreviewSection
        title="Font Size"
        items={scales}
        renderPreview={(value) => (
          <PreviewText $scale={value as string}>{PREVIEW_TEXT}</PreviewText>
        )}
      />

      <PreviewSection
        title="Font Weight"
        items={weights}
        renderPreview={(value) => (
          <PreviewText $weight={value as number}>{PREVIEW_TEXT}</PreviewText>
        )}
      />

      <PreviewSection
        title="Font Family"
        items={families}
        renderPreview={(value) => (
          <PreviewText $family={value as string}>{PREVIEW_TEXT}</PreviewText>
        )}
      />

      <PreviewSection
        title="Line Height"
        items={lineHeights}
        renderPreview={(value) => (
          <PreviewText $lineHeight={value as number}>
            {PREVIEW_TEXT}
            <br />
            {PREVIEW_TEXT}
          </PreviewText>
        )}
      />

      <PreviewSection
        title="Letter Spacing"
        items={letterSpacings}
        renderPreview={(value) => (
          <PreviewText $spacing={value as string}>{PREVIEW_TEXT}</PreviewText>
        )}
      />
    </PreviewContainer>
  );
}
