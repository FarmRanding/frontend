import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { gapCertificationService, type GapCertificationResponse } from '../../../api/gapCertificationService';

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

const CertificationInfo = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: #F8F9FA;
  border-radius: 8px;
  border: 1px solid #E9ECEF;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: #666;
`;

const InfoValue = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: #333;
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
  certificationInfo?: GapCertificationResponse;
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
    const newData = { 
      ...data, 
      gapNumber: value, 
      isVerified: false,
      certificationInfo: undefined 
    };
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

    if (!gapCertificationService.validateCertificationFormat(data.gapNumber.trim())) {
      setVerificationStatus('error');
      setVerificationMessage('GAP 인증번호는 7-15자리 숫자여야 합니다.');
      onValidationChange(false);
      return;
    }

    setVerificationStatus('loading');
    
    try {
      const result = await gapCertificationService.validateCertificationNumber(data.gapNumber.trim());
      
      if (result.isValid && result.certificationInfo) {
      setVerificationStatus('success');
        setVerificationMessage(result.message);
      
        const newData = { 
          ...data, 
          isVerified: true,
          certificationInfo: result.certificationInfo
        };
      onChange(newData);
      onValidationChange(true);
      } else {
        setVerificationStatus('error');
        setVerificationMessage(result.message);
        
        const newData = { 
          ...data, 
          isVerified: false,
          certificationInfo: undefined
        };
        onChange(newData);
        onValidationChange(false);
      }
    } catch (error) {
      setVerificationStatus('error');
      setVerificationMessage('GAP 인증 확인 중 오류가 발생했습니다. 다시 시도해 주세요.');
      
      const newData = { 
        ...data, 
        isVerified: false,
        certificationInfo: undefined
      };
      onChange(newData);
      onValidationChange(false);
    }
  };

  const handleSkip = () => {
    const newData = { 
      gapNumber: '', 
      isVerified: false,
      certificationInfo: undefined
    };
    onChange(newData);
    onValidationChange(true);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\./g, '-').replace(/ /g, '').slice(0, -1);
    } catch {
      return dateString;
    }
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

          {verificationStatus === 'success' && data.certificationInfo && (
            <CertificationInfo>
              <InfoRow>
                <InfoLabel>인증기관:</InfoLabel>
                <InfoValue>{data.certificationInfo.certificationInstitution}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>품목명:</InfoLabel>
                <InfoValue>{data.certificationInfo.productName}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>생산자:</InfoLabel>
                <InfoValue>{data.certificationInfo.producerGroupName}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>유효기간:</InfoLabel>
                <InfoValue>{formatDate(data.certificationInfo.validPeriodEnd)}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>재배면적:</InfoLabel>
                <InfoValue>{data.certificationInfo.cultivationArea?.toLocaleString() || '정보없음'}㎡</InfoValue>
              </InfoRow>
            </CertificationInfo>
          )}
        </GapContainer>

        <SkipButton onClick={handleSkip}>
          GAP 인증이 없어도 괜찮아요 (건너뛰기)
        </SkipButton>
      </FormContainer>
    </Container>
  );
};

export default GapVerificationStep; 