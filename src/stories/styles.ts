import styled from '@emotion/styled';

interface FlexProps {
  gap?: string;
}

export const FlexColumn = styled.div<FlexProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ gap, theme }) => gap || theme.tokens.spacing.scale.md};
`;

export const FlexColumnWide = styled(FlexColumn)`
  gap: ${({ theme }) => theme.tokens.spacing.scale.lg};
`;

export const HintText = styled.p`
  font-size: ${({ theme }) => theme.tokens.typography.scale.sm};
  color: ${({ theme }) => theme.tokens.colors.text.secondary};
  margin: 0;
`;
