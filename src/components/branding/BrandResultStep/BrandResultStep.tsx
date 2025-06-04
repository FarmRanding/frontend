import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import BrandResult from '../../common/BrandResult/BrandResult';
import { type BrandResultData } from '../../common/BrandResult/BrandResult';
import { BRAND_IMAGE_KEYWORDS, CROP_APPEAL_KEYWORDS, LOGO_IMAGE_KEYWORDS, getKeywordLabel } from '../../../constants/keywords';
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
  includeFarmName?: boolean;
  brandingKeywords: string[];
  cropAppealKeywords: string[];
  logoImageKeywords: string[];
  hasGapCertification?: boolean;
  gapCertificationNumber?: string;
  gapInstitutionName?: string;
  gapProductName?: string;
}

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
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const KeywordSectionTitle = styled.h3`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.4;
  color: #000000;
  text-align: center;
  margin: 0 0 24px 0;
`;

const KeywordCategory = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const KeywordCategoryTitle = styled.h4`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.2;
  color: #1F41BB;
  margin: 0 0 12px 0;
`;

const KeywordContainer = styled.div`
  position: relative;
`;

const KeywordGrid = styled.div<{ $showAll: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  justify-content: flex-start;
  transition: all 0.3s ease;
`;

const KeywordWrapper = styled.div<{ $index: number; $isVisible: boolean }>`
  animation: ${fadeIn} 0.5s ease-out ${props => 0.6 + props.$index * 0.05}s both;
  display: ${props => props.$isVisible ? 'block' : 'none'};
`;

const KeywordTag = styled.div`
  padding: 6px 12px;
  background: rgba(31, 65, 187, 0.1);
  border: 1px solid rgba(31, 65, 187, 0.2);
  border-radius: 20px;
  font-family: 'Inter', sans-serif !important;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.2;
  color: #1F41BB;
  white-space: nowrap;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(31, 65, 187, 0.15);
    transform: translateY(-1px);
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
  brandingKeywords: string[];
  cropAppealKeywords: string[];
  logoImageKeywords: string[];
  onComplete: () => void;
}

