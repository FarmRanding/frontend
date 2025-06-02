import React, { useState } from 'react';
import styled from 'styled-components';
import iconDownload from '../../../assets/icon-download.svg';
import iconCopy from '../../../assets/icon-copy.svg';
import MoreButton from '../MoreButton/MoreButton';

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
`;

const BrandImage = styled.img`
  width: 100%;
  height: 100%;
  background: #f0f4ff;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const DownloadButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border: none;
  border-radius: 8px;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const DownloadIcon = styled.img`
  width: 16px;
  height: 16px;
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

  const handleCopy = (field: 'brandName' | 'promotionText' | 'story', value: string) => {
    navigator.clipboard.writeText(value);
    onCopy?.(field, value);
  };

  const handleDownload = () => {
    if (data.imageUrl) {
      onDownload?.(data.imageUrl);
    }
  };

  const handleMoreClick = () => {
    setIsStoryExpanded(!isStoryExpanded);
  };

  const showMoreButton = !isPremium;

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
          <BrandImage 
            src={data.imageUrl || 'https://placehold.co/200x200/a4a4a4/ffffff?text=Brand+Image'} 
            alt="브랜드 이미지" 
          />
          <DownloadButton onClick={handleDownload}>
            <DownloadIcon src={iconDownload} alt="다운로드" />
          </DownloadButton>
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