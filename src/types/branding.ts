// API 공통 응답 타입
export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

// 브랜딩 API 응답 타입
export interface BrandingApiResponse {
  id: number;
  title: string;
  userId: number;
  cropName: string;
  variety: string;
  cultivationMethod: string;
  grade: string;
  brandingKeywords: string[];
  cropAppealKeywords: string[];
  logoImageKeywords: string[];
  gapNumber: string;
  isGapVerified: boolean;
  generatedBrandName: string;
  brandConcept: string;
  brandStory: string;
  brandImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

// UI에서 사용하는 브랜딩 히스토리 타입
export interface BrandingHistory {
  id: string;
  title: string;
  description: string;
  story: string;
  imageUrl?: string;
  createdAt: string;
}

// API 응답을 UI 형식으로 변환하는 유틸 함수
export const mapBrandingApiToHistory = (apiData: BrandingApiResponse): BrandingHistory => {
  try {
    return {
      id: apiData.id?.toString() || '0',
      title: apiData.generatedBrandName || '브랜드명 없음',
      description: apiData.brandConcept || '설명 없음',
      story: apiData.brandStory || '스토리 없음',
      imageUrl: apiData.brandImageUrl || undefined,
      createdAt: formatApiDateToDisplay(apiData.createdAt || new Date().toISOString())
    };
  } catch (error) {
    console.error('브랜딩 데이터 매핑 에러:', error, '원본 데이터:', apiData);
    return {
      id: '0',
      title: '데이터 오류',
      description: '데이터를 불러올 수 없습니다',
      story: '데이터 오류가 발생했습니다',
      imageUrl: undefined,
      createdAt: formatApiDateToDisplay(new Date().toISOString())
    };
  }
};

// ISO 날짜를 "YYYY.MM.DD" 형식으로 변환
export const formatApiDateToDisplay = (isoDate: string): string => {
  try {
    const date = new Date(isoDate);
    
    // 유효하지 않은 날짜인지 확인
    if (isNaN(date.getTime())) {
      console.warn('유효하지 않은 날짜 형식:', isoDate);
      return '날짜 없음';
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  } catch (error) {
    console.error('날짜 포맷팅 에러:', error, '원본 날짜:', isoDate);
    return '날짜 오류';
  }
}; 