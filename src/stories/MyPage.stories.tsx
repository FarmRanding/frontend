import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import MyPage from '../pages/MyPage/MyPage';

const meta: Meta<typeof MyPage> = {
  title: 'Pages/MyPage',
  component: MyPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '사용자의 프로필, 브랜딩 이력, 가격 제안 이력, 멤버십 정보를 관리할 수 있는 마이페이지입니다.'
      }
    }
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 마이페이지
export const Default: Story = {
  name: '기본 마이페이지',
  parameters: {
    docs: {
      description: {
        story: '사용자 정보와 브랜딩/가격 제안 이력을 보여주는 기본 마이페이지입니다.'
      }
    }
  }
};

// 브랜딩 탭 선택된 상태
export const BrandingTab: Story = {
  name: '브랜딩 탭',
  parameters: {
    docs: {
      description: {
        story: '브랜딩 이력 탭이 선택된 상태의 마이페이지입니다. 사용자가 생성한 브랜딩 프로젝트들을 날짜순으로 확인할 수 있습니다.'
      }
    }
  }
};

// 가격 제안 탭 선택된 상태
export const PricingTab: Story = {
  name: '가격 제안 탭',
  parameters: {
    docs: {
      description: {
        story: '가격 제안 이력 탭이 선택된 상태의 마이페이지입니다. 사용자가 요청한 가격 제안 결과들을 확인할 수 있습니다.'
      }
    }
  }
};

// 멤버십 탭 선택된 상태
export const MembershipTab: Story = {
  name: '멤버십 탭',
  parameters: {
    docs: {
      description: {
        story: '멤버십 탭이 선택된 상태의 마이페이지입니다. 다양한 멤버십 플랜을 비교하고 선택할 수 있습니다.'
      }
    }
  }
};

// 프로필 편집 모드
export const EditingProfile: Story = {
  name: '프로필 편집 모드',
  parameters: {
    docs: {
      description: {
        story: '프로필 편집 모드가 활성화된 상태입니다. 사용자는 이름, 농장명, 위치를 수정할 수 있습니다.'
      }
    }
  }
}; 