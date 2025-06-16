import type { Meta, StoryObj } from '@storybook/react';
import PriceQuoteHistoryCard from '../components/common/PriceQuoteHistoryCard';
import EmptyPriceHistory from '../components/common/EmptyPriceHistory';
import { UnifiedPriceHistoryResponse } from '../api/priceQuoteService';

// Mock 데이터
const mockStandardQuote: UnifiedPriceHistoryResponse = {
  id: 1,
  type: 'STANDARD',
  productName: '사과',
  grade: '특급',
  suggestedPrice: 12500,
  unit: 'kg',
  quantity: 1,
  createdAt: new Date().toISOString()
};

const mockPremiumQuote: UnifiedPriceHistoryResponse = {
  id: 2,
  type: 'PREMIUM',
  productName: '배추',
  grade: '상급',
  suggestedPrice: 8900,
  unit: 'kg',
  quantity: 5,
  createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 어제
  retailAverage: 9500,
  wholesaleAverage: 8200,
  calculationReason: '시장 평균가 기준'
};

const mockOldQuote: UnifiedPriceHistoryResponse = {
  id: 3,
  type: 'STANDARD',
  productName: '당근',
  grade: '일반',
  suggestedPrice: 6700,
  unit: 'kg',
  quantity: 3,
  createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5일 전
};

// PriceQuoteHistoryCard 스토리
const meta: Meta<typeof PriceQuoteHistoryCard> = {
  title: 'Components/PriceQuoteHistoryCard',
  component: PriceQuoteHistoryCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
가격 제안 이력을 표시하는 모던한 카드 컴포넌트입니다.

#### 주요 특징
- **프리미엄 구분**: 프리미엄은 보라색 그라데이션, 일반은 깔끔한 흰색 배경
- **모던한 디자인**: 미묘한 배경 패턴, 떠다니는 숫자 효과, 반짝이는 장식
- **부드러운 인터랙션**: 호버 시 스케일링, 향상된 그림자, 빛나는 효과
- **280×200px 크기**: 기존 차트와 동일한 크기로 일관성 유지
- **접근성**: 키보드 네비게이션 지원, 적절한 aria-label 제공

#### 애니메이션 효과
- 배경 그라데이션 쉬프트 (프리미엄만)
- 계산 관련 숫자와 기호가 미묘하게 떠다니는 효과
- 반짝이는 장식 요소들
- 호버 시 부드러운 확대 및 그림자 강화
        `
      }
    }
  },
  argTypes: {
    data: {
      description: '가격 제안 이력 데이터',
      control: false
    },
    onClick: {
      description: '카드 클릭 시 호출되는 함수',
      action: 'clicked'
    }
  },
  decorators: [
    (Story) => (
      <div style={{ 
        background: '#F4FAFF',
        padding: '20px',
        minHeight: '250px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Story />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const StandardQuote: Story = {
  args: {
    data: mockStandardQuote,
    onClick: (data) => console.log('클릭된 데이터:', data)
  },
  parameters: {
    docs: {
      description: {
        story: '일반 가격 제안 카드입니다. 깔끔한 흰색 배경에 파란색 액센트 컬러로 표시됩니다. 미묘한 배경 패턴과 떠다니는 숫자 효과가 적용됩니다.'
      }
    }
  }
};

export const PremiumQuote: Story = {
  args: {
    data: mockPremiumQuote,
    onClick: (data) => console.log('클릭된 데이터:', data)
  },
  parameters: {
    docs: {
      description: {
        story: '프리미엄 가격 제안 카드입니다. 아름다운 보라색 그라데이션 배경에 흰색 텍스트로 표시됩니다. 배경 그라데이션이 부드럽게 움직이며, 더 화려한 장식 효과가 적용됩니다.'
      }
    }
  }
};

export const OldQuote: Story = {
  args: {
    data: mockOldQuote,
    onClick: (data) => console.log('클릭된 데이터:', data)
  },
  parameters: {
    docs: {
      description: {
        story: '며칠 전에 받은 가격 제안 카드입니다. 상대적 시간이 표시됩니다.'
      }
    }
  }
};

// 여러 카드 나열 (좌우 스크롤)
export const MultipleCards: Story = {
  render: (args) => (
    <div style={{ 
      display: 'flex', 
      gap: '16px', 
      overflowX: 'auto',
      padding: '10px',
      width: '600px',
      scrollBehavior: 'smooth'
    }}>
      <PriceQuoteHistoryCard {...args} data={mockStandardQuote} />
      <PriceQuoteHistoryCard {...args} data={mockPremiumQuote} />
      <PriceQuoteHistoryCard {...args} data={mockOldQuote} />
    </div>
  ),
  args: {
    onClick: (data) => console.log('클릭된 데이터:', data)
  },
  parameters: {
    docs: {
      description: {
        story: '여러 가격 제안 카드가 좌우로 스크롤되는 모습입니다. 실제 대시보드와 동일한 형태입니다.'
      }
    }
  }
};

// EmptyPriceHistory 스토리
const emptyMeta: Meta<typeof EmptyPriceHistory> = {
  title: 'Components/EmptyPriceHistory',
  component: EmptyPriceHistory,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '가격 제안 이력이 없을 때 표시되는 빈 상태 컴포넌트입니다.'
      }
    }
  },
  argTypes: {
    onStartQuote: {
      description: '가격 제안 받기 버튼 클릭 시 호출되는 함수',
      action: 'start quote clicked'
    }
  },
  decorators: [
    (Story) => (
      <div style={{ 
        background: '#F4FAFF',
        padding: '20px',
        minHeight: '300px',
        maxWidth: '400px'
      }}>
        <Story />
      </div>
    )
  ]
};

type EmptyStory = StoryObj<typeof emptyMeta>;

export const EmptyState: EmptyStory = {
  args: {
    onStartQuote: () => console.log('가격 제안 받기 시작')
  },
  parameters: {
    docs: {
      description: {
        story: '가격 제안 이력이 없을 때의 빈 상태입니다. 사용자가 첫 번째 가격 제안을 받도록 유도합니다.'
      }
    }
  }
};

export const EmptyWithoutButton: EmptyStory = {
  args: {
    onStartQuote: undefined
  },
  parameters: {
    docs: {
      description: {
        story: '버튼 없이 빈 상태만 표시하는 경우입니다.'
      }
    }
  }
};

// EmptyPriceHistory도 export
export { emptyMeta as EmptyPriceHistoryMeta }; 