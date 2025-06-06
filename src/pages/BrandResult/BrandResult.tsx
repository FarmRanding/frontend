import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useNotification } from '../../contexts/NotificationContext';
import BrandResult from '../../components/common/BrandResult/BrandResult';
import KeywordTag from '../../components/common/KeywordTag/KeywordTag';
import iconCancel from '../../assets/icon-cancel.svg';
import { type BrandResultData } from '../../components/common/BrandResult/BrandResult';
import { fetchCurrentUserFromServer, getCurrentUser } from '../../api/auth';

// 간단한 애니메이션만 유지
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

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

// 스타일 컴포넌트들
const PageContainer = styled.div`
  width: 100%;
  min-height: 874px;
  background: #F4FAFF;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Header = styled.div`
  width: 100%;
  height: 47px;
  background: #F4FAFF;
  display: flex;
  align-items: center;
  padding: 0;
  position: relative;
  flex-shrink: 0;
`;

const CloseButton = styled.button`
  position: absolute;
  left: 15px;
  top: 0;
  width: 42px;
  height: 42px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:hover {
    opacity: 0.7;
  }

  &:active {
    opacity: 0.5;
  }
`;

const CloseIcon = styled.img`
  width: 21px;
  height: 21px;
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 51px 51px 40px 51px;
  flex: 1;
  position: relative;
`;

const Title = styled.h1`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 24px;
  line-height: 1.67;
  letter-spacing: 4.17%;
  text-align: center;
  color: #000000;
  margin: 0 0 64px 0;
  animation: ${fadeIn} 0.8s ease-out;
`;

const BrandResultContainer = styled.div`
  margin-bottom: 48px;
  animation: ${fadeInUp} 0.8s ease-out 0.2s both;
`;

const KeywordSection = styled.div`
  width: 100%;
  max-width: 100%;
  margin-bottom: 48px;
  animation: ${fadeInUp} 0.8s ease-out 0.4s both;
`;

const KeywordSectionTitle = styled.h3`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.4;
  color: #000000;
  text-align: center;
  margin: 0 0 24px 0;
`;

const KeywordContainer = styled.div`
  position: relative;
`;

const KeywordGrid = styled.div<{ $showAll: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 100%;
  max-height: ${props => props.$showAll ? 'none' : '120px'};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const KeywordWrapper = styled.div<{ $index: number }>`
  animation: ${fadeIn} 0.5s ease-out ${props => 0.6 + props.$index * 0.05}s both;
`;

const ShowMoreButton = styled.button<{ $hasMore: boolean }>`
  display: ${props => props.$hasMore ? 'flex' : 'none'};
  width: 100%;
  height: 40px;
  background: rgba(31, 65, 187, 0.1);
  border: 1px solid #1F41BB;
  border-radius: 8px;
  color: #1F41BB;
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 14px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: #1F41BB;
    color: white;
  }
`;

const ActionSection = styled.div`
  width: 100%;
  max-width: 300px;
  animation: ${fadeInUp} 0.8s ease-out 0.6s both;
