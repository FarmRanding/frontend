import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
  width: 100%;
  max-width: 320px;
`;

const Title = styled.h1`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 24px;
  line-height: 1.67;
  letter-spacing: 4.17%;
  text-align: center;
  color: #000000;
  margin: 0;
  white-space: pre-line !important;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
  animation: ${slideInUp} 0.8s ease-out 0.2s both;
`;

const GapContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  width: 100%;
`;

const GapLabel = styled.label`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.18;
  color: #000000;
  margin: 0;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const NumberInputWrapper = styled.div`
  position: relative;
  width: 258px;
  height: 33px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
`;

const NumberInput = styled.input`
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  padding: 0 7px;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.21;
  color: #000000;
  box-sizing: border-box;

  &::placeholder {
    color: #9c9c9c;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const VerifyButton = styled.button`
  width: 50px;
  height: 33px;
  background: #1F41BB;
  border: none;
  border-radius: 8px;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;

  &:hover {
    background: #1a3a9e;
  }

  &:active {
    background: #163285;
  }

  &:disabled {
    background: #9e9e9e;
    cursor: not-allowed;
  }
`;

const VerifyButtonText = styled.span`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.18;
  color: #ffffff;
  white-space: nowrap;
`;

const VerificationStatus = styled.div<{ $isVisible: boolean; $isSuccess: boolean }>`
  margin-top: 12px;
  padding: 12px 16px;
  background: ${props => props.$isSuccess ? '#E8F5E8' : '#FFE8E8'};
  border-radius: 8px;
  border: 1px solid ${props => props.$isSuccess ? '#4CAF50' : '#F44336'};
  opacity: ${props => props.$isVisible ? 1 : 0};
  visibility: ${props => props.$isVisible ? 'visible' : 'hidden'};
  transition: all 0.3s ease-in-out;
`;

const StatusText = styled.p<{ $isSuccess: boolean }>`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4;
  color: ${props => props.$isSuccess ? '#2E7D32' : '#C62828'};
  margin: 0;
  text-align: center;
`;

const SkipButton = styled.button`
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1px solid #9E9E9E;
  border-radius: 8px;
  color: #9E9E9E;
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #9E9E9E;
    color: white;
  }
`;

interface GapVerificationData {
  gapNumber: string;
  isVerified: boolean;
}

interface GapVerificationStepProps {
  data: GapVerificationData;
  onChange: (data: GapVerificationData) => void;
  onValidationChange: (isValid: boolean) => void;
}

type VerificationStatus = 'idle' | 'loading' | 'success' | 'error';

const GapVerificationStep: React.FC<GapVerificationStepProps> = ({
  data,
  onChange,
  onValidationChange
}) => {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
  const [verificationMessage, setVerificationMessage] = useState('');

  const handleInputChange = (value: string) => {
    const newData = { ...data, gapNumber: value, isVerified: false };
    onChange(newData);
    
    if (verificationStatus !== 'idle') {
      setVerificationStatus('idle');
      setVerificationMessage('');
    }
    
    onValidationChange(false);
  };

  const handleVerify = async () => {
    if (!data.gapNumber.trim()) {
      return;
    }

    setVerificationStatus('loading');
    
    try {
      await simulateApiCall(data.gapNumber);
      setVerificationStatus('success');
      setVerificationMessage('GAP 인증번호가 확인되었습니다.');
      
      const newData = { ...data, isVerified: true };
      onChange(newData);
      onValidationChange(true);
    } catch (error) {
      setVerificationStatus('error');
      setVerificationMessage('GAP 인증번호를 찾을 수 없습니다. 다시 확인해 주세요.');
      
      const newData = { ...data, isVerified: false };
      onChange(newData);
      onValidationChange(false);
    }
  };

  const simulateApiCall = async (gapNumber: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 간단한 시뮬레이션: 숫자가 8자리 이상이면 성공
        if (gapNumber.length >= 8) {
          resolve();
        } else {
          reject(new Error('Invalid GAP number'));
        }
      }, 1500);
    });
  };

  const handleSkip = () => {
    const newData = { gapNumber: '', isVerified: false };
    onChange(newData);
    onValidationChange(true); // 건너뛰기는 항상 유효
  };

  return (
    <Container>
      <Title>
        GAP 인증번호를 입력하고<br />확인해주세요.
      </Title>
      
      <FormContainer>
        <GapContainer>
          <GapLabel>GAP 인증번호</GapLabel>
          <InputContainer>
            <NumberInputWrapper>
              <NumberInput
                type="text"
                placeholder="GAP 인증번호를 입력하세요"
                value={data.gapNumber}
                onChange={(e) => handleInputChange(e.target.value)}
                disabled={verificationStatus === 'loading'}
              />
            </NumberInputWrapper>
            <VerifyButton
              onClick={handleVerify}
              disabled={!data.gapNumber.trim() || verificationStatus === 'loading'}
            >
              <VerifyButtonText>
                {verificationStatus === 'loading' ? '확인중' : '확인'}
              </VerifyButtonText>
            </VerifyButton>
          </InputContainer>
          
          <VerificationStatus
            $isVisible={verificationStatus === 'success' || verificationStatus === 'error'}
            $isSuccess={verificationStatus === 'success'}
          >
            <StatusText $isSuccess={verificationStatus === 'success'}>
              {verificationMessage}
            </StatusText>
          </VerificationStatus>
        </GapContainer>

        <SkipButton onClick={handleSkip}>
          GAP 인증이 없어도 괜찮아요 (건너뛰기)
        </SkipButton>
      </FormContainer>
    </Container>
  );
};

export default GapVerificationStep; 