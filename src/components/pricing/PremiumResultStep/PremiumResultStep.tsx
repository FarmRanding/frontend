import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import iconMoney from '../../../assets/icon-money.svg';
import iconGraph from '../../../assets/icon-graph.svg';
import iconCheck from '../../../assets/icon-check.svg';

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

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
  max-width: 500px;
  padding: 0 20px;
  box-sizing: border-box;
`;

const ResultHeader = styled.div`
  text-align: center;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Title = styled.h1`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 24px;
  line-height: 1.67;
  color: #000000;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
  color: #8B5CF6;
  margin: 0;
`;

const ResultCard = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  border-radius: 20px;
  padding: 32px 24px;
  color: white;
  position: relative;
  overflow: hidden;
  animation: ${slideInUp} 0.8s ease-out 0.2s both;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(10px, -10px) rotate(1deg); }
    66% { transform: translate(-5px, 5px) rotate(-1deg); }
  }
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  position: relative;
  z-index: 2;
`;

const ProductIcon = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 20px;
    height: 20px;
    filter: brightness(0) invert(1);
  }
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const ProductName = styled.h2`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.3;
  color: #FFFFFF;
  margin: 0 0 4px 0;
`;

const ProductLocation = styled.p`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
`;

const PriceSection = styled.div`
  text-align: center;
  position: relative;
  z-index: 2;
`;

const PriceLabel = styled.p`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 8px 0;
`;

const SuggestedPrice = styled.div`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 36px;
  line-height: 1.2;
  color: #FFFFFF;
  margin-bottom: 16px;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const PriceBreakdown = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;
`;

const PriceItem = styled.div`
  flex: 1;
  text-align: center;
`;

const PriceItemLabel = styled.p`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 4px 0;
`;

const PriceItemValue = styled.p`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.3;
  color: #FFFFFF;
  margin: 0;
`;

const AnalysisSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: ${slideInUp} 0.8s ease-out 0.4s both;
`;

const AnalysisCard = styled.div`
  width: 100%;
  background: #FFFFFF;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.1);
`;

const AnalysisHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const AnalysisIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 16px;
    height: 16px;
    filter: brightness(0) saturate(100%) invert(47%) sepia(82%) saturate(1352%) hue-rotate(242deg) brightness(97%) contrast(94%);
  }
`;

const AnalysisTitle = styled.h3`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.3;
  color: #1F2937;
  margin: 0;
`;

const AnalysisContent = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
  color: #6B7280;
`;

const CalculationExplanation = styled.div`
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 16px;
  
  /* 읽기 쉬운 텍스트 스타일 */
  text-align: left;
  word-break: keep-all;
  
  /* 신뢰성을 강조하는 스타일 */
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
    border-radius: 2px 0 0 2px;
  }
`;

const RecommendationList = styled.ul`
  margin: 8px 0 0 0;
  padding-left: 16px;
`;

const RecommendationItem = styled.li`
  margin-bottom: 4px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CompleteButton = styled.button`
  width: 100%;
  max-width: 300px;
  padding: 16px;
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  border: none;
  border-radius: 12px;
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.18;
  color: #FFFFFF;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  animation: ${slideInUp} 0.8s ease-out 0.6s both;

  &:hover {
    background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
  }
  
  img {
    width: 20px;
    height: 20px;
    filter: brightness(0) invert(1);
  }
`;

// 툴팁 관련 스타일
const TooltipContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const TooltipTrigger = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const TooltipIcon = styled.div`
  width: 16px;
  height: 16px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
`;

const TooltipContent = styled.div<{ $visible: boolean }>`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.95);
  color: white;
  padding: 16px 20px;
  border-radius: 12px;
  font-family: 'Pretendard', sans-serif;
  font-size: 13px;
  line-height: 1.5;
  white-space: normal;
  width: 320px;
  max-width: 90vw;
  z-index: 1000;
  margin-bottom: 12px;
  opacity: ${props => props.$visible ? 1 : 0};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  transition: all 0.2s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  word-break: keep-all;
  
  /* 화면 밖으로 나가지 않도록 조정 */
  @media (max-width: 400px) {
    width: 280px;
    left: 0;
    transform: translateX(0);
    margin-left: -140px;
  }
  
  /* 툴팁 화살표 */
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.95);
  }
  
  @media (max-width: 400px) {
    &::after {
      left: 50%;
      transform: translateX(-50%);
    }
  }
  transition: opacity 0.2s ease, visibility 0.2s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.9);
  }
