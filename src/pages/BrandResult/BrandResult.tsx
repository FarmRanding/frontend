import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import BrandResult from '../../components/common/BrandResult/BrandResult';
import KeywordTag from '../../components/common/KeywordTag/KeywordTag';
import iconCancel from '../../assets/icon-cancel.svg';
import { type BrandResultData } from '../../components/common/BrandResult/BrandResult';

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
    story: `한 줄기 햇살이 강원도의 붉은 흙을 비추던 어느 봄날,
하은 농장의 밭 한가운데 작은 씨감자가 심어졌습니다.
그 씨감자는 아무 말 없이, 하지만 누구보다 단단한 마음으로 뿌리를 내렸습니다.

${brandName}은 화학비료 대신 미생물 퇴비,
물 맑고 공기 좋은 고랭지 토양에서 천천히 자랍니다.
더디지만 자연의 속도에 맞춘 그 기다림은,
감자의 속살을 더 단단하고 촉촉하게,
맛은 더 달콤하게 만들어줍니다.

이 감자를 키운 사람은,
도시에서 내려와 흙을 배우기 시작한 청년 농부.
바로 '하은'이라는 이름을 가진 농부는
감자 한 알 한 알에 "정직한 먹거리, 건강한 식탁"이라는 신념을 담습니다.

감자는 감자지만, ${brandName}은 다릅니다.
껍질째 쪄먹어도 고소하고, 튀겨도 물이 덜 생깁니다.
아이들에게 안심하고 줄 수 있는,
그래서 도시의 젊은 부모들이 먼저 찾는 감자입니다.

지금 당신의 식탁 위에 올라올
그 작은 감자 하나에도,
흙의 시간과 사람의 진심이 고스란히 담겨 있습니다.`,
    imageUrl: "https://placehold.co/200x200/E8F4FF/1F41BB?text=Brand+Logo"
  };
};

const BrandResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [brandData, setBrandData] = useState<BrandResultData | null>(null);
  const [showAllKeywords, setShowAllKeywords] = useState(false);

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

  useEffect(() => {
    setBrandData(generateBrandData(receivedBrandName));
  }, [receivedBrandName]);

  const handleClose = () => {
    navigate('/');
  };

  const handleComplete = () => {
    console.log('브랜드 생성 완료!');
    console.log('브랜드명:', receivedBrandName);
    console.log('선택된 키워드:', receivedKeywords);
    
    alert('브랜드가 성공적으로 생성되었습니다!');
    navigate('/mypage');
  };

  const handleCopy = (field: string, value: string) => {
    console.log(`${field} 복사됨:`, value);
  };

  const handleDownload = (imageUrl: string) => {
    console.log('이미지 다운로드:', imageUrl);
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
          브랜드를 완성하고 있어요...
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
            isPremium={false}
            onCopy={handleCopy}
            onDownload={handleDownload}
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