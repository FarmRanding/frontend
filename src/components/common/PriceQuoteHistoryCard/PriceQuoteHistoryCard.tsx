import React from 'react';
import styled, { keyframes } from 'styled-components';
import { UnifiedPriceHistoryResponse } from '../../../api/priceQuoteService';

// 애니메이션
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

const CardContainer = styled.div<{ isPremium: boolean }>`
  width: 280px;
  height: 200px;
  background: ${props => props.isPremium 
    ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
    : '#FFFFFF'
  };
  border: 1px solid ${props => props.isPremium 
    ? 'rgba(139, 92, 246, 0.2)' 
    : 'rgba(0, 0, 0, 0.08)'
  };
  border-radius: 16px;
  box-shadow: 
    0px 8px 32px rgba(0, 0, 0, 0.08),
    ${props => props.isPremium 
      ? '0px 1px 0px rgba(255, 255, 255, 0.5) inset' 
      : 'none'
    };
  backdrop-filter: ${props => props.isPremium ? 'blur(20px)' : 'none'};
  padding: 16px;
  box-sizing: border-box;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  animation: ${fadeInUp} 0.6s ease-out;
  transition: all 0.3s ease;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -200%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.isPremium 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(31, 65, 187, 0.05)'
      },
      transparent
    );
    transition: left 0.6s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      ${props => props.isPremium 
        ? '0px 16px 48px rgba(139, 92, 246, 0.25)' 
        : '0px 16px 48px rgba(0, 0, 0, 0.12)'
      },
      ${props => props.isPremium 
        ? '0px 1px 0px rgba(255, 255, 255, 0.6) inset' 
        : 'none'
      };
    
    &::before {
      left: 100%;
    }
  }
`;

const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
`;

const ProductName = styled.h3<{ isPremium: boolean }>`
  font-family: 'Jalnan 2', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: ${props => props.isPremium ? 'white' : '#1F2937'};
  margin: 0;
  line-height: 1.3;
  text-shadow: ${props => props.isPremium ? '0px 1px 2px rgba(0, 0, 0, 0.1)' : 'none'};
`;

const ProductGrade = styled.div<{ isPremium: boolean }>`
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.isPremium ? 'rgba(255, 255, 255, 0.9)' : '#6B7280'};
  line-height: 1.2;
`;

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const PriceValue = styled.div<{ isPremium: boolean }>`
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.isPremium ? 'white' : '#1F2937'};
  line-height: 1;
  text-shadow: ${props => props.isPremium ? '0px 1px 2px rgba(0, 0, 0, 0.1)' : 'none'};
`;

const UnitInfo = styled.div<{ isPremium: boolean }>`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.isPremium ? 'rgba(255, 255, 255, 0.9)' : '#4B5563'};
  line-height: 1;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const DateInfo = styled.span<{ isPremium: boolean }>`
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: ${props => props.isPremium ? 'rgba(255, 255, 255, 0.8)' : '#6B7280'};
  line-height: 1;
`;

const ViewDetailText = styled.span<{ isPremium: boolean }>`
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.isPremium ? 'white' : '#1F41BB'};
  line-height: 1;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  text-shadow: ${props => props.isPremium ? '0px 1px 2px rgba(0, 0, 0, 0.1)' : 'none'};

  &::after {
    content: '→';
    transition: transform 0.2s ease;
  }

  ${CardContainer}:hover & {
    &::after {
      transform: translateX(2px);
    }
  }
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

  return (
    <CardContainer
      className={className}
      isPremium={data.type === 'PREMIUM'}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${data.productName} ${data.grade} 가격 제안 상세보기`}
    >
      <CardHeader>
        <ProductName isPremium={data.type === 'PREMIUM'}>{data.productName}</ProductName>
        <ProductGrade isPremium={data.type === 'PREMIUM'}>{data.grade}</ProductGrade>
      </CardHeader>

      <PriceSection>
        <PriceValue isPremium={data.type === 'PREMIUM'}>{formatPrice(data.suggestedPrice)}원</PriceValue>
        <UnitInfo isPremium={data.type === 'PREMIUM'}>{data.quantity}{data.unit} 기준</UnitInfo>
      </PriceSection>

      <CardFooter>
        <DateInfo isPremium={data.type === 'PREMIUM'}>{formatDate(data.createdAt)}</DateInfo>
        <ViewDetailText isPremium={data.type === 'PREMIUM'}>상세보기</ViewDetailText>
      </CardFooter>
    </CardContainer>
  );
};

export default PriceQuoteHistoryCard; 