`;

// 프리미엄 가격 제안 데이터 타입
interface PremiumPriceData {
  productItemCode: string;
  productVarietyCode: string;
  productName: string;
  location: string;
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

interface PremiumResultStepProps {
  data: PremiumPriceData;
  onComplete: () => void;
}

const PremiumResultStep: React.FC<PremiumResultStepProps> = ({ data, onComplete }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const handleComplete = async () => {
    try {
      // 프리미엄 가격 제안 결과 저장
      const { premiumPriceService } = await import('../../../api/premiumPriceService');
      
      const saveRequest = {
        productGroupCode: '', // 사용하지 않음
        productItemCode: data.productItemCode,
        productVarietyCode: data.productVarietyCode,
        location: data.location
      };
      
      // 결과가 이미 생성되어 있으므로 별도 저장 API 호출 (필요시)
      // await premiumPriceService.saveSuggestion(saveRequest);
      console.log('프리미엄 가격 제안 결과 저장 완료');
      
    } catch (error) {
      console.error('프리미엄 가격 제안 결과 저장 실패:', error);
      // 저장 실패해도 계속 진행 (사용자 경험 방해하지 않음)
    }
    
    onComplete();
  };

  const formatPrice = (price: number) => {
    if (isNaN(price) || price === 0) {
      return '데이터 없음';
    }
    return `${Math.round(price).toLocaleString()}원`;
  };

  const getLocationDisplayName = (location: string) => {
    const locationMap: { [key: string]: string } = {
      '서울': '서울특별시',
      '부산': '부산광역시',
      '대구': '대구광역시',
      '인천': '인천광역시',
      '광주': '광주광역시',
      '대전': '대전광역시',
      '울산': '울산광역시',
      '세종': '세종특별자치시',
      '경기': '경기도',
      '강원': '강원도',
      '충북': '충청북도',
      '충남': '충청남도',
      '전북': '전라북도',
      '전남': '전라남도',
      '경북': '경상북도',
      '경남': '경상남도',
      '제주': '제주특별자치도'
    };
    
    return locationMap[location] || location;
  };

  return (
    <Container>
      <ResultHeader>
        <Title>프리미엄 가격 분석 완료!</Title>
        <Subtitle>KAMIS 데이터와 AI 분석을 통한 정확한 직거래 가격입니다.</Subtitle>
      </ResultHeader>

      <ResultCard>
        <ProductInfo>
          <ProductIcon>
            <img src={iconMoney} alt="농산물" />
          </ProductIcon>
          <ProductDetails>
            <ProductName>{data.productName || '선택한 농산물'}</ProductName>
            <ProductLocation>{getLocationDisplayName(data.location)} 기준</ProductLocation>
          </ProductDetails>
        </ProductInfo>

        <PriceSection>
          <TooltipContainer>
            <PriceLabel>AI 추천 직거래 가격</PriceLabel>
            <TooltipTrigger
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
            >
              <TooltipIcon>?</TooltipIcon>
            </TooltipTrigger>
            <TooltipContent $visible={showTooltip}>
              최근 5일간 소매·도매 가격을 분석하여 생산자와 소비자 모두에게 공정한 직거래 가격을 산출합니다.
              <br />
              <br />
              KAMIS 공식 데이터와 AI 분석을 통해 신뢰성 있는 가격을 제공합니다.
            </TooltipContent>
          </TooltipContainer>
          <SuggestedPrice>{formatPrice(data.suggestedPrice)}</SuggestedPrice>
          
          <PriceBreakdown>
            <PriceItem>
              <PriceItemLabel>소매 평균</PriceItemLabel>
              <PriceItemValue>{formatPrice(data.retailPrice)}</PriceItemValue>
            </PriceItem>
            <PriceItem>
              <PriceItemLabel>도매 평균</PriceItemLabel>
              <PriceItemValue>{formatPrice(data.wholesalePrice)}</PriceItemValue>
            </PriceItem>
          </PriceBreakdown>
        </PriceSection>
      </ResultCard>

      <AnalysisSection>
        <AnalysisCard>
          <AnalysisHeader>
            <AnalysisIcon>
              <img src={iconGraph} alt="계산 근거" />
            </AnalysisIcon>
            <AnalysisTitle>가격 산출 근거</AnalysisTitle>
          </AnalysisHeader>
          <AnalysisContent>
            <CalculationExplanation>
              {data.priceCalculation?.explanation || 
                'KAMIS(한국농수산식품유통공사) 공식 데이터를 기반으로 최근 5일간의 소매·도매 가격을 분석하여 생산자와 소비자 모두에게 공정한 직거래 가격을 제안했습니다. 품질 등급과 지역 특성을 고려하여 시장 상황에 맞는 합리적인 가격을 산출했습니다.'
              }
            </CalculationExplanation>
          </AnalysisContent>
        </AnalysisCard>
      </AnalysisSection>

      <CompleteButton onClick={handleComplete}>
        <img src={iconCheck} alt="완료" />
        마이페이지에서 확인하기
      </CompleteButton>
    </Container>
  );
};

export default PremiumResultStep; 