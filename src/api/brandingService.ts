import apiClient from './axiosConfig';
import type { BrandingApiResponse, ApiResponse } from '../types/branding';

// 백엔드 Grade enum과 일치하는 타입
export type GradeEnum = 'SPECIAL' | 'FIRST' | 'SECOND' | 'THIRD' | 'PREMIUM';

// 한글 등급을 백엔드 enum으로 매핑하는 함수
export const mapGradeToEnum = (gradeKorean: string): GradeEnum => {
  switch (gradeKorean) {
    case '특':
      return 'SPECIAL';
    case '상':
      return 'FIRST';
    case '중':
      return 'SECOND';
    case '하':
      return 'THIRD';
    case '프리미엄':
      return 'PREMIUM';
    default:
      return 'SECOND'; // 기본값: 중급
  }
};

// 브랜드명 생성 요청 타입
export interface BrandNameRequest {
  cropName: string;
  variety?: string;
  brandingKeywords: string[];
  cropAppealKeywords?: string[];
  previousBrandNames?: string[];
}

// 브랜드명 생성 응답 타입
export interface BrandNameResponse {
  brandName: string;
}

// 브랜딩 프로젝트 생성 요청 타입 (백엔드와 일치하도록 수정)
export interface BrandingProjectCreateRequest {
  title: string;
  cropName: string;
  variety?: string;
  cultivationMethod?: string;
  grade?: GradeEnum;  // 백엔드 enum과 일치
  includeFarmName?: boolean;  // 농가명 포함 여부 추가
  brandingKeywords: string[];
  cropAppealKeywords: string[];
  logoImageKeywords: string[];
  hasGapCertification?: boolean;  // GAP 인증 여부
  gapCertificationNumber?: string;  // GAP 인증번호
  gapInstitutionName?: string;  // GAP 인증기관명
  gapProductName?: string;  // GAP 인증 품목명
}

// 브랜딩 목록 조회 API
export const fetchBrandingList = async (): Promise<BrandingApiResponse[]> => {
  const response = await apiClient.get<ApiResponse<BrandingApiResponse[]>>('/api/v1/branding');
  if (response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || '브랜딩 목록 조회에 실패했습니다.');
};

// 브랜딩 상세 조회 API
export const fetchBrandingDetail = async (projectId: number): Promise<BrandingApiResponse> => {
  const response = await apiClient.get<ApiResponse<BrandingApiResponse>>(`/api/v1/branding/${projectId}`);
  if (response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || '브랜딩 상세 조회에 실패했습니다.');
};

// 브랜딩 삭제 API
export const deleteBranding = async (projectId: number): Promise<void> => {
  await apiClient.delete(`/api/v1/branding/${projectId}`);
};

// 브랜딩 서비스 객체 (기존 컴포넌트 호환성을 위해)
export const brandingService = {
  // 브랜드명 생성
  async generateBrandName(request: BrandNameRequest): Promise<BrandNameResponse> {
    const response = await apiClient.post<ApiResponse<BrandNameResponse>>(
      '/api/v1/branding/brand-name',
      request
    );
    return response.data.data;
  },

  // AI 기반 최종 브랜드 생성
  async generateAiBranding(
    request: BrandingProjectCreateRequest,
    brandName: string
  ): Promise<BrandingApiResponse> {
    // 쿼리 파라미터는 brandName만 필요 (백엔드에서 프롬프트 자체 생성)
    const params = new URLSearchParams();
    params.append('brandName', brandName);
    
    const response = await apiClient.post<ApiResponse<BrandingApiResponse>>(
      `/api/v1/branding/ai?${params.toString()}`,
      request
    );
    
    if (!response.data.data) {
      throw new Error(response.data.message || 'API 응답 데이터가 없습니다.');
    }
    
    return response.data.data;
  },

  // 브랜딩 프로젝트 목록 조회
  async getBrandingProjects(): Promise<BrandingApiResponse[]> {
    return fetchBrandingList();
  },

  // 특정 브랜딩 프로젝트 조회
  async getBrandingProject(projectId: number): Promise<BrandingApiResponse> {
    return fetchBrandingDetail(projectId);
  },

  // 브랜딩 프로젝트 삭제
  async deleteBrandingProject(projectId: number): Promise<void> {
    return deleteBranding(projectId);
  }
}; 