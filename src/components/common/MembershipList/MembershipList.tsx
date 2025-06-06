import React from 'react';
import styled from 'styled-components';
import iconShield from '../../../assets/icon-shield.svg';
import iconRocket from '../../../assets/icon-rocket.svg';
import iconDiamond from '../../../assets/icon-diamond.svg';

const MembershipContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 400px;
  padding: 0;
  box-sizing: border-box;
`;

const MembershipGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 4px;
`;

const MembershipCard = styled.div<{ isRecommended?: boolean; isPremium?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: ${props => props.isRecommended ? '32px 24px 24px 24px' : '24px'};
  margin-top: ${props => props.isRecommended ? '12px' : '0'};
  background: ${props => {
    if (props.isRecommended) return 'linear-gradient(135deg, #1F41BB 0%, #3B82F6 100%)';
    if (props.isPremium) return 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)';
    return '#ffffff';
  }};
  border-radius: 16px;
  box-shadow: ${props => 
    props.isRecommended || props.isPremium 
      ? '0px 12px 32px rgba(31, 65, 187, 0.25)' 
      : '0px 8px 24px rgba(0, 0, 0, 0.08)'
  };
  border: ${props => 
    props.isRecommended || props.isPremium 
      ? 'none' 
      : '1px solid rgba(31, 65, 187, 0.1)'
  };
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => 
      props.isRecommended || props.isPremium 
        ? '0px 16px 40px rgba(31, 65, 187, 0.35)' 
        : '0px 12px 32px rgba(31, 65, 187, 0.15)'
    };
  }

  ${props => (props.isRecommended || props.isPremium) && `
    color: white;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
      border-radius: 16px;
      pointer-events: none;
    }
  `}
`;

const RecommendedBadge = styled.div`
  position: absolute;
  top: -6px;
  right: 20px;
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 16px;
  font-family: 'Jalnan 2', sans-serif;
  font-size: 11px;
  font-weight: 400;
  box-shadow: 0px 4px 12px rgba(255, 107, 107, 0.4);
  z-index: 10;
  white-space: nowrap;
`;

const PlanHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const PlanIconContainer = styled.div<{ planType: 'basic' | 'premium' | 'premium-plus' }>`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: ${props => {
    switch (props.planType) {
      case 'basic':
        return 'rgba(31, 65, 187, 0.1)';
      case 'premium':
        return 'rgba(255, 255, 255, 0.2)';
      case 'premium-plus':
        return 'rgba(255, 255, 255, 0.2)';
      default:
        return 'rgba(31, 65, 187, 0.1)';
    }
  }};
  
  img {
    width: 16px;
    height: 16px;
    filter: ${props => {
      switch (props.planType) {
        case 'basic':
          return 'brightness(0) saturate(100%) invert(25%) sepia(98%) saturate(1653%) hue-rotate(221deg) brightness(96%) contrast(91%)'; // #1f41bb 파란색
        case 'premium':
        case 'premium-plus':
          return 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7500%) hue-rotate(324deg) brightness(106%) contrast(106%)'; // 하얀색
        default:
          return 'none';
      }
    }};
  }
`;

const PlanEmoji = styled.span`
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
`;

const PlanTitle = styled.h3<{ isSpecial?: boolean }>`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 1.2;
  margin: 0;
  color: ${props => props.isSpecial ? 'inherit' : '#1F41BB'};
`;

const PlanPrice = styled.div<{ isSpecial?: boolean }>`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 28px;
  line-height: 1.2;
  margin-bottom: 12px;
  color: ${props => props.isSpecial ? 'inherit' : '#1f41bb'};
  
  /* 그라데이션 텍스트 효과 */
  ${props => !props.isSpecial && `
    background: linear-gradient(135deg, #1F41BB 0%, #3B82F6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `}
`;

const PlanDescription = styled.p<{ isSpecial?: boolean }>`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 20px 0;
  color: ${props => props.isSpecial ? 'rgba(255,255,255,0.9)' : '#64748B'};
  word-break: keep-all;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FeatureItem = styled.li<{ isSpecial?: boolean }>`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 13px;
  line-height: 1.4;
  color: ${props => props.isSpecial ? 'rgba(255,255,255,0.95)' : '#374151'};
  display: flex;
  align-items: flex-start;
  gap: 10px;

  &::before {
    content: '✓';
    color: ${props => props.isSpecial ? 'rgba(255,255,255,0.9)' : '#10B981'};
    font-weight: bold;
    font-size: 14px;
    margin-top: 1px;
    flex-shrink: 0;
  }
`;

