import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import iconClose from '../../../assets/icon-close.svg';
import iconBrush from '../../../assets/icon-brush.svg';
import { BRAND_IMAGE_KEYWORDS, CROP_APPEAL_KEYWORDS, LOGO_IMAGE_KEYWORDS, getKeywordLabel } from '../../../constants/keywords';

// 애니메이션
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

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

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
  height: 75vh;
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
  border-bottom: 1px solid rgba(31, 65, 187, 0.1);
`;

const ModalTitle = styled.h2`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.2;
  color: #1F41BB;
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
    background: rgba(31, 65, 187, 0.1);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const CloseIcon = styled.img`
  width: 20px;
  height: 20px;
  filter: brightness(0) saturate(100%) invert(25%) sepia(98%) saturate(1653%) hue-rotate(221deg) brightness(96%) contrast(91%);
`;

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px 40px 20px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const BrandingHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const BrandingTitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BrandingDateSection = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.2;
  color: #9CA3AF;
  padding: 4px 8px;
  background: rgba(31, 65, 187, 0.05);
  border-radius: 6px;
  border: 1px solid rgba(31, 65, 187, 0.1);
`;

const BrandingIcon = styled.img`
  width: 20px;
  height: 20px;
  filter: brightness(0) saturate(100%) invert(25%) sepia(98%) saturate(1653%) hue-rotate(221deg) brightness(96%) contrast(91%);
`;

const BrandingLabel = styled.span`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.18;
  color: #1F41BB;
`;

const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ImageSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
`;

const BrandImageContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(31, 65, 187, 0.15);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 16px 40px rgba(31, 65, 187, 0.2);
  }
`;

const BrandImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${BrandImageContainer}:hover & {
    opacity: 1;
    animation: ${shimmer} 1.5s ease-in-out;
  }
`;

const BrandTitle = styled.h3`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 24px;
  line-height: 1.3;
  color: #1F41BB;
  margin: 0;
  text-align: center;
  background: linear-gradient(135deg, #1F41BB 0%, #3B82F6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const BrandDescription = styled.p`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.6;
  color: #64748B;
  margin: 0;
  text-align: center;
  word-break: keep-all;
  padding: 20px;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(31, 65, 187, 0.05);
`;

const BrandStory = styled.p`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 1.7;
  color: #374151;
  margin: 0;
  padding: 24px;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(31, 65, 187, 0.08);
  word-break: keep-all;
  white-space: pre-wrap;
`;

const KeywordSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 24px;
`;

const KeywordCategory = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const KeywordCategoryTitle = styled.h4`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.2;
  color: #000000;
  margin: 0 0 12px 0;
`;

const KeywordList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  position: relative;
`;

const KeywordTag = styled.div`
  padding: 6px 12px;
  background: rgba(31, 65, 187, 0.1);
  border: 1px solid rgba(31, 65, 187, 0.2);
  border-radius: 20px;
  font-family: 'Inter', sans-serif !important;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.2;
  color: #1F41BB;
  white-space: nowrap;
`;

interface BrandingHistory {
  id: string;
  title: string;
  description: string;
  story: string;
  imageUrl?: string;
  createdAt: string;
  brandingKeywords?: string[];
  cropAppealKeywords?: string[];
  logoImageKeywords?: string[];
}

interface BrandingDetailModalProps {
  isVisible: boolean;
  brandingHistory: BrandingHistory | null;
  onClose: () => void;
}

const BrandingDetailModal: React.FC<BrandingDetailModalProps> = ({
  isVisible,
  brandingHistory,
  onClose
}) => {
  const [isClosing, setIsClosing] = useState(false);

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

  if (!isVisible || !brandingHistory) return null;

  return (
    <ModalOverlay isVisible={isVisible} isClosing={isClosing} onClick={handleOverlayClick}>
      <ModalContainer isVisible={isVisible} isClosing={isClosing}>
        <ModalHeader>
          <ModalTitle>브랜딩 상세</ModalTitle>
          <CloseButton onClick={handleClose} aria-label="닫기">
            <CloseIcon src={iconClose} alt="닫기" />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          <BrandSection>
            <BrandingHeader>
              <BrandingTitleSection>
                <BrandingIcon src={iconBrush} alt="브랜딩" />
                <BrandingLabel>브랜드 정보</BrandingLabel>
              </BrandingTitleSection>
              <BrandingDateSection>{brandingHistory.createdAt}</BrandingDateSection>
            </BrandingHeader>

            <ImageSection>
              <BrandImageContainer>
                <BrandImage 
                  src={brandingHistory.imageUrl || 'https://placehold.co/120x120/E8F4FF/1F41BB?text=🌱'} 
                  alt={brandingHistory.title}
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/120x120/E8F4FF/1F41BB?text=🌱';
                  }}
                />
                <ImageOverlay />
              </BrandImageContainer>
            </ImageSection>

            <BrandTitle>{brandingHistory.title}</BrandTitle>
            <BrandDescription>{brandingHistory.description}</BrandDescription>
            <BrandStory>{brandingHistory.story}</BrandStory>
            
            {/* 키워드 섹션 */}
            {(brandingHistory.brandingKeywords?.length || brandingHistory.cropAppealKeywords?.length || brandingHistory.logoImageKeywords?.length) && (
              <KeywordSection>
                {brandingHistory.brandingKeywords && brandingHistory.brandingKeywords.length > 0 && (
                  <KeywordCategory>
                    <KeywordCategoryTitle>브랜드 이미지 키워드</KeywordCategoryTitle>
                    <KeywordList>
                      {brandingHistory.brandingKeywords.map((keywordId, index) => (
                        <KeywordTag key={index}>
                          {getKeywordLabel(keywordId)}
                        </KeywordTag>
                      ))}
                    </KeywordList>
                  </KeywordCategory>
                )}
                
                {brandingHistory.cropAppealKeywords && brandingHistory.cropAppealKeywords.length > 0 && (
                  <KeywordCategory>
                    <KeywordCategoryTitle>작물 매력 키워드</KeywordCategoryTitle>
                    <KeywordList>
                      {brandingHistory.cropAppealKeywords.map((keywordId, index) => (
                        <KeywordTag key={index}>
                          {getKeywordLabel(keywordId)}
                        </KeywordTag>
                      ))}
                    </KeywordList>
                  </KeywordCategory>
                )}
                
                {brandingHistory.logoImageKeywords && brandingHistory.logoImageKeywords.length > 0 && (
                  <KeywordCategory>
                    <KeywordCategoryTitle>로고 이미지 키워드</KeywordCategoryTitle>
                    <KeywordList>
                      {brandingHistory.logoImageKeywords.map((keywordId, index) => (
                        <KeywordTag key={index}>
                          {getKeywordLabel(keywordId)}
                        </KeywordTag>
                      ))}
                    </KeywordList>
                  </KeywordCategory>
                )}
              </KeywordSection>
            )}
          </BrandSection>

        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default BrandingDetailModal; 