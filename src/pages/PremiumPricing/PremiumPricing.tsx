import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Header from '../../components/common/Header/Header';
import PremiumPriceStep from '../../components/pricing/PremiumPriceStep/PremiumPriceStep';
import PremiumResultStep from '../../components/pricing/PremiumResultStep/PremiumResultStep';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

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
  max-width: 500px;
  height: 4px;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 2px;
  margin-bottom: 24px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #8B5CF6, #7C3AED);
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
  color: #8B5CF6;
`;

const StepContainer = styled.div<{ $direction: 'left' | 'right' }>`
  width: 100%;
  max-width: 500px;
  animation: ${props => props.$direction === 'left' ? slideInLeft : slideInRight} 0.5s ease-out;
`;

const NavigationContainer = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 400px;
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
  background: ${props => props.$disabled ? '#CCCCCC' : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'};
  border: none;
  border-radius: 8px;
  color: white;
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$disabled ? '#CCCCCC' : 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)'};
    transform: ${props => props.$disabled ? 'none' : 'translateY(-1px)'};
  }

  &:active {
    transform: ${props => props.$disabled ? 'none' : 'translateY(0)'};
  }
`;

// 로딩 화면 컴포넌트들
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
  max-width: 500px;
  padding: 40px 20px;
  animation: ${fadeIn} 0.8s ease-out;
`;

const LoadingText = styled.div`
  font-family: 'Jalnan 2', sans-serif;
  font-size: 18px;
  color: #8B5CF6;
  text-align: center;
`;

const LoadingSubText = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #666;
  text-align: center;
  max-width: 280px;
  line-height: 1.4;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 4px;
  justify-content: center;
`;

const pulse = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

const Dot = styled.div<{ $delay: number }>`
  width: 8px;
  height: 8px;
  background: #8B5CF6;
  border-radius: 50%;
  animation: ${pulse} 1.5s infinite;
  animation-delay: ${props => props.$delay}s;
`;

// 프리미엄 가격 제안 단계 정의
export enum PremiumPriceFlowStep {
  PRICE_INPUT = 0,
  RESULT = 1
}

// 프리미엄 가격 제안 데이터 타입
export interface PremiumPriceData {
  productItemCode: string;
  productVarietyCode: string;
  productName: string;
  location: string;
  date: Date | null;
  suggestedPrice: number;
  retailPrice: number;
  wholesalePrice: number;
  priceCalculation?: {
    retailAverage: number;
    wholesaleAverage: number;
    priceRatio: number;
    calculationFormula: string;
    explanation: string;
  };
  marketAnalysis?: {
    marketTrend: string;
    priceFactors: string[];
    recommendations: string[];
  };
}

interface PremiumPricingProps {
  className?: string;
}

