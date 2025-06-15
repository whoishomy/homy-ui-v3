import React from 'react';
import { styled } from '@emotion/styled';
import { useTrademarkTheme } from '@/context/TrademarkThemeContext';
import { motion } from 'framer-motion';

const PreviewContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.tokens.spacing.scale.lg};
  padding: ${({ theme }) => theme.tokens.spacing.scale.lg};
  background: ${({ theme }) => theme.tokens.colors.background};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.lg};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.tokens.spacing.scale.md};
`;

const Title = styled.h3`
  font-family: ${({ theme }) => theme.tokens.typography.fontFamily};
  font-size: ${({ theme }) => theme.tokens.typography.scale.h3};
  color: ${({ theme }) => theme.tokens.colors.text.primary};
  margin: 0;
`;

const ColorSwatch = styled(motion.div)<{ bgColor: string }>`
  width: 100%;
  height: 48px;
  background: ${({ bgColor }) => bgColor};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.sm};
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.tokens.spacing.scale.sm};
  color: ${({ theme }) => theme.tokens.colors.text.primary};
  font-family: ${({ theme }) => theme.tokens.typography.fontFamily};
  font-size: ${({ theme }) => theme.tokens.typography.scale.caption};
`;

const TypeScale = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.tokens.spacing.scale.sm};
`;

const TypeExample = styled.p<{ scale: string }>`
  font-family: ${({ theme }) => theme.tokens.typography.fontFamily};
  font-size: ${({ theme, scale }) => theme.tokens.typography.scale[scale]};
  color: ${({ theme }) => theme.tokens.colors.text.primary};
  margin: 0;
  line-height: ${({ theme }) => theme.tokens.typography.lineHeight.normal};
`;

const SpacingExample = styled(motion.div)<{ size: string }>`
  width: ${({ size }) => size};
  height: 24px;
  background: ${({ theme }) => theme.tokens.colors.primary};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.sm};
  opacity: 0.8;
`;

export function ThemePreview() {
  const { theme } = useTrademarkTheme();

  return (
    <PreviewContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Section>
        <Title>Colors</Title>
        {Object.entries(theme.tokens.colors).map(([key, value]) => {
          if (typeof value === 'string') {
            return (
              <ColorSwatch
                key={key}
                bgColor={value}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {key}: {value}
              </ColorSwatch>
            );
          }
          return null;
        })}
      </Section>

      <Section>
        <Title>Typography</Title>
        <TypeScale>
          {Object.entries(theme.tokens.typography.scale).map(([key, value]) => (
            <TypeExample key={key} scale={key}>
              {key}: {value} - The quick brown fox
            </TypeExample>
          ))}
        </TypeScale>
      </Section>

      <Section>
        <Title>Spacing</Title>
        {Object.entries(theme.tokens.spacing.scale).map(([key, value]) => (
          <SpacingExample
            key={key}
            size={value}
            initial={{ width: 0 }}
            animate={{ width: value }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </Section>
    </PreviewContainer>
  );
}
