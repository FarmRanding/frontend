import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import styled from 'styled-components';
import BrandNameGenerationStep from '../components/branding/BrandNameGenerationStep/BrandNameGenerationStep';

const StoryContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 40px 20px;
  background: #f8f9fa;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BrandNameGenerationStepWrapper = (args: any) => {
  const [generatedBrandName, setGeneratedBrandName] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);

  const handleBrandNameGenerated = (brandName: string) => {
    setGeneratedBrandName(brandName);
    console.log('생성된 브랜드명:', brandName);
  };

  const handleValidationChange = (valid: boolean) => {
    setIsValid(valid);
    console.log('유효성 상태:', valid);
  };

  return (
    <StoryContainer>
      <BrandNameGenerationStep
        {...args}
        onBrandNameGenerated={handleBrandNameGenerated}
        onValidationChange={handleValidationChange}
      />
      
      {/* 디버깅 정보 */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        background: 'white',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        fontSize: '12px',
        maxWidth: '200px'
      }}>
        <div><strong>생성된 브랜드명:</strong> {generatedBrandName || '없음'}</div>
        <div><strong>유효성:</strong> {isValid ? '✅ 유효' : '❌ 무효'}</div>
      </div>
    </StoryContainer>
  );
};

const meta: Meta<typeof BrandNameGenerationStep> = {
  title: 'Branding/BrandNameGenerationStep',
  component: BrandNameGenerationStep,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
브랜딩 프로세스에서 브랜드명을 생성하는 단계의 컴포넌트입니다.

## 주요 기능
- AI 기반 브랜드명 자동 생성
- 멤버십별 재생성 제한 (무료: 3회, 프로: 10회)  
- 브랜드명 직접 편집 기능
- 타이핑 애니메이션 효과
- 중복 방지 로직

## 멤버십별 제한
- **무료 멤버십**: 3번까지 재생성 가능
- **프로 멤버십**: 10번까지 재생성 가능
- 제한 도달 시 업그레이드 안내 표시

## 사용 방법
1. 키워드 선택 후 자동으로 브랜드명 생성 시작
2. 생성된 브랜드명 클릭하여 직접 수정 가능
3. 재생성 버튼으로 새로운 브랜드명 생성
4. 멤버십별 제한 횟수 내에서 재생성 가능
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    brandingKeywords: {
      description: '브랜드 이미지 키워드 배열',
      control: 'object',
    },
    cropAppealKeywords: {
      description: '작물 매력 키워드 배열',
      control: 'object',
    },
    onBrandNameGenerated: {
      description: '브랜드명 생성 완료 시 호출되는 콜백',
      action: 'brandNameGenerated',
    },
    onValidationChange: {
      description: '유효성 변경 시 호출되는 콜백',
      action: 'validationChanged',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: BrandNameGenerationStepWrapper,
  args: {
    brandingKeywords: ['프리미엄', '건강한', '신선한'],
    cropAppealKeywords: ['달콤한', '아삭한', '과즙이 풍부한'],
  },
};

export const ManyKeywords: Story = {
  render: BrandNameGenerationStepWrapper,
  args: {
    brandingKeywords: [
      '프리미엄', '건강한', '신선한', '자연스러운', 
      '정직한', '친환경', '안전한', '영양가 높은'
    ],
    cropAppealKeywords: [
      '달콤한', '아삭한', '과즙이 풍부한', 
      '맛있는', '향이 좋은', '부드러운'
    ],
  },
};

export const MinimalKeywords: Story = {
  render: BrandNameGenerationStepWrapper,
  args: {
    brandingKeywords: ['프리미엄'],
    cropAppealKeywords: ['달콤한'],
  },
};

export const NoAppealKeywords: Story = {
  render: BrandNameGenerationStepWrapper,
  args: {
    brandingKeywords: ['건강한', '신선한', '자연스러운'],
    cropAppealKeywords: [],
  },
};

export const OrganicTheme: Story = {
  render: BrandNameGenerationStepWrapper,
  args: {
    brandingKeywords: ['유기농', '친환경', '자연스러운', '건강한'],
    cropAppealKeywords: ['신선한', '맛있는', '영양가 높은', '안전한'],
  },
};

export const PremiumTheme: Story = {
  render: BrandNameGenerationStepWrapper,
  args: {
    brandingKeywords: ['프리미엄', '고급스러운', '특별한', '엄선된'],
    cropAppealKeywords: ['달콤한', '과즙이 풍부한', '향이 좋은', '부드러운'],
  },
}; 