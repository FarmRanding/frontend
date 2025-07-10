import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import BrandResult from '../components/common/BrandResult/BrandResult';
import type { BrandResultData } from '../components/common/BrandResult/BrandResult';

const mockData: BrandResultData = {
  brandName: '하은 감자',
  promotionText: '자연이 키운 진심의 맛',
  story: `경기도 화성시 동탄면에서 자란 밤양갱 큐트케어는 특등급의 프리미엄 양갱입니다. 우리의 양갱은 최상의 품질을 위해 신선한 밤을 엄선하여 사용하며, 양갱공장에서 정성스럽게 만들어집니다. 부드럽고 쫄깃한 식감은 물론, 달콤한 맛이 입안을 가득 채워줍니다. 건강과 다이어트를 생각하는 여러분을 위해 설계된 이 양갱은, 고품질의 재료만을 사용하여 고객님의 건강을 최우선으로 생각합니다. 따뜻한 순간에 함께하고 싶은 밤양갱 큐트케어, 지금 바로 만나보세요!`,
  imageUrl: 'https://placehold.co/200x200/E8F4FF/1F41BB?text=Brand+Logo'
};

const meta: Meta<typeof BrandResult> = {
  title: 'Components/BrandResult',
  component: BrandResult,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '브랜드 생성 결과를 표시하는 컴포넌트입니다.',
      },
    },
  },
  argTypes: {
    data: {
      description: '브랜드 결과 데이터',
    },
    canAccessStory: {
      description: '스토리 전체 접근 권한',
      control: 'boolean',
    },
    onUpgrade: {
      description: '업그레이드 버튼 클릭 핸들러',
      action: 'upgrade-clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리 (접근 권한 없음)
export const Default: Story = {
  args: {
    data: mockData,
    canAccessStory: false,
    onUpgrade: () => console.log('업그레이드 버튼 클릭'),
  },
};

// 프리미엄 사용자 (접근 권한 있음)
export const PremiumUser: Story = {
  args: {
    data: mockData,
    canAccessStory: true,
    onUpgrade: () => console.log('업그레이드 버튼 클릭'),
  },
};

// 이미지 없는 상태
export const WithoutImage: Story = {
  args: {
    data: {
      ...mockData,
      imageUrl: undefined,
    },
    canAccessStory: false,
    onUpgrade: () => console.log('업그레이드 버튼 클릭'),
  },
};

// 짧은 스토리 (더보기 없음)
export const ShortStory: Story = {
  args: {
    data: {
      ...mockData,
      story: '간단한 브랜드 스토리입니다.',
    },
    canAccessStory: true,
    onUpgrade: () => console.log('업그레이드 버튼 클릭'),
  },
}; 