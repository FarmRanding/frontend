import type { Meta, StoryObj } from '@storybook/react';
import GradeSelector, { GradeValue } from '../components/pricing/GradeSelector/GradeSelector';

const meta: Meta<typeof GradeSelector> = {
  title: 'Components/Pricing/GradeSelector',
  component: GradeSelector,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '농산물 등급 선택을 위한 컴포넌트입니다. 상(04), 중(05), 하(06) 등급을 선택할 수 있습니다.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'select',
      options: ['04', '05', '06'],
      description: '현재 선택된 등급 코드'
    },
    onChange: {
      action: 'changed',
      description: '등급 선택 시 호출되는 콜백 함수'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '04',
    onChange: (grade: GradeValue) => {
      console.log('Selected grade:', grade);
    }
  }
};

export const HighGrade: Story = {
  args: {
    value: '04',
    onChange: (grade: GradeValue) => {
      console.log('Selected grade:', grade);
    }
  },
  parameters: {
    docs: {
      description: {
        story: '상급(04) 등급이 선택된 상태입니다.'
      }
    }
  }
};

export const MiddleGrade: Story = {
  args: {
    value: '05',
    onChange: (grade: GradeValue) => {
      console.log('Selected grade:', grade);
    }
  },
  parameters: {
    docs: {
      description: {
        story: '중급(05) 등급이 선택된 상태입니다.'
      }
    }
  }
};

export const LowGrade: Story = {
  args: {
    value: '06',
    onChange: (grade: GradeValue) => {
      console.log('Selected grade:', grade);
    }
  },
  parameters: {
    docs: {
      description: {
        story: '하급(06) 등급이 선택된 상태입니다.'
      }
    }
  }
};

export const Interactive: Story = {
  args: {
    value: '04',
    onChange: (grade: GradeValue) => {
      console.log('Selected grade:', grade);
      const gradeNames = { '04': '상급', '05': '중급', '06': '하급' };
      alert(`선택된 등급: ${gradeNames[grade]} (${grade})`);
    }
  },
  parameters: {
    docs: {
      description: {
        story: '실제로 등급을 선택할 수 있는 인터랙티브 예제입니다.'
      }
    }
  }
}; 