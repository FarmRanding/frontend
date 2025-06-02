import type { Meta, StoryObj } from '@storybook/react';
import PersonalInfo from '../components/common/PersonalInfo';
import type { PersonalInfoData } from '../components/common/PersonalInfo';

const meta: Meta<typeof PersonalInfo> = {
  title: 'Components/PersonalInfo',
  component: PersonalInfo,
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
  argTypes: {
    data: {
      description: '개인 정보 데이터',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData: PersonalInfoData = {
  name: '',
  farmName: ' 하은팜',
  location: '○○도 □□시 △△동',
};

export const Default: Story = {
  args: {
    data: sampleData,
  },
  parameters: {
    docs: {
      description: {
        story: '완전히 새로워진 모던한 PersonalInfo 컴포넌트입니다. 그라데이션 배경, 호버 애니메이션, shimmer 효과 등이 적용되었습니다.',
      },
    },
  },
};

export const ModernFeatures: Story = {
  args: {
    data: {
      name: '김농부',
      farmName: '김농부네 딸기농장',
      location: '경상북도 안동시 풍천면',
    },
  },
  parameters: {
    docs: {
      description: {
        story: '호버 시 아이콘 확대, 행별 슬라이드 효과, 컬러 변화 등의 인터랙티브 효과를 확인할 수 있습니다.',
      },
    },
  },
};

export const LongText: Story = {
  args: {
    data: {
      name: '이다영',
      farmName: '이다영네 유기농 친환경 무농약 농장',
      location: '전라남도 화순군 남면 월곡리',
    },
  },
  parameters: {
    docs: {
      description: {
        story: '긴 텍스트도 말줄임 처리되어 깔끔하게 표시됩니다. 호버 시 전체 내용을 확인할 수 있습니다.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    data: {
      name: '최민수',
      farmName: '최네농장',
      location: '서울시 강남구',
    },
  },
  parameters: {
    docs: {
      description: {
        story: '각 행에 마우스를 올려보면 개별적인 호버 효과와 함께 아이콘과 텍스트가 인터랙티브하게 반응합니다.',
      },
    },
  },
}; 