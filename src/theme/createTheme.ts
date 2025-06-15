import { CreateThemeConfig, Theme } from './types';
import { baseTokens } from './tokens';

export function createTheme(config: CreateThemeConfig): Theme {
  return {
    colorMode: config.colorMode,
    tokens: baseTokens,
  };
}

// Usage example:
/*
const theme = createTheme('homy', 'dark');
const styledComponent = styled.div`
  background-color: ${({ theme }) => theme.tokens.colors.background};
  color: ${({ theme }) => theme.tokens.colors.text.primary};
  font-family: ${({ theme }) => theme.tokens.typography.fontFamily};
  font-size: ${({ theme }) => theme.tokens.typography.scale.body};
  
  @media (min-width: ${({ theme }) => theme.tokens.breakpoints.md}) {
    font-size: ${({ theme }) => theme.tokens.typography.scale.h3};
  }
`;
*/
