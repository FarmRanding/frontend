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
    allKeywords: {
      control: 'object',
      description: '선택된 모든 키워드 배열',
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
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    allKeywords: [
      'premium', 'fresh', 'organic', 'natural', 'healthy',
      'sweet', 'juicy', 'colorful', 'nutritious', 'delicious'
    ],
    onBrandNameGenerated: (brandName: string) => {
      console.log('생성된 브랜드명:', brandName);
    },
    onValidationChange: (isValid: boolean) => {
      console.log('유효성 변경:', isValid);
    },
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
    allKeywords: ['fresh', 'organic', 'sweet'],
    onBrandNameGenerated: (brandName: string) => {
      console.log('생성된 브랜드명:', brandName);
    },
    onValidationChange: (isValid: boolean) => {
      console.log('유효성 변경:', isValid);
    },
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
export const ManyKeywords: Story = {
  args: {
    allKeywords: [
      'premium', 'fresh', 'organic', 'natural', 'healthy',
      'sweet', 'juicy', 'colorful', 'nutritious', 'delicious',
      'artisanal', 'sustainable', 'local', 'seasonal', 'authentic'
    ],
    onBrandNameGenerated: (brandName: string) => {
      console.log('생성된 브랜드명:', brandName);
    },
    onValidationChange: (isValid: boolean) => {
      console.log('유효성 변경:', isValid);
    },
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
    allKeywords: [
      'professional', 'smart-farm', 'unique', 'digestible', 'premium',
      'water-rich', 'uniform-size', 'easy-storage', 'black-white', 'sweet'
    ],
    onBrandNameGenerated: (brandName: string) => {
      console.log('생성된 브랜드명:', brandName);
    },
    onValidationChange: (isValid: boolean) => {
      console.log('유효성 변경:', isValid);
    },
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