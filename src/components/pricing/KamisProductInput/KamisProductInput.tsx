import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import iconSearch from '../../../assets/icon-search.svg';
import iconChevronDown from '../../../assets/icon-chevrondown.svg';
import { fetchKamisProductCodes } from '../../../api/premiumPriceService';

// 스타일 컴포넌트들
const Container = styled.div`
  width: 100%;
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.43;
  color: #374151;
  margin-bottom: 8px;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input<{ $hasValue: boolean; $isOpen: boolean }>`
  width: 100%;
  height: 48px;
  padding: 12px 40px 12px 16px;
  background: #FFFFFF;
  border: 1px solid ${props => props.$isOpen ? '#8B5CF6' : props.$hasValue ? '#D1D5DB' : '#E5E7EB'};
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  color: ${props => props.$hasValue ? '#111827' : '#9CA3AF'};
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #8B5CF6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }

  &::placeholder {
    color: #9CA3AF;
  }
`;

const IconContainer = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  pointer-events: none;
`;

const SearchIcon = styled.img`
  width: 20px;
  height: 20px;
  opacity: 0.5;
`;

const ChevronIcon = styled.img<{ $isOpen: boolean }>`
  width: 16px;
  height: 16px;
  opacity: 0.5;
  transition: transform 0.2s ease;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const DropdownContainer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 240px;
  overflow-y: auto;
  margin-top: 4px;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
`;

