import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import iconClose from '../../../assets/icon-cancel.svg';
import iconBrush from '../../../assets/icon-brush.svg';
import iconCopy from '../../../assets/icon-copy.svg';
import iconDownload from '../../../assets/icon-download.svg';
import { getKeywordLabel } from '../../../constants/keywords';
import { useNotification } from '../../../contexts/NotificationContext';
import { BrandingHistory as BrandingHistoryType } from '../../../types/branding';
import { fetchCurrentUserFromServer, getCurrentUser } from '../../../api/auth';
import MoreButton from '../MoreButton/MoreButton';

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
  width: 200px;
  height: 200px;
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

const BrandStory = styled.div`
  padding: 16px;
  background: #fafbff;
  border-radius: 12px;
  border: 1px solid rgba(31, 65, 187, 0.1);
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.6;
  text-align: left;
  color: #2d2d2d;
  white-space: pre-wrap;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(31, 65, 187, 0.2);
    background: #f7f9ff;
  }
`;

const StoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StoryField = styled.div<{ isExpanded: boolean; canAccess: boolean }>`
  padding: 16px;
  background: #fafbff;
  border-radius: 12px;
  border: 1px solid rgba(31, 65, 187, 0.1);
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.6;
  color: #2d2d2d;
  white-space: pre-wrap;
  position: relative;
  transition: all 0.2s ease;
  
  ${props => props.canAccess && !props.isExpanded && `
    max-height: 120px;
    overflow: hidden;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40px;
      background: linear-gradient(transparent, #fafbff);
      pointer-events: none;
    }
  `}

  &:hover {
    border-color: rgba(31, 65, 187, 0.2);
    background: #f7f9ff;
  }
`;

const KeywordSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 24px;
`;

const KeywordSectionTitle = styled.h3`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.4;
  color: #000000;
  text-align: center;
  margin: 0 0 24px 0;
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
  color: #1F41BB;
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

const LabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-self: stretch;
  gap: 8px;
  width: 100%;
  align-items: center;
`;

const FieldLabel = styled.span`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 1.4;
  text-align: left;
  color: #1a1a1a;
  flex: 1;
`;

const CopyButton = styled.button`
  width: 20px;
  height: 20px;
  background: rgba(31, 65, 187, 0.1);
  border: none;
  border-radius: 6px;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(31, 65, 187, 0.2);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const CopyIcon = styled.img`
  width: 12px;
  height: 12px;
  opacity: 0.7;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 8px;
  width: 100%;
`;

const InputField = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  width: 100%;
  min-height: 44px;
  background: #fafbff;
  border-radius: 12px;
  border: 1px solid rgba(31, 65, 187, 0.1);
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(31, 65, 187, 0.2);
    background: #f7f9ff;
  }
`;

const InputText = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.5;
  text-align: left;
  color: #2d2d2d;
  width: 100%;
  word-break: keep-all;
`;

const DownloadButton = styled.button`
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border: none;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

  ${BrandImageContainer}:hover & {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const DownloadIcon = styled.img`
  width: 20px;
  height: 20px;
  filter: brightness(0) saturate(100%) invert(25%) sepia(98%) saturate(1653%) hue-rotate(221deg) brightness(96%) contrast(91%);
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
  brandingHistory: BrandingHistoryType | null;
  onClose: () => void;
}

