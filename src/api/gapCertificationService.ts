import apiClient from './axiosConfig';
import type { ApiResponse } from '../types/branding';

// GAP 인증 검색 요청 타입
export interface GapSearchRequest {
  certificationNumber: string;
  productName?: string;
}

// GAP 인증 응답 타입 (백엔드와 일치)
export interface GapCertificationResponse {
  certificationNumber: string;
  certificationInstitution: string;
  institutionCode: string;
  individualGroupType: string;
  producerGroupName: string;
  validPeriodStart: string;
  validPeriodEnd: string;
  productName: string;
  productCode: string;
  registeredFarmCount?: number;
  registeredLotCount?: number;
  cultivationArea?: number;
  productionPlanQuantity?: number;
  designationDate: string;
  isValid: boolean;
  currentlyValid: boolean;
}

// GAP 인증 검증 결과 타입
export interface GapValidationResult {
  isValid: boolean;
  certificationInfo?: GapCertificationResponse;
  message: string;
}

// GAP 인증 검색 API
export const searchGapCertification = async (
  request: GapSearchRequest
): Promise<GapCertificationResponse[]> => {
  const response = await apiClient.post<ApiResponse<GapCertificationResponse[]>>(
    '/api/v1/gap/search',
    request
  );
  
  if (response.data.data) {
    return response.data.data;
  }
  
  throw new Error(response.data.message || 'GAP 인증 정보 검색에 실패했습니다.');
};

// GAP 인증번호 검증 API
export const validateGapCertification = async (
  certificationNumber: string
): Promise<GapValidationResult> => {
  try {
    const response = await apiClient.get<ApiResponse<GapCertificationResponse>>(
      `/api/v1/gap/validate/${certificationNumber}`
    );
    
    if (response.data.data) {
      return {
        isValid: true,
        certificationInfo: response.data.data,
        message: 'GAP 인증번호가 확인되었습니다.'
      };
    }
    
    return {
      isValid: false,
      message: response.data.message || 'GAP 인증 정보를 찾을 수 없습니다.'
    };
    
  } catch (error: any) {
    // 404나 기타 에러 처리
    const errorMessage = error.response?.data?.message || 'GAP 인증번호를 찾을 수 없습니다. 다시 확인해 주세요.';
    
    return {
      isValid: false,
      message: errorMessage
    };
  }
};

// GAP 인증 서비스 객체
export const gapCertificationService = {
  // GAP 인증 검색
  async searchCertification(request: GapSearchRequest): Promise<GapCertificationResponse[]> {
    return searchGapCertification(request);
  },

  // GAP 인증번호 검증
  async validateCertificationNumber(certificationNumber: string): Promise<GapValidationResult> {
    try {
      // search API를 사용하여 실제 GAP 정보 조회
      const response = await apiClient.post<ApiResponse<GapCertificationResponse>>(
        '/api/v1/gap/search',
        { 
          certificationNumber: certificationNumber,
          productName: null 
        }
      );
      
      if (response.data.data) {
        return {
          isValid: true,
          certificationInfo: response.data.data,
          message: 'GAP 인증번호가 확인되었습니다.'
        };
      }
      
      return {
        isValid: false,
        message: response.data.message || 'GAP 인증 정보를 찾을 수 없습니다.'
      };
      
    } catch (error: any) {
      // 404나 기타 에러 처리
      const errorMessage = error.response?.data?.message || 'GAP 인증번호를 찾을 수 없습니다. 다시 확인해 주세요.';
      
      return {
        isValid: false,
        message: errorMessage
      };
    }
  },

  // GAP 인증번호 형식 검증 (프론트엔드 사전 검증)
  validateCertificationFormat(certificationNumber: string): boolean {
    // 백엔드와 동일한 검증 로직: 7-15자리 숫자
    const cleanNumber = certificationNumber.replace(/\D/g, '');
    return cleanNumber.length >= 7 && cleanNumber.length <= 15;
  }
};

export default gapCertificationService; 