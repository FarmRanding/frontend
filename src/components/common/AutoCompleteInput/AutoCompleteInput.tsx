import React from 'react';
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

  // value prop 변화 처리
  React.useEffect(() => {
    setQuery(value);
  }, [value, setQuery]);

  // onChange 이벤트 처리
  const handleInputChangeWithCallback = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    handleInputChange(e);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSelectItem = (item: T) => {
    handleItemSelect(item);
  };

  const defaultRenderItem = (item: T, isSelected: boolean) => (
    <DefaultItemContent>
      <ItemName $isSelected={isSelected}>{getDisplayText(item)}</ItemName>
    </DefaultItemContent>
  );

  return (
    <Container ref={containerRef} className={className}>
      <InputWrapper $hasError={!!error} $disabled={disabled}>
        <Input
          type="text"
          value={query}
          onChange={handleInputChangeWithCallback}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
        />
        {isLoading && <LoadingSpinner />}
      </InputWrapper>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {isOpen && (
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
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {renderItem ? renderItem(item, index === selectedIndex) : defaultRenderItem(item, index === selectedIndex)}
              </DropdownItem>
            ))
          )}
        </DropdownList>
      )}
    </Container>
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

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  margin: 4px 0 0 0;
  padding: 8px 0;
  list-style: none;
  
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