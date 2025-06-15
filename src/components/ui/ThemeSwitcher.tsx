import React from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '@/store/themeStore';
import { useTrademarkTheme } from '@/context/TrademarkThemeContext';
import type { Brand, ColorMode } from '@/types/TrademarkTheme';
import { TrademarkText } from './TrademarkText';

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.tokens.spacing.scale.md};
  padding: ${({ theme }) => theme.tokens.spacing.scale.lg};
  background: ${({ theme }) =>
    theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  border: 1px solid
    ${({ theme }) =>
      theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.lg};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease-in-out;

  @media (min-width: ${({ theme }) => theme.tokens.container.maxWidth.md}) {
    flex-direction: row;
    align-items: center;
  }

  &:hover {
    background: ${({ theme }) =>
      theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'};
  }
`;

const BrandSelect = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.tokens.spacing.scale.sm};
  width: 100%;

  @media (min-width: ${({ theme }) => theme.tokens.container.maxWidth.md}) {
    width: auto;
  }
`;

const BrandButton = styled(motion.button)<{ isActive: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.tokens.spacing.scale.md};
  background: ${({ theme, isActive }) =>
    isActive
      ? theme.colorMode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.05)'
      : 'transparent'};
  border: 1px solid
    ${({ theme, isActive }) =>
      isActive
        ? theme.tokens.colors.primary
        : theme.colorMode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.1)'};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  overflow: hidden;

  &:hover {
    background: ${({ theme }) =>
      theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ThemeToggleGroup = styled(motion.div)`
  display: flex;
  gap: ${({ theme }) => theme.tokens.spacing.scale.sm};
  padding: ${({ theme }) => theme.tokens.spacing.scale.xs};
  background: ${({ theme }) =>
    theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.pill};
`;

const ThemeButton = styled(motion.button)<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.tokens.spacing.scale.sm} ${theme.tokens.spacing.scale.md}`};
  background: ${({ theme, isActive }) =>
    isActive
      ? theme.colorMode === 'dark'
        ? theme.tokens.colors.primary
        : theme.tokens.colors.primary
      : 'transparent'};
  color: ${({ theme, isActive }) =>
    isActive
      ? '#FFFFFF'
      : theme.colorMode === 'dark'
      ? 'rgba(255, 255, 255, 0.8)'
      : 'rgba(0, 0, 0, 0.8)'};
  border: none;
  border-radius: ${({ theme }) => theme.tokens.borderRadius.pill};
  font-size: ${({ theme }) => theme.tokens.typography.scale.sm};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${({ theme, isActive }) =>
      isActive
        ? theme.tokens.colors.primary
        : theme.colorMode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const AnimatedContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.tokens.spacing.scale.xs};
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  bottom: -1px;
  left: -1px;
  right: -1px;
  height: 2px;
  background: ${({ theme }) => theme.tokens.colors.primary};
`;

const ThemeButtonContent = styled(motion.span)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.tokens.spacing.scale.xs};
`;

const IconWrapper = styled.span`
  font-size: 1.5rem;
`;

const brandOptions: { value: Brand; label: string; icon: string }[] = [
  { value: 'homy', label: 'HOMY', icon: '🏠' },
  { value: 'neuro', label: 'Neuro', icon: '🧠' },
  { value: 'lab', label: 'Lab', icon: '🧪' },
];

const themeOptions: { value: ColorMode | 'system'; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'system', label: 'System', icon: '💻' },
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function ThemeSwitcher() {
  const { theme } = useTrademarkTheme();
  const { brand, colorMode, isSystemPreference, setBrand, setColorMode, toggleSystemPreference } =
    useThemeStore();

  const handleThemeChange = (value: ColorMode | 'system') => {
    if (value === 'system') {
      toggleSystemPreference();
    } else {
      setColorMode(value);
    }
  };

  return (
    <Container variants={containerVariants} initial="hidden" animate="visible">
      <BrandSelect variants={itemVariants}>
        {brandOptions.map((option) => (
          <BrandButton
            key={option.value}
            isActive={brand === option.value}
            onClick={() => setBrand(option.value)}
            aria-label={`Switch to ${option.label} brand`}
          >
            <AnimatedContent>
              <IconWrapper>{option.icon}</IconWrapper>
              <TrademarkText variant="caption">{option.label}</TrademarkText>
              {brand === option.value && <ActiveIndicator layoutId="brandIndicator" />}
            </AnimatedContent>
          </BrandButton>
        ))}
      </BrandSelect>

      <ThemeToggleGroup variants={itemVariants}>
        {themeOptions.map((option) => (
          <ThemeButton
            key={option.value}
            isActive={
              option.value === 'system'
                ? isSystemPreference
                : !isSystemPreference && colorMode === option.value
            }
            onClick={() => handleThemeChange(option.value)}
            aria-label={`Switch to ${option.label} theme`}
          >
            <ThemeButtonContent>
              <IconWrapper>{option.icon}</IconWrapper>
              {option.label}
            </ThemeButtonContent>
          </ThemeButton>
        ))}
      </ThemeToggleGroup>
    </Container>
  );
}
