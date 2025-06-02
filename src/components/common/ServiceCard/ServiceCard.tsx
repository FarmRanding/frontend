import React from 'react';
import styled, { keyframes } from 'styled-components';
import iconBrush from '../../../assets/icon-brush.svg';
import iconMoney from '../../../assets/icon-money.svg';
import iconChevronRight from '../../../assets/icon-chevronright.svg';

// 애니메이션
const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const iconPulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
`;

const CardContainer = styled.div<{ variant: ServiceCardVariant }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  width: 100%;
  height: 80px;
  background: ${props => props.variant === 'branding' 
    ? 'linear-gradient(135deg, rgba(31, 65, 187, 0.05) 0%, rgba(79, 70, 229, 0.08) 100%)'
    : 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.08) 100%)'
  };
  border: 1px solid ${props => props.variant === 'branding' 
    ? 'rgba(31, 65, 187, 0.1)'
    : 'rgba(16, 185, 129, 0.1)'
  };
  border-radius: 16px;
  box-shadow: 
    0px 8px 32px rgba(0, 0, 0, 0.08),
    0px 1px 0px rgba(255, 255, 255, 0.5) inset;
  backdrop-filter: blur(10px);
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

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
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.6s ease;
  }

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 
      0px 16px 48px rgba(0, 0, 0, 0.12),
      0px 1px 0px rgba(255, 255, 255, 0.6) inset;
    border-color: ${props => props.variant === 'branding' 
      ? 'rgba(31, 65, 187, 0.2)'
      : 'rgba(16, 185, 129, 0.2)'
    };
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-2px) scale(1.01);
    transition: all 0.1s ease;
  }
`;

const IconContainer = styled.div<{ variant: ServiceCardVariant }>`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${props => props.variant === 'branding' 
    ? 'linear-gradient(135deg, #1F41BB 0%, #4F46E5 100%)'
    : 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
  };
  border-radius: 12px;
  box-shadow: 
    0px 4px 16px rgba(0, 0, 0, 0.1),
    0px 1px 0px rgba(255, 255, 255, 0.2) inset;
  transition: all 0.3s ease;
  position: relative;

  ${CardContainer}:hover & {
    animation: ${iconPulse} 0.6s ease-in-out;
    box-shadow: 
      0px 8px 24px rgba(0, 0, 0, 0.15),
      0px 1px 0px rgba(255, 255, 255, 0.3) inset;
  }
`;

const IconImage = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  transition: all 0.3s ease;

  ${CardContainer}:hover & {
    transform: scale(1.1);
  }
`;

const TextContainer = styled.div`
  flex: 1;
  height: auto;
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 4px;
`;

const MainText = styled.div`
  font-family: var(--font-jalnan) !important;
  font-weight: 800 !important;
  color: #000000;
  text-align: left;
  line-height: 1.2;
  letter-spacing: -0.02em;
`;

const FirstLine = styled.div`
  font-size: 11px;
  color: #6B7280;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  margin-bottom: 2px;
  transition: all 0.3s ease;

  ${CardContainer}:hover & {
    color: #4B5563;
    transform: translateX(2px);
  }
`;

const SecondLine = styled.div<{ variant: ServiceCardVariant }>`
  font-size: 18px;
  color: ${props => props.variant === 'branding' ? '#1F41BB' : '#059669'};
  font-weight: 700;
  transition: all 0.3s ease;

  ${CardContainer}:hover & {
    transform: translateX(2px);
    color: ${props => props.variant === 'branding' ? '#1a37a0' : '#047857'};
  }
`;

const ChevronContainer = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  ${CardContainer}:hover & {
    background: rgba(255, 255, 255, 0.9);
    transform: translateX(4px);
  }
`;

const ChevronIcon = styled.img`
  width: 6px;
  height: 10px;
  transition: all 0.3s ease;
  filter: brightness(0) saturate(100%) invert(25%) sepia(98%) saturate(1653%) hue-rotate(221deg) brightness(96%) contrast(91%);

  ${CardContainer}:hover & {
    transform: translateX(2px);
  }
`;

export type ServiceCardVariant = 'branding' | 'pricing';

interface ServiceCardProps {
  variant: ServiceCardVariant;
  title: React.ReactNode;
  description: React.ReactNode;
  bgSvg: string;
  className?: string;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  variant,
  title,
  description,
  bgSvg,
  className,
  onClick
}) => {
  const getIconSrc = () => {
    switch (variant) {
      case 'branding':
        return iconBrush;
      case 'pricing':
        return iconMoney;
      default:
        return iconBrush;
    }
  };

  const getTextLines = () => {
    switch (variant) {
      case 'branding':
        return {
          first: '마케팅은 저희가 할게요.',
          second: '내 작물 브랜딩'
        };
      case 'pricing':
        return {
          first: '적정 가격 찾아드릴게요.',
          second: '예상 가격 받아보기'
        };
      default:
        return { first: '', second: '' };
    }
  };

  const getAltText = () => {
    switch (variant) {
      case 'branding':
        return '브랜딩 서비스';
      case 'pricing':
        return '가격 서비스';
      default:
        return '서비스';
    }
  };

  const textLines = getTextLines();

  return (
    <CardContainer variant={variant} className={className} onClick={onClick}>
      <IconContainer variant={variant}>
        <IconImage src={getIconSrc()} alt={getAltText()} />
      </IconContainer>
      <TextContainer>
        <MainText>
          <FirstLine>{textLines.first}</FirstLine>
          <SecondLine variant={variant}>{textLines.second}</SecondLine>
        </MainText>
      </TextContainer>
      <ChevronContainer>
        <ChevronIcon src={iconChevronRight} alt="이동" />
      </ChevronContainer>
    </CardContainer>
  );
};

export default ServiceCard; 