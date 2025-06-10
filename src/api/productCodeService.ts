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
        const products = response.data.data as ProductCodeItem[];
        
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