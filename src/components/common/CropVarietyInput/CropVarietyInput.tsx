import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import AutoCompleteInput from '../AutoCompleteInput';
import { useCropData } from '../../../hooks/useCropData';
import { CropItem, VarietyItem } from '../../../api/standardCodeService';

interface CropVarietyData {
  cropCode: string;
  cropName: string;
  varietyCode: string;
  varietyName: string;
}

interface CropVarietyInputProps {
  cropValue?: string;
  varietyValue?: string;
  onChange: (data: CropVarietyData) => void;
  className?: string;
  disabled?: boolean;
}

const CropVarietyInput: React.FC<CropVarietyInputProps> = ({
  cropValue = '',
  varietyValue = '',
  onChange,
  className,
  disabled = false,
}) => {
  const { searchCrops, searchVarieties, isLoading, error } = useCropData();
  
  const [selectedCrop, setSelectedCrop] = useState<CropItem | null>(null);
  const [cropQuery, setCropQuery] = useState(cropValue);
  const [varietyQuery, setVarietyQuery] = useState(varietyValue);
  const [cropOptions, setCropOptions] = useState<CropItem[]>([]);
  const [varietyOptions, setVarietyOptions] = useState<VarietyItem[]>([]);
  const [isLoadingVarieties, setIsLoadingVarieties] = useState(false);

  // 외부에서 값이 변경될 때 내부 상태 업데이트
  useEffect(() => {
    setCropQuery(cropValue);
  }, [cropValue]);

  useEffect(() => {
    setVarietyQuery(varietyValue);
  }, [varietyValue]);

  // 작물 검색
  const handleCropSearch = useCallback(async (query: string) => {
    try {
      const results = await searchCrops(query);
      setCropOptions(results);
      return results;
    } catch (error) {
      console.error('작물 검색 실패:', error);
      return [];
    }
  }, [searchCrops]);

  // 품종 검색
  const handleVarietySearch = useCallback(async (query: string) => {
    if (!selectedCrop) return [];
    
    try {
      const results = await searchVarieties(selectedCrop.cropCode, query);
      setVarietyOptions(results);
      return results;
    } catch (error) {
      console.error('품종 검색 실패:', error);
      return [];
    }
  }, [searchVarieties, selectedCrop]);

  // 작물 선택 시 해당 작물의 모든 품종을 미리 로드
  const preloadVarieties = useCallback(async (crop: CropItem) => {
    try {
      setIsLoadingVarieties(true);
      
      // 빈 쿼리로 해당 작물의 모든 품종 조회
      const allVarieties = await searchVarieties(crop.cropCode, '');
      setVarietyOptions(allVarieties);
    } catch (error) {
      console.error('품종 미리 로드 실패:', error);
      setVarietyOptions([]);
    } finally {
      setIsLoadingVarieties(false);
    }
  }, [searchVarieties]);

  // 작물 선택 처리
  const handleCropSelect = useCallback((crop: CropItem) => {
    setSelectedCrop(crop);
    setCropQuery(crop.cropName);
    setVarietyQuery(''); // 품종 초기화
    
    // 해당 작물의 품종을 미리 로드
    preloadVarieties(crop);
    
    // 상위 컴포넌트에 변경사항 전달
    onChange({
      cropCode: crop.cropCode,
      cropName: crop.cropName,
      varietyCode: '',
      varietyName: ''
    });
  }, [onChange, preloadVarieties]);

  // 품종 선택 처리
  const handleVarietySelect = useCallback((variety: VarietyItem) => {
    setVarietyQuery(variety.varietyName);
    
    // 상위 컴포넌트에 변경사항 전달
    onChange({
      cropCode: variety.cropCode,
      cropName: variety.cropName,
      varietyCode: variety.varietyCode,
      varietyName: variety.varietyName
    });
  }, [onChange]);

  // 품종 입력 활성화 여부
  const isVarietyEnabled = !disabled && selectedCrop !== null;

  return (
    <Container className={className}>
      <InputGroup>
        <Label>작물명</Label>
        <AutoCompleteInput
          items={cropOptions}
          onSelect={handleCropSelect}
          onSearch={handleCropSearch}
          placeholder="예: 토마토"
          disabled={disabled}
          isLoading={isLoading}
          error={error || undefined}
          value={cropQuery}
          onChange={setCropQuery}
          getDisplayText={(item) => item.cropName}
          getItemKey={(item) => item.cropCode}
          noResultsText="검색된 작물이 없습니다."
          emptyText="작물을 검색해보세요"
          minChars={1}
          debounceMs={300}
        />
      </InputGroup>

      <InputGroup>
        <Label>품종</Label>
        <AutoCompleteInput
          items={varietyOptions}
          onSelect={handleVarietySelect}
          onSearch={handleVarietySearch}
          placeholder={
            isVarietyEnabled 
              ? "예: 스테비아 토마토" 
              : "작물을 먼저 선택해주세요"
          }
          disabled={!isVarietyEnabled}
          isLoading={isLoadingVarieties}
          value={varietyQuery}
          onChange={setVarietyQuery}
          getDisplayText={(item) => item.varietyName}
          getItemKey={(item) => item.varietyCode}
          noResultsText="검색된 품종이 없습니다."
          emptyText={selectedCrop ? `${selectedCrop.cropName} 품종을 검색해보세요` : "품종을 검색해보세요"}
          minChars={0}
          debounceMs={300}
        />
        {!isVarietyEnabled && (
          <HelpText>먼저 작물을 선택해주세요.</HelpText>
        )}
      </InputGroup>
    </Container>
  );
};

// 브랜딩 페이지 스타일에 맞춘 스타일 컴포넌트들
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const Label = styled.label`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.18;
  color: #000000;
`;

const HelpText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #9C9C9C;
  margin: 4px 0 0 0;
`;

export default CropVarietyInput; 