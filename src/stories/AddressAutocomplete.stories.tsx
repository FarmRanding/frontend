import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import AddressAutocomplete from '../components/common/AddressAutocomplete/AddressAutocomplete';
import { useState } from 'react';

const meta: Meta<typeof AddressAutocomplete> = {
  title: 'Components/AddressAutocomplete',
  component: AddressAutocomplete,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
주소 자동완성 입력 컴포넌트입니다.

## 주요 기능
- **실시간 검색**: 사용자가 입력하는 동안 법정동 주소를 검색
- **디바운스 최적화**: 700ms 디바운스로 API 호출 최적화
- **키보드 네비게이션**: 방향키와 엔터키로 결과 선택 가능
- **자동완성**: 검색 결과를 클릭하면 자동으로 입력

## 성능 최적화
- **메모이제이션**: React.memo, useCallback, useMemo 활용
- **디바운스**: 입력 중 불필요한 API 호출 방지
- **최소 입력 길이**: 1자 이상부터 검색 시작

## 사용 예시
\`\`\`jsx
const [address, setAddress] = useState('');

<AddressAutocomplete
  value={address}
  onChange={setAddress}
  placeholder="지역명을 입력하세요"
/>
\`\`\`

## API 연동
백엔드 '/api/v1/address/search' 엔드포인트와 연동되어 법정동 주소를 검색합니다.
        `
      }
    }
  },
  argTypes: {
    value: {
      control: 'text',
      description: '현재 입력값'
    },
    onChange: {
      action: 'changed',
      description: '값 변경 이벤트'
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트'
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태'
    }
  }
};

export default meta;
type Story = StoryObj<typeof AddressAutocomplete>;

// 컨트롤이 가능한 기본 스토리
const AddressAutocompleteWithState = (args: any) => {
  const [value, setValue] = useState(args.value || '');
  
  return (
    <div style={{ width: '400px', padding: '20px' }}>
      <AddressAutocomplete
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          action('address-changed')(newValue);
        }}
      />
    </div>
  );
};

export const Default: Story = {
  render: AddressAutocompleteWithState,
  args: {
    placeholder: '주소를 입력하세요',
    disabled: false
  },
  parameters: {
    docs: {
      description: {
        story: '기본적인 주소 자동완성 컴포넌트입니다. "남양주", "화성", "부산" 등을 입력해보세요. 700ms 디바운스가 적용되어 성능이 최적화되었습니다.'
      }
    }
  }
};

export const WithFarmPlaceholder: Story = {
  render: AddressAutocompleteWithState,
  args: {
    placeholder: '농가 위치를 검색하세요 (예: 화성, 이천, 부산)',
    disabled: false
  },
  parameters: {
    docs: {
      description: {
        story: '농가 위치 입력을 위한 스토리입니다. 농업 지역에 특화된 플레이스홀더를 제공합니다.'
      }
    }
  }
};

export const PrefilledValue: Story = {
  render: AddressAutocompleteWithState,
  args: {
    value: '경기도 화성시',
    placeholder: '농가 위치를 입력하세요',
    disabled: false
  },
  parameters: {
    docs: {
      description: {
        story: '미리 입력된 값이 있는 상태입니다. 기존 값을 수정하거나 새로운 주소를 검색할 수 있습니다.'
      }
    }
  }
};

export const Disabled: Story = {
  render: AddressAutocompleteWithState,
  args: {
    value: '경기도 화성시 동탄면',
    placeholder: '주소를 입력하세요',
    disabled: true
  },
  parameters: {
    docs: {
      description: {
        story: '비활성화된 상태의 컴포넌트입니다. 값은 표시되지만 편집할 수 없습니다.'
      }
    }
  }
};

export const PerformanceTest: Story = {
  render: () => {
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [address3, setAddress3] = useState('');
    
    return (
      <div style={{ width: '400px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>농가 1 위치</label>
          <AddressAutocomplete
            value={address1}
            onChange={setAddress1}
            placeholder="첫 번째 농가 위치"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>농가 2 위치</label>
          <AddressAutocomplete
            value={address2}
            onChange={setAddress2}
            placeholder="두 번째 농가 위치"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>농가 3 위치</label>
          <AddressAutocomplete
            value={address3}
            onChange={setAddress3}
            placeholder="세 번째 농가 위치"
          />
        </div>
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#1f41bb' }}>성능 테스트</h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
            여러 개의 컴포넌트를 동시에 사용해도 각각 독립적으로 디바운스가 적용되어 성능이 최적화됩니다.
            각 필드에서 "남양주", "화성", "부산" 등을 동시에 입력해보세요.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '다중 컴포넌트 성능 테스트입니다. 여러 개의 AddressAutocomplete를 동시에 사용해도 각각 독립적으로 최적화되어 동작합니다.'
      }
    }
  }
};

export const KeyboardNavigation: Story = {
  render: AddressAutocompleteWithState,
  args: {
    placeholder: '키보드로 검색해보세요 (↑↓ 방향키, Enter)',
    disabled: false
  },
  parameters: {
    docs: {
      description: {
        story: '키보드 네비게이션 테스트입니다. "남양주"를 입력한 후 방향키로 결과를 선택하고 Enter키로 확정해보세요. Escape키로 목록을 닫을 수 있습니다.'
      }
    }
  }
}; 