import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from './StatusBadge';

const meta: Meta<typeof StatusBadge> = {
  title: 'Components/StatusBadge',
  component: StatusBadge,
  parameters: {
    layout: 'centered',
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['critical', 'warning', 'normal'],
    },
    interactive: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Critical: Story = {
  args: {
    status: 'critical',
    label: 'Kritik',
    ariaLabel: 'Durum: Kritik',
  },
};

export const Warning: Story = {
  args: {
    status: 'warning',
    label: 'Uyarı',
    ariaLabel: 'Durum: Uyarı',
  },
};

export const Normal: Story = {
  args: {
    status: 'normal',
    label: 'Normal',
    ariaLabel: 'Durum: Normal',
  },
};

export const Interactive: Story = {
  args: {
    status: 'critical',
    label: 'Kritik',
    ariaLabel: 'Durum: Kritik - Tıklanabilir',
    interactive: true,
    onClick: () => alert('Badge clicked!'),
  },
};
