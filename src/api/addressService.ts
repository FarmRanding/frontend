import { api } from './axiosConfig';

export interface LegalDistrictResponse {
  code: string;
  sido: string;
  sigungu: string;
  dong: string;
  ri: string;
  fullAddress: string;
}

export interface SearchLegalDistrictsResponse {
  success: boolean;
  data: LegalDistrictResponse[];
  message: string;
}

/**
 * 법정동 검색 API 서비스
 */
export const addressService = {
  /**
   * 키워드로 법정동 검색
   * @param keyword 검색 키워드
   * @param limit 최대 결과 수 (기본 20개)
   * @returns 검색된 법정동 목록
   */
  async searchLegalDistricts(
    keyword: string, 
    limit: number = 20
  ): Promise<LegalDistrictResponse[]> {
    try {
      const response = await api.get<SearchLegalDistrictsResponse>(
        '/api/v1/address/search',
        {
          params: {
            keyword,
            limit,
          },
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error('법정동 검색 실패:', error);
      throw error;
    }
  },
}; 