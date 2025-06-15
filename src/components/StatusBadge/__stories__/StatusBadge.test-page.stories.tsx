import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadgeTestPage } from '../StatusBadge.test-page';

const meta: Meta<typeof StatusBadgeTestPage> = {
  title: 'Components/StatusBadge/Test',
  component: StatusBadgeTestPage,
  parameters: {
    layout: 'fullscreen',
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
};

export default meta;
type Story = StoryObj<typeof StatusBadgeTestPage>;

export const AccessibilityTest: Story = {};
