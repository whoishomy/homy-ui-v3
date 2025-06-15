import React, { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import styled from '@emotion/styled';
import { useTheme } from '@/hooks/useTheme';
import { useColors, useSpacing, useTypography } from '@/hooks/useThemeTokens';
import { motion, AnimatePresence } from 'framer-motion';
import type { ThemeTokens } from '@/types/Theme';

const TokenSection = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.tokens.colors.text.secondary};
`;

const TokenGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const ColorSwatch = styled.div<{ $bg: string }>`
  width: 100%;
  height: 100px;
  background: ${({ $bg }) => $bg};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.md};
  margin-bottom: 0.5rem;
`;

const SpacingSwatch = styled.div<{ $size: string }>`
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  background: ${({ theme }) => theme.tokens.colors.primary};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.sm};
`;

const TokenCard = styled.div`
  padding: 1rem;
  background: ${({ theme }) => theme.tokens.colors.surface};
  border: 1px solid ${({ theme }) => theme.tokens.colors.text.secondary};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.md};
`;

const TokenName = styled.div`
  font-family: ${({ theme }) => theme.tokens.typography.family.mono};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.tokens.colors.primary};
`;

const TokenValue = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.tokens.colors.text.secondary};
`;

const TypeScale = styled.div<{ $size: string }>`
  font-size: ${({ $size }) => $size};
  line-height: 1.5;
  margin-bottom: 0.5rem;
`;

const RadiusBox = styled.div<{ $radius: string }>`
  width: 100px;
  height: 100px;
  background: ${({ theme }) => theme.tokens.colors.primary};
  border-radius: ${({ $radius }) => $radius};
  margin-bottom: 0.5rem;
`;

const ShadowBox = styled.div<{ $shadow: string }>`
  width: 100px;
  height: 100px;
  background: ${({ theme }) => theme.tokens.colors.surface};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.md};
  box-shadow: ${({ $shadow }) => $shadow};
  margin-bottom: 0.5rem;
`;

const BreakpointBar = styled.div<{ $width: string }>`
  width: ${({ $width }) => $width};
  height: 24px;
  background: ${({ theme }) => theme.tokens.colors.primary};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.sm};
  margin-bottom: 0.5rem;
`;

const LayerCard = styled(motion.div)<{ $zIndex: number }>`
  position: relative;
  width: 120px;
  height: 120px;
  background: ${({ theme }) => theme.tokens.colors.primary};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.md};
  z-index: ${({ $zIndex }) => $zIndex};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  box-shadow: ${({ theme }) => theme.tokens.shadow.md};
`;

const LayerContainer = styled.div`
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TransitionBox = styled(motion.div)<{ $transition: string }>`
  width: 100px;
  height: 100px;
  background: ${({ theme }) => theme.tokens.colors.primary};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.md};
  transition: all ${({ $transition }) => $transition};
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
    background: ${({ theme }) => theme.tokens.colors.hover};
  }
`;

const DurationBox = styled(motion.div)`
  width: 100px;
  height: 100px;
  background: ${({ theme }) => theme.tokens.colors.primary};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.md};
`;

const MotionBox = styled(motion.div)`
  width: 100px;
  height: 100px;
  background: ${({ theme }) => theme.tokens.colors.primary};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.md};
`;

const BreakpointSimulator = styled.div`
  position: relative;
  width: 100%;
  height: 60px;
  background: ${({ theme }) =>
    theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.lg};
  overflow: hidden;
  margin-top: 2rem;
`;

const BreakpointIndicator = styled(motion.div)<{ $isActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.tokens.colors.primary : 'transparent'};
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0.3)};
  border-right: 2px dashed ${({ theme }) => theme.tokens.colors.primary};
  display: flex;
  align-items: center;
  padding: 0 1rem;
  color: ${({ theme }) => (theme.colorMode === 'dark' ? '#FFFFFF' : '#000000')};
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease-in-out;
`;

