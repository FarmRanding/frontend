import type { Meta, StoryObj } from '@storybook/react';
import SignupModal from '../components/common/SignupModal/SignupModal';

const meta: Meta<typeof SignupModal> = {
  title: 'Components/SignupModal',
  component: SignupModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '회원가입을 위한 모달 컴포넌트입니다. 이름, 농가명, 농가 위치를 입력받으며, 농가 위치는 주소 검색 기능을 제공합니다.',
      },
    },
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '모달의 열림/닫힘 상태를 제어합니다.',
    },
    onClose: {
      action: 'closed',
      description: '모달을 닫을 때 호출되는 함수입니다.',
    },
    onSubmit: {
      action: 'submitted',
      description: '폼 제출 시 호출되는 함수입니다.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Modal closed'),
    onSubmit: (data) => {
      console.log('Form submitted:', data);
      // 실제 사용 시에는 여기서 API 호출을 하게 됩니다
      return new Promise((resolve) => {
        setTimeout(() => {
          alert(`가입 완료!\n이름: ${data.name}\n농가명: ${data.farmName}\n위치: ${data.farmLocation}`);
          resolve(undefined);
        }, 1000);
      });
    },
  },
  parameters: {
    docs: {
      description: {
        story: '기본적인 회원가입 모달입니다. 모든 필드를 입력하고 "가입 완료" 버튼을 클릭해보세요. 농가 위치 필드에서 "화성" 또는 "경기"를 입력 후 검색 버튼을 눌러보세요.',
      },
    },
  },
};

// 닫힌 상태 스토리
export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log('Modal closed'),
    onSubmit: (data) => {
      console.log('Form submitted:', data);
      return Promise.resolve();
    },
  },
  parameters: {
    docs: {
      description: {
        story: '모달이 닫힌 상태입니다. Controls에서 isOpen을 true로 변경하여 모달을 열어보세요.',
      },
    },
  },
};

// 주소 검색 기능 데모 스토리
export const AddressSearchDemo: Story = {
  args: {
    isOpen: true,
    onClose: () => {
      console.log('모달을 닫습니다.');
      alert('모달을 닫습니다.');
    },
    onSubmit: async (data) => {
      console.log('회원가입 데이터:', data);
      
      // 실제 API 호출을 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`회원가입이 완료되었습니다!\n\n이름: ${data.name}\n농가명: ${data.farmName}\n농가 위치: ${data.farmLocation}`);
      
      return Promise.resolve();
    },
  },
  parameters: {
    docs: {
      description: {
        story: '주소 검색 기능을 테스트할 수 있는 스토리입니다. 농가 위치 필드에 "화성", "경기", "동탄" 등을 입력하고 검색 버튼을 클릭해보세요. 검색 결과를 클릭하면 자동으로 입력됩니다.',
      },
    },
  },
};

// 인터랙티브 스토리 (실제 동작 확인용)
export const Interactive: Story = {
  args: {
    isOpen: true,
    onClose: () => {
      // 스토리북에서는 실제로 모달을 닫을 수 없으므로 콘솔 로그만 출력
      console.log('모달을 닫습니다. (스토리북에서는 실제로 닫히지 않습니다)');
      alert('모달을 닫습니다.');
    },
    onSubmit: async (data) => {
      console.log('회원가입 데이터:', data);
      
      // 실제 API 호출을 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`회원가입이 완료되었습니다!\n\n이름: ${data.name}\n농가명: ${data.farmName}\n농가 위치: ${data.farmLocation}`);
      
      return Promise.resolve();
    },
  },
  parameters: {
    docs: {
      description: {
        story: '완전한 상호작용을 테스트할 수 있는 스토리입니다. 모든 필드를 입력하고 주소 검색도 사용해보세요.',
      },
    },
  },
}; 