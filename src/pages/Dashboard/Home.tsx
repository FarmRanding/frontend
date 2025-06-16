import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Header from '../../components/common/Header';
import ServiceCard from '../../components/common/ServiceCard';
import PriceQuoteHistoryCard from '../../components/common/PriceQuoteHistoryCard';
import EmptyPriceHistory from '../../components/common/EmptyPriceHistory';
import { useAuth } from '../../contexts/AuthContext';
import PremiumMembershipModal from '../../components/common/PremiumMembershipModal/PremiumMembershipModal';
import { PriceQuoteService, UnifiedPriceHistoryResponse } from '../../api/priceQuoteService';

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
  padding: 8px 0 24px 0;
  scroll-behavior: smooth;
  margin: -8px 0;
  
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

const Home: React.FC<HomeProps> = ({ className }) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeChart, setActiveChart] = useState(0);
  const [priceHistory, setPriceHistory] = useState<UnifiedPriceHistoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const { user } = useAuth();
  
  // API에서 가격 제안 이력 가져오기
  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        setIsLoading(true);
        const data = await PriceQuoteService.getUnifiedPriceHistory();
        // 최근 5개만 표시
        setPriceHistory(data.slice(0, 5));
      } catch (error) {
        console.error('가격 제안 이력 조회 실패:', error);
        setPriceHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriceHistory();
  }, []);

  const handleBrandingClick = () => {
    navigate('/branding');
  };

  const handlePricingClick = () => {
    navigate('/price-quote');
  };

  const handlePremiumPricingClick = () => {
    console.log('프리미엄 가격 제안 클릭 - 사용자 멤버십:', user?.membershipType);
    if (user?.membershipType === 'FREE') {
      // 무료 사용자는 프리미엄 멤버십 모달 표시
      console.log('무료 사용자 - 프리미엄 모달 표시');
      setIsPremiumModalOpen(true);
    } else {
      // 프리미엄 이상 사용자는 프리미엄 가격 제안 페이지로 이동
      console.log('프리미엄 사용자 - 페이지 이동');
      navigate('/premium-pricing');
    }
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMypageClick = () => {
    navigate('/mypage');
  };

  const handleQuoteCardClick = (data: UnifiedPriceHistoryResponse) => {
    // 마이페이지 가격 제안 이력 탭으로 이동 (PremiumPricing 방식과 동일)
    navigate('/mypage?tab=pricing', { 
      replace: true,
      state: { forceTabChange: Date.now() } // 고유 키로 강제 탭 변경
    });
  };

  const handleStartQuote = () => {
    navigate('/price-quote');
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

  const handlePremiumModalClose = () => {
    setIsPremiumModalOpen(false);
  };

  const handlePremiumUpgrade = () => {
    setIsPremiumModalOpen(false);
    navigate('/mypage?tab=membership'); // 멤버십 탭으로 이동
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
          <ServiceCard 
            variant="premium-pricing" 
            title="프리미엄 가격 제안"
            description="더 정확한 가격 분석"
            bgSvg=""
            onClick={handlePremiumPricingClick}
          />
        </ServiceCardsContainer>

        <PriceTrendSection>
          <SectionTitle>최근 받아본 가격</SectionTitle>
          {isLoading ? (
            <ChartScrollContainer>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '200px',
                color: '#6B7280',
                fontSize: '14px'
              }}>
                가격 제안 이력을 불러오는 중...
              </div>
            </ChartScrollContainer>
          ) : priceHistory.length > 0 ? (
            <>
              <ChartScrollContainer 
                ref={scrollContainerRef}
                onScroll={handleScroll}
              >
                {priceHistory.map((quote) => (
                  <PriceQuoteHistoryCard
                    key={quote.id}
                    data={quote}
                    onClick={handleQuoteCardClick}
                  />
                ))}
              </ChartScrollContainer>
              
              {priceHistory.length > 1 && (
                <ScrollIndicator>
                  {priceHistory.map((_, index) => (
                    <IndicatorDot
                      key={index}
                      active={index === activeChart}
                      onClick={() => handleIndicatorClick(index)}
                    />
                  ))}
                </ScrollIndicator>
              )}
            </>
          ) : (
            <EmptyPriceHistory onStartQuote={handleStartQuote} />
          )}
        </PriceTrendSection>
      </ContentArea>
      
      {/* 프리미엄 멤버십 모달 */}
      <PremiumMembershipModal
        isOpen={isPremiumModalOpen}
        onClose={handlePremiumModalClose}
        onUpgrade={handlePremiumUpgrade}
        title="프리미엄 멤버십 필요"
        subtitle="프리미엄 가격 제안은 프리미엄 이상 멤버십에서 이용할 수 있습니다."
        featureName="프리미엄 가격 제안"
      />
    </PageContainer>
  );
};

export default Home; 