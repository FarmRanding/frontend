import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import BrandResult from '../../common/BrandResult/BrandResult';
import KeywordTag from '../../common/KeywordTag/KeywordTag';
import { type BrandResultData } from '../../common/BrandResult/BrandResult';
import { BRAND_IMAGE_KEYWORDS, CROP_APPEAL_KEYWORDS, LOGO_IMAGE_KEYWORDS } from '../../../constants/keywords';
import apiClient from '../../../api/axiosConfig';
import type { BrandingApiResponse, ApiResponse } from '../../../types/branding';

// 백엔드 Grade enum과 일치하는 타입
type GradeEnum = 'SPECIAL' | 'FIRST' | 'SECOND' | 'THIRD' | 'PREMIUM';

// 이미지 생성 상태 타입
type ImageGenerationStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

// 한글 등급을 백엔드 enum으로 매핑하는 함수
const mapGradeToEnum = (gradeKorean: string): GradeEnum => {
  switch (gradeKorean) {
    case '특':
      return 'SPECIAL';
    case '상':
      return 'FIRST';
    case '중':
      return 'SECOND';
    case '하':
      return 'THIRD';
    default:
      return 'SECOND'; // 기본값: 중급
  }
};

// 점진적 브랜딩 프로젝트 생성 요청 타입
interface ProgressiveBrandingRequest {
  title: string;
  cropName: string;
  variety?: string;
  cultivationMethod?: string;
  grade?: GradeEnum;
  brandingKeywords: string[];
  cropAppealKeywords: string[];
  logoImageKeywords: string[];
  hasGapCertification?: boolean;
}

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

const pulse = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 320px;
`;

const Title = styled.h1<{ $isGenerating: boolean }>`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 24px;
  line-height: 1.67;
  letter-spacing: 4.17%;
  text-align: center;
  color: ${props => props.$isGenerating ? '#1F41BB' : '#000000'};
  margin: 0 0 64px 0;
  white-space: pre-line !important;
  animation: ${fadeIn} 0.8s ease-out;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  animation: ${fadeInUp} 0.8s ease-out;
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
  max-width: 280px;
  line-height: 1.4;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 4px;
  justify-content: center;
`;

const Dot = styled.div<{ $delay: number }>`
  width: 8px;
  height: 8px;
  background: #1F41BB;
  border-radius: 50%;
  animation: ${pulse} 1.5s infinite;
  animation-delay: ${props => props.$delay}s;
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
  transition: all 0.3s ease;
`;

const KeywordWrapper = styled.div<{ $index: number; $isVisible: boolean }>`
  animation: ${fadeIn} 0.5s ease-out ${props => 0.6 + props.$index * 0.05}s both;
  display: ${props => props.$isVisible ? 'block' : 'none'};
