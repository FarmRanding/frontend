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
        component: '가격 제안 이력을 표시하는 카드 컴포넌트입니다. 프리미엄과 일반 제안을 구분하여 표시하며, 클릭 시 상세보기로 이동할 수 있습니다.'
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
        story: '일반 가격 제안 카드입니다. 초록색 STANDARD 배지가 표시됩니다.'
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
        story: '프리미엄 가격 제안 카드입니다. 주황색 PREMIUM 배지가 표시됩니다.'
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