import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Header from '../../components/common/Header/Header';
import MyPageTabGroup from '../../components/common/MyPageTabGroup/MyPageTabGroup';
import type { MyPageTabOption } from '../../components/common/MyPageTab/MyPageTab';
import BrandingCard from '../../components/common/BrandingCard/BrandingCard';
import BrandingDetailModal from '../../components/common/BrandingDetailModal/BrandingDetailModal';
import PriceQuoteCard from '../../components/common/PriceQuoteCard/PriceQuoteCard';
import PriceQuoteDetailModal from '../../components/common/PriceQuoteDetailModal/PriceQuoteDetailModal';
import PersonalInfo, { type PersonalInfoData } from '../../components/common/PersonalInfo/PersonalInfo';
import MembershipList, { type MembershipPlan } from '../../components/common/MembershipList/MembershipList';
import type { PriceQuoteHistory } from '../../types/priceHistory';
import iconSort from '../../assets/icon-sort.svg';
import iconBrush from '../../assets/icon-brush.svg';
import iconMoney from '../../assets/icon-money.svg';

// 애니메이션
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
`;

const PageContainer = styled.div`
  width: 100%;
  max-width: 402px;
  min-height: 100vh;
  background: #F4FAFF;
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 0 auto;
  overflow-x: hidden;
  box-sizing: border-box;
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 86px 16px 40px 16px;
  flex: 1;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const SectionTitle = styled.h2`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.18;
  letter-spacing: -2%;
  color: #1F41BB;
  margin: 0 0 24px 0;
  align-self: flex-start;
  animation: ${fadeIn} 0.6s ease-out;
`;

const PersonalInfoContainer = styled.div`
  width: 100%;
  max-width: 370px;
  margin-bottom: 48px;
  animation: ${fadeIn} 0.6s ease-out 0.1s both;
  box-sizing: border-box;
`;

const TabContainer = styled.div`
  width: 100%;
  max-width: 100%;
  margin-bottom: 24px;
  animation: ${fadeIn} 0.6s ease-out 0.2s both;
  display: flex;
  justify-content: center;
  overflow-x: hidden;
  box-sizing: border-box;
`;

const HistoryContainer = styled.div`
  width: 100%;
  max-width: 100%;
  background: #FFFFFF;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 20px rgba(31, 65, 187, 0.08);
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.6s ease-out 0.3s both;
  box-sizing: border-box;
`;

