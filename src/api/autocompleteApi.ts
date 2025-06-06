import { StandardCodeService, CropItem } from './standardCodeService';

// CropAutocomplete에서 사용하는 Crop 타입과 맞추기 위한 변환
export interface Crop {
  id: string;
  cropCode: string;
  cropNameKor: string;
  cropNameEng?: string;
  useKind?: string;
}

// CropItem을 Crop으로 변환하는 함수
const convertCropItemToCrop = (cropItem: CropItem): Crop => ({
  id: cropItem.cropCode,
  cropCode: cropItem.cropCode,
  cropNameKor: cropItem.cropName,
  cropNameEng: undefined, // StandardCodeService에서 제공하지 않음
  useKind: undefined, // StandardCodeService에서 제공하지 않음
});

export class AutocompleteAPI {
  /**
   * 작물 검색 (일반)
   */
  static async searchCrops(query: string, limit: number = 10): Promise<Crop[]> {
    try {
      const cropItems = await StandardCodeService.searchCrops(query, limit);
      return cropItems.map(convertCropItemToCrop);
    } catch (error) {
      console.error('작물 검색 실패:', error);
      return [];
    }
  }

  /**
   * 작물 빠른 검색 (quickSearch)
   */
  static async quickSearchCrops(query: string, limit: number = 10): Promise<Crop[]> {
    // 현재는 일반 검색과 동일하게 처리
    return this.searchCrops(query, limit);
  }

  /**
   * 인기 작물 조회
   */
  static async getPopularCrops(limit: number = 20): Promise<Crop[]> {
    try {
      const cropItems = await StandardCodeService.getPopularCrops(limit);
      return cropItems.map(convertCropItemToCrop);
    } catch (error) {
      console.error('인기 작물 조회 실패:', error);
      return [];
    }
  }
} 