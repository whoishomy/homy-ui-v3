import { useTheme } from './useTheme';

export function useThemeTokens() {
  const theme = useTheme();
  return theme.tokens;
}

export function useSpacing() {
  const { spacing } = useThemeTokens();
  return spacing.scale;
}

export function useColors() {
  const { colors } = useThemeTokens();
  return colors;
}

export function useTypography() {
  const { typography } = useThemeTokens();
  return typography;
}

export function useBreakpoints() {
  const theme = useTheme();
  return theme.breakpoints;
}

// Example usage:
/*
function MyComponent() {
  const spacing = useSpacing();
  const colors = useColors();
  const typography = useTypography();
  
  return (
    <div css={css`
      padding: ${spacing.lg};
      color: ${colors.primary};
      font-size: ${typography.scale.md};
    `}>
      Content
    </div>
  );
}
*/
