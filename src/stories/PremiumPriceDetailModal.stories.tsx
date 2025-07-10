import type { Meta, StoryObj } from '@storybook/react';
import PremiumPriceDetailModal from '../components/common/PremiumPriceDetailModal/PremiumPriceDetailModal';
import { UnifiedPriceHistoryResponse } from '../types/priceQuote';

const meta: Meta<typeof PremiumPriceDetailModal> = {
  title: 'Components/PremiumPriceDetailModal',
  component: PremiumPriceDetailModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockPremiumData: UnifiedPriceHistoryResponse = {
  id: 1,
  type: 'PREMIUM',
  productName: '토마토',
  grade: '상급',
  location: '서울특별시',
  suggestedPrice: 3500,
  unit: 'kg',
  quantity: 1,
  harvestDate: null,
  analysisDate: '2024-01-15',
  createdAt: '2024-01-15T10:30:00',
  retailAverage: 4200,
  wholesaleAverage: 2800,
  calculationReason: '서울 지역 토마토 상급 기준으로 소매 5일 평균 4,200원, 도매 5일 평균 2,800원을 분석했습니다. 현재 시장 상황을 고려할 때 소매가의 83% 수준인 3,500원이 적정 판매가로 판단됩니다. 겨울철 토마토 수요 증가와 품질 프리미엄을 반영한 가격입니다.'
};

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    data: mockPremiumData,
  },
};

export const WithoutLocation: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    data: {
      ...mockPremiumData,
      location: null,
    },
  },
};

export const WithoutAnalysisData: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    data: {
      ...mockPremiumData,
      retailAverage: null,
      wholesaleAverage: null,
      calculationReason: null,
    },
  },
}; 