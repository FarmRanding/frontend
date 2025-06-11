import apiClient from './axiosConfig';
import type { YearlyPriceData } from './priceDataService';

// 가격 제안 저장 요청 타입
export interface PriceQuoteSaveRequest {
  productId?: number;
  garakCode: string;
  productName: string;
  grade: string;
  harvestDate: string; // YYYY-MM-DD 형식
  unit?: string;
  quantity?: number;
  finalPrice: number;
  minPrice?: number;
  maxPrice?: number;
  avgPrice?: number;
  yearlyPriceData: string; // JSON 문자열
  lookupDate: string; // YYYY-MM-DD 형식
}

// 가격 제안 응답 타입
export interface PriceQuoteResponse {
  id: number;
  userId: number;
  productId?: number;
  garakCode: string;
  productName: string;
  grade: string;
  harvestDate: string;
  unit?: string;
  quantity?: number;
  finalPrice: number;
  minPrice?: number;
  maxPrice?: number;
  avgPrice?: number;
  fairPrice?: number;
  yearlyPriceData?: string;
  chartMinPrice?: number;
  chartMaxPrice?: number;
  lookupDate?: string;
  analysisResult?: string;
  hasAnalysisResult?: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 가격 제안 API 서비스
 */
export class PriceQuoteService {
  
  /**
   * 가격 제안 결과 저장
   */
  static async savePriceQuoteResult(request: PriceQuoteSaveRequest): Promise<PriceQuoteResponse> {
    try {
      const response = await apiClient.post('/api/v1/price-quotes/save-result', request);
      
      if (response.data && response.data.data) {
        return response.data.data as PriceQuoteResponse;
      }
      
      throw new Error('가격 제안 저장 응답이 올바르지 않습니다.');
      
    } catch (error: any) {
      console.error('가격 제안 저장 실패:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('가격 제안 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }
  
  /**
   * 내 가격 제안 이력 조회
   */
  static async getMyPriceQuotes(): Promise<PriceQuoteResponse[]> {
    try {
      const response = await apiClient.get('/api/v1/price-quotes');
      
      if (response.data && response.data.data) {
        return response.data.data as PriceQuoteResponse[];
      }
      
      throw new Error('가격 제안 이력 조회 응답이 올바르지 않습니다.');
      
    } catch (error: any) {
      console.error('가격 제안 이력 조회 실패:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('가격 제안 이력 조회에 실패했습니다.');
    }
  }
  
  /**
   * 가격 제안 상세 조회
   */
  static async getPriceQuote(id: number): Promise<PriceQuoteResponse> {
    try {
      const response = await apiClient.get(`/api/v1/price-quotes/${id}`);
      
      if (response.data && response.data.data) {
        return response.data.data as PriceQuoteResponse;
      }
      
      throw new Error('가격 제안 상세 조회 응답이 올바르지 않습니다.');
      
    } catch (error: any) {
      console.error('가격 제안 상세 조회 실패:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('가격 제안 상세 조회에 실패했습니다.');
    }
  }
  
  /**
   * 가격 제안 삭제
   */
  static async deletePriceQuote(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/v1/price-quotes/${id}`);
    } catch (error: any) {
      console.error('가격 제안 삭제 실패:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('가격 제안 삭제에 실패했습니다.');
    }
  }
  
  /**
   * YearlyPriceData를 JSON 문자열로 변환
   */
  static yearlyPriceDataToJson(data: YearlyPriceData[]): string {
    return JSON.stringify(data);
  }
  
  /**
   * JSON 문자열을 YearlyPriceData로 변환
   */
  static jsonToYearlyPriceData(json: string): YearlyPriceData[] {
    try {
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('JSON 파싱 실패:', error);
      return [];
    }
  }
  
  /**
   * PriceQuoteResponse를 프론트엔드 타입으로 변환
   */
  static toFrontendType(response: PriceQuoteResponse): any {
    return {
      id: response.id.toString(),
      request: {
        productName: response.productName,
        grade: response.grade,
        harvestDate: new Date(response.harvestDate)
      },
      result: {
        fairPrice: response.finalPrice || response.fairPrice || 0,
        priceData: response.yearlyPriceData ? 
          this.jsonToYearlyPriceData(response.yearlyPriceData).map(item => ({
            date: item.year,
            minPrice: response.minPrice || 0,
            maxPrice: response.maxPrice || 0,
            avgPrice: item.price
          })) : []
      },
      createdAt: new Date(response.createdAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\./g, '.').replace(/ /g, ''),
      unit: response.unit || 'kg',
      quantity: response.quantity || 1
    };
  }
} 