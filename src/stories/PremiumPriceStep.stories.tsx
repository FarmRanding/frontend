import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import PremiumPriceStep from '../components/pricing/PremiumPriceStep/PremiumPriceStep';
import { NotificationProvider } from '../contexts/NotificationContext';

const meta: Meta<typeof PremiumPriceStep> = {
  title: 'Components/Pricing/PremiumPriceStep',
  component: PremiumPriceStep,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### 프리미엄 가격 제안 입력 단계

프리미엄 가격 제안의 첫 번째 단계로, 농산물 정보와 지역을 입력받는 컴포넌트입니다.

#### 주요 기능
- **품목 선택**: 기존 ProductInput 컴포넌트 재사용 (상품 그룹 선택 없이 바로 품목 선택)
- **지역 선택**: LocationSelector 모달을 통한 17개 시도 선택
- **폼 검증**: 품목명과 지역이 모두 입력되어야 다음 단계 진행 가능
- **프리미엄 테마**: 보라색 그라디언트와 애니메이션 효과

#### 디자인 특징
- 기존 PriceQuoteStep과 동일한 레이아웃
- 프리미엄 브랜드 컬러 (#8B5CF6, #7C3AED) 적용
- 부드러운 애니메이션과 호버 효과
        `
      }
    }
  },
  decorators: [
    (Story) => (
      <NotificationProvider>
        <div style={{ 
          width: '100vw', 
          height: '100vh', 
          background: '#F4FAFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <Story />
        </div>
      </NotificationProvider>
    ),
  ],
  argTypes: {
    data: {
      description: '현재 입력된 데이터'
    },
    onChange: {
      action: 'data-changed',
      description: '데이터 변경 이벤트'
    },
    onValidationChange: {
      action: 'validation-changed',
      description: '폼 유효성 변경 이벤트'
    },
    onPriceGenerated: {
      action: 'price-generated',
      description: '가격 생성 완료 이벤트'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 인터랙티브 스토리
const InteractiveTemplate = (args: any) => {
  const [data, setData] = useState({
    productItemCode: '',
    productVarietyCode: '',
    productName: '',
    location: '',
    date: null as Date | null
  });
  const [isValid, setIsValid] = useState(false);

  const handleChange = (updates: any) => {
    const newData = { ...data, ...updates };
    setData(newData);
    action('data-changed')(newData);
  };

  const handleValidationChange = (valid: boolean) => {
    setIsValid(valid);
    action('validation-changed')(valid);
  };

  const handlePriceGenerated = (priceData: any) => {
    action('price-generated')(priceData);
  };

  return (
    <div style={{ width: '100%', maxWidth: '500px' }}>
      <PremiumPriceStep
        data={data}
        onChange={handleChange}
        onValidationChange={handleValidationChange}
        onPriceGenerated={handlePriceGenerated}
      />
      
      {/* 개발용 상태 표시 */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: '#FFFFFF',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        fontSize: '12px',
        color: '#666'
      }}>
        <div><strong>폼 유효성:</strong> {isValid ? '✅ 유효' : '❌ 무효'}</div>
        <div><strong>품목:</strong> {data.productName || '미선택'}</div>
        <div><strong>지역:</strong> {data.location || '미선택'}</div>
        <div><strong>날짜:</strong> {data.date ? data.date.toLocaleDateString() : '미선택'}</div>
        <div><strong>품목 코드:</strong> {data.productItemCode || '없음'}</div>
      </div>
    </div>
  );
};

// 기본 스토리
export const Default: Story = {
  render: InteractiveTemplate,
  parameters: {
    docs: {
      description: {
        story: '기본 상태의 프리미엄 가격 제안 입력 단계입니다. 품목과 지역을 선택할 수 있습니다.'
      }
    }
  }
};

// 품목 선택됨
export const WithProduct: Story = {
  render: (args) => {
    const [data, setData] = useState({
      productItemCode: '111',
      productVarietyCode: '',
      productName: '토마토',
      location: '',
      date: null as Date | null
    });

    return (
      <PremiumPriceStep
        data={data}
        onChange={(updates) => setData({ ...data, ...updates })}
        onValidationChange={action('validation-changed')}
        onPriceGenerated={action('price-generated')}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: '품목이 선택된 상태입니다. 지역을 선택하면 다음 단계로 진행할 수 있습니다.'
      }
    }
  }
};

// 모든 정보 입력 완료
export const Complete: Story = {
  render: (args) => {
    const [data, setData] = useState({
      productItemCode: '111',
      productVarietyCode: '',
      productName: '토마토',
      location: '경기',
      date: new Date()
    });

    return (
      <PremiumPriceStep
        data={data}
        onChange={(updates) => setData({ ...data, ...updates })}
        onValidationChange={action('validation-changed')}
        onPriceGenerated={action('price-generated')}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: '모든 정보가 입력 완료된 상태입니다. 다음 단계로 진행할 수 있습니다.'
      }
    }
  }
};

// 모바일 뷰
export const Mobile: Story = {
  render: InteractiveTemplate,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: '모바일 환경에서의 표시 상태입니다.'
      }
    }
  }
}; 