import type { Meta, StoryObj } from '@storybook/react';
import GapVerificationStep from '../components/branding/GapVerificationStep/GapVerificationStep';
import type { GapCertificationResponse } from '../api/gapCertificationService';

const meta = {
  title: 'Branding/GapVerificationStep',
  component: GapVerificationStep,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '실제 농림축산식품부 GAP 인증 API와 연동된 GAP 인증번호 검증 컴포넌트입니다.'
      }
    }
  },
  argTypes: {
    data: {
      description: 'GAP 검증 데이터 (인증번호, 검증 상태, 인증 정보)',
      control: { type: 'object' }
    },
    onChange: {
      description: 'GAP 검증 데이터 변경 시 호출되는 콜백',
      action: 'changed'
    },
    onValidationChange: {
      description: '검증 상태 변경 시 호출되는 콜백',
      action: 'validation-changed'
    }
  },
  decorators: [
    (Story) => (
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
    ),
  ],
} satisfies Meta<typeof GapVerificationStep>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock GAP 인증 정보
const mockGapCertificationInfo: GapCertificationResponse = {
  certificationNumber: '1234567890123',
  institutionName: '국립농산물품질관리원',
  productName: '토마토',
  farmerName: '김농부',
  businessRegistrationNumber: '123-45-67890',
  address: '경기도 성남시 분당구',
  issuedDate: '2024-01-15',
  validUntil: '2025-01-14',
  cultivationArea: 5000,
  facilityArea: 2000,
  grade: 'GAP 1등급',
  certificationStatus: '유효',
  cropCode: 'T001',
  regionCode: 'KG',
  farmerType: '개인'
};

// 기본 상태 (미입력)
export const Default: Story = {
  args: {
    data: {
      gapNumber: '',
      isVerified: false,
      certificationInfo: undefined
    },
    onChange: (data) => console.log('GAP 데이터 변경:', data),
    onValidationChange: (isValid) => console.log('검증 상태:', isValid)
  }
};

// 인증번호 입력 중
export const WithGapNumber: Story = {
  args: {
    data: {
      gapNumber: '1234567890',
      isVerified: false,
      certificationInfo: undefined
    },
    onChange: (data) => console.log('GAP 데이터 변경:', data),
    onValidationChange: (isValid) => console.log('검증 상태:', isValid)
  }
};

// 검증 성공
export const VerificationSuccess: Story = {
  args: {
    data: {
      gapNumber: '1234567890123',
      isVerified: true,
      certificationInfo: mockGapCertificationInfo
    },
    onChange: (data) => console.log('GAP 데이터 변경:', data),
    onValidationChange: (isValid) => console.log('검증 상태:', isValid)
  }
};

// 검증 실패
export const VerificationFailure: Story = {
  args: {
    data: {
      gapNumber: '999999999',
      isVerified: false,
      certificationInfo: undefined
    },
    onChange: (data) => console.log('GAP 데이터 변경:', data),
    onValidationChange: (isValid) => console.log('검증 상태:', isValid)
  }
};

// 인증번호 형식 오류
export const FormatError: Story = {
  args: {
    data: {
      gapNumber: '12345', // 너무 짧은 인증번호
      isVerified: false,
      certificationInfo: undefined
    },
    onChange: (data) => console.log('GAP 데이터 변경:', data),
    onValidationChange: (isValid) => console.log('검증 상태:', isValid)
  }
};

// 다양한 GAP 인증 정보로 테스트
export const DifferentCertificationInfo: Story = {
  args: {
    data: {
      gapNumber: '9876543210987',
      isVerified: true,
      certificationInfo: {
        ...mockGapCertificationInfo,
        institutionName: '전라남도 농산물품질관리원',
        productName: '딸기',
        farmerName: '이농민',
        address: '전라남도 담양군',
        cultivationArea: 3000,
        facilityArea: 1500,
        farmerType: '단체'
      }
    },
    onChange: (data) => console.log('GAP 데이터 변경:', data),
    onValidationChange: (isValid) => console.log('검증 상태:', isValid)
  }
}; 