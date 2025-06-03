import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import BrandResult from '../../common/BrandResult/BrandResult';
import KeywordTag from '../../common/KeywordTag/KeywordTag';
import { type BrandResultData } from '../../common/BrandResult/BrandResult';
import { BRAND_IMAGE_KEYWORDS, CROP_APPEAL_KEYWORDS, LOGO_IMAGE_KEYWORDS } from '../../../constants/keywords';
import { brandingService, type BrandingProjectCreateRequest, mapGradeToEnum } from '../../../api/brandingService';

// 키워드 ID를 라벨로 변환하는 유틸리티 함수
const getKeywordLabel = (keywordId: string): string => {
  const allKeywords = [...BRAND_IMAGE_KEYWORDS, ...CROP_APPEAL_KEYWORDS, ...LOGO_IMAGE_KEYWORDS];
  const keyword = allKeywords.find(k => k.id === keywordId);
  return keyword ? keyword.label : keywordId;
};

// 애니메이션
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 320px;
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
  white-space: pre-line !important;
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

const CompleteButton = styled.button`
  width: 100%;
  max-width: 300px;
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
  margin-top: 32px;
  animation: ${fadeInUp} 0.8s ease-out 0.6s both;

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

const ActionSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 32px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin: 48px 0;
`;

const LoadingText = styled.div`
  font-family: 'Jalnan 2', sans-serif;
  font-size: 18px;
  color: #1F41BB;
  text-align: center;
`;

const LoadingSubText = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-top: 8px;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

const Dot = styled.div<{ $delay: number }>`
  width: 12px;
  height: 12px;
  background: #1F41BB;
  border-radius: 50%;
  animation: ${fadeInUp} 1.5s infinite;
  animation-delay: ${props => props.$delay}s;
`;

const ErrorContainer = styled.div`
  margin: 24px 0;
  padding: 16px;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.2);
  border-radius: 8px;
`;

const ErrorText = styled.div`
  color: #e74c3c;
  font-family: 'Jalnan 2', sans-serif;
  font-size: 14px;
  text-align: center;
`;

// 브랜드 데이터 생성 함수
const generateBrandData = (brandName: string): BrandResultData => {
  return {
    brandName: brandName,
    promotionText: `${brandName}과 함께하는 건강한 삶`,
    story: `${brandName}은 정성과 사랑으로 키운 특별한 농산물입니다. 자연 그대로의 맛과 영양을 담아, 건강한 식탁을 만들어가는 브랜드입니다.`,
    imageUrl: "https://source.unsplash.com/200x200/?logo"
  };
};

interface BrandResultStepProps {
  brandName: string;
  allKeywords: string[];
  onComplete: () => void;
}

