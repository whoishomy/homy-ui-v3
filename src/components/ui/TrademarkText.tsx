import React, { useEffect } from 'react';
import { css, useTheme } from '@emotion/react';
import { motion } from 'framer-motion';
import { useTrademarkStyle } from '@/hooks/useTrademarkStyle';
import type { TrademarkVisualKit } from '@/types/TrademarkVisualKit';
import { useTrademarkTheme } from '@/context/TrademarkThemeContext';
import { getFontFamilyString } from '@/utils/fontLoader';
import { notifyMake } from 'scripts/notifyMake';
import styled from '@emotion/styled';

interface TrademarkTextProps {
  children: React.ReactNode;
  options?: Partial<TrademarkVisualKit>;
  variant?: 'title' | 'subtitle' | 'body';
  showSymbol?: boolean;
  className?: string;
  animate?: boolean;
}

const StyledMotionSpan = styled(motion.span)``;

export function TrademarkText({
  children,
  options,
  variant = 'body',
  showSymbol = true,
  className,
  animate = true,
}: TrademarkTextProps) {
  const theme = useTheme();
  const { currentBrand } = useTrademarkTheme();
  const brandKit = theme.kits[currentBrand];
  const fontFamily = getFontFamilyString(currentBrand);
  const isDark = theme.colorMode === 'dark';

  // Get variant-specific styles
  const variantStyles = {
    title: {
      fontSize: { sm: '24px', md: '32px', lg: '40px' },
      letterSpacing: '-0.03em',
      fontWeight: 700,
      lineHeight: '1.2',
    },
    subtitle: {
      fontSize: { sm: '18px', md: '24px', lg: '28px' },
      letterSpacing: '-0.02em',
      fontWeight: 500,
      lineHeight: '1.3',
    },
    body: {
      fontSize: { sm: '14px', md: '16px', lg: '18px' },
      letterSpacing: '-0.01em',
      fontWeight: 400,
      lineHeight: '1.5',
    },
  };

  // Merge options with brand kit
  const mergedOptions = {
    visualIdentity: {
      colors: brandKit.visualIdentity.colors,
      typography: {
        ...brandKit.visualIdentity.typography,
        ...variantStyles[variant],
      },
      spacing: brandKit.visualIdentity.spacing || {},
      ...(options?.visualIdentity || {}),
    },
  };

  const styles = css`
    font-family: ${fontFamily};
    color: ${isDark ? theme.tokens.colors.text.light : theme.tokens.colors.text.dark};
    transition: all 0.3s ease-in-out;

    @media (max-width: ${theme.breakpoints.md}) {
      font-size: ${variantStyles[variant].fontSize.md};
    }

    @media (max-width: ${theme.breakpoints.sm}) {
      font-size: ${variantStyles[variant].fontSize.sm};
    }

    &:hover {
      color: ${theme.tokens.colors.primary};
    }
  `;

  const elementRef = useTrademarkStyle<HTMLSpanElement>(mergedOptions);

  // Animation variants
  const textAnimations = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Notify Make when component mounts
  useEffect(() => {
    notifyMake({
      file: `trademark-text-${currentBrand}-${variant}.log`,
      component: 'TrademarkText',
      status: 'done',
      type: 'ui',
      details: {
        branch: process.env.VERCEL_GIT_COMMIT_REF || 'local',
        version: process.env.npm_package_version || '0.0.0',
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
      },
    }).catch(console.error);
  }, [currentBrand, variant]);

  const Component = animate ? StyledMotionSpan : 'span';
  const animationProps = animate ? textAnimations : {};

  return (
    <Component
      ref={elementRef}
      className={className}
      css={styles}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeOut' }}
      {...animationProps}
    >
      {children}
      {showSymbol && (
        <motion.sup
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          ™
        </motion.sup>
      )}
    </Component>
  );
}

// Usage example:
/*
function BrandedText() {
  return (
    <>
      <TrademarkText variant="title">HOMY</TrademarkText>
      <TrademarkText
        variant="body"
        options={{
          visualIdentity: {
            colors: { primary: '#FF0000' },
          },
        }}
      >
        Custom styled text
      </TrademarkText>
    </>
  );
}
*/
