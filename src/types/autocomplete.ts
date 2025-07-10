// 자동완성에서 사용하는 작물 타입
export interface Crop {
  id: string;
  cropCode: string;
  cropNameKor: string;
  cropNameEng?: string;
  useKind?: string;
}

// 자동완성 옵션 타입
export interface AutocompleteOptions {
  maxResults?: number;
  debounceMs?: number;
  minChars?: number;
  showCategory?: boolean;
  enableQuickSearch?: boolean;
}

// 자동완성 검색 결과 타입
export interface AutocompleteResult<T> {
  items: T[];
  totalCount: number;
  hasMore: boolean;
}

// 검색 필터 타입
export interface SearchFilter {
  category?: string;
  region?: string;
  season?: string;
} 