import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { StatusBadge } from '@/components/ui/StatusBadge';

type TokenCategory = 'colors' | 'spacing' | 'typography' | 'shadows' | 'borderRadius';

const ViewerContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.tokens.spacing.scale.sm};
`;

const CategorySelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.tokens.spacing.scale.xs};
`;

const TokenList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.tokens.spacing.scale.sm};
  margin-top: ${({ theme }) => theme.tokens.spacing.scale.md};
`;

const TokenItem = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: ${({ theme }) => theme.tokens.spacing.scale.sm};
  padding: ${({ theme }) => theme.tokens.spacing.scale.sm};
  background: ${({ theme }) =>
    theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.01)'};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.md};
  font-family: ${({ theme }) => theme.tokens.typography.fontFamily.mono};
  font-size: ${({ theme }) => theme.tokens.typography.scale.sm};
`;

const TokenValue = styled.span`
  color: ${({ theme }) =>
    theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'};
  text-align: right;
`;

const TokenPreview = styled.div<{ value: string }>`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.tokens.borderRadius.sm};
  background: ${({ value }) => value};
  border: 1px solid
    ${({ theme }) =>
      theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

function formatTokenValue(value: any, category: TokenCategory): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'object') {
    if (category === 'colors') {
      return value.base || value.scale?.[500] || Object.values(value)[0];
    }
    return JSON.stringify(value);
  }
  return '';
}

function renderTokenPreview(value: string, category: TokenCategory) {
  switch (category) {
    case 'colors':
      return <TokenPreview value={value} />;
    default:
      return null;
  }
}

export function TokenViewer() {
  const { tokens } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<TokenCategory>('colors');

  const categories: { value: TokenCategory; label: string }[] = [
    { value: 'colors', label: 'Colors' },
    { value: 'spacing', label: 'Spacing' },
    { value: 'typography', label: 'Typography' },
    { value: 'shadows', label: 'Shadows' },
    { value: 'borderRadius', label: 'Radius' },
  ];

  const getTokens = (category: TokenCategory) => {
    const categoryTokens = tokens[category];
    if (!categoryTokens) return [];

    return Object.entries(categoryTokens).map(([key, value]) => ({
      name: key,
      value: formatTokenValue(value, category),
    }));
  };

  return (
    <ViewerContainer variants={containerVariants} initial="hidden" animate="visible">
      <CategorySelector>
        {categories.map(({ value, label }) => (
          <StatusBadge
            key={value}
            preset={selectedCategory === value ? 'primary' : 'neutral'}
            ghost={selectedCategory !== value}
            interactive
            onClick={() => setSelectedCategory(value)}
          >
            {label}
          </StatusBadge>
        ))}
      </CategorySelector>

      <TokenList>
        {getTokens(selectedCategory).map(({ name, value }) => (
          <TokenItem key={name} variants={itemVariants}>
            <span>{name}</span>
            <TokenValue>
              {renderTokenPreview(value, selectedCategory)}
              {value}
            </TokenValue>
          </TokenItem>
        ))}
      </TokenList>
    </ViewerContainer>
  );
}
