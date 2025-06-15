import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { ColorPresetToken } from '@/types/ColorPreset';

const GridContainer = styled(motion.div)`
  display: grid;
  gap: ${({ theme }) => theme.tokens.spacing.scale.md};
`;

const ColorSectionContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.tokens.spacing.scale.sm};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.tokens.spacing.scale.sm};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.tokens.typography.scale.lg};
  font-weight: ${({ theme }) => theme.tokens.typography.weight.semibold};
  margin: 0;
`;

const ColorPalette = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${({ theme }) => theme.tokens.spacing.scale.sm};
`;

const ColorSwatch = styled(motion.div)<{ $bg: string; $isDark: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100px;
  padding: ${({ theme }) => theme.tokens.spacing.scale.sm};
  background: ${({ $bg }) => $bg};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.md};
  color: ${({ $isDark }) => ($isDark ? '#FFFFFF' : '#000000')};
  font-family: ${({ theme }) => theme.tokens.typography.family.mono};
  font-size: ${({ theme }) => theme.tokens.typography.scale.sm};
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ColorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ColorName = styled.span`
  font-weight: ${({ theme }) => theme.tokens.typography.weight.medium};
`;

const ColorValue = styled.span`
  opacity: 0.8;
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

function isDarkColor(hex: string): boolean {
  const rgb = parseInt(hex.replace('#', ''), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma < 128;
}

function getColorName(scale: number): string {
  switch (scale) {
    case 100:
      return 'Lightest';
    case 300:
      return 'Light';
    case 500:
      return 'Base';
    case 700:
      return 'Dark';
    case 900:
      return 'Darkest';
    default:
      return '';
  }
}

interface ColorSectionProps {
  name: string;
  color: ColorPresetToken;
  onColorClick: (color: string) => void;
}

function ColorSection({ name, color, onColorClick }: ColorSectionProps) {
  return (
    <ColorSectionContainer variants={sectionVariants}>
      <SectionHeader>
        <SectionTitle>{name}</SectionTitle>
        <StatusBadge preset={name as any} ghost>
          {name}
        </StatusBadge>
      </SectionHeader>
      <ColorPalette>
        {Object.entries(color.scale).map(([scale, value]) => (
          <ColorSwatch
            key={scale}
            $bg={value}
            $isDark={isDarkColor(value)}
            onClick={() => onColorClick(value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ColorInfo>
              <ColorName>{getColorName(Number(scale))}</ColorName>
              <ColorValue>{value}</ColorValue>
            </ColorInfo>
          </ColorSwatch>
        ))}
      </ColorPalette>
    </ColorSectionContainer>
  );
}

export function ColorGrid() {
  const { tokens } = useTheme();
  const { colors } = tokens;

  const handleColorClick = (color: string) => {
    navigator.clipboard.writeText(color);
  };

  return (
    <GridContainer variants={containerVariants} initial="hidden" animate="visible">
      {Object.entries(colors).map(([name, color]) => (
        <ColorSection key={name} name={name} color={color} onColorClick={handleColorClick} />
      ))}
    </GridContainer>
  );
}
