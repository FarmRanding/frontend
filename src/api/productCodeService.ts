import apiClient from './axiosConfig';

// ProductCode 타입 정의
export interface ProductCodeItem {
  id: number;
  garakCode: string;
  productName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 백엔드 ProductCode API 서비스
 * 가락시장 품목 코드 데이터 관리
 */
export class ProductCodeService {
  
  /**
   * 품목 검색 (키워드 기반)
   */
  static async searchProducts(keyword: string = '', limit?: number): Promise<ProductCodeItem[]> {
    try {
      const response = await apiClient.get('/api/v1/product-codes/search', {
        params: { keyword }
      });
      
      // 백엔드 응답 구조: { code: "FR000", message: "성공", data: [...] }
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        let products = response.data.data as ProductCodeItem[];
        
        // 검색 키워드가 있는 경우 일치율 순서로 정렬
        if (keyword.trim()) {
          products = this.sortByRelevance(products, keyword.trim());
        }
        
        // limit이 지정된 경우 제한
        if (limit && limit > 0) {
          return products.slice(0, limit);
        }
        
        return products;
      }
      
      return [];
      
    } catch (error: any) {
      console.error('품목 검색 실패:', error);
      return [];
    }
  }

  /**
   * 검색 결과를 일치율 순서로 정렬
   * 1. 완전 일치 (키워드 === 품목명)
   * 2. 시작 일치 (품목명이 키워드로 시작)
   * 3. 포함 일치 (품목명에 키워드 포함)
   * 4. 각 그룹 내에서는 품목명 길이 순 (짧은 것부터)
   */
  private static sortByRelevance(products: ProductCodeItem[], keyword: string): ProductCodeItem[] {
    const lowerKeyword = keyword.toLowerCase();
    
    return products.sort((a, b) => {
      const aName = a.productName.toLowerCase();
      const bName = b.productName.toLowerCase();
      
      // 완전 일치 체크
      const aExactMatch = aName === lowerKeyword;
      const bExactMatch = bName === lowerKeyword;
      
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;
      if (aExactMatch && bExactMatch) return a.productName.length - b.productName.length;
      
      // 시작 일치 체크
      const aStartsWith = aName.startsWith(lowerKeyword);
      const bStartsWith = bName.startsWith(lowerKeyword);
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      if (aStartsWith && bStartsWith) return a.productName.length - b.productName.length;
      
      // 포함 일치 체크
      const aIncludes = aName.includes(lowerKeyword);
      const bIncludes = bName.includes(lowerKeyword);
      
      if (aIncludes && !bIncludes) return -1;
      if (!aIncludes && bIncludes) return 1;
      if (aIncludes && bIncludes) return a.productName.length - b.productName.length;
      
      // 나머지는 품목명 사전순
      return a.productName.localeCompare(b.productName, 'ko');
    });
  }
  
  /**
   * 모든 활성 품목 조회
   */
  static async getAllActiveProducts(): Promise<ProductCodeItem[]> {
    try {
      const response = await apiClient.get('/api/v1/product-codes');
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      return [];
      
    } catch (error: any) {
      console.error('활성 품목 조회 실패:', error);
      return [];
    }
  }
  
  /**
   * 가락시장 코드로 품목 조회
   */
  static async getProductByGarakCode(garakCode: string): Promise<ProductCodeItem | null> {
    try {
      const response = await apiClient.get('/api/v1/product-codes/by-garak-code', {
        params: { garakCode }
      });
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      return null;
      
    } catch (error: any) {
      console.error('가락시장 코드로 품목 조회 실패:', error);
      return null;
    }
  }
  
  /**
   * 활성 품목 개수 조회
   */
  static async getActiveProductCount(): Promise<number> {
    try {
      const response = await apiClient.get('/api/v1/product-codes/count');
      
      if (response.data && response.data.data !== undefined) {
        return response.data.data;
      }
      
      return 0;
      
    } catch (error: any) {
      console.error('활성 품목 개수 조회 실패:', error);
      return 0;
    }
  }
} 