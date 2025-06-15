import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button/Button';
import type { ColorPreset } from '@/types/ColorPreset';

const ShowcaseContainer = styled(motion.div)`
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
  font-weight: ${({ theme }) => theme.tokens.typography.weight.semibold};
  margin: 0;
`;

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.tokens.spacing.scale.md};
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
`;

const ComponentCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.tokens.spacing.scale.md};
  padding: ${({ theme }) => theme.tokens.spacing.scale.lg};
  background: ${({ theme }) =>
    theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.01)'};
  border: 1px solid
    ${({ theme }) =>
      theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.lg};
`;

const ComponentTitle = styled.h4`
  font-size: ${({ theme }) => theme.tokens.typography.scale.md};
  font-weight: ${({ theme }) => theme.tokens.typography.weight.medium};
  margin: 0;
`;

const ComponentDescription = styled.p`
  font-size: ${({ theme }) => theme.tokens.typography.scale.sm};
  color: ${({ theme }) =>
    theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'};
  margin: 0;
`;

const PreviewArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.tokens.spacing.scale.sm};
  padding: ${({ theme }) => theme.tokens.spacing.scale.md};
  background: ${({ theme }) =>
    theme.colorMode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.5)'};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.md};
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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const presets: ColorPreset[] = ['primary', 'success', 'warning', 'error', 'info'];

interface ShowcaseComponentProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function ShowcaseComponent({ title, description, children }: ShowcaseComponentProps) {
  return (
    <motion.div variants={cardVariants}>
      <ComponentTitle>{title}</ComponentTitle>
      <ComponentDescription>{description}</ComponentDescription>
      <PreviewArea>{children}</PreviewArea>
    </motion.div>
  );
}

export function ComponentShowcase() {
  return (
    <ShowcaseContainer variants={containerVariants} initial="hidden" animate="visible">
      <Section>
        <SectionTitle>Status Badges</SectionTitle>
        <Grid>
          <ShowcaseComponent
            title="Basic Badges"
            description="Simple status indicators with different color presets"
          >
            {presets.map((preset) => (
              <StatusBadge key={preset} preset={preset}>
                {preset}
              </StatusBadge>
            ))}
          </ShowcaseComponent>

          <ShowcaseComponent
            title="Ghost Badges"
            description="Transparent background with colored text"
          >
            {presets.map((preset) => (
              <StatusBadge key={preset} preset={preset} ghost>
                {preset}
              </StatusBadge>
            ))}
          </ShowcaseComponent>

          <ShowcaseComponent title="With Status Dot" description="Badges with status indicator dot">
            {presets.map((preset) => (
              <StatusBadge key={preset} preset={preset} withDot>
                {preset}
              </StatusBadge>
            ))}
          </ShowcaseComponent>

          <ShowcaseComponent
            title="Interactive Badges"
            description="Clickable badges with hover effects"
          >
            {presets.map((preset) => (
              <StatusBadge
                key={preset}
                preset={preset}
                interactive
                onClick={() => console.log(`Clicked ${preset}`)}
              >
                {preset}
              </StatusBadge>
            ))}
          </ShowcaseComponent>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Buttons</SectionTitle>
        <Grid>
          <ShowcaseComponent
            title="Button Variants"
            description="Different button variants with default styling"
          >
            <Button>Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </ShowcaseComponent>

          <ShowcaseComponent
            title="Color Presets"
            description="Buttons with different color presets"
          >
            {presets.map((preset) => (
              <Button key={preset} preset={preset}>
                {preset}
              </Button>
            ))}
          </ShowcaseComponent>

          <ShowcaseComponent
            title="Loading State"
            description="Buttons in loading state with different variants"
          >
            <Button isLoading>Loading</Button>
            <Button preset="primary" isLoading variant="outline">
              Loading
            </Button>
            <Button preset="success" isLoading variant="ghost">
              Loading
            </Button>
          </ShowcaseComponent>

          <ShowcaseComponent
            title="Full Width"
            description="Buttons that take up the full width of their container"
          >
            <Button isFullWidth>Full Width Button</Button>
            <Button preset="primary" variant="outline" isFullWidth>
              Full Width Outline
            </Button>
          </ShowcaseComponent>

          <ShowcaseComponent
            title="Disabled State"
            description="Buttons in disabled state with different variants"
          >
            <Button disabled>Disabled</Button>
            <Button preset="primary" variant="outline" disabled>
              Disabled
            </Button>
            <Button preset="error" variant="ghost" disabled>
              Disabled
            </Button>
          </ShowcaseComponent>
        </Grid>
      </Section>
    </ShowcaseContainer>
  );
}