const BrandResultStep: React.FC<BrandResultStepProps> = ({
  brandName,
  allKeywords,
  onComplete
}) => {
  const [brandData, setBrandData] = useState<BrandResultData | null>(null);
  const [showAllKeywords, setShowAllKeywords] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState('브랜드를 완성하고 있어요...');

  // 브랜딩 데이터 추출
  const cropName = localStorage.getItem('brandingCropName') || '토마토';
  const variety = localStorage.getItem('brandingVariety') || '';
  
  // 키워드 분류 개선 (3등분으로 명확히 분류)
  const keywordCount = Math.ceil(allKeywords.length / 3);
  const brandingKeywords = allKeywords.slice(0, keywordCount); // 브랜드 이미지 키워드
  const cropAppealKeywords = allKeywords.slice(keywordCount, keywordCount * 2); // 작물 매력 키워드  
  const logoImageKeywords = allKeywords.slice(keywordCount * 2); // 로고 이미지 키워드

  // 3행(9개)까지만 기본 표시
  const visibleKeywords = showAllKeywords ? allKeywords : allKeywords.slice(0, 9);
  const hasMoreKeywords = allKeywords.length > 9;

  useEffect(() => {
    generateCompleteBrand();
    
    // 로딩 메시지 업데이트 (사용자에게 진행 상황 알림)
    const messages = [
      '브랜드명을 분석하고 있어요...',
      'AI가 브랜드 컨셉을 생성하고 있어요...',
      '브랜드 스토리를 작성하고 있어요...',
      '브랜드 이미지를 생성하고 있어요...',
      '최종 검토 중이에요...'
    ];
    
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      if (messageIndex < messages.length - 1) {
        messageIndex++;
        setLoadingMessage(messages[messageIndex]);
      }
    }, 10000); // 10초마다 메시지 변경
    
    return () => clearInterval(messageInterval);
  }, []);

  const generateCompleteBrand = async () => {
    setIsGenerating(true);
    setError('');

    try {
      // localStorage에서 브랜딩 데이터 가져오기
      const cultivationMethod = localStorage.getItem('brandingCultivationMethod') || '';
      const gradeKorean = localStorage.getItem('brandingGrade') || '중'; // 기본값: 중급
      const isGapVerified = localStorage.getItem('brandingIsGapVerified') === 'true';
      
      // 한글 등급을 백엔드 enum으로 변환
      const gradeEnum = mapGradeToEnum(gradeKorean);
      
      console.log('등급 매핑:', gradeKorean, '->', gradeEnum);
      console.log('브랜딩 요청 시작:', brandName);

      // AI 기반 최종 브랜드 생성 API 호출 요청 데이터
      const request: BrandingProjectCreateRequest = {
        title: `${brandName} 브랜딩 프로젝트`,
        cropName,
        variety: variety || '', // localStorage에서 가져온 품종 정보
        cultivationMethod: cultivationMethod, // localStorage에서 가져온 재배방식
        grade: gradeEnum, // 선택한 등급을 백엔드 enum으로 변환
        brandingKeywords,
        cropAppealKeywords,
        logoImageKeywords,
        hasGapCertification: isGapVerified // localStorage에서 가져온 GAP 인증 여부
      };

      console.log('브랜드 생성 요청 데이터:', request);

      // API 호출 (백엔드에서 프롬프트 자체 생성)
      const response = await brandingService.createBrandingProjectWithAi(request, brandName);
      
      console.log('브랜드 생성 응답:', response);

      // API 응답이 정상적인지 확인
      if (!response) {
        throw new Error('API 응답이 없습니다.');
      }

      // API 응답을 BrandResultData로 변환 (실제 저장된 데이터 그대로 사용)
      const resultData: BrandResultData = {
        brandName: response.generatedBrandName || brandName,
        promotionText: response.brandConcept || `${brandName}과 함께하는 건강한 삶`,
        story: response.brandStory || `${brandName}은 정성과 사랑으로 키운 특별한 농산물입니다.`,
        imageUrl: response.brandImageUrl // 이미지 URL을 바로 설정
      };

      console.log('변환된 결과 데이터:', resultData);

      // 완성된 데이터를 바로 설정
      setBrandData(resultData);
      setIsGenerating(false);

    } catch (error: any) {
      console.error('브랜드 생성 실패:', error);
      
      // 타임아웃이나 네트워크 에러 시 실제 저장된 데이터 조회 시도
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        console.log('타임아웃 발생, 저장된 브랜딩 데이터 조회 시도...');
        
        try {
          // 최근 생성된 브랜딩 프로젝트 목록을 가져와서 현재 브랜드명과 일치하는 것 찾기
          const projects = await brandingService.getBrandingProjects();
          const recentProject = projects.find((p: any) => p.generatedBrandName === brandName);
          
          if (recentProject) {
            console.log('저장된 브랜딩 데이터 발견:', recentProject);
            
            const resultData: BrandResultData = {
              brandName: recentProject.generatedBrandName,
              promotionText: recentProject.brandConcept,
              story: recentProject.brandStory,
              imageUrl: recentProject.brandImageUrl
            };
            
            setBrandData(resultData);
            setIsGenerating(false);
            return; // 성공적으로 데이터를 가져왔으므로 에러 처리 건너뛰기
          }
        } catch (fetchError) {
          console.error('저장된 데이터 조회 실패:', fetchError);
        }
      }
      
      // 구체적인 에러 메시지 설정
      let errorMessage = '브랜드 생성 중 오류가 발생했습니다.';
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = '브랜드 생성이 완료되었지만 응답 시간이 초과되었습니다. 마이페이지에서 확인해주세요.';
      } else if (error.response?.status === 400) {
        errorMessage = '요청 데이터에 문제가 있습니다. 입력 정보를 확인해주세요.';
      } else if (error.response?.status === 401) {
        errorMessage = '로그인이 필요합니다. 다시 로그인해주세요.';
      } else if (error.response?.status === 403) {
        errorMessage = '브랜딩 사용 한도를 초과했습니다. 멤버십을 업그레이드해주세요.';
      } else if (error.response?.status >= 500) {
        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setIsGenerating(false);
      
      // 타임아웃이 아닌 실제 에러인 경우에만 fallback 데이터 표시
      if (!(error.code === 'ECONNABORTED' || error.message?.includes('timeout'))) {
        const fallbackData = generateBrandData(brandName);
        setBrandData(fallbackData);
      }
    }
  };

  const handleCopy = (field: string, value: string) => {
    navigator.clipboard.writeText(value);
    console.log(`${field} 복사됨:`, value);
  };

  const handleDownload = (imageUrl: string) => {
    console.log('이미지 다운로드:', imageUrl);
  };

  const handleShowMore = () => {
    setShowAllKeywords(!showAllKeywords);
  };

  return (
    <Container>
      <Title>브랜드가 만들어졌어요!</Title>
      
      {isGenerating && (
        <LoadingContainer>
          <LoadingText>{loadingMessage}</LoadingText>
          <LoadingSubText>AI가 최고의 브랜딩을 만들어드리고 있어요 (최대 1분 소요)</LoadingSubText>
          <LoadingDots>
            <Dot $delay={0} />
            <Dot $delay={0.2} />
            <Dot $delay={0.4} />
          </LoadingDots>
        </LoadingContainer>
      )}

      {error && (
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
        </ErrorContainer>
      )}

      {brandData && !isGenerating && (
        <>
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
                      {getKeywordLabel(keyword)}
                    </KeywordTag>
                  </KeywordWrapper>
                ))}
              </KeywordGrid>
              <ShowMoreButton 
                $hasMore={hasMoreKeywords} 
                onClick={handleShowMore}
              >
                {showAllKeywords ? '접기' : `더보기 (+${allKeywords.length - 9}개)`}
              </ShowMoreButton>
            </KeywordContainer>
          </KeywordSection>

          <ActionSection>
            <CompleteButton onClick={onComplete}>
              <ButtonText>완료</ButtonText>
            </CompleteButton>
          </ActionSection>
        </>
      )}
    </Container>
  );
};

export default BrandResultStep; 