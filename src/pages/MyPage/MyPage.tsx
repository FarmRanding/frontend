import React, { useState, useEffect } from 'react';
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
import { BrandingHistory, mapBrandingApiToHistory } from '../../types/branding';
import iconSort from '../../assets/icon-sort.svg';
import iconBrush from '../../assets/icon-brush.svg';
import iconMoney from '../../assets/icon-money.svg';
import iconPencil from '../../assets/icon-pencil.svg';
import { fetchMyUser, updateMyUserProfile, type UpdateProfileRequest, type UserProfileResponse } from '../../api/userService';
import { fetchBrandingList, fetchBrandingDetail, deleteBranding } from '../../api/brandingService';
import type { UserResponse } from '../../types/user';
import { useNotification } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';

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

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 370px;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.18;
  letter-spacing: -2%;
  color: #1F41BB;
  margin: 0;
  animation: ${fadeIn} 0.6s ease-out;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(31, 65, 187, 0.1);
  border: 1px solid rgba(31, 65, 187, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(31, 65, 187, 0.15);
    border-color: rgba(31, 65, 187, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(31, 65, 187, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const EditIcon = styled.img`
  width: 16px;
  height: 16px;
  filter: brightness(0) saturate(100%) invert(25%) sepia(98%) saturate(1653%) hue-rotate(221deg) brightness(96%) contrast(91%);
`;

const PersonalInfoContainer = styled.div`
  width: 100%;
  max-width: 370px;
  margin-bottom: 48px;
  animation: ${fadeIn} 0.6s ease-out 0.1s both;
  box-sizing: border-box;
  overflow: visible;
  position: relative;
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

// Mock 데이터 타입 정의 (BrandingHistory는 이제 types/branding.ts에서 import)
type SortType = 'latest' | 'oldest' | 'name';

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser } = useAuth();
  const { showSuccess, showError, showConfirm, showInfo, showWarning } = useNotification();
  const [selectedTab, setSelectedTab] = useState<MyPageTabOption>(
    location.state?.initialTab || 'branding'
  );
  const [sortType, setSortType] = useState<SortType>('latest');
  const [selectedPriceHistory, setSelectedPriceHistory] = useState<PriceQuoteHistory | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedBrandingHistory, setSelectedBrandingHistory] = useState<BrandingHistory | null>(null);
  const [isBrandingDetailVisible, setIsBrandingDetailVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 실제 사용자 정보 상태 (서버에서 가져온 최신 정보)
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  
  // 편집 관련 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<PersonalInfoData>({
    name: '',
    farmName: '',
    location: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  // 브랜딩 관련 상태
  const [brandingHistory, setBrandingHistory] = useState<BrandingHistory[]>([]);
  const [brandingLoading, setBrandingLoading] = useState(false);
  const [brandingError, setBrandingError] = useState<string | null>(null);

  // 사용자 정보 조회
  useEffect(() => {
    const loadUserData = async () => {
      if (!authUser) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const userData = await fetchMyUser();
        setUser(userData);
        setEditValues({
          name: userData.name || '',
          farmName: userData.farmName || '',
          location: userData.location || ''
        });
      } catch (err: any) {
        console.error('사용자 정보 조회 실패:', err);
        setError(err.message || '사용자 정보를 불러오지 못했습니다.');
        
        // 에러 발생 시 authUser 정보로 폴백
        if (authUser) {
          const fallbackUser: UserProfileResponse = {
            id: authUser.id,
            email: authUser.email,
            name: authUser.name || authUser.nickname,
            membershipType: authUser.membershipType,
            farmName: authUser.farmName,
            location: authUser.location,
            createdAt: authUser.createdAt
          };
          setUser(fallbackUser);
          setEditValues({
            name: authUser.name || authUser.nickname || '',
            farmName: authUser.farmName || '',
            location: authUser.location || ''
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [authUser]);

  // 브랜딩 목록 조회
  useEffect(() => {
    const loadBrandingHistory = async () => {
      setBrandingLoading(true);
      setBrandingError(null);
      
      try {
        const apiData = await fetchBrandingList();
        const mappedData = apiData.map(mapBrandingApiToHistory);
        setBrandingHistory(mappedData);
      } catch (err: any) {
        console.error('브랜딩 목록 조회 실패:', err);
        setBrandingError(err.message || '브랜딩 목록을 불러오지 못했습니다.');
        // 에러가 발생해도 빈 배열로 설정하여 UI가 정상 작동하도록 함
        setBrandingHistory([]);
      } finally {
        setBrandingLoading(false);
      }
    };

    loadBrandingHistory();
  }, []);

  const handleEditClick = () => {
    if (user) {
      setEditValues({
        name: user.name || '',
        farmName: user.farmName || '',
        location: user.location || ''
      });
      setIsEditing(true);
    }
  };

  const handleValueChange = (field: keyof PersonalInfoData, value: string) => {
    setEditValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setUpdateLoading(true);
    try {
      const updatedUser = await updateMyUserProfile(editValues);
      setUser(updatedUser);
      setIsEditing(false);
      setError(null);
      showSuccess('프로필 수정', '프로필이 성공적으로 수정되었습니다.');
    } catch (err: any) {
      setError(err.message || '프로필 수정에 실패했습니다.');
      showError('수정 실패', err.message || '프로필 수정에 실패했습니다.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditValues({
        name: user.name || '',
        farmName: user.farmName || '',
        location: user.location || ''
      });
    }
    setIsEditing(false);
  };

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

  // 더미 브랜딩 이력 데이터 제거 (실제 API 데이터 사용)

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
    // 안전장치: brandingHistory가 없으면 빈 배열 반환
    if (!brandingHistory || !Array.isArray(brandingHistory)) {
      return [];
    }
    
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
    navigate('/home');
  };

  const handleMypageClick = () => {
    // 이미 마이페이지에 있으므로 아무것도 하지 않거나 스크롤 탑
    window.scrollTo(0, 0);
  };

  const handleDeleteBranding = async (id: string) => {
    const confirmed = await showConfirm({
      type: 'confirm',
      title: '브랜딩 삭제',
      message: '정말로 이 브랜딩을 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소'
    });

    if (!confirmed) {
      return;
    }

    try {
      const projectId = parseInt(id);
      if (isNaN(projectId)) {
        throw new Error('유효하지 않은 프로젝트 ID입니다.');
      }
      
      await deleteBranding(projectId);
      
      // 삭제 후 목록 새로고침
      try {
        const updatedData = await fetchBrandingList();
        const mappedData = updatedData.map(mapBrandingApiToHistory);
        setBrandingHistory(mappedData);
        showSuccess('삭제 완료', '브랜딩이 성공적으로 삭제되었습니다.');
      } catch (refreshErr: any) {
        console.error('목록 새로고침 실패:', refreshErr);
        // 새로고침 실패해도 기존 목록에서 해당 항목만 제거
        setBrandingHistory(prev => prev.filter(item => item.id !== id));
        showSuccess('삭제 완료', '브랜딩이 삭제되었습니다.');
      }
    } catch (err: any) {
      console.error('브랜딩 삭제 실패:', err);
      showError('삭제 실패', err.message || '브랜딩 삭제에 실패했습니다.');
    }
  };

  const handleBrandingClick = async (brandingHistory: BrandingHistory) => {
    try {
      // 상세 정보 조회 (필요시)
      const projectId = parseInt(brandingHistory.id);
      if (isNaN(projectId)) {
        console.warn('유효하지 않은 프로젝트 ID, 기존 데이터로 모달 표시:', brandingHistory.id);
        setSelectedBrandingHistory(brandingHistory);
        setIsBrandingDetailVisible(true);
        return;
      }
      
      const detailData = await fetchBrandingDetail(projectId);
      const mappedDetail = mapBrandingApiToHistory(detailData);
      
      setSelectedBrandingHistory(mappedDetail);
      setIsBrandingDetailVisible(true);
    } catch (err: any) {
      console.error('브랜딩 상세 조회 실패:', err);
      // 실패해도 기존 데이터로 모달 열기
      setSelectedBrandingHistory(brandingHistory);
      setIsBrandingDetailVisible(true);
    }
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
    showSuccess('플랜 선택', `${planId} 플랜이 선택되었습니다!`);
  };

  const renderBrandingContent = () => {
    if (brandingLoading) {
      return (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#9CA3AF' }}>
          브랜딩 목록을 불러오는 중...
        </div>
      );
    }

    if (brandingError) {
      return (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#EF4444' }}>
          {brandingError}
          <br />
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              marginTop: '16px', 
              padding: '8px 16px', 
              backgroundColor: '#1F41BB', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer' 
            }}
          >
            새로고침
          </button>
        </div>
      );
    }

    try {
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
                {groupedHistory[date]?.map(item => (
                  <BrandingCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    imageUrl={item.imageUrl}
                    onClick={() => handleBrandingClick(item)}
                    onDelete={() => handleDeleteBranding(item.id)}
                  />
                )) || []}
              </CardsList>
            </DateGroup>
          ))}
        </HistoryListContainer>
      );
    } catch (renderError: any) {
      console.error('브랜딩 콘텐츠 렌더링 에러:', renderError);
      return (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#EF4444' }}>
          브랜딩 목록 표시 중 오류가 발생했습니다.
          <br />
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              marginTop: '16px', 
              padding: '8px 16px', 
              backgroundColor: '#1F41BB', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer' 
            }}
          >
            새로고침
          </button>
        </div>
      );
    }
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
        <SectionHeader>
          <SectionTitle>내 정보</SectionTitle>
          {!isEditing && (
            <EditButton onClick={handleEditClick}>
              <EditIcon src={iconPencil} alt="수정" />
            </EditButton>
          )}
        </SectionHeader>
        
        <PersonalInfoContainer>
          {loading ? (
            <div>로딩 중...</div>
          ) : error ? (
            <div style={{ color: 'red' }}>{error}</div>
          ) : user ? (
            <PersonalInfo
              data={{
                name: user.name || '-',
                farmName: user.farmName || '-',
                location: user.location || '-',
              }}
              isEditing={isEditing}
              editValues={editValues}
              onValueChange={handleValueChange}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : null}
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