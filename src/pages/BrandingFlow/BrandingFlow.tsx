import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Header from '../../components/common/Header';
import BasicInfoStep from '../../components/branding/BasicInfoStep';
import KeywordSelectionStep from '../../components/branding/KeywordSelectionStep';
import GapVerificationStep from '../../components/branding/GapVerificationStep';
import BrandNameGenerationStep from '../../components/branding/BrandNameGenerationStep';
import BrandResultStep from '../../components/branding/BrandResultStep';
import { BRAND_IMAGE_KEYWORDS, CROP_APPEAL_KEYWORDS, LOGO_IMAGE_KEYWORDS } from '../../constants/keywords';

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
  font-family: 'Jalnan 2', sans-serif !important;
  font-weight: 400 !important;
  font-size: 14px !important;
  color: #666 !important;
`;

const StepNumber = styled.span`
  font-family: 'Jalnan 2', sans-serif !important;
  font-weight: 400 !important;
  font-size: 14px !important;
  color: #1F41BB !important;
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
  font-family: 'Jalnan 2', sans-serif !important;
  font-weight: 400 !important;
  font-size: 16px !important;
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
  font-family: 'Jalnan 2', sans-serif !important;
  font-weight: 400 !important;
  font-size: 16px !important;
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

// 브랜딩 단계 정의 (순서 수정)
export enum BrandingStep {
  BASIC_INFO = 0,
  GAP_VERIFICATION = 1,
  BRANDING_KEYWORDS = 2,
  CROP_APPEAL_KEYWORDS = 3,
  LOGO_IMAGE_KEYWORDS = 4,
  BRAND_NAME_GENERATION = 5,
  RESULT = 6
}

// 전체 브랜딩 데이터 타입
export interface BrandingData {
  // 기본 정보
  cropName: string;
  variety: string;
  cultivationMethod: string;
  grade: string;
  
  // 키워드들
  brandingKeywords: string[];
  cropAppealKeywords: string[];
  logoImageKeywords: string[];
  
  // GAP 인증
  gapNumber: string;
  isGapVerified: boolean;
  
  // 생성된 브랜드명
  generatedBrandName: string;
}

const STEP_TITLES = [
  '당신의 정성이 담긴 작물을\n멋지게 꾸며드릴게요.',
  'GAP 인증번호를 입력하고\n확인해주세요.',
  '브랜드 이미지와 관련된\n키워드를 선택해주세요.',
  '작물의 매력을 드러낄\n키워드를 선택해주세요.',
  '로고 이미지와 관련된\n키워드를 선택해주세요.',
  '브랜드명을 생성하고\n있습니다.',
  '브랜딩이 완료되었습니다!'
];

