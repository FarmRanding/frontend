import apiClient from './axiosConfig';

// 가격 조회 요청 타입
export interface PriceDataRequest {
  garakCode: string;
  targetDate: string; // YYYY-MM-DD 형식
  grade: '특' | '상' | '중' | '하';
}

// 년도별 가격 데이터 타입
export interface YearlyPriceData {
  year: string;
  price: number;
}

// 가격 조회 응답 타입
export interface PriceDataResponse {
  productName: string;
  grade: string;
  unit: string;
  period: string;
  averagePrice: number;
  recommendedPrice: number;
  yearlyPrices: YearlyPriceData[];
  standardPrice: number;
}

/**
 * 가락시장 기반 가격 조회 서비스
 */
export class PriceDataService {
  
  /**
   * 가격 데이터 조회
   * 
   * @param request 가격 조회 요청
   * @returns 5년간 가격 데이터 및 평균가격
   */
  static async lookupPrice(request: PriceDataRequest): Promise<PriceDataResponse> {
    try {
      const response = await apiClient.post('/api/v1/price-data/lookup', request);
      
      if (response.data && response.data.data) {
        return response.data.data as PriceDataResponse;
      }
      
      throw new Error('가격 데이터 응답이 올바르지 않습니다.');
      
    } catch (error: any) {
      console.error('가격 조회 실패:', error);
      
      // 백엔드 에러 메시지가 있으면 사용
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('가격 조회에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }
  
  /**
   * 등급 표시명 변환
   */
  static getGradeDisplayName(grade: string): string {
    const gradeMap: { [key: string]: string } = {
      '특': '특급',
      '상': '상급', 
      '중': '중급',
      '하': '하급'
    };
    return gradeMap[grade] || grade;
  }
  
  /**
   * 가격 포맷팅 (천단위 콤마)
   */
  static formatPrice(price: number): string {
    return price.toLocaleString('ko-KR');
  }
  
  /**
   * 가격 변화율 계산 (전년 대비)
   */
  static calculatePriceChangeRate(yearlyPrices: YearlyPriceData[]): number {
    if (yearlyPrices.length < 2) return 0;
    
    // 최신 년도와 전년도 가격 비교
    const currentPrice = yearlyPrices[0].price;
    const previousPrice = yearlyPrices[1].price;
    
    if (previousPrice === 0) return 0;
    
    return ((currentPrice - previousPrice) / previousPrice) * 100;
  }
} 