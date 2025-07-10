import type { Meta, StoryObj } from '@storybook/react';
import { SelectModal } from '../components/common/SelectModal';

const meta: Meta<typeof SelectModal> = {
  title: 'Components/SelectModal',
  component: SelectModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isVisible: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicOptions = [
  { value: 'option1', label: '옵션 1' },
  { value: 'option2', label: '옵션 2' },
  { value: 'option3', label: '옵션 3' },
];

const optionsWithDescription = [
  { 
    value: 'basic', 
    label: '기본 플랜', 
    description: '개인 사용자를 위한 기본 기능' 
  },
  { 
    value: 'pro', 
    label: '프로 플랜', 
    description: '전문가를 위한 고급 기능 포함' 
  },
  { 
    value: 'enterprise', 
    label: '엔터프라이즈 플랜', 
    description: '대기업을 위한 모든 기능과 지원' 
  },
];

const manyOptions = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
  { value: 'cherry', label: '체리' },
  { value: 'date', label: '대추' },
  { value: 'elderberry', label: '엘더베리' },
  { value: 'fig', label: '무화과' },
  { value: 'grape', label: '포도' },
  { value: 'honeydew', label: '허니듀' },
  { value: 'kiwi', label: '키위' },
  { value: 'lemon', label: '레몬' },
];

export const Basic: Story = {
  args: {
    title: '옵션 선택',
    options: basicOptions,
    isVisible: true,
    onSelect: (value) => console.log('Selected:', value),
    onCancel: () => console.log('Cancelled'),
  },
};

export const WithDescription: Story = {
  args: {
    title: '플랜 선택',
    options: optionsWithDescription,
    selectedValue: 'pro',
    isVisible: true,
    onSelect: (value) => console.log('Selected:', value),
    onCancel: () => console.log('Cancelled'),
  },
};

export const ManyOptions: Story = {
  args: {
    title: '과일 선택',
    options: manyOptions,
    selectedValue: 'apple',
    isVisible: true,
    onSelect: (value) => console.log('Selected:', value),
    onCancel: () => console.log('Cancelled'),
  },
};

export const LongTitle: Story = {
  args: {
    title: '매우 긴 제목을 가진 선택 모달입니다',
    options: basicOptions,
    isVisible: true,
    onSelect: (value) => console.log('Selected:', value),
    onCancel: () => console.log('Cancelled'),
  },
}; 