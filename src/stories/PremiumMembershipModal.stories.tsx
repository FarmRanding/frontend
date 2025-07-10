import type { Meta, StoryObj } from '@storybook/react';
import PremiumMembershipModal from '../components/common/PremiumMembershipModal/PremiumMembershipModal';

const meta: Meta<typeof PremiumMembershipModal> = {
  title: 'Components/Common/PremiumMembershipModal',
  component: PremiumMembershipModal,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '모달 열림/닫힘 상태',
    },
    title: {
      control: 'text',
      description: '모달 제목',
    },
    subtitle: {
      control: 'text',
      description: '모달 부제목',
    },
    featureName: {
      control: 'text',
      description: '기능명',
    },
    onClose: {
      action: 'onClose',
      description: '모달 닫기 콜백',
    },
    onUpgrade: {
      action: 'onUpgrade',
      description: '업그레이드 콜백',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PremiumMembershipModal>;

// 기본 프리미엄 멤버십 모달
export const Default: Story = {
  args: {
    isOpen: true,
    title: '프리미엄 멤버십 필요',
    subtitle: '이 기능을 사용하려면 프리미엄 멤버십이 필요합니다.',
    featureName: '프리미엄 가격 제안',
    onClose: () => console.log('모달 닫기'),
    onUpgrade: () => console.log('멤버십 업그레이드'),
  },
};

// 프리미엄 가격 제안 전용
export const PremiumPricing: Story = {
  args: {
    isOpen: true,
    title: '프리미엄 멤버십 필요',
    subtitle: '프리미엄 가격 제안은 프리미엄 이상 멤버십에서 이용할 수 있습니다.',
    featureName: '프리미엄 가격 제안',
    onClose: () => console.log('홈으로 돌아가기'),
    onUpgrade: () => console.log('멤버십 페이지로 이동'),
  },
  parameters: {
    docs: {
      description: {
        story: '프리미엄 가격 제안 기능에 접근할 때 표시되는 모달입니다.'
      }
    }
  }
};

// AI 브랜딩 전용
export const AIBranding: Story = {
  args: {
    isOpen: true,
    title: '프리미엄 멤버십 필요',
    subtitle: 'AI 브랜딩 기능은 프리미엄 이상 멤버십에서 이용할 수 있습니다.',
    featureName: 'AI 브랜딩',
    onClose: () => console.log('모달 닫기'),
    onUpgrade: () => console.log('멤버십 업그레이드'),
  },
  parameters: {
    docs: {
      description: {
        story: 'AI 브랜딩 기능에 접근할 때 표시되는 모달입니다.'
      }
    }
  }
};

// 브랜드 스토리 전용 (프리미엄 플러스 필요)
export const BrandStory: Story = {
  args: {
    isOpen: true,
    title: '프리미엄 플러스 멤버십 필요',
    subtitle: '브랜드 스토리 기능은 프리미엄 플러스 멤버십에서 이용할 수 있습니다.',
    featureName: '브랜드 스토리',
    onClose: () => console.log('모달 닫기'),
    onUpgrade: () => console.log('프리미엄 플러스 업그레이드'),
  },
  parameters: {
    docs: {
      description: {
        story: '브랜드 스토리 기능에 접근할 때 표시되는 모달입니다.'
      }
    }
  }
};

// 닫힌 상태
export const Closed: Story = {
  args: {
    isOpen: false,
    title: '프리미엄 멤버십 필요',
    subtitle: '이 기능을 사용하려면 프리미엄 멤버십이 필요합니다.',
    featureName: '프리미엄 기능',
    onClose: () => console.log('모달 닫기'),
    onUpgrade: () => console.log('멤버십 업그레이드'),
  },
  parameters: {
    docs: {
      description: {
        story: '모달이 닫힌 상태입니다.'
      }
    }
  }
}; 