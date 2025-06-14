import apiClient from './axiosConfig';

// 공통 API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

// 상품 코드 관련 타입
export interface KamisProductGroup {
  code: string;
  name: string;
}

export interface KamisProductItem {
  code: string;
  name: string;
  groupCode: string;
}

export interface KamisProductVariety {
  code: string;
  name: string;
  itemCode: string;
}

// 가격 제안 요청 타입
export interface PremiumPriceRequest {
  productGroupCode: string;
  productItemCode: string;
  productVarietyCode: string;
  location: string;
  date: string; // YYYY-MM-DD 형식
}

// 가격 제안 응답 타입
export interface PremiumPriceResponse {
  id: number;
  productName: string;
  location: string;
  retailPrice: number;
  wholesalePrice: number;
  suggestedPrice: number;
  priceCalculation: {
    retailAverage: number;
    wholesaleAverage: number;
    priceRatio: number;
    calculationFormula: string;
    explanation: string;
  };
  marketAnalysis: {
    marketTrend: string;
    priceFactors: string[];
    recommendations: string[];
  };
  createdAt: string;
}

// 이력 조회용 페이지네이션 타입
export interface PremiumPriceHistoryResponse {
  content: PremiumPriceResponse[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// 상품 그룹 목록 조회
export const fetchProductGroups = async (): Promise<KamisProductGroup[]> => {
  const response = await apiClient.get<ApiResponse<KamisProductGroup[]>>('/api/v1/premium-price/products/groups');
  if (response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || '상품 그룹 조회에 실패했습니다.');
};

// 상품 아이템 목록 조회
export const fetchProductItems = async (groupCode: string): Promise<KamisProductItem[]> => {
  const response = await apiClient.get<ApiResponse<KamisProductItem[]>>(`/api/v1/premium-price/products/groups/${groupCode}/items`);
  if (response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || '상품 아이템 조회에 실패했습니다.');
};

// 상품 품종 목록 조회
export const fetchProductVarieties = async (itemCode: string): Promise<KamisProductVariety[]> => {
  const response = await apiClient.get<ApiResponse<KamisProductVariety[]>>(`/api/v1/premium-price/products/items/${itemCode}/varieties`);
  if (response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || '상품 품종 조회에 실패했습니다.');
};

// 프리미엄 가격 제안 생성
export const createPremiumPriceSuggestion = async (request: PremiumPriceRequest): Promise<PremiumPriceResponse> => {
  const response = await apiClient.post<ApiResponse<PremiumPriceResponse>>('/api/v1/premium-price/suggestions', request);
  if (response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || '가격 제안 생성에 실패했습니다.');
};

// 프리미엄 가격 제안 이력 조회
export const fetchPremiumPriceHistory = async (page = 0, size = 10): Promise<PremiumPriceHistoryResponse> => {
  const response = await apiClient.get<ApiResponse<PremiumPriceHistoryResponse>>('/api/v1/premium-price/history', {
    params: { page, size }
  });
  if (response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || '가격 제안 이력 조회에 실패했습니다.');
};

// 특정 가격 제안 상세 조회
export const fetchPremiumPriceDetail = async (id: number): Promise<PremiumPriceResponse> => {
  const response = await apiClient.get<ApiResponse<PremiumPriceResponse>>(`/api/v1/premium-price/suggestions/${id}`);
  if (response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || '가격 제안 상세 조회에 실패했습니다.');
};

// 프리미엄 가격 제안 서비스 객체
export const premiumPriceService = {
  // 상품 데이터 조회
  async getProductGroups(): Promise<KamisProductGroup[]> {
    return fetchProductGroups();
  },

  async getProductItems(groupCode: string): Promise<KamisProductItem[]> {
    return fetchProductItems(groupCode);
  },

  async getProductVarieties(itemCode: string): Promise<KamisProductVariety[]> {
    return fetchProductVarieties(itemCode);
  },

  // 가격 제안 생성
  async createSuggestion(request: PremiumPriceRequest): Promise<PremiumPriceResponse> {
    return createPremiumPriceSuggestion(request);
  },

  // 이력 조회
  async getHistory(page = 0, size = 10): Promise<PremiumPriceHistoryResponse> {
    return fetchPremiumPriceHistory(page, size);
  },

  // 상세 조회
  async getDetail(id: number): Promise<PremiumPriceResponse> {
    return fetchPremiumPriceDetail(id);
  },

  // 지역 옵션 (하드코딩 - 백엔드와 동일한 값)
  getLocationOptions(): Array<{ value: string; label: string }> {
    return [
      { value: '서울', label: '서울특별시' },
      { value: '부산', label: '부산광역시' },
      { value: '대구', label: '대구광역시' },
      { value: '인천', label: '인천광역시' },
      { value: '광주', label: '광주광역시' },
      { value: '대전', label: '대전광역시' },
      { value: '울산', label: '울산광역시' },
      { value: '세종', label: '세종특별자치시' },
      { value: '경기', label: '경기도' },
      { value: '강원', label: '강원도' },
      { value: '충북', label: '충청북도' },
      { value: '충남', label: '충청남도' },
      { value: '전북', label: '전라북도' },
      { value: '전남', label: '전라남도' },
      { value: '경북', label: '경상북도' },
      { value: '경남', label: '경상남도' },
      { value: '제주', label: '제주특별자치도' }
    ];
  }
}; 