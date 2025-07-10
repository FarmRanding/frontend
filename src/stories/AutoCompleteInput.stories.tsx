import type { Meta, StoryObj } from '@storybook/react';
import AutoCompleteInput from '../components/common/AutoCompleteInput';
import { useState } from 'react';

// 샘플 데이터
const sampleData = [
  { code: '040101', name: '토마토' },
  { code: '040102', name: '방울토마토' },
  { code: '040103', name: '스테비아토마토' },
  { code: '040104', name: '대추방울토마토' },
  { code: '040105', name: '흑토마토' },
];

const meta: Meta<typeof AutoCompleteInput> = {
  title: 'Components/Common/AutoCompleteInput',
  component: AutoCompleteInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '자동완성 기능이 있는 입력 컴포넌트입니다. 검색어를 입력하면 필터링된 결과를 드롭다운으로 보여줍니다.',
      },
    },
  },
  argTypes: {
    items: {
      description: '자동완성할 아이템 배열',
      control: { type: 'object' },
    },
    placeholder: {
      description: '입력 필드 플레이스홀더',
      control: { type: 'text' },
    },
    disabled: {
      description: '입력 필드 비활성화 여부',
      control: { type: 'boolean' },
    },
    error: {
      description: '에러 메시지',
      control: { type: 'text' },
    },
    isLoading: {
      description: '로딩 상태',
      control: { type: 'boolean' },
    },
    noResultsText: {
      description: '검색 결과가 없을 때 표시할 텍스트',
      control: { type: 'text' },
    },
    emptyText: {
      description: '검색어가 없을 때 표시할 텍스트',
      control: { type: 'text' },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  render: (args) => {
    const [selectedItem, setSelectedItem] = useState(null);
    
    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <AutoCompleteInput
          {...args}
          items={sampleData}
          onSelect={(item) => {
            setSelectedItem(item);
            console.log('선택된 아이템:', item);
          }}
        />
        {selectedItem && (
          <p style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
            선택된 아이템: {selectedItem.name} ({selectedItem.code})
          </p>
        )}
      </div>
    );
  },
  args: {
    placeholder: '작물을 검색하세요',
    noResultsText: '검색 결과가 없습니다',
    emptyText: '검색어를 입력해주세요',
  },
};

// 로딩 상태
export const Loading: Story = {
  render: (args) => {
    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <AutoCompleteInput
          {...args}
          items={sampleData}
          onSelect={(item) => console.log('선택된 아이템:', item)}
        />
      </div>
    );
  },
  args: {
    ...Default.args,
    isLoading: true,
  },
};

// 에러 상태
export const WithError: Story = {
  render: (args) => {
    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <AutoCompleteInput
          {...args}
          items={sampleData}
          onSelect={(item) => console.log('선택된 아이템:', item)}
        />
      </div>
    );
  },
  args: {
    ...Default.args,
    error: '작물 데이터를 불러오는데 실패했습니다.',
  },
};

// 비활성화 상태
export const Disabled: Story = {
  render: (args) => {
    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <AutoCompleteInput
          {...args}
          items={sampleData}
          onSelect={(item) => console.log('선택된 아이템:', item)}
        />
      </div>
    );
  },
  args: {
    ...Default.args,
    disabled: true,
    placeholder: '비활성화된 상태',
  },
};

// 커스텀 렌더링
export const CustomRendering: Story = {
  render: (args) => {
    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <AutoCompleteInput
          {...args}
          items={sampleData}
          onSelect={(item) => console.log('선택된 아이템:', item)}
          renderItem={(item, isSelected) => (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              backgroundColor: isSelected ? '#e3f2fd' : 'transparent',
            }}>
              <div>
                <div style={{ fontWeight: 'bold', color: '#1f2937' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  코드: {item.code}
                </div>
              </div>
              <span style={{
                fontSize: '10px',
                color: '#059669',
                backgroundColor: '#d1fae5',
                padding: '2px 6px',
                borderRadius: '4px',
              }}>
                토마토류
              </span>
            </div>
          )}
        />
      </div>
    );
  },
  args: {
    ...Default.args,
  },
};

// 빈 데이터
export const EmptyData: Story = {
  render: (args) => {
    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <AutoCompleteInput
          {...args}
          items={[]}
          onSelect={(item) => console.log('선택된 아이템:', item)}
        />
      </div>
    );
  },
  args: {
    ...Default.args,
    emptyText: '등록된 작물이 없습니다',
  },
}; 