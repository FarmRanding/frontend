import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';
import { AutocompleteAPI } from '../../api/autocompleteApi';
import { Crop, AutocompleteOptions } from '../../types/autocomplete';
import { debounce } from '../../utils/debounce';

interface CropAutocompleteProps {
  onSelect: (crop: Crop) => void;
  placeholder?: string;
  options?: AutocompleteOptions;
  disabled?: boolean;
  error?: string;
  value?: string;
  className?: string;
}

const CropAutocomplete: React.FC<CropAutocompleteProps> = ({
  onSelect,
  placeholder = "작물을 검색하세요",
  options = {},
  disabled = false,
  error,
  value = '',
  className,
}) => {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<Crop[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 기본 옵션
  const finalOptions = useMemo(() => ({
    maxResults: 10,
    debounceMs: 300,
    minChars: 1,
    showCategory: true,
    enableQuickSearch: true,
    ...options,
  }), [options]);

  // 드롭다운 위치 계산
  const updateDropdownPosition = useCallback(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
      });
    }
  }, []);

  // 드롭다운이 열릴 때 위치 업데이트
  useEffect(() => {
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

  // 검색 함수
  const searchCrops = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < finalOptions.minChars) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = finalOptions.enableQuickSearch
        ? await AutocompleteAPI.quickSearchCrops(searchQuery, finalOptions.maxResults)
        : await AutocompleteAPI.searchCrops(searchQuery, finalOptions.maxResults);
      
      setResults(searchResults);
    } catch (error) {
      console.error('작물 검색 실패:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [finalOptions]);

  // 디바운스된 검색
  const debouncedSearch = useMemo(
    () => debounce(searchCrops, finalOptions.debounceMs),
    [searchCrops, finalOptions.debounceMs]
  );

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
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 입력 변화 처리
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setSelectedIndex(-1);
    setIsOpen(true);
    
    if (newQuery && !isOpen) {
      updateDropdownPosition();
    }
    
    debouncedSearch(newQuery);
  }, [debouncedSearch, isOpen, updateDropdownPosition]);

  // 포커스 처리
  const handleFocus = useCallback(() => {
    setIsOpen(true);
    updateDropdownPosition();
    if (query && query.trim().length >= finalOptions.minChars) {
      searchCrops(query);
    }
  }, [query, searchCrops, finalOptions.minChars, updateDropdownPosition]);

  // 블러 처리
  const handleBlur = useCallback((e: React.FocusEvent) => {
    const target = e.relatedTarget as Node;
    
    // 드롭다운 포탈 내부 클릭인지 확인
    const dropdownPortal = document.querySelector('[data-dropdown-portal]');
    if (dropdownPortal && dropdownPortal.contains(target)) {
      return; // 드롭다운 내부 클릭이면 무시
    }
    
    // 드롭다운 아이템 클릭 시 블러 방지
    if (containerRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    setTimeout(() => setIsOpen(false), 200);
  }, []);

  // 아이템 선택
  const handleItemSelect = useCallback((crop: Crop) => {
    setQuery(crop.cropNameKor);
    setIsOpen(false);
    setSelectedIndex(-1);
    onSelect(crop);
  }, [onSelect]);

  // 키보드 네비게이션
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleItemSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  }, [isOpen, results, selectedIndex, handleItemSelect]);

  // 선택된 아이템 스크롤 처리
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [selectedIndex]);

  // value prop 변화 처리
  useEffect(() => {
    setQuery(value);
  }, [value]);

  return (
    <>
      <Container ref={containerRef} className={className}>
        <InputWrapper $hasError={!!error} $disabled={disabled}>
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
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
            {results.length === 0 ? (
              <NoResults>
                {query ? '검색 결과가 없습니다' : '작물을 검색해보세요'}
              </NoResults>
            ) : (
              results.map((crop, index) => (
                <DropdownItem
                  key={crop.id}
                  $isSelected={index === selectedIndex}
                  onClick={() => handleItemSelect(crop)}
                  onMouseDown={(e) => e.preventDefault()} // 포커스 잃는 것 방지
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <CropInfo>
                    <CropName>{crop.cropNameKor}</CropName>
                    <CropCode>{crop.cropCode}</CropCode>
                  </CropInfo>
                  <CropDetails>
                    {crop.cropNameEng && <CropEngName>{crop.cropNameEng}</CropEngName>}
                    {crop.useKind && <UseKind>{crop.useKind}</UseKind>}
                  </CropDetails>
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
    border-color: #ef4444;
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
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: translateY(-50%) rotate(0deg); }
    100% { transform: translateY(-50%) rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  margin-top: 4px;
  color: #ef4444;
  font-size: 14px;
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
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
  width: 100%;
`;

const DropdownItem = styled.li<{ $isSelected: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.15s ease-in-out;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover,
  ${({ $isSelected }) => $isSelected && css`
    background-color: #f3f4f6;
  `}
  
  ${({ $isSelected }) => $isSelected && css`
    background-color: #eff6ff;
  `}
`;

const CropInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const CropName = styled.span`
  font-weight: 600;
  color: #1f2937;
`;

const CropCode = styled.span`
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
`;

const CropDetails = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const CropEngName = styled.span`
  font-size: 14px;
  color: #6b7280;
`;

const UseKind = styled.span`
  font-size: 12px;
  color: #059669;
  background: #d1fae5;
  padding: 2px 6px;
  border-radius: 4px;
`;

const NoResults = styled.div`
  padding: 16px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
`;

export default CropAutocomplete; 