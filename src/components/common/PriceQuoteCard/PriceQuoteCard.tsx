import React from 'react';
import styled from 'styled-components';
import iconTrash from '../../../assets/icon-trash.svg';

const CardContainer = styled.div<{ $isPremium?: boolean }>`
  width: 100%;
  background: ${props => props.$isPremium 
    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.02) 0%, rgba(168, 85, 247, 0.03) 100%)'
    : '#FFFFFF'
  };
  border-radius: 12px;
  box-shadow: 0 4px 28px rgba(0, 0, 0, 0.15);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid ${props => props.$isPremium ? 'rgba(139, 92, 246, 0.1)' : 'rgba(31, 65, 187, 0.05)'};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => props.$isPremium 
      ? 'linear-gradient(90deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%)'
      : 'linear-gradient(90deg, #1F41BB 0%, #4F46E5 50%, #818CF8 100%)'
    };
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.$isPremium 
      ? '0 12px 32px rgba(139, 92, 246, 0.2)'
      : '0 12px 32px rgba(31, 65, 187, 0.15)'
    };
    border-color: ${props => props.$isPremium ? 'rgba(139, 92, 246, 0.15)' : 'rgba(31, 65, 187, 0.1)'};
    
    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
`;

const CropInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

const CropName = styled.div`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.18;
  color: #000000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CropDetails = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.2;
  color: #6B7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TypeBadge = styled.span<{ $isPremium?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 10px;
  line-height: 1.2;
  background: ${props => props.$isPremium ? 'rgba(139, 92, 246, 0.1)' : 'rgba(31, 65, 187, 0.1)'};
  color: ${props => props.$isPremium ? '#8B5CF6' : '#1F41BB'};
  border: 1px solid ${props => props.$isPremium ? 'rgba(139, 92, 246, 0.2)' : 'rgba(31, 65, 187, 0.2)'};
  flex-shrink: 0;
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
`;

const PriceIconContainer = styled.div<{ $isPremium?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.$isPremium ? 'rgba(139, 92, 246, 0.1)' : 'rgba(31, 65, 187, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: ${props => props.$isPremium ? '#8B5CF6' : '#1F41BB'};

  ${CardContainer}:hover & {
    background: ${props => props.$isPremium ? 'rgba(139, 92, 246, 0.15)' : 'rgba(31, 65, 187, 0.15)'};
    transform: scale(1.05);
  }
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`;

const FairPrice = styled.div<{ $isPremium?: boolean }>`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.18;
  color: ${props => props.$isPremium ? '#8B5CF6' : '#1F41BB'};
  white-space: nowrap;
`;

const PriceUnit = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 11px;
  line-height: 1.2;
  color: #9CA3AF;
`;

const ActionSection = styled.div`
  position: relative;
  z-index: 2;
`;

const DeleteButton = styled.button`
  width: 36px;
  height: 36px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  flex-shrink: 0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(239, 68, 68, 0.1);
    border-radius: 50%;
    transition: all 0.3s ease;
    transform: translate(-50%, -50%);
  }

  &:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.3);
    transform: scale(1.05);
    
    &::before {
      width: 100%;
      height: 100%;
    }
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
  }
`;

const DeleteIcon = styled.img`
  width: 14px;
  height: 14px;
  filter: brightness(0) saturate(100%) invert(28%) sepia(99%) saturate(3207%) hue-rotate(343deg) brightness(96%) contrast(93%);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  
  ${DeleteButton}:hover & {
    transform: scale(1.1);
  }
`;

interface PriceQuoteCardProps {
  productName: string;
  grade: string;
  fairPrice: number;
  unit?: string;
  quantity?: number;
  type?: 'STANDARD' | 'PREMIUM'; // 가격 제안 타입
  location?: string; // 프리미엄 전용
  onClick?: () => void;
  onDelete?: () => void;
}

const PriceQuoteCard: React.FC<PriceQuoteCardProps> = ({
  productName,
  grade,
  fairPrice,
  unit = 'kg',
  quantity = 1,
  type = 'STANDARD',
  location,
  onClick,
  onDelete
}) => {
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  const getGradeDisplayText = (grade: string) => {
    const gradeMap: { [key: string]: string } = {
      '특': '특급',
      '상': '상급',
      '중': '중급',
      '하': '하급'
    };
    return gradeMap[grade] || grade;
  };

  const formatPrice = (price: number) => {
    return Math.round(price).toLocaleString();
  };

  const isPremium = type === 'PREMIUM';

  return (
    <CardContainer $isPremium={isPremium} onClick={handleCardClick}>
      <MainContent>
        <CropInfo>
          <CropName>{productName}</CropName>
          <CropDetails>
            <span>{getGradeDisplayText(grade)}</span>
            <TypeBadge $isPremium={isPremium}>
              {isPremium ? '프리미엄' : '일반'}
            </TypeBadge>
            {isPremium && location && (
              <span style={{ color: '#8B5CF6', fontSize: '10px' }}>
                {location}
              </span>
            )}
          </CropDetails>
        </CropInfo>
        
        <PriceSection>
          <PriceIconContainer $isPremium={isPremium}>
            ₩
          </PriceIconContainer>
          <PriceContainer>
            <FairPrice $isPremium={isPremium}>{formatPrice(fairPrice)}원</FairPrice>
            <PriceUnit>{quantity}{unit} 기준</PriceUnit>
          </PriceContainer>
        </PriceSection>
      </MainContent>
      
      {onDelete && (
        <ActionSection>
          <DeleteButton onClick={handleDeleteClick} aria-label="삭제">
            <DeleteIcon src={iconTrash} alt="삭제" />
          </DeleteButton>
        </ActionSection>
      )}
    </CardContainer>
  );
};

export default PriceQuoteCard; 