const DropdownItem = styled.div<{ $isHighlighted: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  background: ${props => props.$isHighlighted ? '#F3F4F6' : '#FFFFFF'};
  border-bottom: 1px solid #F3F4F6;
  transition: background-color 0.15s ease;

  &:hover {
    background: #F3F4F6;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ItemName = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #111827;
  margin-bottom: 4px;
`;

const ItemVariety = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: #6B7280;
`;

const NoResults = styled.div`
  padding: 16px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #6B7280;
`;

const LoadingItem = styled.div`
  padding: 16px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #6B7280;
`;

// 타입 정의
interface KamisProduct {
  itemCode: string;
  itemName: string;
  kindCode: string;
  kindName: string;
}

interface KamisProductInputProps {
  value: string;
  onChange: (product: KamisProduct) => void;
  placeholder?: string;
  className?: string;
}

const KamisProductInput: React.FC<KamisProductInputProps> = ({
  value,
  onChange,
  placeholder = "농산물을 검색해주세요",
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const [products, setProducts] = useState<KamisProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 검색어 변경 시 API 호출
  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.length < 1) {
        setProducts([]);
        return;
      }

      setLoading(true);
      try {
        const results = await fetchKamisProductCodes(searchTerm);
        setProducts(results);
      } catch (error) {
        console.error('KAMIS 품목 검색 실패:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  // 포커스 핸들러
  const handleInputFocus = () => {
    setIsOpen(true);
    if (searchTerm.length >= 1) {
      // 기존 검색 결과가 있으면 표시
    }
  };

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < products.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && products[highlightedIndex]) {
          handleProductSelect(products[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // 상품 선택 핸들러
  const handleProductSelect = (product: KamisProduct) => {
    setSearchTerm(product.itemName);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onChange(product);
  };

  // 드롭다운 내용 렌더링
  const renderDropdownContent = () => {
    if (loading) {
      return <LoadingItem>검색 중...</LoadingItem>;
    }

    if (products.length === 0 && searchTerm.length >= 1) {
      return <NoResults>검색 결과가 없습니다.</NoResults>;
    }

    return products.map((product, index) => (
      <DropdownItem
        key={`${product.itemCode}-${product.kindCode}`}
        $isHighlighted={index === highlightedIndex}
        onClick={() => handleProductSelect(product)}
      >
        <ItemName>{product.itemName}</ItemName>
        <ItemVariety>{product.kindName}</ItemVariety>
      </DropdownItem>
    ));
  };

  return (
    <Container ref={containerRef} className={className}>
      <Label>농산물</Label>
      <InputContainer>
        <Input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          $hasValue={!!searchTerm}
          $isOpen={isOpen}
        />
        <IconContainer>
          <SearchIcon src={iconSearch} alt="검색" />
          <ChevronIcon src={iconChevronDown} alt="드롭다운" $isOpen={isOpen} />
        </IconContainer>
      </InputContainer>
      
      <DropdownContainer $isOpen={isOpen && (loading || products.length > 0 || searchTerm.length >= 1)}>
        {renderDropdownContent()}
      </DropdownContainer>
    </Container>
  );
};

export default KamisProductInput; 
import styled from 'styled-components';
import iconSearch from '../../../assets/icon-search.svg';
import iconChevronDown from '../../../assets/icon-chevrondown.svg';
import { fetchKamisProductCodes } from '../../../api/premiumPriceService';

// 스타일 컴포넌트들
const Container = styled.div`
  width: 100%;
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.43;
  color: #374151;
  margin-bottom: 8px;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input<{ $hasValue: boolean; $isOpen: boolean }>`
  width: 100%;
  height: 48px;
  padding: 12px 40px 12px 16px;
  background: #FFFFFF;
  border: 1px solid ${props => props.$isOpen ? '#8B5CF6' : props.$hasValue ? '#D1D5DB' : '#E5E7EB'};
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  color: ${props => props.$hasValue ? '#111827' : '#9CA3AF'};
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #8B5CF6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }

  &::placeholder {
    color: #9CA3AF;
  }
`;

const IconContainer = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  pointer-events: none;
`;

const SearchIcon = styled.img`
  width: 20px;
  height: 20px;
  opacity: 0.5;
`;

const ChevronIcon = styled.img<{ $isOpen: boolean }>`
  width: 16px;
  height: 16px;
  opacity: 0.5;
  transition: transform 0.2s ease;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const DropdownContainer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 240px;
  overflow-y: auto;
  margin-top: 4px;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
`;

const DropdownItem = styled.div<{ $isHighlighted: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  background: ${props => props.$isHighlighted ? '#F3F4F6' : '#FFFFFF'};
  border-bottom: 1px solid #F3F4F6;
  transition: background-color 0.15s ease;

  &:hover {
    background: #F3F4F6;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ItemName = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #111827;
  margin-bottom: 4px;
`;

const ItemVariety = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: #6B7280;
`;

const NoResults = styled.div`
  padding: 16px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #6B7280;
`;

const LoadingItem = styled.div`
  padding: 16px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #6B7280;
`;

// 타입 정의
interface KamisProduct {
  itemCode: string;
  itemName: string;
  kindCode: string;
  kindName: string;
}

interface KamisProductInputProps {
  value: string;
  onChange: (product: KamisProduct) => void;
  placeholder?: string;
  className?: string;
}

const KamisProductInput: React.FC<KamisProductInputProps> = ({
  value,
  onChange,
  placeholder = "농산물을 검색해주세요",
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const [products, setProducts] = useState<KamisProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 검색어 변경 시 API 호출
  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.length < 1) {
        setProducts([]);
        return;
      }

      setLoading(true);
      try {
        const results = await fetchKamisProductCodes(searchTerm);
        setProducts(results);
      } catch (error) {
        console.error('KAMIS 품목 검색 실패:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  // 포커스 핸들러
  const handleInputFocus = () => {
    setIsOpen(true);
    if (searchTerm.length >= 1) {
      // 기존 검색 결과가 있으면 표시
    }
  };

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < products.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && products[highlightedIndex]) {
          handleProductSelect(products[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // 상품 선택 핸들러
  const handleProductSelect = (product: KamisProduct) => {
    setSearchTerm(product.itemName);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onChange(product);
  };

  // 드롭다운 내용 렌더링
  const renderDropdownContent = () => {
    if (loading) {
      return <LoadingItem>검색 중...</LoadingItem>;
    }

    if (products.length === 0 && searchTerm.length >= 1) {
      return <NoResults>검색 결과가 없습니다.</NoResults>;
    }

    return products.map((product, index) => (
      <DropdownItem
        key={`${product.itemCode}-${product.kindCode}`}
        $isHighlighted={index === highlightedIndex}
        onClick={() => handleProductSelect(product)}
      >
        <ItemName>{product.itemName}</ItemName>
        <ItemVariety>{product.kindName}</ItemVariety>
      </DropdownItem>
    ));
  };

  return (
    <Container ref={containerRef} className={className}>
      <Label>농산물</Label>
      <InputContainer>
        <Input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          $hasValue={!!searchTerm}
          $isOpen={isOpen}
        />
        <IconContainer>
          <SearchIcon src={iconSearch} alt="검색" />
          <ChevronIcon src={iconChevronDown} alt="드롭다운" $isOpen={isOpen} />
        </IconContainer>
      </InputContainer>
      
      <DropdownContainer $isOpen={isOpen && (loading || products.length > 0 || searchTerm.length >= 1)}>
        {renderDropdownContent()}
      </DropdownContainer>
    </Container>
  );
};

export default KamisProductInput; 