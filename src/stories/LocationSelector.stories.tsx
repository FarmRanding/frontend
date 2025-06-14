import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import LocationSelector from '../components/common/LocationSelector/LocationSelector';

const meta: Meta<typeof LocationSelector> = {
  title: 'Components/LocationSelector',
  component: LocationSelector,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### 지역 선택 모달

프리미엄 가격 제안에서 사용되는 지역 선택 모달 컴포넌트입니다.

#### 주요 기능
- **17개 시도 선택**: 서울, 부산, 대구 등 전국 17개 시도
- **모달 인터페이스**: 오버레이 클릭 또는 X 버튼으로 닫기
- **선택 상태 표시**: 현재 선택된 지역 하이라이트
- **부드러운 애니메이션**: 페이드인/슬라이드업 효과

#### 디자인 특징
- 기존 GradeSelector와 동일한 UI 패턴
- 프리미엄 브랜드 컬러 (#8B5CF6) 적용
- 모바일 친화적 반응형 디자인
        `
      }
    }
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '모달 열림/닫힘 상태'
    },
    selectedLocation: {
      control: 'select',
      options: ['', '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'],
      description: '현재 선택된 지역'
    },
    onClose: {
      action: 'closed',
      description: '모달 닫기 이벤트'
    },
    onSelect: {
      action: 'location-selected',
      description: '지역 선택 이벤트'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 인터랙티브 스토리
const InteractiveTemplate = (args: any) => {
  const [isOpen, setIsOpen] = useState(args.isOpen || false);
  const [selectedLocation, setSelectedLocation] = useState(args.selectedLocation || '');

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    action('closed')();
  };
  
  const handleSelect = (location: string) => {
    setSelectedLocation(location);
    setIsOpen(false);
    action('location-selected')(location);
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F4FAFF'
    }}>
      {/* 트리거 버튼 */}
      <button
        onClick={handleOpen}
        style={{
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          fontSize: '16px',
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        {selectedLocation ? `선택됨: ${selectedLocation}` : '지역 선택하기'}
      </button>

      {/* 모달 */}
      <LocationSelector
        isOpen={isOpen}
        onClose={handleClose}
        onSelect={handleSelect}
        selectedLocation={selectedLocation}
      />
    </div>
  );
};

// 기본 스토리 (닫힌 상태)
export const Default: Story = {
  render: InteractiveTemplate,
  args: {
    isOpen: false,
    selectedLocation: ''
  },
  parameters: {
    docs: {
      description: {
        story: '기본 상태의 지역 선택 모달입니다. 버튼을 클릭하여 모달을 열 수 있습니다.'
      }
    }
  }
};

// 열린 상태
export const Open: Story = {
  render: InteractiveTemplate,
  args: {
    isOpen: true,
    selectedLocation: ''
  },
  parameters: {
    docs: {
      description: {
        story: '모달이 열린 상태입니다. 17개 시도 중 하나를 선택할 수 있습니다.'
      }
    }
  }
};

// 지역 선택됨
export const WithSelection: Story = {
  render: InteractiveTemplate,
  args: {
    isOpen: true,
    selectedLocation: '경기'
  },
  parameters: {
    docs: {
      description: {
        story: '경기도가 선택된 상태입니다. 선택된 지역은 하이라이트되어 표시됩니다.'
      }
    }
  }
};

// 서울 선택됨
export const SeoulSelected: Story = {
  render: InteractiveTemplate,
  args: {
    isOpen: true,
    selectedLocation: '서울'
  },
  parameters: {
    docs: {
      description: {
        story: '서울특별시가 선택된 상태입니다.'
      }
    }
  }
};

// 제주 선택됨
export const JejuSelected: Story = {
  render: InteractiveTemplate,
  args: {
    isOpen: true,
    selectedLocation: '제주'
  },
  parameters: {
    docs: {
      description: {
        story: '제주특별자치도가 선택된 상태입니다.'
      }
    }
  }
};

// 모바일 뷰
export const Mobile: Story = {
  render: InteractiveTemplate,
  args: {
    isOpen: true,
    selectedLocation: '부산'
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: '모바일 환경에서의 지역 선택 모달입니다.'
      }
    }
  }
}; 
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import LocationSelector from '../components/common/LocationSelector/LocationSelector';

const meta: Meta<typeof LocationSelector> = {
  title: 'Components/LocationSelector',
  component: LocationSelector,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### 지역 선택 모달

프리미엄 가격 제안에서 사용되는 지역 선택 모달 컴포넌트입니다.

#### 주요 기능
- **17개 시도 선택**: 서울, 부산, 대구 등 전국 17개 시도
- **모달 인터페이스**: 오버레이 클릭 또는 X 버튼으로 닫기
- **선택 상태 표시**: 현재 선택된 지역 하이라이트
- **부드러운 애니메이션**: 페이드인/슬라이드업 효과

#### 디자인 특징
- 기존 GradeSelector와 동일한 UI 패턴
- 프리미엄 브랜드 컬러 (#8B5CF6) 적용
- 모바일 친화적 반응형 디자인
        `
      }
    }
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '모달 열림/닫힘 상태'
    },
    selectedLocation: {
      control: 'select',
      options: ['', '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'],
      description: '현재 선택된 지역'
    },
    onClose: {
      action: 'closed',
      description: '모달 닫기 이벤트'
    },
    onSelect: {
      action: 'location-selected',
      description: '지역 선택 이벤트'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 인터랙티브 스토리
const InteractiveTemplate = (args: any) => {
  const [isOpen, setIsOpen] = useState(args.isOpen || false);
  const [selectedLocation, setSelectedLocation] = useState(args.selectedLocation || '');

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    action('closed')();
  };
  
  const handleSelect = (location: string) => {
    setSelectedLocation(location);
    setIsOpen(false);
    action('location-selected')(location);
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F4FAFF'
    }}>
      {/* 트리거 버튼 */}
      <button
        onClick={handleOpen}
        style={{
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          fontSize: '16px',
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        {selectedLocation ? `선택됨: ${selectedLocation}` : '지역 선택하기'}
      </button>

      {/* 모달 */}
      <LocationSelector
        isOpen={isOpen}
        onClose={handleClose}
        onSelect={handleSelect}
        selectedLocation={selectedLocation}
      />
    </div>
  );
};

