import { useState, useEffect, useCallback } from 'react';
import { StandardCodeService, CropItem, VarietyItem } from '../api/standardCodeService';

interface UseCropDataReturn {
  cropData: CropItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  searchCrops: (query: string) => Promise<CropItem[]>;
  searchVarieties: (cropCode: string, query: string) => Promise<VarietyItem[]>;
}

export function useCropData(): UseCropDataReturn {
  const [cropData, setCropData] = useState<CropItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 초기 인기 작물 데이터 로드
  const fetchInitialCropData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await StandardCodeService.getPopularCrops(20);
      setCropData(data);
    } catch (err: any) {
      console.error('초기 작물 데이터 로드 실패:', err);
      setError('작물 데이터를 불러오는데 실패했습니다.');
      setCropData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 작물 검색
  const searchCrops = useCallback(async (query: string): Promise<CropItem[]> => {
    try {
      if (!query || query.trim().length === 0) {
        const popularCrops = await StandardCodeService.getPopularCrops(10);
        return popularCrops;
      }
      
      const searchResults = await StandardCodeService.searchCrops(query.trim(), 15);
      return searchResults;
    } catch (err: any) {
      console.error('작물 검색 실패:', err);
      // 검색 실패 시 빈 배열 반환 (에러를 던지지 않음)
      return [];
    }
  }, []);

  // 품종 검색
  const searchVarieties = useCallback(async (cropCode: string, query: string): Promise<VarietyItem[]> => {
    try {
      if (!cropCode) {
        return [];
      }
      
      const varieties = await StandardCodeService.searchVarieties(cropCode, query.trim(), 15);
      return varieties;
    } catch (err: any) {
      console.error('품종 검색 실패:', err);
      // 검색 실패 시 빈 배열 반환 (에러를 던지지 않음)
      return [];
    }
  }, []);

  useEffect(() => {
    fetchInitialCropData();
  }, [fetchInitialCropData]);

  const refetch = useCallback(() => {
    fetchInitialCropData();
  }, [fetchInitialCropData]);

  return {
    cropData,
    isLoading,
    error,
    refetch,
    searchCrops,
    searchVarieties,
  };
} 