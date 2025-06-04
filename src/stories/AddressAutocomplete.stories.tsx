import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import AddressAutocomplete from '../components/common/AddressAutocomplete/AddressAutocomplete';

const meta: Meta<typeof AddressAutocomplete> = {
  title: 'Components/AddressAutocomplete',
  component: AddressAutocomplete,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '법정동 주소 자동완성 컴포넌트입니다. 사용자가 입력한 키워드로 실제 법정동 데이터를 검색하여 자동완성 기능을 제공합니다.',
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: '입력 필드의 현재 값',
    },
    onChange: {
      action: 'changed',
      description: '값이 변경될 때 호출되는 함수',
    },
    placeholder: {
      control: 'text',
      description: '입력 필드의 플레이스홀더 텍스트',
    },
    disabled: {
      control: 'boolean',
      description: '입력 필드 비활성화 여부',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AddressAutocomplete>;

// 기본 스토리
export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    
    return (
      <div style={{ width: '400px' }}>
        <AddressAutocomplete
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
  args: {
    placeholder: '주소를 입력하세요',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: '기본적인 주소 자동완성 컴포넌트입니다. "부산", "서울", "화성" 등을 입력해보세요.',
      },
    },
  },
};

// 미리 입력된 값이 있는 경우
export const WithInitialValue: Story = {
  render: (args) => {
    const [value, setValue] = useState('경기도 화성시');
    
    return (
      <div style={{ width: '400px' }}>
        <AddressAutocomplete
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
  args: {
    placeholder: '주소를 입력하세요',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: '초기값이 설정된 상태의 주소 자동완성 컴포넌트입니다.',
      },
    },
  },
};

// 비활성화된 상태
export const Disabled: Story = {
  render: (args) => {
    const [value, setValue] = useState('서울특별시 강남구');
    
    return (
      <div style={{ width: '400px' }}>
        <AddressAutocomplete
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
  args: {
    placeholder: '주소를 입력하세요',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: '비활성화된 상태의 주소 자동완성 컴포넌트입니다.',
      },
    },
  },
};

// 커스텀 플레이스홀더
export const CustomPlaceholder: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    
    return (
      <div style={{ width: '400px' }}>
        <AddressAutocomplete
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
  args: {
    placeholder: '농가 위치를 검색하세요 (예: 화성, 이천, 부산)',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: '커스텀 플레이스홀더가 설정된 주소 자동완성 컴포넌트입니다.',
      },
    },
  },
};

// 폼 내에서 사용하는 경우
export const InForm: Story = {
  render: (args) => {
    const [formData, setFormData] = useState({
      name: '',
      farmName: '',
      location: '',
    });
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`폼 제출됨:\n이름: ${formData.name}\n농가명: ${formData.farmName}\n위치: ${formData.location}`);
    };
    
    return (
      <form 
        onSubmit={handleSubmit}
        style={{ 
          width: '400px', 
          padding: '20px', 
          border: '1px solid #e1e5e9', 
          borderRadius: '8px',
          backgroundColor: '#fff'
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            이름
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="이름을 입력하세요"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
            }}
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            농가명
          </label>
          <input
            type="text"
            value={formData.farmName}
            onChange={(e) => setFormData(prev => ({ ...prev, farmName: e.target.value }))}
            placeholder="농가명을 입력하세요"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            농가 위치
          </label>
          <AddressAutocomplete
            {...args}
            value={formData.location}
            onChange={(location) => setFormData(prev => ({ ...prev, location }))}
          />
        </div>
        
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          제출
        </button>
      </form>
    );
  },
  args: {
    placeholder: '농가 위치를 입력하세요',
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: '실제 폼에서 사용되는 모습을 보여주는 스토리입니다. 주소를 입력하고 제출해보세요.',
      },
    },
  },
}; 