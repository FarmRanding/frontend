import type { Meta, StoryObj } from '@storybook/react';
import PriceQuoteStep from '../components/pricing/PriceQuoteStep/PriceQuoteStep';

const meta: Meta<typeof PriceQuoteStep> = {
  title: 'Pricing/PriceQuoteStep',
  component: PriceQuoteStep,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockData = {
  cropName: '',
  variety: '',
  grade: '',
  harvestDate: null,
};

export const Default: Story = {
  args: {
    data: mockData,
    onChange: (data) => console.log('Data changed:', data),
    onValidationChange: (isValid) => console.log('Validation changed:', isValid),
    onPriceGenerated: (price) => console.log('Price generated:', price),
  },
};

export const WithData: Story = {
  args: {
    data: {
      cropName: '토마토',
      variety: '대추방울토마토',
      grade: 'special',
      harvestDate: new Date('2024-03-15'),
    },
    onChange: (data) => console.log('Data changed:', data),
    onValidationChange: (isValid) => console.log('Validation changed:', isValid),
    onPriceGenerated: (price) => console.log('Price generated:', price),
  },
}; 