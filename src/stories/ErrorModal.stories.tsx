import type { Meta, StoryObj } from '@storybook/react';
import ErrorModal from '../components/common/ErrorModal/ErrorModal';

const meta: Meta<typeof ErrorModal> = {
  title: 'Components/Common/ErrorModal',
  component: ErrorModal,
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
      description: '에러 제목',
    },
    subtitle: {
      control: 'text',
      description: '에러 부제목',
    },
    showCondition: {
      control: 'boolean',
      description: '선택된 조건 표시 여부',
    },
    onClose: {
      action: 'onClose',
      description: '모달 닫기 콜백',
    },
    onRetry: {
      action: 'onRetry',
      description: '재시도 콜백 (선택사항)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorModal>;

// 기본 데이터 없음 에러
export const DataNotAvailable: Story = {
  args: {
    isOpen: true,
    title: '시장 가격 데이터가 없습니다',
    subtitle: '선택하신 조건에 대한 시장 가격 데이터가 없어 분석을 진행할 수 없습니다.',
    showCondition: true,
    condition: {
      productName: '양파',
      grade: '상급',
      location: '서울',
      date: '2025년 6월 25일',
    },
    onRetry: () => console.log('조건 변경 클릭'),
  },
};

// AI 서비스 에러
export const AIServiceError: Story = {
  args: {
    isOpen: true,
    title: 'AI 분석 중 오류가 발생했습니다',
    subtitle: '잠시 후 다시 시도해 주세요.',
    showCondition: false,
  },
};

// 멤버십 필요 에러
export const PremiumRequired: Story = {
  args: {
    isOpen: true,
    title: '프리미엄 기능입니다',
    subtitle: '이 기능을 사용하려면 프리미엄 멤버십이 필요합니다.',
    showCondition: false,
    onRetry: () => console.log('멤버십 페이지로 이동'),
  },
};

// 상품 코드 없음 에러
export const ProductCodeNotFound: Story = {
  args: {
    isOpen: true,
    title: '지원하지 않는 농산물입니다',
    subtitle: '현재 지원하지 않는 농산물입니다. 다른 농산물을 선택해 주세요.',
    showCondition: true,
    condition: {
      productName: '희귀한 버섯',
      grade: '상급',
      location: '강원도',
      date: '2025. 6. 25.',
    },
  },
};

// 조건 없이 표시하는 경우
export const WithoutCondition: Story = {
  args: {
    isOpen: true,
    title: '네트워크 오류',
    subtitle: '인터넷 연결을 확인하고 다시 시도해 주세요.',
    showCondition: false,
  },
};

// 재시도 버튼이 있는 경우
export const WithRetryButton: Story = {
  args: {
    isOpen: true,
    title: '일시적인 오류가 발생했습니다',
    subtitle: '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    showCondition: false,
    onRetry: () => console.log('다시 시도'),
  },
}; 