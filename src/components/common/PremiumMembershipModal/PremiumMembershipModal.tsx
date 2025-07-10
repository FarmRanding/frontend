import React from 'react';
import styled, { keyframes } from 'styled-components';
import iconDiamond from '../../../assets/icon-diamond.svg';

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

const PremiumIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px auto;
  position: relative;
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.25);
`;

const DiamondIcon = styled.img`
  width: 28px;
  height: 28px;
  filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
`;

const Title = styled.h2`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 24px;
  line-height: 1.3;
  color: #8B5CF6;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
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

const FeatureSection = styled.div`
  background: linear-gradient(135deg, #F8FAFF 0%, #F3F0FF 100%);
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
`;

const SectionIcon = styled.img`
  width: 18px;
  height: 18px;
  filter: brightness(0) saturate(100%) invert(43%) sepia(96%) saturate(1352%) hue-rotate(221deg) brightness(99%) contrast(94%);
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #4B5563;
`;

const FeatureBullet = styled.span`
  width: 6px;
  height: 6px;
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
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
    background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
    color: #FFFFFF;
    
    &:hover {
      background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
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

interface PremiumMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  title?: string;
  subtitle?: string;
  featureName?: string;
}

const PremiumMembershipModal: React.FC<PremiumMembershipModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  title = "프리미엄 멤버십 필요",
  subtitle = "이 기능을 사용하려면 프리미엄 멤버십이 필요합니다.",
  featureName = "프리미엄 가격 제안"
}) => {
  console.log('PremiumMembershipModal 렌더링:', { isOpen, title, featureName });
  
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
          <PremiumIcon>
            <DiamondIcon src={iconDiamond} alt="Premium" />
          </PremiumIcon>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </ModalHeader>

        <ModalBody>
          <FeatureSection>
            <SectionTitle>
              <SectionIcon src={iconDiamond} alt="Premium" />
              프리미엄 멤버십 혜택
            </SectionTitle>
            <FeatureList>
              <FeatureItem>
                <FeatureBullet />
                <span>AI 기반 정확한 직거래 가격 제안</span>
              </FeatureItem>
              <FeatureItem>
                <FeatureBullet />
                <span>KAMIS 공식 데이터 기반 시장 분석</span>
              </FeatureItem>
              <FeatureItem>
                <FeatureBullet />
                <span>무제한 브랜딩 및 가격 제안 서비스</span>
              </FeatureItem>
            </FeatureList>
          </FeatureSection>
        </ModalBody>

        <ModalFooter>
          <Button $variant="secondary" onClick={onClose}>
            나중에
          </Button>
          <Button $variant="primary" onClick={onUpgrade}>
            멤버십 업그레이드
          </Button>
        </ModalFooter>
      </ModalContainer>
    </Overlay>
  );
};

export default PremiumMembershipModal; 