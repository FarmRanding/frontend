import type { Meta, StoryObj } from '@storybook/react';
import KamisProductInput from '../components/pricing/KamisProductInput/KamisProductInput';

const meta: Meta<typeof KamisProductInput> = {
  title: 'Components/Pricing/KamisProductInput',
  component: KamisProductInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'KAMIS 품목 코드 검색 및 선택을 위한 입력 컴포넌트입니다. 농산물명을 검색하면 KAMIS 데이터베이스에서 해당하는 품목 코드를 찾아 드롭다운으로 표시합니다.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: '현재 선택된 농산물명'
    },
    placeholder: {
      control: 'text',
      description: '입력 필드의 플레이스홀더 텍스트'
    },
    onChange: {
      action: 'changed',
      description: '농산물 선택 시 호출되는 콜백 함수'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    placeholder: '농산물을 검색해주세요',
    onChange: (product) => {
      console.log('Selected product:', product);
    }
  }
};

export const WithValue: Story = {
  args: {
    value: '감자',
    placeholder: '농산물을 검색해주세요',
    onChange: (product) => {
      console.log('Selected product:', product);
    }
  }
};

export const CustomPlaceholder: Story = {
  args: {
    value: '',
    placeholder: 'KAMIS 품목을 검색하세요',
    onChange: (product) => {
      console.log('Selected product:', product);
    }
  }
};

export const Interactive: Story = {
  args: {
    value: '',
    placeholder: '농산물을 검색해주세요',
    onChange: (product) => {
      console.log('Selected product:', product);
      alert(`선택된 농산물: ${product.itemName} (품목코드: ${product.itemCode}, 품종: ${product.kindName})`);
    }
  },
  parameters: {
    docs: {
      description: {
        story: '실제로 검색하고 선택할 수 있는 인터랙티브 예제입니다. 농산물명을 입력하면 KAMIS 데이터에서 검색 결과를 보여줍니다.'
      }
    }
  }
}; 