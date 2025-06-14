import type { Meta, StoryObj } from '@storybook/react';
import { JonyToast } from '../JonyToast';

const meta: Meta<typeof JonyToast> = {
  title: '🧼 Toast/Jony Showcase',
  component: JonyToast,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#F5F5F7' },
        { name: 'dark', value: '#000000' },
      ],
    },
    docs: {
      description: {
        component: `
"Design is not just what it looks like and feels like. Design is how it works."

The JonyToast component embodies three core principles:
- Silüet: The form follows intention
- Gövde: Every element carries its weight
- Sessizlik: The interface speaks through silence

Usage:
\`\`\`tsx
toast({
  title: "Design is quiet",
  description: "It whispers, never shouts",
  variant: "success"
})
\`\`\`
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof JonyToast>;

export const Default: Story = {
  args: {
    title: 'Default Toast',
    description: 'This is a default toast message',
    variant: 'default',
  },
};

export const Success: Story = {
  args: {
    title: 'Success Toast',
    description: 'Operation completed successfully',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    title: 'Warning Toast',
    description: 'Please review this important notice',
    variant: 'warning',
  },
};

export const Destructive: Story = {
  args: {
    title: 'Error Toast',
    description: 'Something went wrong',
    variant: 'destructive',
  },
}; 