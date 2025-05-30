import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BrandingCard from '../components/common/BrandingCard/BrandingCard';

const meta: Meta<typeof BrandingCard> = {
  title: 'common/BrandingCard',
  component: BrandingCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#F4FAFF' },
        { name: 'white', value: '#ffffff' },
      ],
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof BrandingCard>;

export const Apple: Story = {
  args: {
    title: '뽀사과',
    description: '한 입에 쏙, 귀여움이 톡!',
    imageUrl: 'https://placehold.co/72x72/ff6b6b/ffffff?text=🍎',
    onDelete: () => alert('뽀사과 카드가 삭제되었습니다!'),
  },
  parameters: {
    docs: {
      description: {
        story: '모던한 디자인의 브랜딩 카드입니다. 호버 시 부드러운 애니메이션과 함께 상승 효과를 확인할 수 있습니다.',
      },
    },
  },
};

export const Potato: Story = {
  args: {
    title: '하은 감자',
    description: '자연이 키운 진심의 맛',
    imageUrl: 'https://placehold.co/72x72/8b4513/ffffff?text=🥔',
    onDelete: () => alert('하은 감자 카드가 삭제되었습니다!'),
  },
  parameters: {
    docs: {
      description: {
        story: '그라데이션 텍스트 효과와 부드러운 그림자를 적용한 카드 디자인입니다.',
      },
    },
  },
};

export const GreenVegetable: Story = {
  args: {
    title: '싱싱초록',
    description: '노지에서 자란 고품질 오이고추, 바로 산지에서 보내드립니다.',
    imageUrl: 'https://placehold.co/72x72/32cd32/ffffff?text=🌶️',
    onDelete: () => alert('싱싱초록 카드가 삭제되었습니다!'),
  },
  parameters: {
    docs: {
      description: {
        story: '긴 설명 텍스트를 2줄로 제한하여 깔끔하게 표시하는 기능을 확인할 수 있습니다.',
      },
    },
  },
};

export const Tomato: Story = {
  args: {
    title: '토담토',
    description: '햇살과 정성을 가득 담은 산지직송 대추토마토, 토담토가 전하는 자연 그대로의 달콤함.',
    imageUrl: 'https://placehold.co/72x72/FF6347/ffffff?text=🍅',
    onDelete: () => alert('토담토 카드가 삭제되었습니다!'),
  },
  parameters: {
    docs: {
      description: {
        story: '텍스트 말줄임 기능과 함께 모던한 삭제 버튼 디자인을 확인할 수 있습니다.',
      },
    },
  },
};

export const ModernEffects: Story = {
  args: {
    title: '프리미엄 딸기',
    description: '달콤하고 신선한 프리미엄 딸기입니다.',
    imageUrl: 'https://placehold.co/72x72/E91E63/ffffff?text=🍓',
    onDelete: () => alert('프리미엄 딸기 카드가 삭제되었습니다!'),
  },
  parameters: {
    docs: {
      description: {
        story: '호버 시 이미지 확대 효과, shimmer 애니메이션, 상단 그라데이션 바 등 모던한 인터랙션 효과들을 확인할 수 있습니다.',
      },
    },
  },
};

export const AllCards: Story = {
  render: () => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '16px',
      padding: '24px',
      background: '#F4FAFF',
      borderRadius: '16px'
    }}>
      <BrandingCard
        title="뽀사과"
        description="한 입에 쏙, 귀여움이 톡!"
        imageUrl="https://placehold.co/72x72/ff6b6b/ffffff?text=🍎"
        onDelete={() => alert('뽀사과 삭제!')}
      />
      <BrandingCard
        title="하은 감자"
        description="자연이 키운 진심의 맛"
        imageUrl="https://placehold.co/72x72/8b4513/ffffff?text=🥔"
        onDelete={() => alert('하은 감자 삭제!')}
      />
      <BrandingCard
        title="싱싱초록"
        description="노지에서 자란 고품질 오이고추, 바로 산지에서 보내드립니다."
        imageUrl="https://placehold.co/72x72/32cd32/ffffff?text=🌶️"
        onDelete={() => alert('싱싱초록 삭제!')}
      />
      <BrandingCard
        title="토담토"
        description="햇살과 정성을 가득 담은 산지직송 대추토마토, 토담토가 전하는 자연 그대로의 달콤함."
        imageUrl="https://placehold.co/72x72/FF6347/ffffff?text=🍅"
        onDelete={() => alert('토담토 삭제!')}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '여러 개의 브랜딩 카드가 함께 배치된 모습입니다. 실제 마이페이지에서의 배치와 유사합니다.',
      },
    },
  },
}; 