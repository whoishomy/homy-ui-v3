import React from 'react';
import styled from '@emotion/styled';

export type CodeBlockVariant = 'inline' | 'block';
export type CodeBlockSize = 'sm' | 'md' | 'lg';

export interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Visual variant
   * @default "block"
   */
  variant?: CodeBlockVariant;

  /**
   * Text size
   * @default "md"
   */
  size?: CodeBlockSize;

  /**
   * Whether to show line numbers
   * @default false
   */
  showLineNumbers?: boolean;

  /**
   * Whether to enable word wrap
   * @default false
   */
  wrap?: boolean;

  /**
   * Programming language for syntax highlighting
   */
  language?: string;
}

const StyledPre = styled.pre<{
  $variant: CodeBlockVariant;
  $size: CodeBlockSize;
  $wrap: boolean;
}>`
  margin: 0;
  padding: ${({ theme, $variant }) =>
    $variant === 'block' ? theme.tokens.spacing.scale.md : '0.2em 0.4em'};
  font-family: ${({ theme }) => theme.tokens.typography.family.mono};
  font-size: ${({ theme, $size }) => theme.tokens.typography.scale[$size]};
  line-height: 1.5;
  background: ${({ theme }) =>
    theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
  border: 1px solid
    ${({ theme }) =>
      theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.md};
  overflow-x: auto;
  white-space: ${({ $wrap }) => ($wrap ? 'pre-wrap' : 'pre')};

  &::selection {
    background: ${({ theme }) =>
      theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

const StyledCode = styled.code`
  color: ${({ theme }) => theme.text.primary};
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
`;

const LineNumbers = styled.div`
  display: inline-block;
  padding-right: ${({ theme }) => theme.tokens.spacing.scale.md};
  margin-right: ${({ theme }) => theme.tokens.spacing.scale.md};
  border-right: 1px solid
    ${({ theme }) =>
      theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  color: ${({ theme }) => theme.text.secondary};
  user-select: none;
`;

export const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(
  (
    {
      variant = 'block',
      size = 'md',
      showLineNumbers = false,
      wrap = false,
      language,
      children,
      ...props
    },
    ref
  ) => {
    const content = typeof children === 'string' ? children : '';
    const lines = content.split('\n');

    return (
      <StyledPre ref={ref} $variant={variant} $size={size} $wrap={wrap} {...props}>
        {variant === 'block' && showLineNumbers && (
          <LineNumbers>
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </LineNumbers>
        )}
        <StyledCode className={language && `language-${language}`}>{children}</StyledCode>
      </StyledPre>
    );
  }
);

CodeBlock.displayName = 'CodeBlock';
