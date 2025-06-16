import React from 'react';
import styled, { keyframes } from 'styled-components';

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

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const EmptyContainer = styled.div`
  width: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 
    0px 8px 32px rgba(0, 0, 0, 0.08),
    0px 1px 0px rgba(255, 255, 255, 0.5) inset;
  backdrop-filter: blur(20px);
  padding: 40px 20px;
  box-sizing: border-box;
  animation: ${fadeInUp} 0.6s ease-out;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #9CA3AF;
  animation: ${floatAnimation} 3s ease-in-out infinite;
  margin-bottom: 8px;
`;

const EmptyTitle = styled.h3`
  font-family: 'Jalnan 2', sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: #374151;
  margin: 0;
  line-height: 1.3;
`;

const EmptyDescription = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
  margin: 0;
  line-height: 1.5;
  max-width: 280px;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #1F41BB 0%, #1E3A8A 100%);
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
  box-shadow: 0px 4px 16px rgba(31, 65, 187, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 8px 24px rgba(31, 65, 187, 0.4);
  }

  &:active {
    transform: translateY(0px);
  }
`;

interface EmptyPriceHistoryProps {
  onStartQuote?: () => void;
  className?: string;
}

const EmptyPriceHistory: React.FC<EmptyPriceHistoryProps> = ({ 
  onStartQuote,
  className 
}) => {
  const handleStartQuote = () => {
    onStartQuote?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleStartQuote();
    }
  };

  return (
    <EmptyContainer className={className}>
      <EmptyIcon>📊</EmptyIcon>
      <EmptyTitle>아직 가격 제안을 받아본 적이 없어요</EmptyTitle>
      <EmptyDescription>
        농산물의 예상 가격을 확인해보세요.<br />
        브랜딩과 함께 더 정확한 가격 정보를 받을 수 있어요.
      </EmptyDescription>
      {onStartQuote && (
        <ActionButton 
          onClick={handleStartQuote}
          onKeyDown={handleKeyDown}
          aria-label="가격 제안 받기 시작하기"
        >
          가격 제안 받기
        </ActionButton>
      )}
    </EmptyContainer>
  );
};

export default EmptyPriceHistory; 