const ViewportDisplay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.875rem;
  color: ${({ theme }) =>
    theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'};
`;

function ColorTokens() {
  const colors = useColors();

  return (
    <TokenSection>
      <SectionTitle>Colors</SectionTitle>
      <TokenGrid>
        {Object.entries(colors).map(([key, value]) => {
          // Handle nested text colors
          if (key === 'text') {
            return Object.entries(value as Record<string, string>).map(([textKey, textValue]) => (
              <TokenCard key={`text-${textKey}`}>
                <ColorSwatch $bg={textValue} />
                <TokenName>text.{textKey}</TokenName>
                <TokenValue>{textValue}</TokenValue>
              </TokenCard>
            ));
          }

          return (
            <TokenCard key={key}>
              <ColorSwatch $bg={value as string} />
              <TokenName>{key}</TokenName>
              <TokenValue>{value as string}</TokenValue>
            </TokenCard>
          );
        })}
      </TokenGrid>
    </TokenSection>
  );
}

function SpacingTokens() {
  const spacing = useSpacing();

  return (
    <TokenSection>
      <SectionTitle>Spacing Scale</SectionTitle>
      <TokenGrid>
        {Object.entries(spacing).map(([key, value]) => (
          <TokenCard key={key}>
            <SpacingSwatch $size={value} />
            <TokenName>spacing.{key}</TokenName>
            <TokenValue>{value}</TokenValue>
          </TokenCard>
        ))}
      </TokenGrid>
    </TokenSection>
  );
}

function TypographyTokens() {
  const typography = useTypography();

  return (
    <TokenSection>
      <SectionTitle>Typography Scale</SectionTitle>
      <TokenGrid>
        {Object.entries(typography.scale).map(([key, value]) => (
          <TokenCard key={key}>
            <TypeScale $size={value}>The quick brown fox</TypeScale>
            <TokenName>typography.{key}</TokenName>
            <TokenValue>{value}</TokenValue>
          </TokenCard>
        ))}
      </TokenGrid>
    </TokenSection>
  );
}

function BorderRadiusTokens() {
  const theme = useTheme();

  return (
    <TokenSection>
      <SectionTitle>Border Radius</SectionTitle>
      <TokenGrid>
        {Object.entries(theme.tokens.borderRadius).map(([key, value]) => (
          <TokenCard key={key}>
            <RadiusBox $radius={value} />
            <TokenName>radius.{key}</TokenName>
            <TokenValue>{value}</TokenValue>
          </TokenCard>
        ))}
      </TokenGrid>
    </TokenSection>
  );
}

function ShadowTokens() {
  const theme = useTheme();

  return (
    <TokenSection>
      <SectionTitle>Shadows</SectionTitle>
      <TokenGrid>
        {Object.entries(theme.tokens.shadow).map(([key, value]) => (
          <TokenCard key={key}>
            <ShadowBox $shadow={value} />
            <TokenName>shadow.{key}</TokenName>
            <TokenValue>{value}</TokenValue>
          </TokenCard>
        ))}
      </TokenGrid>
    </TokenSection>
  );
}

function BreakpointTokens() {
  const theme = useTheme();

  return (
    <TokenSection>
      <SectionTitle>Breakpoints</SectionTitle>
      <TokenGrid>
        {Object.entries(theme.breakpoints).map(([key, value]) => (
          <TokenCard key={key}>
            <BreakpointBar $width={value} />
            <TokenName>breakpoints.{key}</TokenName>
            <TokenValue>{value}</TokenValue>
          </TokenCard>
        ))}
      </TokenGrid>
    </TokenSection>
  );
}

function InteractiveBreakpoints() {
  const theme = useTheme();
  const [viewport, setViewport] = useState(0);
  const [activeBreakpoint, setActiveBreakpoint] = useState('');

  useEffect(() => {
    const updateViewport = () => {
      setViewport(window.innerWidth);

      // Find active breakpoint
      const breakpoints = Object.entries(theme.breakpoints)
        .map(([key, value]) => ({
          name: key,
          width: parseInt(value),
        }))
        .sort((a, b) => b.width - a.width);

      const active = breakpoints.find((bp) => window.innerWidth >= bp.width)?.name || 'xs';
      setActiveBreakpoint(active);
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, [theme.breakpoints]);

  return (
    <TokenSection>
      <SectionTitle>Interactive Breakpoints</SectionTitle>
      <BreakpointSimulator>
        <ViewportDisplay>
          Current Viewport: {viewport}px ({activeBreakpoint})
        </ViewportDisplay>
        {Object.entries(theme.breakpoints).map(([key, value]) => {
          const width = parseInt(value);
          const isActive = activeBreakpoint === key;

          return (
            <BreakpointIndicator
              key={key}
              $isActive={isActive}
              style={{ width }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isActive ? 1 : 0.3, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {key} ({value})
            </BreakpointIndicator>
          );
        })}
      </BreakpointSimulator>
    </TokenSection>
  );
}

function ZIndexTokens() {
  const theme = useTheme();
  const zIndexTokens = theme.tokens.zIndex as Record<string, number>;

  return (
    <TokenSection>
      <SectionTitle>Z-Index Layers</SectionTitle>
      <TokenGrid>
        <LayerContainer>
          {Object.entries(zIndexTokens).map(([key, value], index) => (
            <LayerCard
              key={key}
              $zIndex={value}
              style={{
                position: 'absolute',
                left: `${index * 20}px`,
                top: `${index * 20}px`,
              }}
            >
              <TokenName>z-index.{key}</TokenName>
              <TokenValue>{value}</TokenValue>
            </LayerCard>
          ))}
        </LayerContainer>
      </TokenGrid>
    </TokenSection>
  );
}

function TransitionTokens() {
  const theme = useTheme();
  const transitionTokens = theme.tokens.transition as Record<string, string>;

  return (
    <TokenSection>
      <SectionTitle>Transitions</SectionTitle>
      <TokenGrid>
        {Object.entries(transitionTokens).map(([key, value]) => (
          <TokenCard key={key}>
            <TransitionBox $transition={value} whileHover={{ scale: 1.1 }} />
            <TokenName>transition.{key}</TokenName>
            <TokenValue>{value}</TokenValue>
          </TokenCard>
        ))}
      </TokenGrid>
    </TokenSection>
  );
}

function DurationTokens() {
  const theme = useTheme();
  const durationTokens = theme.tokens.duration as Record<string, string>;

  return (
    <TokenSection>
      <SectionTitle>Durations</SectionTitle>
      <TokenGrid>
        {Object.entries(durationTokens).map(([key, value]) => (
          <TokenCard key={key}>
            <DurationBox
              animate={{
                x: [0, 50, 0],
                transition: { duration: Number(value.replace('ms', '')) / 1000, repeat: Infinity },
              }}
            />
            <TokenName>duration.{key}</TokenName>
            <TokenValue>{value}</TokenValue>
          </TokenCard>
        ))}
      </TokenGrid>
    </TokenSection>
  );
}

function MotionPresets() {
  const theme = useTheme();
  const motionPresets = theme.tokens.motion?.presets as Record<string, any>;

  if (!motionPresets) return null;

  return (
    <TokenSection>
      <SectionTitle>Motion Presets</SectionTitle>
      <TokenGrid>
        {Object.entries(motionPresets).map(([key, preset]) => (
          <TokenCard key={key}>
            <MotionBox initial="initial" animate="animate" variants={preset} whileHover="hover" />
            <TokenName>motion.presets.{key}</TokenName>
            <TokenValue>{JSON.stringify(preset, null, 2)}</TokenValue>
          </TokenCard>
        ))}
      </TokenGrid>
    </TokenSection>
  );
}

function ThemeTokensShowcase() {
  return (
    <div>
      <ColorTokens />
      <SpacingTokens />
      <TypographyTokens />
      <BorderRadiusTokens />
      <ShadowTokens />
      <BreakpointTokens />
      <InteractiveBreakpoints />
      <ZIndexTokens />
      <TransitionTokens />
      <DurationTokens />
      <MotionPresets />
    </div>
  );
}

const meta: Meta<typeof ThemeTokensShowcase> = {
  title: 'Foundation/Theme Tokens',
  component: ThemeTokensShowcase,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Theme Tokens

This showcase displays all available theme tokens in the design system. These tokens are accessible through the useTheme hooks:

\`\`\`tsx
import { useColors, useSpacing, useTypography } from '@/hooks/useThemeTokens';

// Access specific token categories
const colors = useColors();
const spacing = useSpacing();
const typography = useTypography();

// Or access all tokens
const theme = useTheme();
const { borderRadius, shadow, breakpoints } = theme.tokens;
\`\`\`

## Token Categories

- **Colors**: Brand colors, UI states, text variants
- **Spacing**: Consistent spacing scale
- **Typography**: Font sizes, weights, families
- **Border Radius**: Corner rounding presets
- **Shadows**: Elevation and depth styles
- **Breakpoints**: Responsive design stops

## Usage in Styled Components

\`\`\`tsx
const StyledComponent = styled.div\`
  color: \${({ theme }) => theme.tokens.colors.primary};
  padding: \${({ theme }) => theme.tokens.spacing.scale.md};
  font-size: \${({ theme }) => theme.tokens.typography.scale.lg};
  border-radius: \${({ theme }) => theme.tokens.borderRadius.md};
  box-shadow: \${({ theme }) => theme.tokens.shadow.md};

  @media (min-width: \${({ theme }) => theme.breakpoints.md}) {
    // Responsive styles
  }
\`;
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeTokensShowcase>;

export const Default: Story = {};

// Dark mode variant
export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
