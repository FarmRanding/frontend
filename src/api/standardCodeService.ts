import apiClient from './axiosConfig';

console.log('🌍 환경변수 확인:', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  NODE_ENV: import.meta.env.NODE_ENV,
  환경변수전체: import.meta.env
});

export interface CropItem {
  cropCode: string;
  cropName: string;
}

export interface VarietyItem {
  varietyCode: string;
  varietyName: string;
  cropCode: string;
  cropName: string;
}

// 백엔드 FarmrandingResponseBody 형식
export interface FarmrandingApiResponse<T> {
  success: boolean;
  data: T;
  code: string;
  message: string;
}

export interface CropApiResponse extends FarmrandingApiResponse<CropItem[]> {}
export interface VarietyApiResponse extends FarmrandingApiResponse<VarietyItem[]> {}

export class StandardCodeService {
  
  /**
   * 작물 검색
   */
  static async searchCrops(query: string = '', limit: number = 10): Promise<CropItem[]> {
    try {
      const response = await apiClient.get('/api/v1/standard-codes/crops/search', {
        params: { query, limit }
      });
      
      // 백엔드 응답 구조: { code: "FR000", message: "성공", data: [...] }
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      return [];
      
    } catch (error: any) {
      console.error('작물 검색 실패:', error);
      throw error;
    }
  }

  /**
   * 인기 작물 조회
   */
  static async getPopularCrops(limit: number = 20): Promise<CropItem[]> {
    try {
      const response = await apiClient.get('/api/v1/standard-codes/crops/popular', {
        params: { limit }
      });
      
      // 백엔드 응답 구조: { code: "FR000", message: "성공", data: [...] }
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      return [];
      
    } catch (error: any) {
      console.error('인기 작물 조회 실패:', error);
      return []; // 실패 시 빈 배열 반환
    }
  }

  /**
   * 품종 검색 (작물 코드 기반)
   */
  static async searchVarieties(cropCode: string, query: string = '', limit: number = 15): Promise<VarietyItem[]> {
    try {
      const response = await apiClient.get('/api/v1/standard-codes/varieties/search', {
        params: { cropCode, query, limit }
      });
      
      // 백엔드 응답 구조: { code: "FR000", message: "성공", data: [...] }
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      return [];
      
    } catch (error: any) {
      console.error('품종 검색 실패:', error);
      return [];
    }
  }

  /**
   * 표준코드 데이터 동기화
   */
  static async syncData(): Promise<void> {
    try {
      const response = await apiClient.post('/api/v1/standard-codes/sync');
      
      if (response.data && response.data.success === false) {
        throw new Error(response.data.message || '데이터 동기화에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('데이터 동기화 실패:', error);
      throw error;
    }
  }
}

export default StandardCodeService; 