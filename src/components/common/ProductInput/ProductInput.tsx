import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { ProductCodeService, ProductCodeItem } from '../../../api/productCodeService';
import AutoCompleteInput from '../AutoCompleteInput';

export interface ProductInputData {
  productId: number | null;
  garakCode: string;
  productName: string;
}

interface ProductInputProps {
  value?: string;
  onChange: (data: ProductInputData) => void;
  className?: string;
  disabled?: boolean;
  nextFieldRef?: React.RefObject<HTMLInputElement>;
}

const ProductInput: React.FC<ProductInputProps> = ({
  value = '',
  onChange,
  className,
  disabled = false,
  nextFieldRef,
}) => {
  const [query, setQuery] = useState(value);
  const [products, setProducts] = useState<ProductCodeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // 외부에서 값이 변경될 때 내부 상태 업데이트
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // 품목 검색
  const handleSearch = useCallback(async (searchQuery: string): Promise<ProductCodeItem[]> => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!searchQuery || searchQuery.trim().length === 0) {
        // 빈 쿼리일 때는 인기 품목을 보여줄 수 있지만, 일단 빈 배열 반환
        setProducts([]);
        return [];
      }
      
      const results = await ProductCodeService.searchProducts(searchQuery.trim(), 15);
      setProducts(results);
      return results;
      
    } catch (err: any) {
      console.error('품목 검색 실패:', err);
      setError('품목 검색에 실패했습니다.');
      setProducts([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 품목 선택 처리
  const handleSelect = useCallback((product: ProductCodeItem) => {
    setQuery(product.productName);
    
    // 상위 컴포넌트에 선택된 품목 정보 전달
    onChange({
      productId: product.id,
      garakCode: product.garakCode,
      productName: product.productName
    });

    // 다음 필드로 포커스 이동 (약간의 지연 후)
    if (nextFieldRef?.current) {
      setTimeout(() => {
        nextFieldRef.current?.focus();
      }, 100);
    }
  }, [onChange, nextFieldRef]);

  // 입력 값 변경 처리
  const handleInputChange = useCallback((newValue: string) => {
    setQuery(newValue);
    
    // 입력 중에는 선택 해제
    if (newValue === '') {
      onChange({
        productId: null,
        garakCode: '',
        productName: ''
      });
    }
  }, [onChange]);

  return (
    <Container className={className}>
      <InputGroup>
        <Label>품목</Label>
        <AutoCompleteInput
          items={products}
          onSelect={handleSelect}
          onSearch={handleSearch}
          placeholder="예: 토마토, 감자, 사과"
          disabled={disabled}
          isLoading={isLoading}
          error={error || undefined}
          value={query}
          onChange={handleInputChange}
          getDisplayText={(item) => item.productName}
          getItemKey={(item) => item.id.toString()}
          noResultsText="검색된 품목이 없습니다."
          emptyText="품목을 검색해보세요"
          minChars={1}
          debounceMs={300}
          inputRef={inputRef}
        />
      </InputGroup>
    </Container>
  );
};

// 스타일 컴포넌트들 (CropVarietyInput과 동일한 스타일)
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
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

export default ProductInput; 