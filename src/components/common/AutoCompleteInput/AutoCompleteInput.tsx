import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';
import { useAutocomplete } from '../../../hooks/useAutocomplete';

interface AutoCompleteInputProps<T> {
  items: T[];
  onSelect: (item: T) => void;
  onSearch?: (query: string) => Promise<T[]>;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  isLoading?: boolean;
  value?: string;
  className?: string;
  getDisplayText?: (item: T) => string;
  getItemKey?: (item: T) => string;
  renderItem?: (item: T, isSelected: boolean) => React.ReactNode;
  debounceMs?: number;
  minChars?: number;
  noResultsText?: string;
  emptyText?: string;
  onFilter?: (items: T[], query: string) => T[];
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

const AutoCompleteInput = <T,>({
  items,
  onSelect,
  onSearch,
  onChange,
  placeholder = "검색하세요",
  disabled = false,
  error,
  isLoading = false,
  value = '',
  className,
  getDisplayText = (item: any) => item.name || '',
  getItemKey = (item: any) => item.code || item.id || '',
  renderItem,
  debounceMs = 300,
  minChars = 1,
  noResultsText = "검색 결과가 없습니다",
  emptyText = "검색어를 입력해주세요",
  onFilter,
  inputRef,
}: AutoCompleteInputProps<T>) => {
  
  const {
    query,
    setQuery,
    filteredItems,
    isOpen,
    selectedIndex,
    setSelectedIndex,
    handleInputChange,
    handleKeyDown,
    handleItemSelect,
    handleFocus,
    handleBlur,
    containerRef,
    listRef,
  } = useAutocomplete(items, onSelect, {
    debounceMs,
    minChars,
    onSearch,
    onFilter: onFilter || ((items, query) => {
      return items.filter(item =>
        getDisplayText(item).toLowerCase().includes(query.toLowerCase())
      );
    }),
  });

  // 드롭다운 위치 상태
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const localInputRef = useRef<HTMLInputElement>(null);
  const effectiveInputRef = inputRef || localInputRef;

  // 외부 클릭 감지
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // 드롭다운 포탈 내부 클릭인지 확인
      const dropdownPortal = document.querySelector('[data-dropdown-portal]');
      if (dropdownPortal && dropdownPortal.contains(target)) {
        return; // 드롭다운 내부 클릭이면 무시
      }
      
      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen, setSelectedIndex]);

  // value prop 변화 처리
  React.useEffect(() => {
    setQuery(value);
  }, [value, setQuery]);

  // 드롭다운 위치 계산
  const updateDropdownPosition = React.useCallback(() => {
    if (effectiveInputRef.current) {
      const rect = effectiveInputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [effectiveInputRef]);

  // 드롭다운이 열릴 때 위치 업데이트
  React.useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      
      const handleResize = () => updateDropdownPosition();
      const handleScroll = () => setIsOpen(false);

      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isOpen, updateDropdownPosition]);

  // onChange 이벤트 처리
  const handleInputChangeWithCallback = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    handleInputChange(e);
    if (onChange) {
      onChange(newValue);
    }
    if (newValue && !isOpen) {
      updateDropdownPosition();
    }
  };

  const handleSelectItem = (item: T) => {
    handleItemSelect(item);
  };

  // 포커스 핸들러 래핑
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    handleFocus(e);
    updateDropdownPosition();
  };

  const defaultRenderItem = (item: T, isSelected: boolean) => (
    <DefaultItemContent>
      <ItemName $isSelected={isSelected}>{getDisplayText(item)}</ItemName>
    </DefaultItemContent>
  );

  return (
    <>
      <Container ref={containerRef} className={className}>
        <InputWrapper $hasError={!!error} $disabled={disabled}>
          <Input
            ref={effectiveInputRef}
            type="text"
            value={query}
            onChange={handleInputChangeWithCallback}
            onFocus={handleInputFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
          />
          {isLoading && <LoadingSpinner />}
        </InputWrapper>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Container>
      
      {/* 포탈로 렌더링되는 드롭다운 */}
      {typeof window !== 'undefined' && isOpen && createPortal(
        <DropdownPortal
          data-dropdown-portal
          $top={dropdownPosition.top}
          $left={dropdownPosition.left}
          $width={dropdownPosition.width}
        >
          <DropdownList ref={listRef}>
            {filteredItems.length === 0 ? (
              <NoResults>
                {query ? noResultsText : emptyText}
              </NoResults>
            ) : (
              filteredItems.map((item, index) => (
                <DropdownItem
                  key={getItemKey(item)}
                  $isSelected={index === selectedIndex}
                  onClick={() => handleSelectItem(item)}
                  onMouseDown={(e) => e.preventDefault()} // 포커스 잃는 것 방지
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {renderItem ? renderItem(item, index === selectedIndex) : defaultRenderItem(item, index === selectedIndex)}
                </DropdownItem>
              ))
            )}
          </DropdownList>
        </DropdownPortal>,
        document.body
      )}
    </>
  );
};

// 스타일 컴포넌트들
const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
`;

const InputWrapper = styled.div<{ $hasError: boolean; $disabled: boolean }>`
  position: relative;
  
  ${({ $hasError }) => $hasError && css`
    .input {
      border-color: #ef4444;
    }
  `}
  
  ${({ $disabled }) => $disabled && css`
    opacity: 0.6;
    cursor: not-allowed;
  `}
`;

const Input = styled.input`
  width: 100%;
  height: 33px;
  background: #FFFFFF;
  border: none;
  border-radius: 8px;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
  padding: 0 40px 0 7px;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.21;
  color: #000000;
  transition: all 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    box-shadow: 0px 8px 24px 0px rgba(31, 65, 187, 0.2);
  }
  
  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &::placeholder {
    color: #9C9C9C;
  }
`;

const LoadingSpinner = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #1F41BB;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: translateY(-50%) rotate(0deg); }
    100% { transform: translateY(-50%) rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  font-family: 'Inter', sans-serif;
`;

// 포탈로 렌더링될 드롭다운 컨테이너
const DropdownPortal = styled.div<{ $top: number; $left: number; $width: number }>`
  position: fixed;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  width: ${props => props.$width}px;
  z-index: 99999;
  margin-top: 4px;
  pointer-events: auto;
`;

const DropdownList = styled.ul`
  background: white;
  border-radius: 8px;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
  padding: 8px 0;
  list-style: none;
  width: 100%;
  
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

const DropdownItem = styled.li<{ $isSelected: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  background-color: ${({ $isSelected }) => $isSelected ? '#F0F7FF' : 'transparent'};
  border-left: ${({ $isSelected }) => $isSelected ? '3px solid #1F41BB' : '3px solid transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #F0F7FF;
    border-left: 3px solid #1F41BB;
  }
  
  &:active {
    background-color: #E3F2FD;
  }
`;

const DefaultItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ItemName = styled.span<{ $isSelected: boolean }>`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: ${({ $isSelected }) => $isSelected ? '#1F41BB' : '#000000'};
  transition: color 0.2s ease;
`;

const ItemCode = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: #9C9C9C;
  /* 코드는 숨김 처리 */
  display: none;
`;

const NoResults = styled.div`
  padding: 16px;
  text-align: center;
  color: #9C9C9C;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
`;

export default AutoCompleteInput; 