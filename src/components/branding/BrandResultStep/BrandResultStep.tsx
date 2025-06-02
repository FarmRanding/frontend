import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import BrandResult from '../../common/BrandResult/BrandResult';
import KeywordTag from '../../common/KeywordTag/KeywordTag';
import { type BrandResultData } from '../../common/BrandResult/BrandResult';
import { BRAND_IMAGE_KEYWORDS, CROP_APPEAL_KEYWORDS, LOGO_IMAGE_KEYWORDS } from '../../../constants/keywords';

// 키워드 ID를 라벨로 변환하는 유틸리티 함수
const getKeywordLabel = (keywordId: string): string => {
  const allKeywords = [...BRAND_IMAGE_KEYWORDS, ...CROP_APPEAL_KEYWORDS, ...LOGO_IMAGE_KEYWORDS];
  const keyword = allKeywords.find(k => k.id === keywordId);
  return keyword ? keyword.label : keywordId;
};

// 애니메이션
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
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
  margin: 0 0 64px 0;
  white-space: pre-line !important;
  animation: ${fadeIn} 0.8s ease-out;
`;

const BrandResultContainer = styled.div`
  margin-bottom: 48px;
  animation: ${fadeInUp} 0.8s ease-out 0.2s both;
`;

const KeywordSection = styled.div`
  width: 100%;
  max-width: 100%;
  margin-bottom: 48px;
  animation: ${fadeInUp} 0.8s ease-out 0.4s both;
`;

const KeywordSectionTitle = styled.h3`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.4;
  color: #000000;
  text-align: center;
  margin: 0 0 24px 0;
`;

const KeywordContainer = styled.div`
  position: relative;
`;

const KeywordGrid = styled.div<{ $showAll: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 100%;
  max-height: ${props => props.$showAll ? 'none' : '120px'};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const KeywordWrapper = styled.div<{ $index: number }>`
  animation: ${fadeIn} 0.5s ease-out ${props => 0.6 + props.$index * 0.05}s both;
`;

const ShowMoreButton = styled.button<{ $hasMore: boolean }>`
  display: ${props => props.$hasMore ? 'flex' : 'none'};
  width: 100%;
  height: 40px;
  background: rgba(31, 65, 187, 0.1);
  border: 1px solid #1F41BB;
  border-radius: 8px;
  color: #1F41BB;
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 14px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: #1F41BB;
    color: white;
  }
`;

const CompleteButton = styled.button`
  width: 100%;
  max-width: 300px;
  padding: 17px;
  background: linear-gradient(135deg, #1F41BB 0%, #4F46E5 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-top: 32px;
  animation: ${fadeInUp} 0.8s ease-out 0.6s both;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(31, 65, 187, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const ButtonText = styled.span`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.18;
  color: #ffffff;
  position: relative;
  z-index: 1;
`;

// 브랜드 데이터 생성 함수
const generateBrandData = (brandName: string): BrandResultData => {
  return {
    brandName: brandName,
    promotionText: `${brandName}과 함께하는 건강한 삶`,
    story: `${brandName}은 정성과 사랑으로 키운 특별한 농산물입니다. 자연 그대로의 맛과 영양을 담아, 건강한 식탁을 만들어가는 브랜드입니다.`,
    imageUrl: "https://source.unsplash.com/200x200/?logo"
  };
};

interface BrandResultStepProps {
  brandName: string;
  allKeywords: string[];
  onComplete: () => void;
}

const BrandResultStep: React.FC<BrandResultStepProps> = ({
  brandName,
  allKeywords,
  onComplete
}) => {
  const [showAllKeywords, setShowAllKeywords] = useState(false);
  const brandData = generateBrandData(brandName);

  const handleCopy = (field: string, value: string) => {
    navigator.clipboard.writeText(value);
    console.log(`${field} 복사됨:`, value);
  };

  const handleDownload = (imageUrl: string) => {
    console.log('이미지 다운로드:', imageUrl);
  };

  const handleShowMore = () => {
    setShowAllKeywords(!showAllKeywords);
  };

  const visibleKeywords = showAllKeywords ? allKeywords : allKeywords.slice(0, 6);
  const hasMoreKeywords = allKeywords.length > 6;

  return (
    <Container>
      <Title>브랜딩이 완료되었습니다!</Title>
      
      <BrandResultContainer>
        <BrandResult
          data={brandData}
          onCopy={handleCopy}
          onDownload={handleDownload}
        />
      </BrandResultContainer>

      <KeywordSection>
        <KeywordSectionTitle>선택한 키워드</KeywordSectionTitle>
        <KeywordContainer>
          <KeywordGrid $showAll={showAllKeywords}>
            {visibleKeywords.map((keyword, index) => (
              <KeywordWrapper key={keyword} $index={index}>
                <KeywordTag
                  variant="selected"
                  onClick={() => {}}
                >
                  {getKeywordLabel(keyword)}
                </KeywordTag>
              </KeywordWrapper>
            ))}
          </KeywordGrid>
          <ShowMoreButton 
            $hasMore={hasMoreKeywords}
            onClick={handleShowMore}
          >
            {showAllKeywords ? '접기' : '더보기'}
          </ShowMoreButton>
        </KeywordContainer>
      </KeywordSection>

      <CompleteButton onClick={onComplete}>
        <ButtonText>브랜딩 완료</ButtonText>
      </CompleteButton>
    </Container>
  );
};

export default BrandResultStep; 