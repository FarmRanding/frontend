import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Header from '../../components/common/Header';
import PriceQuoteStep from '../../components/pricing/PriceQuoteStep';
import PriceResultStep from '../../components/pricing/PriceResultStep';

// 애니메이션
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

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const PageContainer = styled.div`
  width: 100%;
  min-height: 874px;
  background: #F4FAFF;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 107px 16px 30px 16px; /* 56px(Header) + 51px(기존) = 107px */
  flex: 1;
  max-width: 100%;
`;

const ProgressBar = styled.div`
  width: 100%;
  max-width: 320px;
  height: 4px;
  background: rgba(31, 65, 187, 0.1);
  border-radius: 2px;
  margin-bottom: 24px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #1F41BB, #4F46E5);
  border-radius: 2px;
  width: ${props => props.$progress}%;
  transition: width 0.5s ease;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  gap: 8px;
`;

const StepText = styled.span`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #666;
`;

const StepNumber = styled.span`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #1F41BB;
`;

const StepContainer = styled.div<{ $direction: 'left' | 'right' }>`
  width: 100%;
  max-width: 320px;
  animation: ${props => props.$direction === 'left' ? slideInLeft : slideInRight} 0.5s ease-out;
`;

const NavigationContainer = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 300px;
  margin-top: 40px;
`;

const PrevButton = styled.button`
  flex: 1;
  padding: 17px;
  background: #9E9E9E;
  border: none;
  border-radius: 8px;
  color: white;
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #757575;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const NextButton = styled.button<{ $disabled: boolean }>`
  flex: 1;
  padding: 17px;
  background: ${props => props.$disabled ? '#CCCCCC' : '#1F41BB'};
  border: none;
  border-radius: 8px;
  color: white;
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$disabled ? '#CCCCCC' : '#1a3a9e'};
    transform: ${props => props.$disabled ? 'none' : 'translateY(-1px)'};
  }

  &:active {
    transform: ${props => props.$disabled ? 'none' : 'translateY(0)'};
  }
`;

// 가격 제안 단계 정의
export enum PriceFlowStep {
  QUOTE_INPUT = 0,
  RESULT = 1
}

// 가격 제안 데이터 타입
export interface PriceQuoteData {
  cropName: string;
  variety: string;
  grade: string;
  harvestDate: Date | null;
  estimatedPrice: number;
}

const PriceQuoteFlow: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<PriceFlowStep>(PriceFlowStep.QUOTE_INPUT);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right');
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
  const [priceQuoteData, setPriceQuoteData] = useState<PriceQuoteData>({
    cropName: '',
    variety: '',
    grade: '',
    harvestDate: null,
    estimatedPrice: 0
  });

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleMypageClick = () => {
    navigate('/mypage');
  };

  const handleNext = () => {
    if (currentStep < PriceFlowStep.RESULT && isCurrentStepValid) {
      setAnimationDirection('left');
      setCurrentStep(currentStep + 1);
      setIsCurrentStepValid(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > PriceFlowStep.QUOTE_INPUT) {
      setAnimationDirection('right');
      setCurrentStep(currentStep - 1);
      setIsCurrentStepValid(true);
    }
  };

  const updatePriceQuoteData = (updates: Partial<PriceQuoteData>) => {
    setPriceQuoteData(prev => ({ ...prev, ...updates }));
  };

  const getProgress = () => {
    return ((currentStep + 1) / Object.keys(PriceFlowStep).length * 2) * 100;
  };

  const getCurrentStepComponent = () => {
    switch (currentStep) {
      case PriceFlowStep.QUOTE_INPUT:
        return (
          <PriceQuoteStep
            data={{
              cropName: priceQuoteData.cropName,
              variety: priceQuoteData.variety,
              grade: priceQuoteData.grade,
              harvestDate: priceQuoteData.harvestDate
            }}
            onChange={(data) => updatePriceQuoteData(data)}
            onValidationChange={setIsCurrentStepValid}
            onPriceGenerated={(price) => updatePriceQuoteData({ estimatedPrice: price })}
          />
        );
      case PriceFlowStep.RESULT:
        return (
          <PriceResultStep
            data={priceQuoteData}
            onComplete={() => navigate('/mypage', { state: { initialTab: 'pricing' } })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <Header 
        onClickLogo={handleLogoClick}
        onClickMypage={handleMypageClick}
      />

      <ContentArea>
        <ProgressBar>
          <ProgressFill $progress={getProgress()} />
        </ProgressBar>

        <StepIndicator>
          <StepText>단계</StepText>
          <StepNumber>{currentStep + 1}</StepNumber>
          <StepText>/ 2</StepText>
        </StepIndicator>

        <StepContainer $direction={animationDirection}>
          {getCurrentStepComponent()}
        </StepContainer>

        {/* 네비게이션 버튼들 - RESULT 단계에서는 숨김 */}
        {currentStep !== PriceFlowStep.RESULT && (
          <NavigationContainer>
            {currentStep > PriceFlowStep.QUOTE_INPUT && (
              <PrevButton onClick={handlePrev}>
                이전
              </PrevButton>
            )}
            
            {currentStep < PriceFlowStep.RESULT && (
              <NextButton 
                $disabled={!isCurrentStepValid}
                onClick={handleNext}
              >
                가격 확인
              </NextButton>
            )}
          </NavigationContainer>
        )}
      </ContentArea>
    </PageContainer>
  );
};

export default PriceQuoteFlow; 