const BrandingFlow: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<BrandingStep>(BrandingStep.BASIC_INFO);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right');
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
  const [brandingData, setBrandingData] = useState<BrandingData>({
    cropName: '',
    variety: '',
    cultivationMethod: '',
    grade: '',
    brandingKeywords: [],
    cropAppealKeywords: [],
    logoImageKeywords: [],
    gapNumber: '',
    isGapVerified: false,
    generatedBrandName: ''
  });

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleMypageClick = () => {
    navigate('/mypage');
  };

  const handleNext = () => {
    if (currentStep < BrandingStep.RESULT && isCurrentStepValid) {
      setAnimationDirection('left');
      setCurrentStep(currentStep + 1);
      setIsCurrentStepValid(false); // 다음 단계로 넘어가면 유효성 초기화
    }
  };

  const handlePrev = () => {
    if (currentStep > BrandingStep.BASIC_INFO) {
      setAnimationDirection('right');
      setCurrentStep(currentStep - 1);
      setIsCurrentStepValid(true); // 이전 단계로 돌아가면 유효한 상태로 설정
    }
  };

  const updateBrandingData = (updates: Partial<BrandingData>) => {
    setBrandingData(prev => ({ ...prev, ...updates }));
  };

  const getProgress = () => {
    return ((currentStep + 1) / Object.keys(BrandingStep).length * 2) * 100;
  };

  const getCurrentStepComponent = () => {
    switch (currentStep) {
      case BrandingStep.BASIC_INFO:
        return (
          <BasicInfoStep
            data={{
              cropName: brandingData.cropName,
              variety: brandingData.variety,
              cultivationMethod: brandingData.cultivationMethod,
              grade: brandingData.grade
            }}
            onChange={(data) => updateBrandingData(data)}
            onValidationChange={setIsCurrentStepValid}
          />
        );
      case BrandingStep.GAP_VERIFICATION:
        return (
          <GapVerificationStep
            data={{
              gapNumber: brandingData.gapNumber,
              isVerified: brandingData.isGapVerified
            }}
            onChange={(data) => updateBrandingData({ 
              gapNumber: data.gapNumber, 
              isGapVerified: data.isVerified 
            })}
            onValidationChange={setIsCurrentStepValid}
          />
        );
      case BrandingStep.BRANDING_KEYWORDS:
        return (
          <KeywordSelectionStep
            title="브랜드 이미지와 관련된 키워드를 선택해주세요."
            keywords={BRAND_IMAGE_KEYWORDS}
            selectedKeywords={brandingData.brandingKeywords}
            onChange={(keywords) => updateBrandingData({ brandingKeywords: keywords })}
            onValidationChange={setIsCurrentStepValid}
          />
        );
      case BrandingStep.CROP_APPEAL_KEYWORDS:
        return (
          <KeywordSelectionStep
            title="작물의 매력을 드러낼 키워드를 선택해주세요."
            keywords={CROP_APPEAL_KEYWORDS}
            selectedKeywords={brandingData.cropAppealKeywords}
            onChange={(keywords) => updateBrandingData({ cropAppealKeywords: keywords })}
            onValidationChange={setIsCurrentStepValid}
          />
        );
      case BrandingStep.LOGO_IMAGE_KEYWORDS:
        return (
          <KeywordSelectionStep
            title="로고 이미지와 관련된 키워드를 선택해주세요."
            keywords={LOGO_IMAGE_KEYWORDS}
            selectedKeywords={brandingData.logoImageKeywords}
            onChange={(keywords) => updateBrandingData({ logoImageKeywords: keywords })}
            onValidationChange={setIsCurrentStepValid}
          />
        );
      case BrandingStep.BRAND_NAME_GENERATION:
        const allKeywords = [
          ...brandingData.brandingKeywords,
          ...brandingData.cropAppealKeywords,
          ...brandingData.logoImageKeywords
        ];
        return (
          <BrandNameGenerationStep
            allKeywords={allKeywords}
            onBrandNameGenerated={(name) => updateBrandingData({ generatedBrandName: name })}
            onValidationChange={setIsCurrentStepValid}
          />
        );
      case BrandingStep.RESULT:
        const allKeywordsForResult = [
          ...brandingData.brandingKeywords,
          ...brandingData.cropAppealKeywords,
          ...brandingData.logoImageKeywords
        ];
        return (
          <BrandResultStep
            brandName={brandingData.generatedBrandName}
            allKeywords={allKeywordsForResult}
            onComplete={() => navigate('/mypage')}
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
          <StepText 
            className="step-text" 
            style={{ fontFamily: "'Jalnan 2', sans-serif" }}
          >
            단계
          </StepText>
          <StepNumber 
            className="step-number"
            style={{ fontFamily: "'Jalnan 2', sans-serif" }}
          >
            {currentStep + 1}
          </StepNumber>
          <StepText 
            className="step-text"
            style={{ fontFamily: "'Jalnan 2', sans-serif" }}
          >
            / 7
          </StepText>
        </StepIndicator>

        <StepContainer $direction={animationDirection}>
          {getCurrentStepComponent()}
        </StepContainer>

        {/* 네비게이션 버튼들 - RESULT 단계에서는 숨김 */}
        {currentStep !== BrandingStep.RESULT && (
          <NavigationContainer>
            {currentStep > BrandingStep.BASIC_INFO && (
              <PrevButton 
                onClick={handlePrev} 
                className="nav-button"
                style={{ fontFamily: "'Jalnan 2', sans-serif" }}
              >
                이전
              </PrevButton>
            )}
            
            {currentStep < BrandingStep.RESULT && (
              <NextButton 
                $disabled={!isCurrentStepValid}
                onClick={handleNext}
                className="nav-button"
                style={{ fontFamily: "'Jalnan 2', sans-serif" }}
              >
                {currentStep === BrandingStep.BRAND_NAME_GENERATION ? '완료' : '다음'}
              </NextButton>
            )}
          </NavigationContainer>
        )}
      </ContentArea>
    </PageContainer>
  );
};

export default BrandingFlow; 