const SortSection = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20px 20px 16px 20px;
  background: #FFFFFF;
  border-bottom: 1px solid #F0F4F8;
  box-sizing: border-box;
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(31, 65, 187, 0.08);
  border: 1px solid rgba(31, 65, 187, 0.2);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: fit-content;

  &:hover {
    background: rgba(31, 65, 187, 0.12);
    border-color: rgba(31, 65, 187, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(31, 65, 187, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SortIcon = styled.img`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;

const SortText = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 13px;
  line-height: 1.2;
  color: #1F41BB;
  white-space: nowrap;
`;

const HistoryListContainer = styled.div`
  padding: 32px 20px 40px 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  background: #FFFFFF;
  flex: 1;
  overflow-y: auto;
  box-sizing: border-box;
  animation: ${fadeIn} 0.6s ease-out;
`;

const DateGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
`;

const DateHeader = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 8px;
`;

const DateText = styled.div`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.18;
  color: #6B7280;
  margin-bottom: 8px;
`;

const DateLine = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, #E5E7EB 0%, rgba(229, 231, 235, 0) 100%);
`;

const CardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #9CA3AF;
  background: #FFFFFF;
  flex: 1;
`;

const EmptyIconContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(31, 65, 187, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  position: relative;
  transition: all 0.3s ease;
  animation: ${float} 3s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(31, 65, 187, 0.2) 0%, rgba(79, 70, 229, 0.1) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: scale(1.05);
    
    &::before {
      opacity: 1;
    }
  }
`;

const EmptyIcon = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(25%) sepia(98%) saturate(1653%) hue-rotate(221deg) brightness(96%) contrast(91%);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;

  ${EmptyIconContainer}:hover & {
    transform: scale(1.1);
    filter: brightness(0) saturate(100%) invert(43%) sepia(96%) saturate(1352%) hue-rotate(221deg) brightness(99%) contrast(94%);
  }
`;

const EmptyTitle = styled.div`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.4;
  color: #6B7280;
  margin-bottom: 8px;
`;

const EmptyDescription = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
  color: #9CA3AF;
`;

const MembershipContainer = styled.div`
  width: 100%;
  padding: 20px;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  overflow-y: auto;
  flex: 1;
  animation: ${fadeIn} 0.6s ease-out;
  
  /* 마이페이지 멤버십 탭에 맞는 스타일링 */
  .membership-list {
    width: 100%;
    max-width: 100%;
    
    /* MembershipList 내부 스타일 조정 */
    > div {
      padding: 0;
      max-width: 100%;
    }
  }
`;

// Mock 데이터 타입 정의
interface BrandingHistory {
  id: string;
  title: string;
  description: string;
  story: string;
  imageUrl?: string;
  createdAt: string;
}

type SortType = 'latest' | 'oldest' | 'name';

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState<MyPageTabOption>(
    location.state?.initialTab || 'branding'
  );
  const [sortType, setSortType] = useState<SortType>('latest');
  const [selectedPriceHistory, setSelectedPriceHistory] = useState<PriceQuoteHistory | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedBrandingHistory, setSelectedBrandingHistory] = useState<BrandingHistory | null>(null);
  const [isBrandingDetailVisible, setIsBrandingDetailVisible] = useState(false);

  // 5년간 더미 데이터 생성 함수
  const generatePriceData = () => {
    const basePrice = 2800;
    const data = [];
    
    for (let year = 2019; year <= 2023; year++) {
      for (let month = 1; month <= 12; month++) {
        const variation = Math.random() * 0.4 - 0.2;
        const seasonalFactor = Math.sin((month - 1) * Math.PI / 6) * 0.15;
        
        const avgPrice = basePrice * (1 + variation + seasonalFactor);
        const minPrice = avgPrice * (0.7 + Math.random() * 0.2);
        const maxPrice = avgPrice * (1.1 + Math.random() * 0.2);
        
        data.push({
          date: `${year}-${month.toString().padStart(2, '0')}`,
          minPrice: Math.round(minPrice),
          maxPrice: Math.round(maxPrice),
          avgPrice: Math.round(avgPrice)
        });
      }
    }
    
    return data;
  };

  // Mock 가격 제안 이력 데이터
  const priceQuoteHistory: PriceQuoteHistory[] = [
    {
      id: '1',
      request: {
        cropName: '감자',
        variety: '수미',
        grade: '상',
        harvestDate: new Date('2025-05-15')
      },
      result: {
        fairPrice: 2745,
        priceData: generatePriceData()
      },
      createdAt: '2025.05.15',
      unit: 'kg',
      quantity: 1
    },
    {
      id: '2',
      request: {
        cropName: '사과',
        variety: '후지',
        grade: '특',
        harvestDate: new Date('2025-05-14')
      },
      result: {
        fairPrice: 6900,
        priceData: generatePriceData()
      },
      createdAt: '2025.05.15',
      unit: 'kg',
      quantity: 1
    },
    {
      id: '3',
      request: {
        cropName: '아스파라거스',
        variety: '그린아스파라',
        grade: '중',
        harvestDate: new Date('2025-05-14')
      },
      result: {
        fairPrice: 14700,
        priceData: generatePriceData()
      },
      createdAt: '2025.05.14',
      unit: 'kg',
      quantity: 1
    }
  ];

  // Mock 브랜딩 이력 데이터
  const brandingHistory: BrandingHistory[] = [
    {
      id: '1',
      title: '뽀사과',
      description: '한 입에 쏙, 귀여움이 톡!',
      story: '아이들이 좋아하는 작고 귀여운 사과를 만들고 싶었어요. 기존 사과보다 크기는 작지만, 당도는 더 높고 아삭한 식감이 매력적입니다.\n\n매일 새벽 5시에 일어나 과수원을 돌보며, 하나하나 정성스럽게 키운 사과들입니다. 농약 사용을 최소화하고, 자연 친화적인 방법으로 재배했습니다.\n\n\'뽀사과\'라는 이름은 손녀가 지어줬는데, 정말 사과처럼 볼이 뽀얗고 귀엽다고 해서 붙인 이름이에요.',
      imageUrl: 'https://placehold.co/72x72/ff6b6b/ffffff?text=🍎',
      createdAt: '2024.12.15'
    },
    {
      id: '2',
      title: '하은 감자',
      description: '자연이 키운 진심의 맛',
      story: '고향 강원도의 깨끗한 고랭지에서 자란 감자입니다. 일교차가 큰 환경에서 자란 덕분에 당도가 높고 포슬포슬한 식감을 자랑해요.\n\n3대째 이어온 감자 농사의 노하우를 바탕으로, 전통 농법과 현대 기술을 조화롭게 접목했습니다. 화학비료 대신 퇴비를 사용하고, 토양의 건강을 최우선으로 생각합니다.\n\n딸 하은이의 이름을 따서 \'하은 감자\'라고 명명했습니다. 하은이가 농업에 관심을 갖고 함께 일할 수 있기를 바라는 마음을 담았어요.',
      imageUrl: 'https://placehold.co/72x72/8B4513/ffffff?text=🥔',
      createdAt: '2024.12.14'
    },
    {
      id: '3',
      title: '싱싱초록',
      description: '노지에서 자란 고품질 오이고추, 바로 산지에서 보내드립니다.',
      story: '충청남도 논산의 비옥한 땅에서 자란 오이고추입니다. 조부모님 대부터 이어온 씨앗을 사용해 재배하는 토종 오이고추로, 시중에서 찾기 어려운 진짜 맛을 자랑합니다.\n\n농약을 최소한으로 사용하고, 천적 곤충을 활용한 친환경 농법으로 재배합니다. 매일 새벽 이슬을 맞으며 자란 오이고추는 아삭하고 신선함이 오래 지속됩니다.\n\n싱싱하고 초록빛이 아름다워 \'싱싱초록\'이라는 브랜드명을 지었습니다. 소비자들에게 건강하고 신선한 채소를 전달하고 싶은 마음을 담았어요.',
      imageUrl: 'https://placehold.co/72x72/32CD32/ffffff?text=🌶️',
      createdAt: '2024.12.10'
    },
    {
      id: '4',
      title: '토담토',
      description: '"햇살과 정성을 가득 담은 산지직송 대추토마토, 토담토가 전하는 자연 그대로의 달콤함."',
      story: '전라남도 고흥의 따뜻한 햇살 아래에서 자란 대추토마토입니다. 바닷바람과 충분한 일조량, 그리고 농부의 정성이 만들어낸 최고의 토마토예요.\n\n당도 12브릭스 이상의 고당도 토마토로, 과일처럼 달콤합니다. 하우스가 아닌 노지에서 자연스럽게 익힌 토마토라 영양가도 풍부하고 맛도 진합니다.\n\n\'토마토에 정성을 담다\'는 의미로 \'토담토\'라고 이름 지었습니다. 소비자 분들이 한 입 베어물면 농부의 진심을 느끼실 수 있을 거라 확신합니다.',
      imageUrl: 'https://placehold.co/72x72/FF6347/ffffff?text=🍅',
      createdAt: '2024.11.28'
    }
  ];

  // 멤버십 플랜 데이터
  const membershipPlans: MembershipPlan[] = [
    {
      id: 'free',
      iconType: 'shield',
      title: '일반 회원',
      price: '₩0 /월',
      description: '브랜딩과 가격 제안, 무료로 시작해보세요. 간단히 체험하고 싶은 농장주님께 추천드려요.',
      features: [
        '브랜딩: 최초 5회',
        '가격 제안: 최초 5회',
        '판매글 생성: 제공되지 않음',
        '기본 고객 지원',
      ],
    },
    {
      id: 'premium',
      iconType: 'rocket',
      title: '프리미엄',
      price: '₩4,900 /월',
      description: '브랜딩과 가격 제안을 무제한으로. 꾸준히 사용하는 농장주님께 꼭 맞는 요금제입니다.',
      features: [
        '브랜딩: 무제한',
        '가격 제안: 무제한',
        '판매글 생성: 제공되지 않음',
        '우선 고객 지원',
      ],
      isRecommended: true,
    },
    {
      id: 'premium-plus',
      iconType: 'diamond',
      title: '프리미엄 플러스',
      price: '₩8,900 /월',
      description: '홍보 문구까지 자동으로 완성해드릴게요. 마케팅까지 맡기고 싶은 농장주님께 추천합니다.',
      features: [
        '브랜딩: 무제한',
        '가격 제안: 무제한',
        '판매글 생성: 무제한',
        '감성형 / 실용형 / 쇼핑몰형 등 다양한 문체 지원',
      ],
      isPremium: true,
    },
  ];

  // PersonalInfo 데이터
  const personalData: PersonalInfoData = {
    name: "윤하은",
    farmName: " 하은팜",
    location: "○○도 □□시 △△동"
  };

  const handleTabChange = (tab: MyPageTabOption) => {
    setSelectedTab(tab);
  };

  const handleSort = () => {
    const sortOptions: SortType[] = ['latest', 'oldest', 'name'];
    const currentIndex = sortOptions.indexOf(sortType);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortType(sortOptions[nextIndex]);
  };

  const getSortButtonText = () => {
    switch (sortType) {
      case 'latest': return '최신순';
      case 'oldest': return '오래된순';
      case 'name': return '이름순';
      default: return '정렬';
    }
  };

  const getSortedBrandingHistory = () => {
    const historyCopy = [...brandingHistory];
    
    switch (sortType) {
      case 'latest':
        return historyCopy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return historyCopy.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'name':
        return historyCopy.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return historyCopy;
    }
  };

  const getSortedPriceHistory = () => {
    const historyCopy = [...priceQuoteHistory];
    
    switch (sortType) {
      case 'latest':
        return historyCopy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return historyCopy.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'name':
        return historyCopy.sort((a, b) => a.request.cropName.localeCompare(b.request.cropName));
      default:
        return historyCopy;
    }
  };

  const getGroupedBrandingHistory = () => {
    const sortedHistory = getSortedBrandingHistory();
    const grouped: { [date: string]: BrandingHistory[] } = {};
    
    sortedHistory.forEach(item => {
      if (!grouped[item.createdAt]) {
        grouped[item.createdAt] = [];
      }
      grouped[item.createdAt].push(item);
    });
    
    return grouped;
  };

  const getGroupedPriceHistory = () => {
    const sortedHistory = getSortedPriceHistory();
    const grouped: { [date: string]: PriceQuoteHistory[] } = {};
    
    sortedHistory.forEach(item => {
      if (!grouped[item.createdAt]) {
        grouped[item.createdAt] = [];
      }
      grouped[item.createdAt].push(item);
    });
    
    return grouped;
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleMypageClick = () => {
    // 이미 마이페이지에 있으므로 아무것도 하지 않거나 스크롤 탑
    window.scrollTo(0, 0);
  };

  const handleDeleteBranding = (id: string) => {
    console.log(`브랜딩 ${id} 삭제`);
    // TODO: 실제 삭제 로직 구현
  };

  const handleBrandingClick = (brandingHistory: BrandingHistory) => {
    setSelectedBrandingHistory(brandingHistory);
    setIsBrandingDetailVisible(true);
  };

  const handleCloseBrandingDetail = () => {
    setIsBrandingDetailVisible(false);
    setSelectedBrandingHistory(null);
  };

  const handleDeletePriceQuote = (id: string) => {
    console.log(`가격 제안 ${id} 삭제`);
    // TODO: 실제 삭제 로직 구현
  };

  const handlePriceQuoteClick = (priceHistory: PriceQuoteHistory) => {
    setSelectedPriceHistory(priceHistory);
    setIsDetailModalVisible(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalVisible(false);
    setSelectedPriceHistory(null);
  };

  const handleSelectPlan = (planId: string) => {
    console.log(`플랜 선택됨: ${planId}`);
    // TODO: 실제 플랜 구독 로직 구현
    alert(`${planId} 플랜이 선택되었습니다!`);
  };

  const renderBrandingContent = () => {
    const groupedHistory = getGroupedBrandingHistory();
    const dateKeys = Object.keys(groupedHistory);

    if (dateKeys.length === 0) {
      return (
        <EmptyState>
          <EmptyIconContainer>
            <EmptyIcon src={iconBrush} alt="브랜딩" />
          </EmptyIconContainer>
          <EmptyTitle>브랜딩 이력이 없습니다</EmptyTitle>
          <EmptyDescription>
            첫 번째 브랜드를 만들어보세요!<br />
            홈에서 브랜딩 서비스를 시작할 수 있습니다.
          </EmptyDescription>
        </EmptyState>
      );
    }

    return (
      <HistoryListContainer>
        {dateKeys.map(date => (
          <DateGroup key={date}>
            <DateHeader>
              <DateText>{date}</DateText>
              <DateLine />
            </DateHeader>
            <CardsList>
              {groupedHistory[date].map(item => (
                <BrandingCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  imageUrl={item.imageUrl}
                  onClick={() => handleBrandingClick(item)}
                  onDelete={() => handleDeleteBranding(item.id)}
                />
              ))}
            </CardsList>
          </DateGroup>
        ))}
      </HistoryListContainer>
    );
  };

  const renderPricingContent = () => {
    const groupedHistory = getGroupedPriceHistory();
    const dateKeys = Object.keys(groupedHistory);

    if (dateKeys.length === 0) {
      return (
        <EmptyState>
          <EmptyIconContainer>
            <EmptyIcon src={iconMoney} alt="가격제안" />
          </EmptyIconContainer>
          <EmptyTitle>가격 제안 이력이 없습니다</EmptyTitle>
          <EmptyDescription>
            첫 번째 가격 제안을 받아보세요!<br />
            홈에서 가격 제안 서비스를 시작할 수 있습니다.
          </EmptyDescription>
        </EmptyState>
      );
    }

    return (
      <HistoryListContainer>
        {dateKeys.map(date => (
          <DateGroup key={date}>
            <DateHeader>
              <DateText>{date}</DateText>
              <DateLine />
            </DateHeader>
            <CardsList>
              {groupedHistory[date].map(item => (
                <PriceQuoteCard
                  key={item.id}
                  cropName={item.request.cropName}
                  variety={item.request.variety}
                  grade={item.request.grade}
                  fairPrice={item.result.fairPrice}
                  unit={item.unit}
                  quantity={item.quantity}
                  onClick={() => handlePriceQuoteClick(item)}
                  onDelete={() => handleDeletePriceQuote(item.id)}
                />
              ))}
            </CardsList>
          </DateGroup>
        ))}
      </HistoryListContainer>
    );
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'branding':
        return (
          <div key="branding-content">
            {renderBrandingContent()}
          </div>
        );
      case 'pricing':
        return (
          <div key="pricing-content">
            {renderPricingContent()}
          </div>
        );
      case 'membership':
        return (
          <div key="membership-content">
            <MembershipContainer>
              <MembershipList
                plans={membershipPlans}
                onSelectPlan={handleSelectPlan}
                className="membership-list"
              />
            </MembershipContainer>
          </div>
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
        <SectionTitle>개인 정보</SectionTitle>
        <PersonalInfoContainer>
          <PersonalInfo data={personalData} />
        </PersonalInfoContainer>

        <TabContainer>
          <MyPageTabGroup
            selectedTab={selectedTab}
            onTabChange={handleTabChange}
          />
        </TabContainer>

        <HistoryContainer>
          {(selectedTab === 'branding' || selectedTab === 'pricing') && (
            <SortSection>
              <SortButton onClick={handleSort}>
                <SortIcon src={iconSort} alt="정렬" />
                <SortText>{getSortButtonText()}</SortText>
              </SortButton>
            </SortSection>
          )}
          
          {renderTabContent()}
        </HistoryContainer>
      </ContentArea>

      <PriceQuoteDetailModal
        isVisible={isDetailModalVisible}
        priceHistory={selectedPriceHistory}
        onClose={handleCloseDetailModal}
      />

      <BrandingDetailModal
        isVisible={isBrandingDetailVisible}
        brandingHistory={selectedBrandingHistory}
        onClose={handleCloseBrandingDetail}
      />
    </PageContainer>
  );
};

export default MyPage; 