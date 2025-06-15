import type { Meta, StoryObj } from '@storybook/react';
import { TrademarkExample } from './TrademarkExample';

const meta: Meta<typeof TrademarkExample> = {
  title: 'UI/TrademarkExample',
  component: TrademarkExample,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TrademarkExample>;

export const Default: Story = {};

export const CustomStyles: Story = {
  render: () => <TrademarkExample />,
};
