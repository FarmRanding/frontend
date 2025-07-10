import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from '../components/common/Toast';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['success', 'error', 'info', 'warning'],
    },
    duration: {
      control: { type: 'number' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    id: '1',
    type: 'success',
    title: '성공',
    message: '작업이 성공적으로 완료되었습니다.',
    duration: 4000,
    onClose: () => console.log('Toast closed'),
  },
};

export const Error: Story = {
  args: {
    id: '2',
    type: 'error',
    title: '오류 발생',
    message: '요청을 처리하는 중 오류가 발생했습니다.',
    duration: 4000,
    onClose: () => console.log('Toast closed'),
  },
};

export const Info: Story = {
  args: {
    id: '3',
    type: 'info',
    title: '정보',
    message: '새로운 업데이트가 있습니다.',
    duration: 4000,
    onClose: () => console.log('Toast closed'),
  },
};

export const Warning: Story = {
  args: {
    id: '4',
    type: 'warning',
    title: '주의',
    message: '이 작업은 되돌릴 수 없습니다.',
    duration: 4000,
    onClose: () => console.log('Toast closed'),
  },
};

export const WithoutMessage: Story = {
  args: {
    id: '5',
    type: 'success',
    title: '저장 완료',
    duration: 4000,
    onClose: () => console.log('Toast closed'),
  },
};

export const LongDuration: Story = {
  args: {
    id: '6',
    type: 'info',
    title: '긴 지속시간',
    message: '이 토스트는 10초 동안 표시됩니다.',
    duration: 10000,
    onClose: () => console.log('Toast closed'),
  },
}; 