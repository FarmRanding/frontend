import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// 애니메이션들
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

const blinkCursor = keyframes`
  to {
    border-right-color: transparent;
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

const Title = styled.h1<{ $isVisible: boolean }>`
  font-family: 'Jalnan 2', sans-serif !important;
  font-weight: 400 !important;
  font-size: 24px !important;
  line-height: 1.67 !important;
  letter-spacing: 4.17% !important;
  text-align: center !important;
  color: #000000 !important;
  margin: 0 !important;
  white-space: pre-line !important;
  word-wrap: break-word !important;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.5s ease;
`;

const StatusText = styled.h2<{ $isVisible: boolean }>`
  font-family: 'Jalnan 2', sans-serif !important;
  font-weight: 400 !important;
  font-size: 20px !important;
  line-height: 1.67 !important;
  letter-spacing: 4.17% !important;
  text-align: center !important;
  color: #000000 !important;
  margin: 0 0 24px 0 !important;
  opacity: ${props => props.$isVisible ? 1 : 0};
  animation: ${props => props.$isVisible ? fadeIn : 'none'} 0.8s ease-out;
  transition: opacity 0.5s ease;
`;

const BrandNameContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
`;

const BrandNameCard = styled.div<{ $isVisible: boolean }>`
  width: 280px;
  height: 80px;
  background: #FFFFFF;
  border: 2px solid #1F41BB;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(31, 65, 187, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transform: ${props => props.$isVisible ? 'scale(1)' : 'scale(0.8)'};
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: ${props => props.$isVisible ? 'scale(1.02)' : 'scale(0.8)'};
    box-shadow: 0 6px 20px rgba(31, 65, 187, 0.25);
  }
`;

const BrandNameText = styled.span<{ $isTyping: boolean }>`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 32px;
  line-height: 1.2;
  color: #1F41BB;
  text-align: center;
  white-space: nowrap;
  overflow: visible;
  border-right: ${props => props.$isTyping ? '3px solid #1F41BB' : 'none'};
  animation: ${props => props.$isTyping ? blinkCursor : 'none'} 1s infinite;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 4px;
  justify-content: center;
  margin-bottom: 24px;
`;

const Dot = styled.div<{ $delay: number }>`
  width: 8px;
  height: 8px;
  background: #1F41BB;
  border-radius: 50%;
  animation: ${pulse} 1.5s infinite;
  animation-delay: ${props => props.$delay}s;
`;

const RegenerateButton = styled.button`
  padding: 12px 24px;
  background: rgba(31, 65, 187, 0.1);
  border: 2px solid #1F41BB;
  border-radius: 8px;
  color: #1F41BB;
  font-family: 'Jalnan 2', sans-serif !important;
  font-weight: 400 !important;
  font-size: 14px !important;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #1F41BB;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(31, 65, 187, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

// 브랜드명 생성 로직
const generateBrandName = (selectedKeywords: string[]): string => {
  const brandNames = [
    '하은 감자', '순한 토마토', '자연 그대로', '정성 한 스푼',
    '햇살 농원', '청정 들판', '미소 작물', '황금 수확',
    '정직한 농부', '신선한 아침', '건강한 선택', '자연의 선물',
    '풍성한 들판', '깨끗한 자연', '온정 농장', '정성 가득'
  ];
  
  return brandNames[Math.floor(Math.random() * brandNames.length)];
};

type GenerationStatus = 'generating' | 'complete';

interface BrandNameGenerationStepProps {
  allKeywords: string[];
  onBrandNameGenerated: (brandName: string) => void;
  onValidationChange: (isValid: boolean) => void;
}

const BrandNameGenerationStep: React.FC<BrandNameGenerationStepProps> = ({
  allKeywords,
  onBrandNameGenerated,
  onValidationChange
}) => {
  const [status, setStatus] = useState<GenerationStatus>('generating');
  const [brandName, setBrandName] = useState<string>('');
  const [displayedName, setDisplayedName] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);

  const startGeneration = () => {
    setStatus('generating');
    setDisplayedName('');
    setIsTyping(false);
    onValidationChange(false);
    
    // 브랜드명 생성 시뮬레이션
    setTimeout(() => {
      const newBrandName = generateBrandName(allKeywords);
      setBrandName(newBrandName);
      setStatus('complete');
      onBrandNameGenerated(newBrandName);
      onValidationChange(true);
      
      // 타이핑 애니메이션 시작
      setTimeout(() => {
        setIsTyping(true);
        let index = 0;
        const typeInterval = setInterval(() => {
          if (index < newBrandName.length) {
            setDisplayedName(newBrandName.slice(0, index + 1));
            index++;
          } else {
            setIsTyping(false);
            clearInterval(typeInterval);
          }
        }, 150);
      }, 500);
    }, 2500);
  };

  useEffect(() => {
    startGeneration();
  }, []);

  const handleRegenerate = () => {
    startGeneration();
  };

  return (
    <Container>
      <Title 
        $isVisible={status === 'generating'} 
        className="brand-title"
        style={{ fontFamily: "'Jalnan 2', sans-serif" }}
      >
        {status === 'generating' && (
          <>
            브랜드명을 생성하고<br />있습니다.
          </>
        )}
      </Title>
      
      <StatusText 
        $isVisible={status === 'complete'} 
        className="status-text"
        style={{ fontFamily: "'Jalnan 2', sans-serif" }}
      >
        브랜드명이 만들어졌어요!
      </StatusText>

      <BrandNameContainer>
        {status === 'generating' ? (
          <LoadingDots>
            <Dot $delay={0} />
            <Dot $delay={0.2} />
            <Dot $delay={0.4} />
          </LoadingDots>
        ) : (
          <BrandNameCard $isVisible={status === 'complete'}>
            <BrandNameText $isTyping={isTyping}>
              {displayedName}
            </BrandNameText>
          </BrandNameCard>
        )}
      </BrandNameContainer>

      {status === 'complete' && (
        <RegenerateButton 
          onClick={handleRegenerate} 
          className="regen-button"
          style={{ fontFamily: "'Jalnan 2', sans-serif" }}
        >
          브랜드명 다시 생성하기
        </RegenerateButton>
      )}
    </Container>
  );
};

export default BrandNameGenerationStep; 