const PremiumPricing: React.FC<PremiumPricingProps> = ({ className }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showError } = useNotification();
  const [currentStep, setCurrentStep] = useState<PremiumPriceFlowStep>(PremiumPriceFlowStep.PRICE_INPUT);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right');
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [premiumPriceData, setPremiumPriceData] = useState<PremiumPriceData>({
    productItemCode: '',
    productVarietyCode: '',
    productName: '',
    location: '',
    date: null,
    suggestedPrice: 0,
    retailPrice: 0,
    wholesalePrice: 0
  });

  // 멤버십 확인
  React.useEffect(() => {
    if (user?.membershipType === 'FREE') {
      showError('프리미엄 멤버십 필요', '프리미엄 가격 제안은 프리미엄 이상 멤버십에서 이용할 수 있습니다.');
      navigate('/mypage?tab=membership');
    }
  }, [user, navigate, showError]);

  const handleLogoClick = () => {
    navigate('/home');
  };

  const handleMypageClick = () => {
    navigate('/mypage');
  };

  const handleNext = async () => {
    if (currentStep < PremiumPriceFlowStep.RESULT && isCurrentStepValid) {
      // 가격이 아직 생성되지 않았다면 먼저 생성
      if (premiumPriceData.suggestedPrice === 0) {
        setIsLoading(true);
        try {
          // 프리미엄 가격 제안 API 호출
          const { premiumPriceService } = await import('../../api/premiumPriceService');
          
          const request = {
            productGroupCode: '', // 사용하지 않음
            productItemCode: premiumPriceData.productItemCode,
            productVarietyCode: premiumPriceData.productVarietyCode,
            location: premiumPriceData.location,
            date: premiumPriceData.date?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
          };
          
          const result = await premiumPriceService.createSuggestion(request);
          
          updatePremiumPriceData({
            suggestedPrice: Number(result.suggestedPrice),
            retailPrice: Number(result.retail5DayAvg),
            wholesalePrice: Number(result.wholesale5DayAvg),
            productName: premiumPriceData.productName, // 기존 입력값 유지
            priceCalculation: {
              retailAverage: Number(result.retail5DayAvg),
              wholesaleAverage: Number(result.wholesale5DayAvg),
              priceRatio: Number(result.alphaRatio),
              calculationFormula: '직거래 제안가 = min(소매 5일 평균 × 0.95, max(도매 5일 평균 × 1.20, 도매 5일 평균 × α × 0.5 × 0.9))',
              explanation: result.calculationReason
            },
            marketAnalysis: {
              marketTrend: '최근 5일간의 가격 동향을 분석한 결과입니다.',
              priceFactors: ['계절적 요인', '공급량 변화', '소비자 수요'],
              recommendations: ['적정 가격대에서 판매하여 경쟁력 확보', '품질 관리를 통한 프리미엄 가격 유지']
            }
          });
          
        } catch (error: any) {
          console.error('프리미엄 가격 제안 실패:', error);
          showError('오류', error.message || '프리미엄 가격 제안에 실패했습니다. 잠시 후 다시 시도해주세요.');
          setIsLoading(false);
          return; // 다음 단계로 진행하지 않음
        } finally {
          setIsLoading(false);
        }
      }
      
      setAnimationDirection('left');
      setCurrentStep(currentStep + 1);
      setIsCurrentStepValid(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > PremiumPriceFlowStep.PRICE_INPUT) {
      setAnimationDirection('right');
      setCurrentStep(currentStep - 1);
      setIsCurrentStepValid(true);
    }
  };

  const updatePremiumPriceData = (updates: Partial<PremiumPriceData>) => {
    setPremiumPriceData(prev => ({ ...prev, ...updates }));
  };

  const getProgress = () => {
    return ((currentStep + 1) / Object.keys(PremiumPriceFlowStep).length * 2) * 100;
  };

  const getCurrentStepComponent = () => {
    // 로딩 중일 때는 로딩 화면 표시
    if (isLoading) {
      return (
        <LoadingContainer>
          <LoadingText>프리미엄 가격 분석 중...</LoadingText>
          <LoadingSubText>
            KAMIS 데이터와 AI 분석을 통한 정확한 직거래 가격을 계산하고 있습니다.
          </LoadingSubText>
          <LoadingDots>
            <Dot $delay={0} />
            <Dot $delay={0.2} />
            <Dot $delay={0.4} />
          </LoadingDots>
        </LoadingContainer>
      );
    }

    switch (currentStep) {
      case PremiumPriceFlowStep.PRICE_INPUT:
        return (
          <PremiumPriceStep
            data={{
              productItemCode: premiumPriceData.productItemCode,
              productVarietyCode: premiumPriceData.productVarietyCode,
              productName: premiumPriceData.productName,
              location: premiumPriceData.location,
              date: premiumPriceData.date
            }}
            onChange={(data) => updatePremiumPriceData(data)}
            onValidationChange={setIsCurrentStepValid}
            onPriceGenerated={(priceData) => updatePremiumPriceData(priceData)}
          />
        );
      case PremiumPriceFlowStep.RESULT:
        return (
          <PremiumResultStep
            data={premiumPriceData}
            onComplete={() => navigate('/mypage?tab=premium-pricing')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PageContainer className={className}>
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

        {/* 네비게이션 버튼들 - RESULT 단계나 로딩 중에는 숨김 */}
        {currentStep !== PremiumPriceFlowStep.RESULT && !isLoading && (
          <NavigationContainer>
            {currentStep > PremiumPriceFlowStep.PRICE_INPUT && (
              <PrevButton onClick={handlePrev}>
                이전
              </PrevButton>
            )}
            
            {currentStep < PremiumPriceFlowStep.RESULT && (
              <NextButton 
                $disabled={!isCurrentStepValid}
                onClick={handleNext}
              >
                프리미엄 가격 확인
              </NextButton>
            )}
          </NavigationContainer>
        )}
      </ContentArea>
    </PageContainer>
  );
};

export default PremiumPricing; 