const SelectButton = styled.button<{ isSpecial?: boolean; isDisabled?: boolean }>`
  margin-top: 20px;
  padding: 14px 24px;
  background: ${props => {
    if (props.isDisabled) return '#E5E7EB';
    return props.isSpecial ? 'rgba(255,255,255,0.2)' : '#1f41bb';
  }};
  color: ${props => {
    if (props.isDisabled) return '#9CA3AF';
    return props.isSpecial ? 'white' : 'white';
  }};
  border: ${props => {
    if (props.isDisabled) return '1px solid #D1D5DB';
    return props.isSpecial ? '1px solid rgba(255,255,255,0.3)' : 'none';
  }};
  border-radius: 12px;
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 14px;
  cursor: ${props => props.isDisabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  backdrop-filter: ${props => props.isSpecial ? 'blur(10px)' : 'none'};
  opacity: ${props => props.isDisabled ? 0.6 : 1};

  &:hover {
    background: ${props => {
      if (props.isDisabled) return '#E5E7EB';
      return props.isSpecial ? 'rgba(255,255,255,0.3)' : '#1a3aa3';
    }};
    transform: ${props => props.isDisabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.isDisabled ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15)'};
  }

  &:active {
    transform: ${props => props.isDisabled ? 'none' : 'translateY(0)'};
  }
`;

export interface MembershipPlan {
  id: string;
  emoji?: string;
  iconType?: 'shield' | 'rocket' | 'diamond';
  title: string;
  price: string;
  description: string;
  features: string[];
  isRecommended?: boolean;
  isPremium?: boolean;
}

export type SortType = 'price-asc' | 'price-desc' | 'name' | 'recommended';

interface MembershipListProps {
  plans: MembershipPlan[];
  onSelectPlan?: (planId: string) => void;
  className?: string;
  currentMembershipType?: string;
}

const MembershipList: React.FC<MembershipListProps> = ({
  plans,
  onSelectPlan,
  className,
  currentMembershipType = 'FREE',
}) => {
  const getIconForPlan = (plan: MembershipPlan): string | undefined => {
    if (plan.iconType) {
      switch (plan.iconType) {
        case 'shield':
          return iconShield;
        case 'rocket':
          return iconRocket;
        case 'diamond':
          return iconDiamond;
      }
    }
    return undefined;
  };

  const getPlanType = (plan: MembershipPlan): 'basic' | 'premium' | 'premium-plus' => {
    if (plan.isPremium) return 'premium-plus';
    if (plan.isRecommended) return 'premium';
    return 'basic';
  };

  // 버튼 텍스트 결정 함수
  const getButtonText = (planId: string): string => {
    if (planId === 'free') {
      return currentMembershipType === 'FREE' ? '현재 사용 중' : '다운그레이드';
    }
    if (planId === 'premium') {
      if (currentMembershipType === 'PREMIUM') return '현재 사용 중';
      if (currentMembershipType === 'PREMIUM_PLUS') return '다운그레이드';
      return '업그레이드';
    }
    if (planId === 'premium-plus') {
      if (currentMembershipType === 'PREMIUM_PLUS') return '현재 사용 중';
      return '업그레이드';
    }
    return '선택하기';
  };

  // 버튼 비활성화 여부 결정 함수
  const isButtonDisabled = (planId: string): boolean => {
    if (planId === 'free' && currentMembershipType === 'FREE') return true;
    if (planId === 'premium' && currentMembershipType === 'PREMIUM') return true;
    if (planId === 'premium-plus' && currentMembershipType === 'PREMIUM_PLUS') return true;
    return false;
  };

  // 추천순으로 기본 정렬
  const sortedPlans = plans.sort((a, b) => {
    if (a.isRecommended && !b.isRecommended) return -1;
    if (!a.isRecommended && b.isRecommended) return 1;
    if (a.isPremium && !b.isPremium) return -1;
    if (!a.isPremium && b.isPremium) return 1;
    return 0;
  });

  return (
    <MembershipContainer className={className}>
      <MembershipGrid>
        {sortedPlans.map((plan) => (
          <MembershipCard 
            key={plan.id}
            isRecommended={plan.isRecommended}
            isPremium={plan.isPremium}
          >
            {plan.isRecommended && (
              <RecommendedBadge>추천</RecommendedBadge>
            )}
            
            <PlanHeader>
              {getIconForPlan(plan) && (
                <PlanIconContainer planType={getPlanType(plan)}>
                  <img src={getIconForPlan(plan)} alt={`${plan.title} 아이콘`} />
                </PlanIconContainer>
              )}
              {plan.emoji && !getIconForPlan(plan) && (
                <PlanEmoji>{plan.emoji}</PlanEmoji>
              )}
              <PlanTitle isSpecial={plan.isRecommended || plan.isPremium}>
                {plan.title}
              </PlanTitle>
            </PlanHeader>

            <PlanPrice isSpecial={plan.isRecommended || plan.isPremium}>
              {plan.price}
            </PlanPrice>

            <PlanDescription isSpecial={plan.isRecommended || plan.isPremium}>
              {plan.description}
            </PlanDescription>

            <FeatureList>
              {plan.features.map((feature, index) => (
                <FeatureItem 
                  key={index}
                  isSpecial={plan.isRecommended || plan.isPremium}
                >
                  {feature}
                </FeatureItem>
              ))}
            </FeatureList>

            <SelectButton 
              isSpecial={plan.isRecommended || plan.isPremium}
              isDisabled={isButtonDisabled(plan.id)}
              onClick={() => !isButtonDisabled(plan.id) && onSelectPlan?.(plan.id)}
            >
              {getButtonText(plan.id)}
            </SelectButton>
          </MembershipCard>
        ))}
      </MembershipGrid>
    </MembershipContainer>
  );
};

export default MembershipList; 