import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import iconDownload from '../../../assets/icon-download.svg';
import iconCopy from '../../../assets/icon-copy.svg';
import MoreButton from '../MoreButton/MoreButton';

// 로딩 애니메이션
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
`;

const BrandResultCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 28px;
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0px 4px 20px 0px rgba(31, 65, 187, 0.08);
  border: 1px solid rgba(31, 65, 187, 0.08);
  box-sizing: border-box;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #1F41BB 0%, #4F46E5 100%);
  }
`;

const ContentFrame = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
  width: 100%;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 8px;
  width: 100%;
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

const ImageContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0px 4px 16px 0px rgba(31, 65, 187, 0.12);
  background: #f0f4ff;
`;

const BrandImage = styled.img<{ $isLoading?: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: ${props => props.$isLoading ? 0 : 1};

  &:hover {
    transform: scale(1.02);
  }
`;

const ImageLoadingContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f0f4ff;
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid rgba(31, 65, 187, 0.1);
  border-top: 3px solid #1F41BB;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.div`
  font-family: 'Jalnan 2', sans-serif;
  font-size: 12px;
  color: #1F41BB;
  text-align: center;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8f1ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Jalnan 2', sans-serif;
  font-size: 14px;
  color: #9CA3AF;
  text-align: center;
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

  ${ImageContainer}:hover & {
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

const StoryField = styled.div<{ isExpanded: boolean; isPremium: boolean }>`
  display: flex;
  align-items: flex-start;
  padding: 16px;
  width: 100%;
  min-height: 60px;
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

const StoryText = styled.span<{ isExpanded: boolean }>`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 13px;
  line-height: 1.6;
  text-align: left;
  color: #4a4a4a;
  width: 100%;
  display: ${props => props.isExpanded ? 'block' : '-webkit-box'};
  -webkit-line-clamp: ${props => props.isExpanded ? 'none' : '2'};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: keep-all;
`;

const StoryContainer = styled.div`
  width: 100%;
  position: relative;
`;

export interface BrandResultData {
  brandName: string;
  promotionText: string;
  story: string;
  imageUrl?: string;
}

interface BrandResultProps {
  data: BrandResultData;
  isPremium?: boolean;
  onCopy?: (field: 'brandName' | 'promotionText' | 'story', value: string) => void;
  onDownload?: (imageUrl: string) => void;
  className?: string;
}

const BrandResult: React.FC<BrandResultProps> = ({
  data,
  isPremium = false,
  onCopy,
  onDownload,
  className,
}) => {
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(!!data.imageUrl);
  const [imageError, setImageError] = useState(false);

  const handleCopy = (field: 'brandName' | 'promotionText' | 'story', value: string) => {
    navigator.clipboard.writeText(value);
    onCopy?.(field, value);
  };

  const handleDownload = () => {
    if (data.imageUrl && !isImageLoading && !imageError) {
      onDownload?.(data.imageUrl);
    }
  };

  const handleMoreClick = () => {
    setIsStoryExpanded(!isStoryExpanded);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
  };

  // 이미지 URL이 변경될 때 로딩 상태 초기화
  React.useEffect(() => {
    if (data.imageUrl) {
      setIsImageLoading(true);
      setImageError(false);
    } else {
      setIsImageLoading(false);
      setImageError(false);
    }
  }, [data.imageUrl]);

  const showMoreButton = !isPremium;

  const renderImageContent = () => {
    // 이미지 URL이 없는 경우 (아직 생성 중)
    if (!data.imageUrl) {
      return (
        <ImageLoadingContainer>
          <LoadingSpinner />
          <LoadingText>이미지 생성 중...</LoadingText>
        </ImageLoadingContainer>
      );
    }

    // 이미지 로딩 중
    if (isImageLoading) {
      return (
        <ImageLoadingContainer>
          <LoadingSpinner />
          <LoadingText>이미지 로딩 중...</LoadingText>
        </ImageLoadingContainer>
      );
    }

    // 이미지 로딩 실패
    if (imageError) {
      return (
        <PlaceholderImage>
          브랜드 이미지
          <br />
          생성 완료
        </PlaceholderImage>
      );
    }

    // 정상적인 이미지 표시
    return null;
  };

  return (
    <BrandResultCard className={className}>
      <ContentFrame>
        <FieldContainer>
          <LabelContainer>
            <FieldLabel>브랜드명</FieldLabel>
          </LabelContainer>
          <InputField>
            <InputText>{data.brandName}</InputText>
          </InputField>
        </FieldContainer>

        <ImageContainer>
          {renderImageContent()}
          {data.imageUrl && (
            <BrandImage 
              src={data.imageUrl} 
              alt="브랜드 이미지" 
              $isLoading={isImageLoading}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
          {data.imageUrl && !isImageLoading && !imageError && (
            <DownloadButton onClick={handleDownload}>
              <DownloadIcon src={iconDownload} alt="다운로드" />
            </DownloadButton>
          )}
        </ImageContainer>

        <FieldContainer>
          <LabelContainer>
            <FieldLabel>홍보 문구</FieldLabel>
            <CopyButton onClick={() => handleCopy('promotionText', data.promotionText)}>
              <CopyIcon src={iconCopy} alt="복사" />
            </CopyButton>
          </LabelContainer>
          <InputField>
            <InputText>{data.promotionText}</InputText>
          </InputField>
        </FieldContainer>

        <FieldContainer>
          <LabelContainer>
            <FieldLabel>스토리</FieldLabel>
            <CopyButton onClick={() => handleCopy('story', data.story)}>
              <CopyIcon src={iconCopy} alt="복사" />
            </CopyButton>
          </LabelContainer>
          <StoryContainer>
            <StoryField isExpanded={isStoryExpanded} isPremium={isPremium}>
              <StoryText isExpanded={isStoryExpanded}>
                {data.story}
              </StoryText>
            </StoryField>
            {showMoreButton && (
              <MoreButton onClick={handleMoreClick}>
                {isStoryExpanded ? '접기' : '프리미엄 구독하고 더 보기'}
              </MoreButton>
            )}
          </StoryContainer>
        </FieldContainer>
      </ContentFrame>
    </BrandResultCard>
  );
};

export default BrandResult; 