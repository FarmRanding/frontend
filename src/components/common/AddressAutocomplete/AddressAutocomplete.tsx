import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { addressService, LegalDistrictResponse } from '../../../api/addressService';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  placeholder = '주소를 입력하세요',
  disabled = false,
  className,
}) => {
  const [suggestions, setSuggestions] = useState<LegalDistrictResponse[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [inputValue, setInputValue] = useState(value);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<number | undefined>(undefined);

  // value props가 변경되면 inputValue 동기화 (단, 사용자가 직접 입력 중이 아닐 때만)
  useEffect(() => {
    if (value !== inputValue && document.activeElement !== inputRef.current) {
      setInputValue(value);
    }
  }, [value]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 검색 함수 (메모이제이션)
  const searchAddresses = useCallback(async (keyword: string) => {
    // 빈 문자열이나 너무 짧은 검색어는 제외
    if (!keyword.trim() || keyword.trim().length < 1) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await addressService.searchLegalDistricts(keyword.trim(), 10);
      setSuggestions(results);
      setIsOpen(results.length > 0);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('주소 검색 실패:', error);
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 디바운스된 검색 (700ms로 증가)
  useEffect(() => {
    // 이전 타이머 클리어
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // 새 타이머 설정
    searchTimeoutRef.current = setTimeout(() => {
      searchAddresses(inputValue);
    }, 700);

    // 클린업
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [inputValue, searchAddresses]);

  // 입력 핸들러
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  }, [onChange]);

  // 주소 선택 핸들러
  const handleSelectAddress = useCallback((address: LegalDistrictResponse) => {
    const selectedAddress = address.fullAddress;
    setInputValue(selectedAddress);
    onChange(selectedAddress);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  }, [onChange]);

  // 키보드 네비게이션
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectAddress(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  }, [isOpen, suggestions, selectedIndex, handleSelectAddress]);

  // 포커스 핸들러
  const handleFocus = useCallback(() => {
    if (suggestions.length > 0 && inputValue.trim()) {
      setIsOpen(true);
    }
  }, [suggestions.length, inputValue]);

  // 메모이제이션된 suggestion 리스트
  const suggestionList = useMemo(() => {
    if (!isOpen || suggestions.length === 0) return null;
    
    return (
      <SuggestionsList>
        {suggestions.map((suggestion, index) => (
          <SuggestionItem
            key={suggestion.code}
            onClick={() => handleSelectAddress(suggestion)}
            $isSelected={index === selectedIndex}
          >
            <MainAddress>{suggestion.fullAddress}</MainAddress>
          </SuggestionItem>
        ))}
      </SuggestionsList>
    );
  }, [isOpen, suggestions, selectedIndex, handleSelectAddress]);

  return (
    <Container ref={containerRef} className={className}>
      <InputContainer>
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
        />
        {isLoading && <LoadingSpinner />}
      </InputContainer>
      
      {suggestionList}
    </Container>
  );
};

export default AddressAutocomplete;

// Styled Components
const Container = styled.div`
  position: relative;
  width: 100%;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  line-height: 1.5;
  background-color: #fff;
  color: #1f2937;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #1F41BB;
    box-shadow: 0 0 0 3px rgba(31, 65, 187, 0.1);
  }
  
  &:disabled {
    background-color: #f8f9fa;
    color: #6b7280;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const LoadingSpinner = styled.div`
  position: absolute;
  right: 12px;
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  border-top-color: #1F41BB;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  margin-top: 4px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 0;
  margin: 4px 0 0 0;
  list-style: none;
`;

const SuggestionItem = styled.li<{ $isSelected: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  background-color: ${props => props.$isSelected ? 'rgba(31, 65, 187, 0.05)' : 'white'};
  transition: background-color 0.15s ease;
  
  &:hover {
    background-color: rgba(31, 65, 187, 0.05);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const MainAddress = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
`; 