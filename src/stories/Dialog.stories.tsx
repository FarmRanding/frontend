import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from '../components/common/Dialog';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['alert', 'confirm'],
    },
    isVisible: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Alert: Story = {
  args: {
    type: 'alert',
    title: '알림',
    message: '작업이 완료되었습니다.',
    confirmText: '확인',
    isVisible: true,
    onConfirm: () => console.log('Alert confirmed'),
  },
};

export const Confirm: Story = {
  args: {
    type: 'confirm',
    title: '확인',
    message: '정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
    confirmText: '삭제',
    cancelText: '취소',
    isVisible: true,
    onConfirm: () => console.log('Confirmed'),
    onCancel: () => console.log('Cancelled'),
  },
};

export const LongMessage: Story = {
  args: {
    type: 'confirm',
    title: '중요한 결정',
    message: '이것은 매우 긴 메시지입니다. 사용자에게 중요한 정보를 전달하기 위해 여러 줄에 걸쳐 작성된 메시지입니다. 이런 경우에도 다이얼로그가 적절히 표시되는지 확인해야 합니다.',
    confirmText: '동의',
    cancelText: '거부',
    isVisible: true,
    onConfirm: () => console.log('Agreed'),
    onCancel: () => console.log('Disagreed'),
  },
};

export const CustomButtons: Story = {
  args: {
    type: 'confirm',
    title: '파일 저장',
    message: '변경사항을 저장하시겠습니까?',
    confirmText: '저장',
    cancelText: '저장 안함',
    isVisible: true,
    onConfirm: () => console.log('Saved'),
    onCancel: () => console.log('Not saved'),
  },
}; 