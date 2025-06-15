import React from 'react';
import styled from '@emotion/styled';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.tokens.spacing.scale.lg};
  padding: ${({ theme }) => theme.tokens.spacing.scale.lg};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.tokens.spacing.scale.md};
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.text.primary};
  font-size: ${({ theme }) => theme.tokens.typography.scale.xl};
  font-weight: ${({ theme }) => theme.tokens.typography.weight.semibold};
`;

const variantIcons = {
  info: <Info size={20} />,
  success: <CheckCircle size={20} />,
  warning: <AlertTriangle size={20} />,
  error: <XCircle size={20} />,
};

const variantMessages = {
  info: {
    title: 'Information',
    description: 'This is an informational message for the user.',
  },
  success: {
    title: 'Success',
    description: 'The operation was completed successfully.',
  },
  warning: {
    title: 'Warning',
    description: 'Please review your input before proceeding.',
  },
  error: {
    title: 'Error',
    description: 'An error occurred while processing your request.',
  },
};

export const AlertShowcase: React.FC = () => {
  const [dismissedAlerts, setDismissedAlerts] = React.useState<string[]>([]);

  const handleDismiss = (id: string) => {
    setDismissedAlerts((prev) => [...prev, id]);
  };

  return (
    <Container>
      <Section>
        <Title>Alert Variants</Title>
        {Object.entries(variantMessages).map(([variant, message]) => {
          const alertId = `${variant}-basic`;
          if (dismissedAlerts.includes(alertId)) return null;

          return (
            <Alert
              key={variant}
              variant={variant as keyof typeof variantMessages}
              icon={variantIcons[variant as keyof typeof variantIcons]}
              title={message.title}
              description={message.description}
              dismissible
              onDismiss={() => handleDismiss(alertId)}
            />
          );
        })}
      </Section>

      <Section>
        <Title>Title Only</Title>
        <Alert
          variant="warning"
          icon={variantIcons.warning}
          title="Your session will expire in 5 minutes"
        />
      </Section>

      <Section>
        <Title>Description Only</Title>
        <Alert
          variant="info"
          icon={variantIcons.info}
          description="We've updated our privacy policy. Please take a moment to review the changes."
        />
      </Section>

      <Section>
        <Title>Without Icon</Title>
        <Alert
          variant="success"
          title="Profile Updated"
          description="Your profile information has been updated successfully."
        />
      </Section>

      <Section>
        <Title>Non-dismissible</Title>
        <Alert
          variant="error"
          icon={variantIcons.error}
          title="Critical Error"
          description="The system is currently unavailable. Please try again later."
        />
      </Section>
    </Container>
  );
};
