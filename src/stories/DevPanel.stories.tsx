import type { Meta, StoryObj } from '@storybook/react';
import DevPanel from '../components/common/DevPanel/DevPanel';

const meta: Meta<typeof DevPanel> = {
  title: 'Components/DevPanel',
  component: DevPanel,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '개발 환경에서만 표시되는 개발자 도구 패널입니다. 신규 유저 테스트와 사용자 데이터 관리 기능을 제공합니다.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: '추가 CSS 클래스명',
    },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DevPanel>;

// 기본 스토리
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '개발자 패널의 기본 모습입니다. 하단에 고정되어 토글 버튼으로 펼치고 접을 수 있습니다.',
      },
    },
  },
};

// 확장된 상태 스토리
export const Expanded: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '개발자 패널이 확장된 상태입니다. 각 버튼들이 실제로는 window.devTools 함수들을 호출합니다.',
      },
    },
  },
  decorators: [
    (Story) => {
      // 스토리북에서 window.devTools 모킹
      (window as any).devTools = {
        simulateNewUser: () => console.log('🆕 신규 유저 시뮬레이션'),
        restoreOriginalUser: () => console.log('🔄 원본 사용자 복구'),
        showBackupData: () => console.log('📊 백업 데이터 확인'),
        triggerSignupModal: () => console.log('📝 회원가입 모달 표시'),
        hasBackup: () => true,
      };
      
      return <Story />;
    },
  ],
};

// 백업 없는 상태 스토리
export const NoBackup: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '백업 데이터가 없는 상태입니다. 원본 사용자 복구 버튼이 표시되지 않습니다.',
      },
    },
  },
  decorators: [
    (Story) => {
      // 백업이 없는 상태로 모킹
      (window as any).devTools = {
        simulateNewUser: () => console.log('🆕 신규 유저 시뮬레이션'),
        restoreOriginalUser: () => console.log('🔄 원본 사용자 복구'),
        showBackupData: () => console.log('📊 백업 데이터 확인'),
        triggerSignupModal: () => console.log('📝 회원가입 모달 표시'),
        hasBackup: () => false,
      };
      
      return <Story />;
    },
  ],
};

// 사용법 가이드 스토리
export const UsageGuide: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: `
### 🛠️ 개발자 도구 사용법

**주요 기능:**

1. **신규 유저 시뮬레이션** - 현재 사용자 데이터를 백업하고 신규 유저로 변환
2. **회원가입 모달 표시** - 현재 페이지에서 바로 회원가입 모달 테스트
3. **원본 사용자 복구** - 백업된 데이터로 원래 사용자 상태 복구
4. **백업 데이터 확인** - 현재 백업 상태와 데이터 확인

**사용 순서:**
1. 🆕 신규 유저 시뮬레이션 클릭
2. 소셜 로그인으로 신규 유저 플로우 테스트
3. 🔄 원본 사용자 복구로 원상복구

**콘솔 함수:**
- \`window.devTools.simulateNewUser()\`
- \`window.devTools.restoreOriginalUser()\`
- \`window.devTools.showBackupData()\`
- \`window.devTools.triggerSignupModal()\`
        `,
      },
    },
  },
  decorators: [
    (Story) => {
      (window as any).devTools = {
        simulateNewUser: () => console.log('🆕 신규 유저 시뮬레이션'),
        restoreOriginalUser: () => console.log('🔄 원본 사용자 복구'),
        showBackupData: () => console.log('📊 백업 데이터 확인'),
        triggerSignupModal: () => console.log('📝 회원가입 모달 표시'),
        hasBackup: () => true,
      };
      
      return <Story />;
    },
  ],
}; 