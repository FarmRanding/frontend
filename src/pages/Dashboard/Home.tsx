import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Header from '../../components/common/Header';
import ServiceCard from '../../components/common/ServiceCard';
import PriceTrendChart from '../../components/common/PriceTrendChart';

// 부드러운 애니메이션만 유지
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

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background: #F4FAFF;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 88px 21px 40px;
  overflow-y: auto;
  box-sizing: border-box;
`;

const ServiceCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 48px;
  animation: ${fadeInUp} 0.6s ease-out;
`;

const SectionTitle = styled.h2`
  font-family: 'Jalnan 2', sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: #1F2937;
  margin: 0 0 20px 0;
  line-height: 1.3;
  animation: ${fadeInUp} 0.6s ease-out 0.1s both;
`;

const PriceTrendSection = styled.div`
  animation: ${fadeInUp} 0.6s ease-out 0.2s both;
`;

const ChartScrollContainer = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 0 0 16px 0;
  scroll-behavior: smooth;
  
  /* 깔끔한 스크롤바 */
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #F3F4F6;
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 2px;
    transition: background 0.2s ease;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #9CA3AF;
  }
`;

const ScrollIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
`;

const IndicatorDot = styled.div<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.active ? '#1F41BB' : '#D1D5DB'};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: ${props => props.active ? '#1F41BB' : '#9CA3AF'};
  }
`;

interface HomeProps {
  className?: string;
}

// 샘플 가격 동향 데이터
const generateSampleData = (basePrice: number, days: number = 30) => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // 가격 변동 시뮬레이션
    const variation = (Math.random() - 0.5) * 0.2; // ±10% 변동
    const price = Math.round(basePrice * (1 + variation));
    
    data.push({
      date: date.toISOString(),
      price
    });
  }
  
  return data;
};

const samplePriceTrends = [
  {
    cropName: '사과',
    variety: '후지',
    currentPrice: 12500,
    priceChange: 5.2,
    data: generateSampleData(12500)
  },
  {
    cropName: '배추',
    variety: '김장용',
    currentPrice: 8900,
    priceChange: -2.1,
    data: generateSampleData(8900)
  },
  {
    cropName: '당근',
    variety: '일반',
    currentPrice: 6700,
    priceChange: 8.7,
    data: generateSampleData(6700)
  }
];

const Home: React.FC<HomeProps> = ({ className }) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeChart, setActiveChart] = useState(0);

  const handleBrandingClick = () => {
    navigate('/branding');
  };

  const handlePricingClick = () => {
    navigate('/price-quote');
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMypageClick = () => {
    navigate('/mypage');
  };

  const handleIndicatorClick = (index: number) => {
    setActiveChart(index);
    if (scrollContainerRef.current) {
      const chartWidth = 280 + 16; // 차트 너비 + 간격
      scrollContainerRef.current.scrollTo({
        left: index * chartWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const chartWidth = 280 + 16;
      const newActiveChart = Math.round(scrollLeft / chartWidth);
      setActiveChart(newActiveChart);
    }
  };

  return (
    <PageContainer className={className}>
      <Header 
        onClickLogo={handleLogoClick}
        onClickMypage={handleMypageClick}
      />
      
      <ContentArea>
        <ServiceCardsContainer>
          <ServiceCard 
            variant="branding" 
            title="브랜딩 서비스"
            description="내 작물 브랜딩"
            bgSvg=""
            onClick={handleBrandingClick}
          />
          <ServiceCard 
            variant="pricing" 
            title="가격 서비스"
            description="예상 가격 받아보기"
            bgSvg=""
            onClick={handlePricingClick}
          />
        </ServiceCardsContainer>

        <PriceTrendSection>
          <SectionTitle>최근 가격 동향</SectionTitle>
          <ChartScrollContainer 
            ref={scrollContainerRef}
            onScroll={handleScroll}
          >
            {samplePriceTrends.map((trend, index) => (
              <PriceTrendChart
                key={`${trend.cropName}-${trend.variety}`}
                data={trend}
              />
            ))}
          </ChartScrollContainer>
          
          <ScrollIndicator>
            {samplePriceTrends.map((_, index) => (
              <IndicatorDot
                key={index}
                active={index === activeChart}
                onClick={() => handleIndicatorClick(index)}
              />
            ))}
          </ScrollIndicator>
        </PriceTrendSection>
      </ContentArea>
    </PageContainer>
  );
};

export default Home; 