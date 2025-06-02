import type { Meta, StoryObj } from '@storybook/react';
import PriceTrendChart from '../components/common/PriceTrendChart/PriceTrendChart';

// 샘플 데이터 생성 함수
const generateSampleData = (basePrice: number, days: number = 30) => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // 가격 변동 시뮬레이션
    const variation = (Math.random() - 0.5) * 0.2; // ±10% 변동
    const price = Math.round(basePrice * (1 + variation));
    
    data.push({
      date: date.toISOString(),
      price
    });
  }
  
  return data;
};

const meta: Meta<typeof PriceTrendChart> = {
  title: 'Components/PriceTrendChart',
  component: PriceTrendChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '가격 동향을 보여주는 모던한 차트 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: '차트에 표시할 가격 동향 데이터',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PriceTrendChart>;

export const PositiveTrend: Story = {
  args: {
    data: {
      cropName: '사과',
      variety: '후지',
      currentPrice: 12500,
      priceChange: 5.2,
      data: generateSampleData(12500)
    },
  },
};

export const NegativeTrend: Story = {
  args: {
    data: {
      cropName: '배추',
      variety: '김장용',
      currentPrice: 8900,
      priceChange: -2.1,
      data: generateSampleData(8900)
    },
  },
};

export const StableTrend: Story = {
  args: {
    data: {
      cropName: '당근',
      variety: '일반',
      currentPrice: 6700,
      priceChange: 0.3,
      data: generateSampleData(6700)
    },
  },
};

export const HighPriceCrop: Story = {
  args: {
    data: {
      cropName: '딸기',
      variety: '설향',
      currentPrice: 25000,
      priceChange: 12.8,
      data: generateSampleData(25000)
    },
  },
};

export const LowPriceCrop: Story = {
  args: {
    data: {
      cropName: '양파',
      variety: '일반',
      currentPrice: 3200,
      priceChange: -8.5,
      data: generateSampleData(3200)
    },
  },
}; 