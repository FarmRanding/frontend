import type { Meta, StoryObj } from '@storybook/react';
import PriceResultStep from '../components/pricing/PriceResultStep/PriceResultStep';

const meta: Meta<typeof PriceResultStep> = {
  title: 'Pricing/PriceResultStep',
  component: PriceResultStep,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockData = {
  cropName: '토마토',
  variety: '대추방울토마토',
  grade: 'special',
  harvestDate: new Date('2024-03-15'),
  estimatedPrice: 12500,
};

export const Default: Story = {
  args: {
    data: mockData,
    onComplete: () => console.log('Complete clicked'),
  },
};

export const HighPrice: Story = {
  args: {
    data: {
      ...mockData,
      estimatedPrice: 25000,
    },
    onComplete: () => console.log('Complete clicked'),
  },
};

export const LowPrice: Story = {
  args: {
    data: {
      ...mockData,
      estimatedPrice: 8000,
    },
    onComplete: () => console.log('Complete clicked'),
  },
}; 