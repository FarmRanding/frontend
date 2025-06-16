import React from 'react';
import styled, { keyframes } from 'styled-components';

// 애니메이션
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: ${fadeIn} 0.3s ease-out;
  padding: 20px;
  box-sizing: border-box;
`;

const ModalContainer = styled.div`
  background: #FFFFFF;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${slideUp} 0.4s ease-out;
`;

const ModalHeader = styled.div`
  padding: 32px 32px 24px 32px;
  text-align: center;
  border-bottom: 1px solid #F3F4F6;
`;

const ErrorIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #FEE2E2 0%, #FCA5A5 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px auto;
  position: relative;
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.15);
  
  &::before {
    content: '';
    position: absolute;
    width: 24px;
    height: 24px;
    background: #DC2626;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  &::after {
    content: '!';
    position: absolute;
    color: #FFFFFF;
    font-family: 'Jalnan 2', sans-serif;
    font-weight: 700;
    font-size: 16px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }
`;

const ErrorTitle = styled.h2`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 24px;
  line-height: 1.3;
  color: #DC2626;
  margin: 0 0 8px 0;
`;

const ErrorSubtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  color: #6B7280;
  margin: 0;
`;

const ModalBody = styled.div`
  padding: 24px 32px;
`;

const ConditionSection = styled.div`
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #1F2937;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '';
    width: 20px;
    height: 20px;
    border-radius: 4px;
    display: inline-block;
  }
`;

const ConditionSectionTitle = styled(SectionTitle)`
  &::before {
    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'/%3E%3C/svg%3E") center/contain;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'/%3E%3C/svg%3E") center/contain;
  }
`;

const SolutionSectionTitle = styled(SectionTitle)`
  &::before {
    background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189 6.996 6.996 0 01-1.5-2.148 6.996 6.996 0 01-1.5 2.148A6.01 6.01 0 0012 12.75zm0 0V9m0 0a6.01 6.01 0 01-1.5.189 6.996 6.996 0 011.5 2.148 6.996 6.996 0 011.5-2.148A6.01 6.01 0 0012 9z'/%3E%3C/svg%3E") center/contain;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189 6.996 6.996 0 01-1.5-2.148 6.996 6.996 0 01-1.5 2.148A6.01 6.01 0 0012 12.75zm0 0V9m0 0a6.01 6.01 0 01-1.5.189 6.996 6.996 0 011.5 2.148 6.996 6.996 0 011.5-2.148A6.01 6.01 0 0012 9z'/%3E%3C/svg%3E") center/contain;
  }
`;

const ConditionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ConditionItem = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #4B5563;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ConditionLabel = styled.span`
  color: #6B7280;
`;

const ConditionValue = styled.span`
  font-weight: 500;
  color: #1F2937;
`;

const SolutionSection = styled.div`
  background: #EFF6FF;
  border: 1px solid #DBEAFE;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
`;

const SolutionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SolutionItem = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #1E40AF;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  line-height: 1.5;
`;

const SolutionBullet = styled.span`
  width: 6px;
  height: 6px;
  background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
  border-radius: 50%;
  margin-top: 8px;
  flex-shrink: 0;
`;

const ModalFooter = styled.div`
  padding: 24px 32px 32px 32px;
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.$variant === 'primary' ? `
    background: #EF4444;
    color: #FFFFFF;
    
    &:hover {
      background: #DC2626;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
    }
  ` : `
    background: #F3F4F6;
    color: #6B7280;
    
    &:hover {
      background: #E5E7EB;
      color: #4B5563;
      transform: translateY(-1px);
    }
  `}
  
  &:active {
    transform: translateY(0);
  }
`;

interface ErrorCondition {
  productName: string;
  grade: string;
  location: string;
  date: string;
}

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
  title: string;
  subtitle?: string;
  condition?: ErrorCondition;
  showCondition?: boolean;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  onRetry,
  title,
  subtitle = "조건을 변경하고 다시 시도해 보세요.",
  condition,
  showCondition = true
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer>
        <ModalHeader>
          <ErrorIcon />
          <ErrorTitle>{title}</ErrorTitle>
          <ErrorSubtitle>{subtitle}</ErrorSubtitle>
        </ModalHeader>

        <ModalBody>
          {showCondition && condition && (
            <ConditionSection>
              <ConditionSectionTitle>
                현재 선택된 조건
              </ConditionSectionTitle>
              <ConditionList>
                <ConditionItem>
                  <ConditionLabel>품목</ConditionLabel>
                  <ConditionValue>{condition.productName}</ConditionValue>
                </ConditionItem>
                <ConditionItem>
                  <ConditionLabel>등급</ConditionLabel>
                  <ConditionValue>{condition.grade}</ConditionValue>
                </ConditionItem>
                <ConditionItem>
                  <ConditionLabel>지역</ConditionLabel>
                  <ConditionValue>{condition.location}</ConditionValue>
                </ConditionItem>
                <ConditionItem>
                  <ConditionLabel>날짜</ConditionLabel>
                  <ConditionValue>{condition.date}</ConditionValue>
                </ConditionItem>
              </ConditionList>
            </ConditionSection>
          )}

          <SolutionSection>
            <SolutionSectionTitle>
              해결 방법
            </SolutionSectionTitle>
            <SolutionList>
              <SolutionItem>
                <SolutionBullet />
                <span>다른 농산물을 선택해 보세요</span>
              </SolutionItem>
              <SolutionItem>
                <SolutionBullet />
                <span>다른 지역을 선택해 보세요</span>
              </SolutionItem>
              <SolutionItem>
                <SolutionBullet />
                <span>최근 날짜로 변경해 보세요</span>
              </SolutionItem>
              <SolutionItem>
                <SolutionBullet />
                <span>등급을 변경해 보세요</span>
              </SolutionItem>
            </SolutionList>
          </SolutionSection>
        </ModalBody>

        <ModalFooter>
          <Button $variant="secondary" onClick={onClose}>
            취소
          </Button>
          {onRetry ? (
            <Button $variant="primary" onClick={onRetry}>
              조건 변경
            </Button>
          ) : (
            <Button $variant="primary" onClick={onClose}>
              확인
            </Button>
          )}
        </ModalFooter>
      </ModalContainer>
    </Overlay>
  );
};

export default ErrorModal; 