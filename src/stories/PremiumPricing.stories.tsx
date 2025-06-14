import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { action } from '@storybook/addon-actions';
import PremiumPricing from '../pages/PremiumPricing/PremiumPricing';
import { AuthProvider } from '../contexts/AuthContext';
import { NotificationProvider } from '../contexts/NotificationContext';

const meta: Meta<typeof PremiumPricing> = {
  title: 'Pages/PremiumPricing',
  component: PremiumPricing,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '프리미엄 회원 전용 고급 가격 제안 서비스 페이지입니다. KAMIS API 데이터와 AI 분석을 통해 정확한 직거래 가격을 제안합니다.'
      }
    }
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <Story />
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock API responses
const mockPremiumPriceService = {
  getHistory: () => Promise.resolve({
    content: [
      {
        id: 1,
        productName: '사과(후지)',
        location: '경기',
        suggestedPrice: 15000,
        createdAt: '2024-01-15T10:30:00'
      },
      {
        id: 2,
        productName: '배추(김장용)',
        location: '충남',
        suggestedPrice: 8500,
        createdAt: '2024-01-14T14:20:00'
      },
      {
        id: 3,
        productName: '당근(일반)',
        location: '전국',
        suggestedPrice: 6700,
        createdAt: '2024-01-13T09:15:00'
      }
    ],
    totalElements: 15,
    totalPages: 5,
    currentPage: 0,
    pageSize: 3
  })
};

export const Default: Story = {
  name: '기본 상태',
  parameters: {
    docs: {
      description: {
        story: '프리미엄 가격 제안 페이지의 기본 상태입니다. 히어로 섹션, 특징 소개, 최근 이력을 포함합니다.'
      }
    }
  }
};

export const WithHistory: Story = {
  name: '이력이 있는 상태',
  parameters: {
    docs: {
      description: {
        story: '사용자가 이전에 프리미엄 가격 제안을 받은 이력이 있는 상태입니다.'
      }
    },
    mockData: {
      premiumPriceService: mockPremiumPriceService
    }
  }
};

export const EmptyHistory: Story = {
  name: '이력이 없는 상태',
  parameters: {
    docs: {
      description: {
        story: '처음 방문한 사용자 또는 아직 가격 제안을 받지 않은 사용자의 상태입니다.'
      }
    },
    mockData: {
      premiumPriceService: {
        getHistory: () => Promise.resolve({
          content: [],
          totalElements: 0,
          totalPages: 0,
          currentPage: 0,
          pageSize: 3
        })
      }
    }
  }
};

export const LoadingHistory: Story = {
  name: '이력 로딩 중',
  parameters: {
    docs: {
      description: {
        story: '가격 제안 이력을 불러오는 중인 상태입니다.'
      }
    },
    mockData: {
      premiumPriceService: {
        getHistory: () => new Promise(() => {}) // 무한 대기
      }
    }
  }
};

export const FreeMemberAccess: Story = {
  name: '무료 회원 접근',
  parameters: {
    docs: {
      description: {
        story: '무료 회원이 프리미엄 가격 제안에 접근했을 때의 상태입니다. 멤버십 업그레이드 안내가 표시됩니다.'
      }
    },
    mockData: {
      user: {
        id: 1,
        email: 'free@example.com',
        nickname: '무료회원',
        membershipType: 'FREE'
      }
    }
  }
};

export const PremiumMemberAccess: Story = {
  name: '프리미엄 회원 접근',
  parameters: {
    docs: {
      description: {
        story: '프리미엄 회원이 프리미엄 가격 제안에 접근한 상태입니다. 모든 기능을 사용할 수 있습니다.'
      }
    },
    mockData: {
      user: {
        id: 2,
        email: 'premium@example.com',
        nickname: '프리미엄회원',
        membershipType: 'PREMIUM'
      },
      premiumPriceService: mockPremiumPriceService
    }
  }
};

export const Mobile: Story = {
  name: '모바일 화면',
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: '모바일 디바이스에서의 프리미엄 가격 제안 페이지입니다.'
      }
    }
  }
};

export const Tablet: Story = {
  name: '태블릿 화면',
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: '태블릿 디바이스에서의 프리미엄 가격 제안 페이지입니다.'
      }
    }
  }
}; 