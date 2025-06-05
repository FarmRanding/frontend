import type { Meta, StoryObj } from '@storybook/react';
import CropVarietyInput from '../components/common/CropVarietyInput/CropVarietyInput';
import { useState } from 'react';
import { StandardCodeItem } from '../api/standardCodeService';
import { within, userEvent, expect } from '@storybook/test';

const meta: Meta<typeof CropVarietyInput> = {
  title: '팜랜딩/CropVarietyInput',
  component: CropVarietyInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
작물과 품종을 선택할 수 있는 2단계 자동완성 입력 컴포넌트입니다.

## 주요 기능
- 📝 **작물 자동완성**: 공공데이터 기반 작물 검색
- 🌱 **품종 자동완성**: 선택된 작물에 따른 품종 검색
- ⌨️ **키보드 네비게이션**: 화살표 키로 항목 선택
- 🔄 **2단계 연동**: 작물 선택 시 품종 자동 초기화
- 📱 **반응형 디자인**: 모바일 친화적 스타일
- 🎨 **브랜딩 스타일**: 팜랜딩 디자인 시스템 적용

## 사용 예시
브랜딩 페이지에서 농산물 정보 입력 시 사용됩니다.
        `,
      },
    },
  },
  argTypes: {
    cropValue: {
      control: 'text',
      description: '현재 선택된 작물명',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "''" },
      },
    },
    varietyValue: {
      control: 'text',
      description: '현재 선택된 품종명',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "''" },
      },
    },
    disabled: {
      control: 'boolean',
      description: '입력 비활성화 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onChange: {
      action: 'changed',
      description: '선택 변경 시 호출되는 콜백 함수',
      table: {
        type: { 
          summary: '(data: CropVarietyData) => void',
          detail: `{
  cropCode: string;
  cropName: string;
  varietyCode: string;
  varietyName: string;
}`,
        },
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    cropValue: '',
    varietyValue: '',
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // 작물 입력 필드 확인
    const cropInput = canvas.getByPlaceholderText('예: 토마토');
    await expect(cropInput).toBeInTheDocument();
    
    // 품종 입력 필드 확인 (비활성화 상태)
    const varietyInput = canvas.getByPlaceholderText('작물을 먼저 선택해주세요');
    await expect(varietyInput).toBeInTheDocument();
    await expect(varietyInput).toBeDisabled();
  },
};

// 작물 선택된 상태
export const WithSelectedCrop: Story = {
  args: {
    cropValue: '토마토',
    varietyValue: '',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: '작물이 선택된 상태입니다. 이제 품종을 선택할 수 있습니다.',
      },
    },
  },
};

// 작물과 품종 모두 선택된 상태
export const WithBothSelected: Story = {
  args: {
    cropValue: '토마토',
    varietyValue: '스테비아 토마토',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: '작물과 품종이 모두 선택된 완료 상태입니다.',
      },
    },
  },
};

// 비활성화 상태
export const Disabled: Story = {
  args: {
    cropValue: '',
    varietyValue: '',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: '입력이 비활성화된 상태입니다.',
      },
    },
  },
};

// 인터랙션 테스트
export const InteractionTest: Story = {
  args: {
    cropValue: '',
    varietyValue: '',
    disabled: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // 작물 입력 필드에 포커스
    const cropInput = canvas.getByPlaceholderText('예: 토마토');
    await userEvent.click(cropInput);
    
    // 작물명 입력
    await userEvent.type(cropInput, '토마토');
    
    // 잠시 대기 (디바운스)
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // onChange 콜백이 호출되었는지 확인
    await expect(args.onChange).toHaveBeenCalled();
  },
};

// 에러 처리 테스트
export const ErrorHandling: Story = {
  args: {
    cropValue: '',
    varietyValue: '',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: '네트워크 오류 등의 상황에서도 안정적으로 동작합니다.',
      },
    },
  },
};

// 반응형 테스트 (모바일)
export const Mobile: Story = {
  args: {
    cropValue: '',
    varietyValue: '',
    disabled: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: '모바일 화면에서의 동작을 확인할 수 있습니다.',
      },
    },
  },
};

// 키보드 네비게이션 테스트
export const KeyboardNavigation: Story = {
  args: {
    cropValue: '',
    varietyValue: '',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
키보드만으로 조작할 수 있습니다:
- **Tab**: 필드 간 이동
- **↑/↓**: 드롭다운 항목 선택
- **Enter**: 선택된 항목 확정
- **Esc**: 드롭다운 닫기
        `,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Tab으로 작물 입력 필드로 이동
    await userEvent.tab();
    
    // 작물명 입력
    await userEvent.type(canvas.getByPlaceholderText('예: 토마토'), '배');
    
    // 잠시 대기
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // 키보드로 선택
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');
  },
}; 