// 기본 스토리 (닫힌 상태)
export const Default: Story = {
  render: InteractiveTemplate,
  args: {
    isOpen: false,
    selectedLocation: ''
  },
  parameters: {
    docs: {
      description: {
        story: '기본 상태의 지역 선택 모달입니다. 버튼을 클릭하여 모달을 열 수 있습니다.'
      }
    }
  }
};

// 열린 상태
export const Open: Story = {
  render: InteractiveTemplate,
  args: {
    isOpen: true,
    selectedLocation: ''
  },
  parameters: {
    docs: {
      description: {
        story: '모달이 열린 상태입니다. 17개 시도 중 하나를 선택할 수 있습니다.'
      }
    }
  }
};

// 지역 선택됨
export const WithSelection: Story = {
  render: InteractiveTemplate,
  args: {
    isOpen: true,
    selectedLocation: '경기'
  },
  parameters: {
    docs: {
      description: {
        story: '경기도가 선택된 상태입니다. 선택된 지역은 하이라이트되어 표시됩니다.'
      }
    }
  }
};

// 서울 선택됨
export const SeoulSelected: Story = {
  render: InteractiveTemplate,
  args: {
    isOpen: true,
    selectedLocation: '서울'
  },
  parameters: {
    docs: {
      description: {
        story: '서울특별시가 선택된 상태입니다.'
      }
    }
  }
};

// 제주 선택됨
export const JejuSelected: Story = {
  render: InteractiveTemplate,
  args: {
    isOpen: true,
    selectedLocation: '제주'
  },
  parameters: {
    docs: {
      description: {
        story: '제주특별자치도가 선택된 상태입니다.'
      }
    }
  }
};

// 모바일 뷰
export const Mobile: Story = {
  render: InteractiveTemplate,
  args: {
    isOpen: true,
    selectedLocation: '부산'
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: '모바일 환경에서의 지역 선택 모달입니다.'
      }
    }
  }
}; 