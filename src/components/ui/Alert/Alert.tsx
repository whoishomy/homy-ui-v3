import React from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { X as CloseIcon } from 'lucide-react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

const variantToColor: Record<AlertVariant, string> = {
  info: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Visual variant of the alert
   * @default "info"
   */
  variant?: AlertVariant;

  /**
   * Alert title
   */
  title?: React.ReactNode;

  /**
   * Alert description
   */
  description?: React.ReactNode;

  /**
   * Custom icon
   */
  icon?: React.ReactNode;

  /**
   * Whether the alert can be dismissed
   * @default false
   */
  dismissible?: boolean;

  /**
   * Callback when alert is dismissed
   */
  onDismiss?: () => void;
}

const StyledAlert = styled(motion.div)<{ variant: AlertVariant }>`
  position: relative;
  display: flex;
  gap: ${({ theme }) => theme.tokens.spacing.scale.md};
  padding: ${({ theme }) => theme.tokens.spacing.scale.md};
  border-radius: ${({ theme }) => theme.tokens.borderRadius.md};
  transition: all 0.2s ease-in-out;

  ${({ theme, variant }) => {
    const color = variantToColor[variant];
    return `
      background: ${
        theme.colorMode === 'dark'
          ? `color-mix(in srgb, ${color} 10%, transparent)`
          : `color-mix(in srgb, ${color} 10%, white)`
      };
      border: 1px solid ${
        theme.colorMode === 'dark'
          ? `color-mix(in srgb, ${color} 30%, transparent)`
          : `color-mix(in srgb, ${color} 30%, white)`
      };
    `;
  }}
`;

const IconWrapper = styled.div<{ variant: AlertVariant }>`
  display: flex;
  align-items: flex-start;
  color: ${({ variant }) => variantToColor[variant]};
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.tokens.spacing.scale.xs};
`;

const Title = styled.div<{ variant: AlertVariant }>`
  color: ${({ variant }) => variantToColor[variant]};
  font-weight: ${({ theme }) => theme.tokens.typography.weight.semibold};
  font-size: ${({ theme }) => theme.tokens.typography.scale.sm};
  line-height: 1.5;
`;

const Description = styled.div`
  color: ${({ theme }) => theme.text.primary};
  font-size: ${({ theme }) => theme.tokens.typography.scale.sm};
  line-height: 1.5;
`;

const DismissButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.tokens.spacing.scale.sm};
  right: ${({ theme }) => theme.tokens.spacing.scale.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.tokens.spacing.scale.xs};
  color: ${({ theme }) => theme.text.primary};
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.tokens.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${({ theme }) =>
      theme.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.tokens.colors.focus};
    outline-offset: 2px;
  }
`;

const alertVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = 'info',
      title,
      description,
      icon,
      dismissible = false,
      onDismiss,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <AnimatePresence>
        <StyledAlert
          ref={ref}
          variant={variant}
          role="alert"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={alertVariants}
          className={className}
          {...props}
        >
          {icon && <IconWrapper variant={variant}>{icon}</IconWrapper>}

          <Content>
            {title && <Title variant={variant}>{title}</Title>}
            {description && <Description>{description}</Description>}
          </Content>

          {dismissible && (
            <DismissButton type="button" onClick={onDismiss} aria-label="Dismiss alert">
              <CloseIcon size={16} />
            </DismissButton>
          )}
        </StyledAlert>
      </AnimatePresence>
    );
  }
);

Alert.displayName = 'Alert';
