import type { Meta, StoryObj } from '@storybook/react';
import PremiumResultStep from '../components/pricing/PremiumResultStep/PremiumResultStep';

const meta: Meta<typeof PremiumResultStep> = {
  title: 'Components/Pricing/PremiumResultStep',
  component: PremiumResultStep,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '프리미엄 가격 제안 완성 결과를 표시하는 컴포넌트입니다. 상세 정보 섹션이 추가되어 품목명, 등급, 분석일, 기준 수량, 지역 정보를 표시합니다.'
      }
    }
  },
  decorators: [
    (Story) => (
      <div style={{ 
        width: '100%',
        maxWidth: '402px',
        padding: '20px',
        background: '#F4FAFF',
        minHeight: '100vh'
      }}>
        <Story />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockPremiumData = {
  productItemCode: '101',
  productVarietyCode: '001',
  productName: '친환경 방울토마토',
  location: '서울',
  grade: '상급',
  analysisDate: '2024-06-23T09:30:00',
  quantity: '1',
  unit: 'kg',
  suggestedPrice: 15000,
  retailPrice: 18000,
  wholesalePrice: 12000,
  priceCalculation: {
    retailAverage: 18000,
    wholesaleAverage: 12000,
    priceRatio: 0.83,
    calculationFormula: '(소매가격 + 도매가격) / 2 × 0.83',
    explanation: 'KAMIS(한국농수산식품유통공사) 공식 데이터를 기반으로 최근 5일간의 소매·도매 가격을 분석하여 생산자와 소비자 모두에게 공정한 직거래 가격을 제안했습니다.'
  }
};

export const Default: Story = {
  args: {
    data: mockPremiumData,
    onComplete: () => console.log('프리미엄 가격 제안 완료')
  }
};

export const WithoutOptionalData: Story = {
  args: {
    data: {
      ...mockPremiumData,
      grade: undefined,
      analysisDate: undefined,
      quantity: undefined,
      unit: undefined,
      priceCalculation: undefined
    },
    onComplete: () => console.log('프리미엄 가격 제안 완료')
  }
};

export const DifferentProduct: Story = {
  args: {
    data: {
      productItemCode: '201',
      productVarietyCode: '003',
      productName: '유기농 상추',
      location: '경기',
      grade: '특급',
      analysisDate: '2024-06-22T14:20:00',
      quantity: '500',
      unit: 'g',
      suggestedPrice: 8500,
      retailPrice: 10000,
      wholesalePrice: 7000,
      priceCalculation: {
        retailAverage: 10000,
        wholesaleAverage: 7000,
        priceRatio: 0.85,
        calculationFormula: '(소매가격 + 도매가격) / 2 × 0.85',
        explanation: '최근 시장 동향을 반영하여 공정한 가격을 제안했습니다.'
      }
    },
    onComplete: () => console.log('프리미엄 가격 제안 완료')
  }
};

export const HighPriceProduct: Story = {
  args: {
    data: {
      productItemCode: '301',
      productVarietyCode: '005',
      productName: '프리미엄 수박',
      location: '제주',
      grade: '특급',
      analysisDate: '2024-06-21T16:45:00',
      quantity: '1',
      unit: '개',
      suggestedPrice: 45000,
      retailPrice: 55000,
      wholesalePrice: 35000,
      priceCalculation: {
        retailAverage: 55000,
        wholesaleAverage: 35000,
        priceRatio: 0.82,
        calculationFormula: '(소매가격 + 도매가격) / 2 × 0.82',
        explanation: '제주 지역 특산품으로 품질이 우수하여 프리미엄 가격이 적용되었습니다.'
      }
    },
    onComplete: () => console.log('프리미엄 가격 제안 완료')
  }
}; 