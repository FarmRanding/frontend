export interface PriceQuoteRequest {
  productName: string;
  grade: string;
  harvestDate: Date;
}

export interface PriceQuoteResult {
  fairPrice: number;
  priceData: PriceHistoryData[];
}

export interface PriceHistoryData {
  date: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
}

// 가격 제안 타입 (프리미엄/일반 구분)
export type QuotationType = 'STANDARD' | 'PREMIUM';

export interface PriceQuoteHistory {
  id: string;
  request: PriceQuoteRequest;
  result: PriceQuoteResult;
  createdAt: string;
  unit: string; // 'kg', 'box' 등
  quantity: number; // 1kg, 5kg 등
  quotationType: QuotationType; // 프리미엄/일반 구분
} 