`;

const ShowMoreButton = styled.button`
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
  display: flex;
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

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
    
    &::before {
      display: none;
    }
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(31, 65, 187, 0.4);
  }

  &:active:not(:disabled) {
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

  &:hover:not(:disabled)::before {
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
  
  button:disabled & {
    color: #888888;
  }
`;

const ErrorContainer = styled.div`
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.2);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const ErrorText = styled.div`
  color: #e74c3c;
  font-family: 'Jalnan 2', sans-serif;
  font-size: 14px;
  text-align: center;
  line-height: 1.4;
`;

const DEFAULT_VISIBLE_COUNT = 6;

// Fallback 브랜드 데이터 생성
const generateBrandData = (brandName: string): BrandResultData => {
  return {
    brandName,
    promotionText: `${brandName}과 함께하는 건강한 삶`,
    story: `${brandName}은 정성과 사랑으로 키운 특별한 농산물입니다. 우리의 정직한 재배 방식과 깐깐한 품질 관리를 통해 최고의 맛과 영양을 선사합니다.`,
    imageUrl: undefined // 이미지는 백그라운드에서 생성
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
  const [isGenerating, setIsGenerating] = useState(true);
  const [brandData, setBrandData] = useState<BrandResultData | null>(null);
  const [showAllKeywords, setShowAllKeywords] = useState(false);
  const [error, setError] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState('브랜드를 생성하고 있습니다...');
  const [imageStatus, setImageStatus] = useState<ImageGenerationStatus>('PENDING');
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // localStorage에서 브랜딩 데이터 가져오기
  const cropName = localStorage.getItem('brandingCropName') || '토마토';
  const variety = localStorage.getItem('brandingVariety') || undefined;
  
  // allKeywords 배열 분할 로직 수정 - 실제 키워드 개수에 따라 동적 분할
  console.log('전체 키워드 배열:', allKeywords);
  console.log('전체 키워드 개수:', allKeywords.length);
  
  // 키워드 타입별 개수 확인
  const totalKeywords = allKeywords.length;
  let brandingKeywords: string[] = [];
  let cropAppealKeywords: string[] = [];
  let logoImageKeywords: string[] = [];
  
  if (totalKeywords >= 15) {
    // 15개 이상인 경우: 5개씩 분할
    brandingKeywords = allKeywords.slice(0, 5);
    cropAppealKeywords = allKeywords.slice(5, 10);
    logoImageKeywords = allKeywords.slice(10, 15);
  } else if (totalKeywords >= 10) {
    // 10-14개인 경우: 브랜딩 5개, 작물매력 5개, 나머지는 로고 키워드
    brandingKeywords = allKeywords.slice(0, 5);
    cropAppealKeywords = allKeywords.slice(5, 10);
    logoImageKeywords = allKeywords.slice(10);
  } else if (totalKeywords >= 5) {
    // 5-9개인 경우: 절반씩 나누고 나머지는 로고 키워드
    const half = Math.floor(totalKeywords / 2);
    brandingKeywords = allKeywords.slice(0, half);
    cropAppealKeywords = allKeywords.slice(half, Math.min(totalKeywords, half * 2));
    logoImageKeywords = allKeywords.slice(half * 2);
  } else {
    // 5개 미만인 경우: 모든 키워드를 각 타입에 복사
    brandingKeywords = [...allKeywords];
    cropAppealKeywords = [...allKeywords];
    logoImageKeywords = [...allKeywords];
  }
  
  // 로고 이미지 키워드가 빈 배열인 경우 기본값 설정
  if (logoImageKeywords.length === 0) {
    console.warn('로고 이미지 키워드가 빈 배열입니다. 기본값을 사용합니다.');
    logoImageKeywords = ['simple', 'modern', 'natural']; // 기본 키워드
  }
  
  console.log('분할된 키워드:');
  console.log('- brandingKeywords:', brandingKeywords);
  console.log('- cropAppealKeywords:', cropAppealKeywords); 
  console.log('- logoImageKeywords:', logoImageKeywords);

  const getTitle = () => {
    if (isGenerating) {
      return '브랜드를 생성하고\n있습니다.';
    }
    return '브랜드가 완성되었어요!';
  };

  // 점진적 브랜딩 생성
  const generateProgressiveBrand = async () => {
    setIsGenerating(true);
    setError('');
    setLoadingMessage('브랜드 텍스트를 생성하고 있습니다...');

    // 이전 요청이 있다면 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 새로운 AbortController 생성
    abortControllerRef.current = new AbortController();

    try {
      // localStorage에서 브랜딩 데이터 가져오기
      const cultivationMethod = localStorage.getItem('brandingCultivationMethod') || '';
      const gradeKorean = localStorage.getItem('brandingGrade') || '중';
      const isGapVerified = localStorage.getItem('brandingIsGapVerified') === 'true';
      
      // 한글 등급을 백엔드 enum으로 변환
      const gradeEnum = mapGradeToEnum(gradeKorean);
      
      console.log('점진적 브랜딩 요청 시작:', brandName);

      // 점진적 브랜딩 API 호출 요청 데이터
      const request: ProgressiveBrandingRequest = {
        title: `${brandName} 브랜딩 프로젝트`,
        cropName,
        variety: variety || '',
        cultivationMethod: cultivationMethod,
        grade: gradeEnum,
        brandingKeywords,
        cropAppealKeywords,
        logoImageKeywords,
        hasGapCertification: isGapVerified
      };

      console.log('점진적 브랜딩 요청 데이터:', request);

      // 점진적 브랜딩 API 호출 - 텍스트는 즉시 반환, 이미지는 백그라운드 처리
      const params = new URLSearchParams();
      params.append('brandName', brandName);
      
      const response = await apiClient.post<ApiResponse<BrandingApiResponse>>(
        `/api/v1/branding/ai/progressive?${params.toString()}`,
        request,
        {
          signal: abortControllerRef.current.signal,
          timeout: 10000 // 10초 타임아웃 (텍스트 생성은 빠름)
        }
      );
      
      console.log('점진적 브랜딩 API 응답:', response.data);
      
      if (!response.data.data) {
        throw new Error(response.data.message || 'API 응답 데이터가 없습니다.');
      }

      const projectData = response.data.data;
      setCurrentProjectId(projectData.id);
      
      // 텍스트 데이터는 즉시 표시 (5초 내 완료)
      const resultData: BrandResultData = {
        brandName: projectData.generatedBrandName || brandName,
        promotionText: projectData.brandConcept || `${brandName}과 함께하는 건강한 삶`,
        story: projectData.brandStory || `${brandName}은 정성과 사랑으로 키운 특별한 농산물입니다.`,
        imageUrl: projectData.brandImageUrl // 초기에는 undefined일 수 있음
      };

      console.log('점진적 브랜딩 결과 데이터:', resultData);

      setBrandData(resultData);
      setImageStatus(projectData.imageGenerationStatus || 'PROCESSING');
      setIsGenerating(false);

      // 이미지가 아직 생성 중이면 polling 시작
      if (!projectData.brandImageUrl || projectData.imageGenerationStatus === 'PROCESSING') {
        setLoadingMessage('브랜드 이미지를 생성하고 있습니다...');
        startImagePolling(projectData.id);
      }

    } catch (error: any) {
      // 요청이 취소된 경우는 무시
      if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
        console.log('요청이 취소되었습니다.');
        return;
      }

      console.error('점진적 브랜딩 생성 실패:', error);
      
      // 구체적인 에러 메시지 설정
      let errorMessage = '브랜드 생성 중 오류가 발생했습니다.';
      if (error.response?.status === 400) {
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
      
      // Fallback 데이터 표시
      const fallbackData = generateBrandData(brandName);
      setBrandData(fallbackData);
      setImageStatus('FAILED');
    }
  };

  // 이미지 생성 상태 폴링
  const startImagePolling = (projectId: number) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    let attempts = 0;
    const maxAttempts = 60; // 최대 5분 (5초 간격)

    pollingIntervalRef.current = setInterval(async () => {
      attempts++;
      
      try {
        console.log(`이미지 상태 확인 중... (${attempts}/${maxAttempts})`);
        
        const response = await apiClient.get<ApiResponse<BrandingApiResponse>>(
          `/api/v1/branding/${projectId}`
        );

        if (response.data.data) {
          const projectData = response.data.data;
          const newImageStatus = projectData.imageGenerationStatus;
          
          console.log('이미지 생성 상태:', newImageStatus);
          setImageStatus(newImageStatus || 'PROCESSING');

          // 이미지 생성 완료 시
          if (newImageStatus === 'COMPLETED' && projectData.brandImageUrl) {
            console.log('이미지 생성 완료:', projectData.brandImageUrl);
            
            setBrandData(prev => prev ? {
              ...prev,
              imageUrl: projectData.brandImageUrl
            } : null);
            
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
          }
          
          // 이미지 생성 실패 시
          else if (newImageStatus === 'FAILED') {
            console.log('이미지 생성 실패');
            
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
          }
        }

        // 최대 시도 횟수 초과 시 폴링 중단
        if (attempts >= maxAttempts) {
          console.log('이미지 생성 폴링 시간 초과');
          setImageStatus('FAILED');
          
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
        }

      } catch (error) {
        console.error('이미지 상태 확인 실패:', error);
        
        // 연속 실패 시 폴링 중단
        if (attempts >= 5) {
          setImageStatus('FAILED');
          
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
        }
      }
    }, 5000); // 5초마다 확인
  };

  useEffect(() => {
    generateProgressiveBrand();
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

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

  // 이미지 상태에 따른 UI 렌더링
  const renderBrandResult = () => {
    if (!brandData) return null;

    // 모든 상태에서 BrandResult 컴포넌트만 렌더링
    // 이미지 로딩/실패 상태는 BrandResult 컴포넌트 내부에서 처리됨
    return (
      <BrandResult
        data={brandData}
        isPremium={false}
        onCopy={handleCopy}
        onDownload={handleDownload}
      />
    );
  };

  return (
    <Container>
      <Title $isGenerating={isGenerating}>{getTitle()}</Title>
      
      {isGenerating && (
        <LoadingContainer>
          <LoadingText>{loadingMessage}</LoadingText>
          <LoadingSubText>텍스트를 먼저 생성하고, 이미지는 백그라운드에서 처리됩니다</LoadingSubText>
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
            {renderBrandResult()}
          </BrandResultContainer>

          <KeywordSection>
            <KeywordSectionTitle>선택한 키워드</KeywordSectionTitle>
            <KeywordContainer>
              <KeywordGrid $showAll={showAllKeywords}>
                {allKeywords.map((keyword, index) => {
                  const isVisible = showAllKeywords || index < DEFAULT_VISIBLE_COUNT;
                  return (
                    <KeywordWrapper key={keyword} $index={index} $isVisible={isVisible}>
                      <KeywordTag variant="selected">
                        {getKeywordLabel(keyword)}
                      </KeywordTag>
                    </KeywordWrapper>
                  );
                })}
              </KeywordGrid>
              
              {allKeywords.length > DEFAULT_VISIBLE_COUNT && (
                <ShowMoreButton onClick={handleShowMore}>
                  {showAllKeywords ? '키워드 접기' : `키워드 ${allKeywords.length - DEFAULT_VISIBLE_COUNT}개 더보기`}
                </ShowMoreButton>
              )}
            </KeywordContainer>
          </KeywordSection>

          <CompleteButton 
            onClick={onComplete} 
            disabled={imageStatus === 'PROCESSING' && !brandData?.imageUrl}
          >
            <ButtonText>
              {imageStatus === 'PROCESSING' && !brandData?.imageUrl 
                ? '이미지 로딩중입니다...' 
                : '마이페이지로 이동'
              }
            </ButtonText>
          </CompleteButton>
        </>
      )}
    </Container>
  );
};

export default BrandResultStep; 