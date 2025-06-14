import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { UnifiedPriceHistoryResponse } from '../../../types/priceQuote';
import iconClose from '../../../assets/icon-close.svg';

interface PremiumPriceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: UnifiedPriceHistoryResponse;
}

// 애니메이션 정의 (기존 PriceQuoteDetailModal과 동일)
const slideUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const slideDown = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const PremiumPriceDetailModal: React.FC<PremiumPriceDetailModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}.`;
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 400);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <ModalOverlay isVisible={isOpen} isClosing={isClosing} onClick={handleOverlayClick}>
      <ModalContainer isVisible={isOpen} isClosing={isClosing}>
        <ModalHeader>
          <ModalTitle>프리미엄 가격 제안 상세</ModalTitle>
          <CloseButton onClick={handleClose} aria-label="닫기">
            <CloseIcon src={iconClose} alt="닫기" />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          <InfoSection>
            <InfoItem>
              <InfoLabel>품목명</InfoLabel>
              <InfoValue>{data.productName}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>등급</InfoLabel>
              <InfoValue>{data.grade}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>분석일</InfoLabel>
              <InfoValue>{data.analysisDate ? formatDate(data.analysisDate) : '-'}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>기준 수량</InfoLabel>
              <InfoValue>{data.quantity}{data.unit}</InfoValue>
            </InfoItem>

            {data.location && (
              <InfoItem>
                <InfoLabel>지역</InfoLabel>
                <InfoValue>{data.location}</InfoValue>
              </InfoItem>
            )}
          </InfoSection>

          <PriceSection>
            <PriceHeader>
              <PriceIcon>₩</PriceIcon>
              <PriceLabel>적정가격({data.quantity}{data.unit} 기준)</PriceLabel>
            </PriceHeader>
            <PriceDisplay>
              <PriceValue>{formatPrice(data.suggestedPrice)}원</PriceValue>
            </PriceDisplay>
          </PriceSection>

          {data.retailAverage && data.wholesaleAverage && (
            <AnalysisSection>
              <SectionTitle>시장 분석 데이터</SectionTitle>
              <AnalysisRow>
                <AnalysisLabel>소매 5일 평균</AnalysisLabel>
                <AnalysisValue>{formatPrice(data.retailAverage)}원</AnalysisValue>
              </AnalysisRow>
              <AnalysisRow>
                <AnalysisLabel>도매 5일 평균</AnalysisLabel>
                <AnalysisValue>{formatPrice(data.wholesaleAverage)}원</AnalysisValue>
              </AnalysisRow>
            </AnalysisSection>
          )}

          {data.calculationReason && (
            <ReasonSection>
              <SectionTitle>계산 근거</SectionTitle>
              <ReasonText>{data.calculationReason}</ReasonText>
            </ReasonSection>
          )}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

// 기존 PriceQuoteDetailModal과 동일한 스타일
const ModalOverlay = styled.div<{ isVisible: boolean; isClosing: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: ${props => props.isClosing ? fadeOut : fadeIn} 0.3s ease-out;
  opacity: ${props => props.isVisible ? 1 : 0};
`;

const ModalContainer = styled.div<{ isVisible: boolean; isClosing: boolean }>`
  width: 100%;
  max-width: 402px;
  height: 85vh;
  background: #F4FAFF;
  border-radius: 24px 24px 0 0;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  animation: ${props => props.isClosing ? slideDown : slideUp} 0.4s ease-out;
  transform: ${props => props.isVisible ? 'translateY(0)' : 'translateY(100%)'};
`;

const ModalHeader = styled.div`
  width: 100%;
  height: 60px;
  background: #F4FAFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.1);
`;

const ModalTitle = styled.h2`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.2;
  color: #8B5CF6;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(139, 92, 246, 0.1);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const CloseIcon = styled.img`
  width: 20px;
  height: 20px;
  filter: brightness(0) saturate(100%) invert(47%) sepia(89%) saturate(2435%) hue-rotate(244deg) brightness(98%) contrast(95%);
`;

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px 40px 20px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const InfoLabel = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.2;
  color: #6B7280;
`;

const InfoValue = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.2;
  color: #1F2937;
`;

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PriceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PriceIcon = styled.div`
  width: 20px;
  height: 20px;
  color: #8B5CF6;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PriceLabel = styled.span`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.18;
  color: #8B5CF6;
`;

const PriceDisplay = styled.div`
  width: 100%;
  height: 60px;
  background: #FFFFFF;
  border: none;
  border-radius: 8px;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(168, 85, 247, 0.03) 100%);
    border-radius: 8px;
  }
`;

const PriceValue = styled.span`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 24px;
  line-height: 1.2;
  color: #8B5CF6;
  position: relative;
  z-index: 1;
`;

const AnalysisSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h3`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.2;
  color: #8B5CF6;
  margin: 0;
`;

const AnalysisRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const AnalysisLabel = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.2;
  color: #6B7280;
`;

const AnalysisValue = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.2;
  color: #8B5CF6;
`;

const ReasonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ReasonText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #4B5563;
  margin: 0;
  padding: 16px;
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #8B5CF6;
`;

export default PremiumPriceDetailModal; 