import React from 'react';
import styled from 'styled-components';
import KeywordTag from '../../common/KeywordTag/KeywordTag';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 320px;
  height: 500px;
`;

const Title = styled.h1`
  font-family: 'Jalnan 2', sans-serif !important;
  font-weight: 400 !important;
  font-size: 24px !important;
  line-height: 1.67 !important;
  letter-spacing: 4.17% !important;
  text-align: center !important;
  color: #000000 !important;
  margin: 0 0 64px 0 !important;
  white-space: pre-line !important;
  word-wrap: break-word !important;
  flex-shrink: 0;
`;

const KeywordContainer = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
`;

const KeywordGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 23px 12px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 9px 15px 40px 15px;
  box-sizing: border-box;
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(31, 65, 187, 0.3);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(31, 65, 187, 0.5);
  }
`;

const FadeOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(transparent, #F4FAFF);
  pointer-events: none;
  z-index: 1;
`;

interface Keyword {
  id: string;
  label: string;
}

interface KeywordSelectionStepProps {
  title: string;
  keywords: Keyword[];
  selectedKeywords: string[];
  onChange: (selectedKeywords: string[]) => void;
  onValidationChange: (isValid: boolean) => void;
  minSelection?: number;
  maxSelection?: number;
}

const KeywordSelectionStep: React.FC<KeywordSelectionStepProps> = ({
  title,
  keywords,
  selectedKeywords,
  onChange,
  onValidationChange,
  minSelection = 1,
  maxSelection = 10
}) => {
  const handleKeywordToggle = (keywordId: string) => {
    let newSelected: string[];
    
    if (selectedKeywords.includes(keywordId)) {
      newSelected = selectedKeywords.filter(id => id !== keywordId);
    } else {
      if (selectedKeywords.length >= maxSelection) {
        return; // 최대 선택 개수 초과
      }
      newSelected = [...selectedKeywords, keywordId];
    }
    
    onChange(newSelected);
    onValidationChange(newSelected.length >= minSelection);
  };

  const renderTitle = () => {
    if (title.includes('브랜드 이미지와 관련된')) {
      return (
        <>
          브랜드 이미지와 관련된<br />키워드를 선택해주세요.
        </>
      );
    } else if (title.includes('작물의 매력을 드러낼')) {
      return (
        <>
          작물의 매력을 드러낼<br />키워드를 선택해주세요.
        </>
      );
    } else if (title.includes('로고 이미지와 관련된')) {
      return (
        <>
          로고 이미지와 관련된<br />키워드를 선택해주세요.
        </>
      );
    }
    return title;
  };

  return (
    <Container>
      <Title 
        className="brand-title"
        style={{ fontFamily: "'Jalnan 2', sans-serif" }}
      >
        {renderTitle()}
      </Title>
      
      <KeywordContainer>
        <KeywordGrid>
          {keywords.map((keyword) => (
            <KeywordTag
              key={keyword.id}
              variant={selectedKeywords.includes(keyword.id) ? 'selected' : 'default'}
              onClick={() => handleKeywordToggle(keyword.id)}
            >
              {keyword.label}
            </KeywordTag>
          ))}
        </KeywordGrid>
        <FadeOverlay />
      </KeywordContainer>
    </Container>
  );
};

export default KeywordSelectionStep; 