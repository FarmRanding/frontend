export interface PriceQuoteHistory {
  id: number;
  productName: string;
  grade: string;
  unit: string;
  quantity: number;
  harvestDate: string;
  fairPrice: number;
  finalPrice: number;
  createdAt: string;
  priceData?: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
    }>;
  };
}

export interface UnifiedPriceHistoryResponse {
  id: number;
  type: 'STANDARD' | 'PREMIUM';
  productName: string;
  grade: string;
  location?: string | null;
  suggestedPrice: number;
  unit: string;
  quantity: number;
  harvestDate?: string | null;
  analysisDate?: string | null;
  createdAt: string;
  
  // 프리미엄 전용 필드
  retailAverage?: number | null;
  wholesaleAverage?: number | null;
  calculationReason?: string | null;
}

export interface PriceQuoteRequest {
  productName: string;
  grade: string;
  unit: string;
  quantity: number;
  harvestDate: string;
}

export interface PriceQuoteResponse {
  id: number;
  productName: string;
  grade: string;
  unit: string;
  quantity: number;
  harvestDate: string;
  fairPrice: number;
  finalPrice: number;
  createdAt: string;
  priceData: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
    }>;
  };
} 