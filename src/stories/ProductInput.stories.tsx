import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import ProductInput, { ProductInputData } from '../components/common/ProductInput/ProductInput';

const meta: Meta<typeof ProductInput> = {
  title: 'Components/Common/ProductInput',
  component: ProductInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
가락시장 품목 코드 데이터를 기반으로 한 품목 선택 컴포넌트입니다.

## 주요 기능
- **실시간 검색**: 키워드 입력 시 백엔드 API 호출로 품목 검색
- **드롭다운 선택**: 브랜딩 페이지와 동일한 AutoCompleteInput 사용
- **엔터키 자동선택**: 검색 결과 중 첫 번째 항목 자동 선택
- **키보드 네비게이션**: 화살표 키로 항목 이동 가능
- **자동 포커스**: 다음 필드로 자동 포커스 이동

## 데이터 소스
- 가락시장 공공데이터 API 연동
- 703개 품목 코드 지원
- 실시간 동기화 지원

## 사용 예시
가격제안 페이지에서 기존의 "작물명 + 품종" 두 필드를 "품목" 하나로 통합하여 사용합니다.
        `
      }
    }
  },
  argTypes: {
    value: {
      control: 'text',
      description: '현재 입력된 품목명',
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
      description: '품목 선택 시 호출되는 콜백 함수',
      table: {
        type: { 
          summary: '(data: ProductInputData) => void',
          detail: `{
  productId: number | null;
  garakCode: string;
  productName: string;
}`,
        },
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProductInput>;

// 기본 스토리
export const Default: Story = {
  args: {
    value: '',
    onChange: action('product-changed'),
    disabled: false,
  },
};

// 미리 입력된 값이 있는 상태
export const WithValue: Story = {
  args: {
    value: '토마토',
    onChange: action('product-changed'),
    disabled: false,
  },
};

// 비활성화 상태
export const Disabled: Story = {
  args: {
    value: '감자',
    onChange: action('product-changed'),
    disabled: true,
  },
};

// 실제 사용 예시 (상태 관리 포함)
export const Interactive: Story = {
  render: (args) => {
    const [productData, setProductData] = useState<ProductInputData>({
      productId: null,
      garakCode: '',
      productName: ''
    });

    const [inputValue, setInputValue] = useState('');

    const handleChange = (data: ProductInputData) => {
      setProductData(data);
      setInputValue(data.productName);
      action('product-changed')(data);
    };

    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <ProductInput
          {...args}
          value={inputValue}
          onChange={handleChange}
        />
        
        {productData.productName && (
          <div style={{ 
            marginTop: '16px', 
            padding: '12px', 
            backgroundColor: '#F0F9FF', 
            borderRadius: '8px',
            border: '1px solid #BAE6FD'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#0369A1' }}>선택된 품목</h4>
            <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#64748B' }}>
              <strong>품목명:</strong> {productData.productName}
            </p>
            <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#64748B' }}>
              <strong>가락코드:</strong> {productData.garakCode}
            </p>
            <p style={{ margin: '0', fontSize: '13px', color: '#64748B' }}>
              <strong>ID:</strong> {productData.productId}
            </p>
          </div>
        )}
      </div>
    );
  },
  args: {
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
실제 사용 예시입니다. 

**테스트해보세요:**
1. 품목명에 '토마', '감자', '사과' 등을 입력
2. 검색 결과가 나타나면 **엔터키** 또는 방향키로 선택
3. 선택 결과가 하단에 표시됩니다

## 주요 특징
- 가락시장 API 연동으로 실제 품목 데이터 검색
- 엔터키 자동 선택 기능으로 빠른 입력 가능
- productId, garakCode, productName 정보 포함
        `,
      },
    },
  },
};

// 길이 제한 테스트
export const LongProductName: Story = {
  args: {
    value: '친환경무농약재배방울토마토프리미엄',
    onChange: action('product-changed'),
    disabled: false,
  },
};

// 가격제안 플로우에서의 사용 예시
export const InPriceQuoteFlow: Story = {
  render: (args) => {
    const [productData, setProductData] = useState<ProductInputData>({
      productId: null,
      garakCode: '',
      productName: ''
    });

    const [inputValue, setInputValue] = useState('');

    const handleChange = (data: ProductInputData) => {
      setProductData(data);
      setInputValue(data.productName);
      action('product-changed')(data);
    };

    return (
      <div style={{ 
        width: '320px', 
        padding: '20px',
        backgroundColor: '#F8FAFC',
        borderRadius: '12px',
        fontFamily: 'Inter, sans-serif'
      }}>
        <h2 style={{ 
          fontFamily: 'Jalnan 2, sans-serif',
          fontSize: '18px',
          color: '#000000',
          margin: '0 0 24px 0',
          textAlign: 'center'
        }}>
          당신의 작물 정보를<br />입력해주세요.
        </h2>
        
        <ProductInput
          {...args}
          value={inputValue}
          onChange={handleChange}
        />
        
        <div style={{ 
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ 
            margin: '0',
            fontSize: '12px',
            color: '#6B7280',
            textAlign: 'center'
          }}>
            {productData.productName 
              ? `선택된 품목: ${productData.productName} (${productData.garakCode})`
              : '품목을 선택해주세요'
            }
          </p>
        </div>
      </div>
    );
  },
  args: {
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
가격제안 플로우에서 실제 사용되는 모습입니다.

기존의 "작물명 + 품종" 두 필드가 "품목" 하나로 통합되어 더 간편해졌습니다.
        `,
      },
    },
  },
}; 