`;

const CompleteButton = styled.button`
  width: 100%;
  padding: 17px;
  background: linear-gradient(135deg, #1F41BB 0%, #4F46E5 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(31, 65, 187, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const ButtonText = styled.span`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.18;
  color: #ffffff;
  position: relative;
  z-index: 1;
`;

// 데이터 타입 정의
interface LocationState {
  brandName: string;
  selectedKeywords: string[];
}

// Mock 브랜드 데이터 생성 함수
const generateBrandData = (brandName: string): BrandResultData => {
  return {
    brandName: brandName,
    promotionText: "자연이 키운 진심의 맛",
    story: `경기도 화성시 동탄면에서 자란 밤양갱 큐트케어는 특등급의 프리미엄 양갱입니다. 우리의 양갱은 최상의 품질을 위해 신선한 밤을 엄선하여 사용하며, 양갱공장에서 정성스럽게 만들어집니다. 부드럽고 쫄깃한 식감은 물론, 달콤한 맛이 입안을 가득 채워줍니다. 건강과 다이어트를 생각하는 여러분을 위해 설계된 이 양갱은, 고품질의 재료만을 사용하여 고객님의 건강을 최우선으로 생각합니다. 따뜻한 순간에 함께하고 싶은 밤양갱 큐트케어, 지금 바로 만나보세요!`,
    imageUrl: "https://placehold.co/200x200/E8F4FF/1F41BB?text=Brand+Logo"
  };
};

const BrandResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError, showInfo, showWarning } = useNotification();
  const [brandData, setBrandData] = useState<BrandResultData | null>(null);
  const [showAllKeywords, setShowAllKeywords] = useState(false);
  
  // 🔥 멤버십 상태 및 스토리 접근 권한
  const [userMembershipType, setUserMembershipType] = useState<string>('FREE');
  const [canAccessStory, setCanAccessStory] = useState<boolean>(false);

  // 이전 페이지에서 전달받은 데이터
  const state = location.state as LocationState;
  const receivedBrandName = state?.brandName || "하은 감자";
  const receivedKeywords = state?.selectedKeywords || [
    '프리미엄', '규모가 큰', '정성을 담은', 
    '유기농', '건강 관리', '모양이 예쁜',
    '일러스트', '따뜻한', '심플한',
    '안전한', '친환경', '신선한',
    '맛있는', '건강한', '자연스러운',
    '정직한', '깨끗한', '영양가 높은'
  ];

  // 3행(9개)까지만 기본 표시
  const visibleKeywords = showAllKeywords ? receivedKeywords : receivedKeywords.slice(0, 9);
  const hasMoreKeywords = receivedKeywords.length > 9;

  // 🔥 멤버십 체크 및 브랜드 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        // 브랜드 데이터 설정
        setBrandData(generateBrandData(receivedBrandName));
        
        // 멤버십 정보 확인
        const currentUser = await fetchCurrentUserFromServer();
        if (currentUser) {
          let membershipTypeStr = '';
          
          // 멤버십 타입 정규화
          if (typeof currentUser.membershipType === 'string') {
            membershipTypeStr = currentUser.membershipType;
          } else if (currentUser.membershipType && typeof currentUser.membershipType === 'object' && currentUser.membershipType.name) {
            membershipTypeStr = currentUser.membershipType.name;
          } else {
            membershipTypeStr = currentUser.membershipType?.toString() || 'FREE';
          }
          
          // 대소문자 무관하게 체크
          const normalizedMembershipType = membershipTypeStr.toUpperCase();
          const hasStoryAccess = normalizedMembershipType === 'PREMIUM_PLUS' || 
                                normalizedMembershipType === 'PREMIUMPLUS' ||
                                normalizedMembershipType.includes('PREMIUM_PLUS') ||
                                normalizedMembershipType.includes('PREMIUMPLUS');
          
          setUserMembershipType(membershipTypeStr);
          setCanAccessStory(hasStoryAccess);
          
          console.log('🔍 브랜드 결과 페이지 - 사용자 멤버십 정보:', membershipTypeStr);
          console.log('🔍 브랜드 결과 페이지 - 스토리 접근 권한:', hasStoryAccess);
        } else {
          // 로컬 정보 사용
          const localUser = getCurrentUser();
          if (localUser) {
            let membershipTypeStr = '';
            
            if (typeof localUser.membershipType === 'string') {
              membershipTypeStr = localUser.membershipType;
            } else if (localUser.membershipType && typeof localUser.membershipType === 'object' && localUser.membershipType.name) {
              membershipTypeStr = localUser.membershipType.name;
            } else {
              membershipTypeStr = localUser.membershipType?.toString() || 'FREE';
            }
            
            const normalizedMembershipType = membershipTypeStr.toUpperCase();
            const hasStoryAccess = normalizedMembershipType === 'PREMIUM_PLUS' || 
                                  normalizedMembershipType === 'PREMIUMPLUS' ||
                                  normalizedMembershipType.includes('PREMIUM_PLUS') ||
                                  normalizedMembershipType.includes('PREMIUMPLUS');
            
            setUserMembershipType(membershipTypeStr);
            setCanAccessStory(hasStoryAccess);
            
            console.log('🔍 브랜드 결과 페이지 - 로컬 멤버십 정보:', membershipTypeStr);
            console.log('🔍 브랜드 결과 페이지 - 로컬 스토리 접근 권한:', hasStoryAccess);
          }
        }
      } catch (error) {
        console.error('❌ 브랜드 결과 페이지 - 데이터 로드 실패:', error);
        setBrandData(generateBrandData(receivedBrandName));
        setUserMembershipType('FREE');
        setCanAccessStory(false);
      }
    };
    
    loadData();
  }, [receivedBrandName]);

  const handleClose = () => {
    navigate('/home');
  };

  const handleComplete = () => {
    showSuccess('브랜드 생성 완료', '브랜드가 성공적으로 생성되었습니다!');
    navigate('/mypage');
  };

  const handleUpgradeClick = () => {
    // 마이페이지 멤버십 탭으로 이동
    navigate('/mypage', { state: { initialTab: 'membership' } });
  };

  const handleCopy = (field: string, value: string) => {
    console.log(`${field} 복사됨:`, value);
  };

  const handleDownload = (imageUrl: string) => {
    try {
      // 이미지 다운로드 로직
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${brandData?.brandName || 'brand'}_logo.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showSuccess('다운로드 시작', '브랜드 로고 이미지 다운로드가 시작되었습니다.');
      console.log('다운로드 시작:', imageUrl);
    } catch (error) {
      console.error('이미지 다운로드 실패:', error);
      showError('다운로드 실패', '이미지 다운로드에 실패했습니다.');
    }
  };

  const handleShowMore = () => {
    setShowAllKeywords(!showAllKeywords);
  };

  if (!brandData) {
    return (
      <PageContainer>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
          color: '#1F41BB'
        }}>
          잠시만 기다려 주세요...
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <CloseButton onClick={handleClose} aria-label="닫기">
          <CloseIcon src={iconCancel} alt="닫기" />
        </CloseButton>
      </Header>

      <ContentArea>
        <Title>브랜드가 만들어졌어요!</Title>
        
        <BrandResultContainer>
          <BrandResult
            data={brandData}
            canAccessStory={canAccessStory}
            onUpgrade={handleUpgradeClick}
          />
        </BrandResultContainer>

        <KeywordSection>
          <KeywordSectionTitle>선택한 키워드</KeywordSectionTitle>
          <KeywordContainer>
            <KeywordGrid $showAll={showAllKeywords}>
              {visibleKeywords.map((keyword, index) => (
                <KeywordWrapper key={keyword} $index={index}>
                  <KeywordTag variant="selected">
                    {keyword}
                  </KeywordTag>
                </KeywordWrapper>
              ))}
            </KeywordGrid>
            <ShowMoreButton 
              $hasMore={hasMoreKeywords} 
              onClick={handleShowMore}
            >
              {showAllKeywords ? '접기' : `더보기 (+${receivedKeywords.length - 9}개)`}
            </ShowMoreButton>
          </KeywordContainer>
        </KeywordSection>

        <ActionSection>
          <CompleteButton onClick={handleComplete}>
            <ButtonText>완료</ButtonText>
          </CompleteButton>
        </ActionSection>
      </ContentArea>
    </PageContainer>
  );
};

export default BrandResultPage; 