const BrandingDetailModal: React.FC<BrandingDetailModalProps> = ({
  isVisible,
  brandingHistory,
  onClose
}) => {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo, showWarning } = useNotification();
  const [isClosing, setIsClosing] = useState(false);
  
  // 🔥 멤버십 상태 및 스토리 표시 관련 상태
  const [userMembershipType, setUserMembershipType] = useState<string>('FREE');
  const [canAccessStory, setCanAccessStory] = useState<boolean>(false);
  const [isStoryExpanded, setIsStoryExpanded] = useState<boolean>(false);

  // 🔥 사용자 멤버십 정보 로드
  useEffect(() => {
    const loadUserMembershipInfo = async () => {
      try {
        const currentUser = await fetchCurrentUserFromServer();
        if (currentUser) {
          let membershipTypeStr = '';
          
          // 멤버십 타입 정규화
          if (typeof currentUser.membershipType === 'string') {
            membershipTypeStr = currentUser.membershipType;
          } else if (currentUser.membershipType && typeof currentUser.membershipType === 'object' && currentUser.membershipType.name) {
            membershipTypeStr = currentUser.membershipType.name;
          } else {
            membershipTypeStr = currentUser.membershipType?.toString() || 'FREE';
          }
          
          // 대소문자 무관하게 체크
          const normalizedMembershipType = membershipTypeStr.toUpperCase();
          const hasStoryAccess = normalizedMembershipType === 'PREMIUM_PLUS' || 
                                normalizedMembershipType === 'PREMIUMPLUS' ||
                                normalizedMembershipType.includes('PREMIUM_PLUS') ||
                                normalizedMembershipType.includes('PREMIUMPLUS');
          
          setUserMembershipType(membershipTypeStr);
          setCanAccessStory(hasStoryAccess);
          
          console.log('🔍 브랜딩 상세 - 사용자 멤버십 정보 로드:', membershipTypeStr);
          console.log('🔍 브랜딩 상세 - 정규화된 멤버십 타입:', normalizedMembershipType);
          console.log('🔍 브랜딩 상세 - 브랜드 스토리 접근 권한:', hasStoryAccess);
        } else {
          // 로컬 정보 사용
          const localUser = getCurrentUser();
          if (localUser) {
            let membershipTypeStr = '';
            
            if (typeof localUser.membershipType === 'string') {
              membershipTypeStr = localUser.membershipType;
            } else if (localUser.membershipType && typeof localUser.membershipType === 'object' && localUser.membershipType.name) {
              membershipTypeStr = localUser.membershipType.name;
            } else {
              membershipTypeStr = localUser.membershipType?.toString() || 'FREE';
            }
            
            const normalizedMembershipType = membershipTypeStr.toUpperCase();
            const hasStoryAccess = normalizedMembershipType === 'PREMIUM_PLUS' || 
                                  normalizedMembershipType === 'PREMIUMPLUS' ||
                                  normalizedMembershipType.includes('PREMIUM_PLUS') ||
                                  normalizedMembershipType.includes('PREMIUMPLUS');
            
            setUserMembershipType(membershipTypeStr);
            setCanAccessStory(hasStoryAccess);
            
            console.log('🔍 브랜딩 상세 - 로컬 멤버십 정보:', membershipTypeStr);
            console.log('🔍 브랜딩 상세 - 로컬 스토리 접근 권한:', hasStoryAccess);
          }
        }
      } catch (error) {
        console.error('❌ 브랜딩 상세 - 사용자 정보 로드 실패:', error);
        setUserMembershipType('FREE');
        setCanAccessStory(false);
      }
    };
    
    if (isVisible) {
      loadUserMembershipInfo();
    }
  }, [isVisible]);

  // 🔥 스토리 미리보기 텍스트 생성 (BrandResult와 동일한 로직)
  const getPreviewText = (text: string, maxLength: number = 80): string => {
    if (text.length <= maxLength) return text;
    
    // 문장 단위로 자르기 (마침표, 느낌표, 물음표 기준)
    const sentences = text.split(/([.!?])/);
    let preview = '';
    
    for (let i = 0; i < sentences.length; i += 2) {
      const sentence = sentences[i] + (sentences[i + 1] || '');
      if ((preview + sentence).length > maxLength) break;
      preview += sentence;
    }
    
    // 문장 단위로 자를 수 없으면 글자 수로 자르기
    if (preview.length === 0) {
      preview = text.substring(0, maxLength);
    }
    
    return preview.trim() + '...';
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

  const handleCopy = async (field: 'brandName' | 'promotionText' | 'story', value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      
      const fieldNames = {
        brandName: '브랜드명',
        promotionText: '홍보 문구',
        story: '스토리'
      };
      
      showSuccess('복사 완료', `${fieldNames[field]}이(가) 클립보드에 복사되었습니다.`);
    } catch (error) {
      console.error('클립보드 복사 실패:', error);
      showSuccess('복사 완료', '텍스트가 복사되었습니다.');
    }
  };

  const handleDownload = (imageUrl: string) => {
    try {
      // 이미지 다운로드 로직
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${brandingHistory?.title || 'brand'}_logo.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showSuccess('다운로드 시작', '브랜드 로고 이미지 다운로드가 시작되었습니다.');
      console.log('다운로드 시작:', imageUrl);
    } catch (error) {
      console.error('이미지 다운로드 실패:', error);
      showError('다운로드 실패', '이미지 다운로드에 실패했습니다.');
    }
  };

  // 🔥 더보기 핸들러
  const handleMoreClick = () => {
    if (canAccessStory) {
      setIsStoryExpanded(!isStoryExpanded);
    } else {
      // 마이페이지 멤버십 탭으로 이동
      navigate('/mypage', { state: { initialTab: 'membership' } });
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

            {/* 브랜드명 필드 */}
            <FieldContainer>
              <LabelContainer>
                <FieldLabel>브랜드명</FieldLabel>
                <CopyButton onClick={() => handleCopy('brandName', brandingHistory.title)}>
                  <CopyIcon src={iconCopy} alt="복사" />
                </CopyButton>
              </LabelContainer>
              <InputField>
                <InputText>{brandingHistory.title}</InputText>
              </InputField>
            </FieldContainer>

            <ImageSection>
              <BrandImageContainer>
                <BrandImage 
                  src={brandingHistory.imageUrl || 'https://placehold.co/200x200/E8F4FF/1F41BB?text=🌱'} 
                  alt={brandingHistory.title}
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/200x200/E8F4FF/1F41BB?text=🌱';
                  }}
                />
                <ImageOverlay />
                {brandingHistory.imageUrl && (
                  <DownloadButton onClick={() => handleDownload(brandingHistory.imageUrl!)}>
                    <DownloadIcon src={iconDownload} alt="다운로드" />
                  </DownloadButton>
                )}
              </BrandImageContainer>
            </ImageSection>

            {/* 홍보 문구 필드 */}
            <FieldContainer>
              <LabelContainer>
                <FieldLabel>홍보 문구</FieldLabel>
                <CopyButton onClick={() => handleCopy('promotionText', brandingHistory.description)}>
                  <CopyIcon src={iconCopy} alt="복사" />
                </CopyButton>
              </LabelContainer>
              <InputField>
                <InputText>{brandingHistory.description}</InputText>
              </InputField>
            </FieldContainer>

            {/* 스토리 필드 */}
            <FieldContainer>
              <LabelContainer>
                <FieldLabel>스토리</FieldLabel>
                <CopyButton onClick={() => handleCopy('story', brandingHistory.story)}>
                  <CopyIcon src={iconCopy} alt="복사" />
                </CopyButton>
              </LabelContainer>
              <StoryContainer>
                <StoryField isExpanded={isStoryExpanded} canAccess={canAccessStory}>
                  {!canAccessStory ? 
                    getPreviewText(brandingHistory.story) : 
                    brandingHistory.story
                  }
                </StoryField>
                {!canAccessStory && (
                  <MoreButton onClick={handleMoreClick}>
                    프리미엄 플러스 구독하고 더 보기
                  </MoreButton>
                )}
                {canAccessStory && brandingHistory.story.length > 120 && (
                  <MoreButton onClick={handleMoreClick}>
                    {isStoryExpanded ? '접기' : '더보기'}
                  </MoreButton>
                )}
              </StoryContainer>
            </FieldContainer>
            
            {/* 키워드 섹션 */}
            {(brandingHistory.brandingKeywords?.length || brandingHistory.cropAppealKeywords?.length || brandingHistory.logoImageKeywords?.length) && (
              <KeywordSection>
                <KeywordSectionTitle>선택한 키워드</KeywordSectionTitle>
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