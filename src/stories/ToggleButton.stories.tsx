import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import styled from 'styled-components';
import iconToggle from '../assets/icon-toggle.svg';

// 토글 컴포넌트 정의
const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 0;
`;

const ToggleLabel = styled.span`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.18;
  color: #000000;
`;

const ToggleButton = styled.button<{ $isActive: boolean }>`
  width: 48px;
  height: 28px;
  background: ${props => props.$isActive ? '#1F41BB' : '#E5E7EB'};
  border: none;
  border-radius: 14px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  outline: none;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(31, 65, 187, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ToggleKnob = styled.div<{ $isActive: boolean }>`
  width: 20px;
  height: 20px;
  background: #FFFFFF;
  border-radius: 50%;
  position: absolute;
  top: 4px;
  left: ${props => props.$isActive ? '24px' : '4px'};
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ToggleIcon = styled.img<{ $isActive: boolean }>`
  width: 12px;
  height: 12px;
  filter: ${props => props.$isActive 
    ? 'brightness(0) saturate(100%) invert(25%) sepia(98%) saturate(1653%) hue-rotate(221deg) brightness(96%) contrast(91%)'
    : 'brightness(0) saturate(100%) invert(60%) sepia(5%) saturate(7%) hue-rotate(4deg) brightness(93%) contrast(87%)'
  };
  transition: all 0.3s ease;
`;

const ToggleDescription = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 10px;
  line-height: 1.4;
  color: #999;
  margin-top: 4px;
  text-align: left;
`;

interface ToggleProps {
  label: string;
  description?: string;
  isActive: boolean;
  onChange: (isActive: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ 
  label, 
  description, 
  isActive, 
  onChange 
}) => {
  return (
    <div>
      <ToggleContainer>
        <ToggleLabel>{label}</ToggleLabel>
        <ToggleButton
          $isActive={isActive}
          onClick={() => onChange(!isActive)}
        >
          <ToggleKnob $isActive={isActive}>
            <ToggleIcon 
              src={iconToggle} 
              alt="토글" 
              $isActive={isActive}
            />
          </ToggleKnob>
        </ToggleButton>
      </ToggleContainer>
      {description && (
        <ToggleDescription>
          {description}
        </ToggleDescription>
      )}
    </div>
  );
};

// Interactive Toggle 스토리 컴포넌트
const InteractiveToggle: React.FC<Omit<ToggleProps, 'isActive' | 'onChange'>> = (props) => {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <Toggle 
      {...props} 
      isActive={isActive} 
      onChange={setIsActive}
    />
  );
};

const meta: Meta<typeof Toggle> = {
  title: 'Components/ToggleButton',
  component: Toggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '농가명 포함과 같은 설정을 위한 토글 버튼 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: '토글 버튼의 라벨 텍스트',
    },
    description: {
      control: 'text',
      description: '토글 버튼 아래에 표시될 설명 텍스트',
    },
    isActive: {
      control: 'boolean',
      description: '토글 버튼의 활성화 상태',
    },
    onChange: {
      action: 'toggled',
      description: '토글 상태가 변경될 때 호출되는 콜백',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 토글
export const Default: Story = {
  render: (args) => <InteractiveToggle {...args} />,
  args: {
    label: '농가명 포함',
    description: '농가명 정보는 판매글에만 영향됩니다',
  },
};

// 활성화된 상태
export const Active: Story = {
  args: {
    label: '농가명 포함',
    description: '농가명 정보는 판매글에만 영향됩니다',
    isActive: true,
    onChange: () => {},
  },
};

// 비활성화된 상태
export const Inactive: Story = {
  args: {
    label: '농가명 포함',
    description: '농가명 정보는 판매글에만 영향됩니다',
    isActive: false,
    onChange: () => {},
  },
};

// 설명 없는 토글
export const WithoutDescription: Story = {
  render: (args) => <InteractiveToggle {...args} />,
  args: {
    label: '알림 받기',
  },
};

// 다양한 라벨
export const DifferentLabels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}>
      <InteractiveToggle 
        label="농가명 포함" 
        description="농가명 정보는 판매글에만 영향됩니다" 
      />
      <InteractiveToggle 
        label="알림 받기" 
        description="새로운 소식을 알려드립니다" 
      />
      <InteractiveToggle 
        label="자동 저장" 
        description="작성 중인 내용을 자동으로 저장합니다" 
      />
      <InteractiveToggle 
        label="다크 모드" 
      />
    </div>
  ),
}; 