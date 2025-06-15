import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JonyToast } from '../JonyToast';
import { ToastProvider } from '../ToastProvider';

const meta = {
  title: 'Components/UI/Toast/JonyToast',
  component: JonyToast,
} satisfies Meta<typeof JonyToast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <JonyToast title="Test Toast" description="From screenshot" variant="default" />
    </ToastProvider>
  ),
};
