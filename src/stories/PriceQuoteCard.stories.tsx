import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import PriceQuoteCard from '../components/common/PriceQuoteCard/PriceQuoteCard';

const meta: Meta<typeof PriceQuoteCard> = {
  title: 'Components/PriceQuoteCard',
  component: PriceQuoteCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
가격 제안 이력을 표시하는 카드 컴포넌트입니다.

## 주요 기능
- **작물 정보 표시**: 작물명, 품종, 등급 정보
- **적정가격 표시**: 계산된 적정가격과 기준 수량
- **상호작용**: 카드 클릭 시 상세조회, 삭제 버튼
- **애니메이션**: 슬라이드 인 효과와 호버 애니메이션
- **반응형 디자인**: 모바일 최적화

## 등급 시스템
- 특급(최고급), 상급(우수), 중급(보통), 하급(일반)

## 디자인 특징
- 브랜드 컬러 #1F41BB 기반 UI
- 그라데이션과 그림자 효과
- 호버 시 글로우 애니메이션
- 가격 아이콘과 함께 표시
        `
      }
    }
  },
  argTypes: {
    productName: {
      control: 'text',
      description: '품목명'
    },
    grade: {
      control: 'select',
      options: ['특', '상', '중', '하'],
      description: '등급'
    },
    fairPrice: {
      control: 'number',
      description: '적정가격 (원)'
    },
    unit: {
      control: 'text',
      description: '단위'
    },
    quantity: {
      control: 'number',
      description: '수량'
    },
    onClick: {
      action: 'clicked',
      description: '카드 클릭 이벤트'
    },
    onDelete: {
      action: 'deleted',
      description: '삭제 버튼 클릭 이벤트'
    }
  }
};

export default meta;
type Story = StoryObj<typeof PriceQuoteCard>;

export const Default: Story = {
  args: {
    productName: '감자',
    grade: '상',
    fairPrice: 2745,
    unit: 'kg',
    quantity: 1,
    onClick: action('card-clicked'),
    onDelete: action('delete-clicked')
  }
};

export const Premium: Story = {
  args: {
    productName: '사과',
    grade: '특',
    fairPrice: 6900,
    unit: 'kg',
    quantity: 1,
    onClick: action('card-clicked'),
    onDelete: action('delete-clicked')
  }
};

export const Expensive: Story = {
  args: {
    productName: '아스파라거스',
    grade: '중',
    fairPrice: 14700,
    unit: 'kg',
    quantity: 1,
    onClick: action('card-clicked'),
    onDelete: action('delete-clicked')
  }
};

export const LongNames: Story = {
  args: {
    productName: '친환경무농약재배토마토',
    grade: '특',
    fairPrice: 8500,
    unit: 'kg',
    quantity: 1,
    onClick: action('card-clicked'),
    onDelete: action('delete-clicked')
  }
};

export const WithoutDelete: Story = {
  args: {
    cropName: '감자',
    variety: '수미',
    grade: '상',
    fairPrice: 2745,
    unit: 'kg',
    quantity: 1,
    onClick: action('card-clicked')
    // onDelete를 제공하지 않음
  }
};

export const DifferentUnits: Story = {
  args: {
    productName: '포도',
    grade: '특',
    fairPrice: 45000,
    unit: 'box',
    quantity: 2,
    onClick: action('card-clicked'),
    onDelete: action('delete-clicked')
  }
}; 