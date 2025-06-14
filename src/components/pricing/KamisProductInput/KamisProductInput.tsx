import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import iconSearch from '../../../assets/icon-search.svg';
import iconChevronDown from '../../../assets/icon-chevrondown.svg';
import { fetchKamisProductCodes } from '../../../api/premiumPriceService';

// 스타일 컴포넌트들 - 기존 가격제안/브랜딩 페이지와 통일
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  position: relative;
`;

const Label = styled.label`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.18;
  color: #000000;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input<{ $hasValue: boolean; $isOpen: boolean }>`
  width: 100%;
  height: 33px;
  background: #FFFFFF;
  border: none;
  border-radius: 8px;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
  padding: 0 40px 0 12px;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.21;
  color: ${props => props.$hasValue ? '#000000' : '#9C9C9C'};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0px 8px 24px 0px rgba(31, 65, 187, 0.2);
  }

  &:hover {
    box-shadow: 0px 8px 24px 0px rgba(31, 65, 187, 0.2);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #9C9C9C;
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
  opacity: 0.7;
  transition: all 0.3s ease;

  ${Input}:hover ~ ${IconContainer} & {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const ChevronIcon = styled.img<{ $isOpen: boolean }>`
  width: 16px;
  height: 16px;
  opacity: 0.7;
  transition: all 0.3s ease;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};

  ${Input}:hover ~ ${IconContainer} & {
    opacity: 1;
    transform: ${props => props.$isOpen ? 'rotate(180deg) scale(1.1)' : 'rotate(0deg) scale(1.1)'};
  }
`;

// 포탈로 렌더링될 드롭다운 컨테이너
const DropdownPortal = styled.div<{ $isOpen: boolean; $top: number; $left: number; $width: number }>`
  position: fixed;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  width: ${props => props.$width}px;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
  padding: 8px 0;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const DropdownItem = styled.div<{ $isHighlighted: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  background-color: ${({ $isHighlighted }) => $isHighlighted ? '#F0F7FF' : 'transparent'};
  border-left: ${({ $isHighlighted }) => $isHighlighted ? '3px solid #1F41BB' : '3px solid transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #F0F7FF;
    border-left: 3px solid #1F41BB;
  }
  
  &:active {
    background-color: #E3F2FD;
  }
`;

const ItemName = styled.div<{ $isHighlighted?: boolean }>`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: ${({ $isHighlighted }) => $isHighlighted ? '#1F41BB' : '#000000'};
  transition: color 0.2s ease;
  margin-bottom: 2px;
`;

const ItemVariety = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: #9C9C9C;
`;

const NoResults = styled.div`
  padding: 16px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #9C9C9C;
`;

const LoadingItem = styled.div`
  padding: 16px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #9C9C9C;
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
  placeholder = "품목을 검색해주세요",
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const [products, setProducts] = useState<KamisProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 드롭다운 위치 계산
  const updateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // 드롭다운 포탈 내부 클릭인지 확인
      const dropdownPortal = document.querySelector('[data-dropdown-portal]');
      if (dropdownPortal && dropdownPortal.contains(target)) {
        return; // 드롭다운 내부 클릭이면 무시
      }
      
      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 윈도우 리사이즈 시 드롭다운 위치 업데이트
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isOpen]);

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
    updateDropdownPosition();
  };

  // 포커스 핸들러
  const handleInputFocus = () => {
    setIsOpen(true);
    updateDropdownPosition();
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
    console.log('KamisProductInput에서 상품 선택:', product);
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
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('드롭다운 아이템 클릭:', product);
          handleProductSelect(product);
        }}
        onMouseDown={(e) => {
          e.preventDefault(); // 포커스 잃는 것 방지
        }}
      >
        <ItemName $isHighlighted={index === highlightedIndex}>{product.itemName}</ItemName>
        <ItemVariety>{product.kindName}</ItemVariety>
      </DropdownItem>
    ));
  };

  const shouldShowDropdown = isOpen && (loading || products.length > 0 || searchTerm.length >= 1);

  return (
    <>
      <Container ref={containerRef} className={className}>
        <Label>품목</Label>
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
      </Container>
      
      {/* 포탈로 렌더링되는 드롭다운 */}
      {typeof window !== 'undefined' && createPortal(
        <DropdownPortal
          data-dropdown-portal
          $isOpen={shouldShowDropdown}
          $top={dropdownPosition.top}
          $left={dropdownPosition.left}
          $width={dropdownPosition.width}
        >
          {renderDropdownContent()}
        </DropdownPortal>,
        document.body
      )}
    </>
  );
};

export default KamisProductInput; 