const BrandResultStep: React.FC<BrandResultStepProps> = ({
  brandName,
  brandingKeywords,
  cropAppealKeywords,
  logoImageKeywords,
  onComplete
}) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [brandData, setBrandData] = useState<BrandResultData | null>(null);
  const [error, setError] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState('브랜드를 생성하고 있습니다...');
  const [imageStatus, setImageStatus] = useState<ImageGenerationStatus>('PENDING');
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // localStorage에서 브랜딩 데이터 가져오기
  const cropName = localStorage.getItem('brandingCropName') || '토마토';
  const variety = localStorage.getItem('brandingVariety') || undefined;
  
  console.log('BrandResultStep - 받은 키워드:');
  console.log('- brandingKeywords:', brandingKeywords);
  console.log('- cropAppealKeywords:', cropAppealKeywords);
  console.log('- logoImageKeywords:', logoImageKeywords);

  // 로고 이미지 키워드가 빈 배열인 경우 기본값 설정
  const finalLogoImageKeywords = logoImageKeywords.length > 0 
    ? logoImageKeywords 
    : ['simple', 'modern', 'natural'];
  
  console.log('분할된 키워드:');
  console.log('- brandingKeywords:', brandingKeywords);
  console.log('- cropAppealKeywords:', cropAppealKeywords); 
  console.log('- finalLogoImageKeywords:', finalLogoImageKeywords);

  const getTitle = () => {
    if (isGenerating) {
      return '브랜드를 생성하고\n있습니다.';
    }
    return '브랜드가 완성되었어요!';
  };

  // 점진적 브랜딩 생성
  const generateProgressiveBrand = async () => {
    try {
      setIsGenerating(true);
      setLoadingMessage('브랜드를 생성하고 있습니다...');
      setError('');

      // localStorage에서 브랜딩 정보 가져오기
      const cropName = localStorage.getItem('brandingCropName') || 'Unknown';
      const variety = localStorage.getItem('brandingVariety') || '';
      const cultivationMethod = localStorage.getItem('brandingCultivationMethod') || '';
      const gradeValue = localStorage.getItem('brandingGrade') || '';
      const includeFarmNameValue = localStorage.getItem('brandingIncludeFarmName');
      
      // GAP 인증 관련 정보 가져오기
      const isGapVerified = localStorage.getItem('brandingIsGapVerified') === 'true';
      const gapNumber = localStorage.getItem('brandingGapNumber') || '';
      const gapInstitutionName = localStorage.getItem('brandingGapInstitutionName') || '';
      const gapProductName = localStorage.getItem('brandingGapProductName') || '';
      
      // includeFarmName 값 처리 (문자열을 boolean으로 변환)
      const includeFarmName = includeFarmNameValue === 'true';
      
      console.log('BrandResultStep - localStorage에서 가져온 정보:');
      console.log('- cropName:', cropName);
      console.log('- variety:', variety);
      console.log('- cultivationMethod:', cultivationMethod);
      console.log('- gradeValue:', gradeValue);
      console.log('- includeFarmName:', includeFarmName, '(타입:', typeof includeFarmName, ')');
      console.log('- isGapVerified:', isGapVerified);
      console.log('- gapNumber:', gapNumber);
      console.log('- gapInstitutionName:', gapInstitutionName);
      console.log('- gapProductName:', gapProductName);

      // Grade enum 변환
      let gradeEnum: GradeEnum;
      switch (gradeValue) {
        case '특':
          gradeEnum = 'SPECIAL';
          break;
        case '상':
          gradeEnum = 'FIRST';
          break;
        case '중':
          gradeEnum = 'SECOND';
          break;
        case '하':
          gradeEnum = 'THIRD';
          break;
        default:
          gradeEnum = 'SECOND'; // 기본값: 중급
      }

      const request: ProgressiveBrandingRequest = {
        title: `${brandName} 브랜딩 프로젝트`,
        cropName: cropName,
        variety: variety,
        cultivationMethod: cultivationMethod,
        grade: gradeEnum,
        includeFarmName: includeFarmName,  // 농가명 포함 여부 전달
        brandingKeywords,
        cropAppealKeywords,
        logoImageKeywords,
        hasGapCertification: isGapVerified,
        gapCertificationNumber: isGapVerified ? gapNumber : undefined,
        gapInstitutionName: isGapVerified ? gapInstitutionName : undefined,
        gapProductName: isGapVerified ? gapProductName : undefined,
      };

      console.log('점진적 브랜딩 요청 데이터:', request);

      // 점진적 브랜딩 API 호출 - 텍스트는 즉시 반환, 이미지는 백그라운드 처리
      const params = new URLSearchParams();
      params.append('brandName', brandName);
      
      const response = await apiClient.post<ApiResponse<BrandingApiResponse>>(
        `/api/v1/branding/ai/progressive?${params.toString()}`,
        request,
        {
          signal: abortControllerRef.current?.signal,
          timeout: 30000 // 30초로 증가
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
      
      // 타임아웃 에러인 경우 폴링으로 결과 확인 시도
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        console.log('타임아웃 발생, 폴링으로 결과 확인 시도...');
        setError('');
        setLoadingMessage('브랜드 생성 상태를 확인하고 있습니다...');
        
        // 최근 프로젝트 확인 시도
        await checkRecentProject();
        return;
      }
      
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

  // 최근 프로젝트 확인 (타임아웃 발생 시)
  const checkRecentProject = async () => {
    try {
      const response = await apiClient.get<ApiResponse<BrandingApiResponse[]>>(
        '/api/v1/branding?page=0&size=1'
      );
      
      if (response.data.data && response.data.data.length > 0) {
        const recentProject = response.data.data[0];
        
        // 최근 프로젝트가 현재 브랜드명과 일치하는지 확인
        if (recentProject.generatedBrandName === brandName || 
            recentProject.title?.includes(brandName)) {
          
          console.log('최근 프로젝트 발견:', recentProject);
          setCurrentProjectId(recentProject.id);
          
          const resultData: BrandResultData = {
            brandName: recentProject.generatedBrandName || brandName,
            promotionText: recentProject.brandConcept || `${brandName}과 함께하는 건강한 삶`,
            story: recentProject.brandStory || `${brandName}은 정성과 사랑으로 키운 특별한 농산물입니다.`,
            imageUrl: recentProject.brandImageUrl
          };

          setBrandData(resultData);
          setImageStatus(recentProject.imageGenerationStatus || 'PROCESSING');
          setIsGenerating(false);

          // 이미지가 아직 생성 중이면 polling 시작
          if (!recentProject.brandImageUrl || recentProject.imageGenerationStatus === 'PROCESSING') {
            setLoadingMessage('브랜드 이미지를 생성하고 있습니다...');
            startImagePolling(recentProject.id);
          }
          
          return;
        }
      }
      
      // 매칭되는 프로젝트가 없으면 에러 표시
      throw new Error('생성된 프로젝트를 찾을 수 없습니다.');
      
    } catch (error) {
      console.error('최근 프로젝트 확인 실패:', error);
      setError('브랜드 생성 상태를 확인할 수 없습니다. 잠시 후 다시 시도해주세요.');
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
            
            {/* 브랜드 이미지 키워드 */}
            {brandingKeywords.length > 0 && (
              <KeywordCategory>
                <KeywordCategoryTitle>브랜드 이미지 키워드</KeywordCategoryTitle>
                <KeywordContainer>
                  <KeywordGrid $showAll={true}>
                    {brandingKeywords.map((keyword, index) => (
                      <KeywordWrapper key={keyword} $index={index} $isVisible={true}>
                        <KeywordTag>
                          {getKeywordLabel(keyword)}
                        </KeywordTag>
                      </KeywordWrapper>
                    ))}
                  </KeywordGrid>
                </KeywordContainer>
              </KeywordCategory>
            )}
            
            {/* 작물 매력 키워드 */}
            {cropAppealKeywords.length > 0 && (
              <KeywordCategory>
                <KeywordCategoryTitle>작물 매력 키워드</KeywordCategoryTitle>
                <KeywordContainer>
                  <KeywordGrid $showAll={true}>
                    {cropAppealKeywords.map((keyword, index) => (
                      <KeywordWrapper key={keyword} $index={index} $isVisible={true}>
                        <KeywordTag>
                          {getKeywordLabel(keyword)}
                        </KeywordTag>
                      </KeywordWrapper>
                    ))}
                  </KeywordGrid>
                </KeywordContainer>
              </KeywordCategory>
            )}
            
            {/* 로고 이미지 키워드 */}
            {finalLogoImageKeywords.length > 0 && (
              <KeywordCategory>
                <KeywordCategoryTitle>로고 이미지 키워드</KeywordCategoryTitle>
        <KeywordContainer>
                  <KeywordGrid $showAll={true}>
                    {finalLogoImageKeywords.map((keyword, index) => (
                      <KeywordWrapper key={keyword} $index={index} $isVisible={true}>
                        <KeywordTag>
                  {getKeywordLabel(keyword)}
                </KeywordTag>
              </KeywordWrapper>
            ))}
          </KeywordGrid>
                </KeywordContainer>
              </KeywordCategory>
            )}
          </KeywordSection>

          <CompleteButton 
            onClick={onComplete} 
            disabled={imageStatus === 'PROCESSING' && !brandData?.imageUrl}
          >
            <ButtonText>
              {imageStatus === 'PROCESSING' && !brandData?.imageUrl 
                ? '이미지 생성중입니다...' 
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