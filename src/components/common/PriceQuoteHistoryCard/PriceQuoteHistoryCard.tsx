import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { UnifiedPriceHistoryResponse } from '../../../api/priceQuoteService';

// 최적화된 애니메이션 (GPU 가속 활용)
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 10px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;



const CardContainer = styled.div<{ $isPremium: boolean }>`
  width: 280px;
  height: 200px;
  background: ${props => props.$isPremium 
    ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
    : '#FFFFFF'
  };
  border: 1px solid ${props => props.$isPremium 
    ? 'rgba(139, 92, 246, 0.2)' 
    : 'rgba(229, 231, 235, 1)'
  };
  border-radius: 16px;
  box-shadow: ${props => props.$isPremium 
    ? '0 4px 20px rgba(139, 92, 246, 0.15)'
    : '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)'
  };
  padding: 20px;
  box-sizing: border-box;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
  /* GPU 가속 활용 */
  will-change: transform, box-shadow;
  transform: translate3d(0, 0, 0);
  
  /* 부드러운 전환 */
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* 초기 애니메이션 */
  animation: ${fadeInUp} 0.4s ease-out;

  /* 미묘한 패턴 (성능 최적화) */
  ${props => !props.$isPremium && css`
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.02) 1px, transparent 1px);
      background-size: 30px 30px;
      opacity: 0.5;
      pointer-events: none;
    }
  `}

  /* 호버 효과 최적화 */
  &:hover {
    transform: translate3d(0, -3px, 0);
    box-shadow: ${props => props.$isPremium 
      ? '0 8px 30px rgba(139, 92, 246, 0.25)'
      : '0 8px 25px rgba(0, 0, 0, 0.08), 0 3px 10px rgba(0, 0, 0, 0.08)'
    };
  }

  &:active {
    transform: translate3d(0, -1px, 0);
    transition: all 0.1s ease;
  }
`;

const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
`;

const ProductName = styled.h3<{ $isPremium: boolean }>`
  font-family: 'Jalnan 2', sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: ${props => props.$isPremium ? 'white' : '#111827'};
  margin: 0;
  line-height: 1.3;
  text-shadow: ${props => props.$isPremium ? '0 1px 2px rgba(0, 0, 0, 0.1)' : 'none'};
`;

const ProductGrade = styled.div<{ $isPremium: boolean }>`
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.$isPremium ? 'rgba(255, 255, 255, 0.85)' : '#6B7280'};
  line-height: 1.2;
`;

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const PriceValue = styled.div<{ $isPremium: boolean }>`
  font-family: 'Inter', sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: ${props => props.$isPremium ? 'white' : '#111827'};
  line-height: 1;
  text-shadow: ${props => props.$isPremium ? '0 1px 2px rgba(0, 0, 0, 0.1)' : 'none'};
`;

const UnitInfo = styled.div<{ $isPremium: boolean }>`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.$isPremium ? 'rgba(255, 255, 255, 0.85)' : '#6B7280'};
  line-height: 1;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const DateInfo = styled.span<{ $isPremium: boolean }>`
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.$isPremium ? 'rgba(255, 255, 255, 0.75)' : '#9CA3AF'};
  line-height: 1;
`;

const ViewDetailText = styled.span<{ $isPremium: boolean }>`
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.$isPremium ? 'white' : '#3B82F6'};
  line-height: 1;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: transform 0.2s ease;
  text-shadow: ${props => props.$isPremium ? '0 1px 2px rgba(0, 0, 0, 0.1)' : 'none'};

  &::after {
    content: '→';
    transition: transform 0.2s ease;
  }

  ${CardContainer}:hover & {
    transform: translateX(2px);
    
    &::after {
      transform: translateX(2px);
    }
  }
`;

// 프리미엄 배지 (깔끔한 디자인)
const PremiumBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 4px 10px;
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;



interface PriceQuoteHistoryCardProps {
  data: UnifiedPriceHistoryResponse;
  onClick?: (data: UnifiedPriceHistoryResponse) => void;
  className?: string;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR').format(price);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return '오늘';
  } else if (diffDays === 2) {
    return '어제';
  } else if (diffDays <= 7) {
    return `${diffDays - 1}일 전`;
  } else {
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    });
  }
};

const PriceQuoteHistoryCard: React.FC<PriceQuoteHistoryCardProps> = ({ 
  data, 
  onClick,
  className 
}) => {
  const handleClick = () => {
    onClick?.(data);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  const isPremium = data.type === 'PREMIUM';

  return (
    <CardContainer
      className={className}
      $isPremium={isPremium}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${data.productName} ${data.grade} 가격 제안 상세보기`}
    >
      {/* 프리미엄 배지 */}
      {isPremium && <PremiumBadge>Premium</PremiumBadge>}

      <CardHeader>
        <ProductName $isPremium={isPremium}>{data.productName}</ProductName>
        <ProductGrade $isPremium={isPremium}>{data.grade}</ProductGrade>
      </CardHeader>

      <PriceSection>
        <PriceValue $isPremium={isPremium}>{formatPrice(data.suggestedPrice)}원</PriceValue>
        <UnitInfo $isPremium={isPremium}>{data.quantity}{data.unit} 기준</UnitInfo>
      </PriceSection>

      <CardFooter>
        <DateInfo $isPremium={isPremium}>{formatDate(data.createdAt)}</DateInfo>
        <ViewDetailText $isPremium={isPremium}>상세보기</ViewDetailText>
      </CardFooter>
    </CardContainer>
  );
};

export default PriceQuoteHistoryCard; 