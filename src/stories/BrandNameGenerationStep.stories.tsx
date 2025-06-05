import type { Meta, StoryObj } from '@storybook/react';
import BrandNameGenerationStep from '../components/branding/BrandNameGenerationStep/BrandNameGenerationStep';

const meta: Meta<typeof BrandNameGenerationStep> = {
  title: 'Branding/BrandNameGenerationStep',
  component: BrandNameGenerationStep,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '브랜드명을 AI로 생성하고 사용자가 직접 편집할 수 있는 단계 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    brandingKeywords: {
      control: 'object',
      description: '브랜드명에 포함될 키워드 배열',
    },
    cropAppealKeywords: {
      control: 'object',
      description: '브랜드명에 포함될 작물의 특성 키워드 배열',
    },
    onBrandNameGenerated: {
      action: 'brandNameGenerated',
      description: '브랜드명이 생성되었을 때 호출되는 콜백',
    },
    onValidationChange: {
      action: 'validationChanged',
      description: '유효성 상태가 변경되었을 때 호출되는 콜백',
    },
  },
  args: {
    brandingKeywords: ['프리미엄', '신선한', '건강한'],
    cropAppealKeywords: ['달콤한', '아삭한', '과즙이 풍부한'],
    onBrandNameGenerated: (brandName: string) => console.log('Generated brand name:', brandName),
    onValidationChange: (isValid: boolean) => console.log('Validation changed:', isValid),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    brandingKeywords: ['프리미엄', '신선한', '건강한', '자연적인'],
    cropAppealKeywords: ['달콤한', '아삭한', '과즙이 풍부한'],
  },
  parameters: {
    docs: {
      description: {
        story: '기본적인 브랜드명 생성 단계입니다. 10개의 키워드를 기반으로 AI가 브랜드명을 생성합니다.',
      },
    },
  },
};

// 적은 키워드로 테스트
export const FewKeywords: Story = {
  args: {
    brandingKeywords: ['fresh', 'organic', 'sweet'],
    cropAppealKeywords: ['달콤한', '아삭한', '과즙이 풍부한'],
  },
  parameters: {
    docs: {
      description: {
        story: '키워드가 적을 때의 동작을 확인할 수 있습니다. 기본값으로 키워드가 보충됩니다.',
      },
    },
  },
};

// 많은 키워드로 테스트
export const WithManyKeywords: Story = {
  args: {
    brandingKeywords: ['프리미엄', '신선한', '건강한', '자연적인', '고품질'],
    cropAppealKeywords: ['달콤한', '아삭한', '과즙이 풍부한', '영양가 높은', '맛있는'],
  },
  parameters: {
    docs: {
      description: {
        story: '키워드가 많을 때의 동작을 확인할 수 있습니다. 처음 10개 키워드만 사용됩니다.',
      },
    },
  },
};

// 토마토 예시
export const TomatoExample: Story = {
  args: {
    brandingKeywords: [
      'professional', 'smart-farm', 'unique', 'digestible', 'premium',
      'water-rich', 'uniform-size', 'easy-storage', 'black-white', 'sweet'
    ],
    cropAppealKeywords: [
      'professional', 'smart-farm', 'unique', 'digestible', 'premium',
      'water-rich', 'uniform-size', 'easy-storage', 'black-white', 'sweet'
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '토마토 작물에 대한 실제 키워드 조합 예시입니다.',
      },
    },
  },
  decorators: [
    (Story) => {
      // localStorage에 토마토 작물 정보 설정
      if (typeof window !== 'undefined') {
        localStorage.setItem('brandingCropName', '토마토');
        localStorage.setItem('brandingVariety', '방울토마토');
      }
      return <Story />;
    },
  ],
}; 