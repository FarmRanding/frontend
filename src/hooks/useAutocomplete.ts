import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAutocompleteOptions {
  debounceMs?: number;
  minChars?: number;
  onFilter?: (items: any[], query: string) => any[];
  onSearch?: (query: string) => Promise<any[]>;
}

interface UseAutocompleteReturn<T> {
  query: string;
  setQuery: (query: string) => void;
  filteredItems: T[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleItemSelect: (item: T) => void;
  handleFocus: () => void;
  handleBlur: (e: React.FocusEvent) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  listRef: React.RefObject<HTMLUListElement>;
}

export function useAutocomplete<T>(
  items: T[],
  onSelect: (item: T) => void,
  options: UseAutocompleteOptions = {}
): UseAutocompleteReturn<T> {
  const {
    debounceMs = 300,
    minChars = 1,
    onFilter,
    onSearch,
  } = options;

  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<T[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // 필터링 로직
  const filterItems = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < minChars) {
      setFilteredItems([]);
      return;
    }

    // 외부 검색 함수가 있으면 사용
    if (onSearch) {
      try {
        const searchResults = await onSearch(searchQuery);
        setFilteredItems(searchResults);
      } catch (error) {
        console.error('검색 중 오류 발생:', error);
        setFilteredItems([]);
      }
      return;
    }

    // 기본 필터링 로직
    if (onFilter) {
      setFilteredItems(onFilter(items, searchQuery));
    } else {
      // 기본 필터링: name 속성으로 검색
      const filtered = items.filter(item => 
        (item as any).name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [items, minChars, onFilter, onSearch]);

  // 디바운스된 필터링
  const debouncedFilter = useCallback((searchQuery: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      filterItems(searchQuery);
    }, debounceMs);
  }, [filterItems, debounceMs]);

  // 입력 변화 처리
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setSelectedIndex(-1);
    setIsOpen(true);
    
    debouncedFilter(newQuery);
  }, [debouncedFilter]);

  // 키보드 네비게이션
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredItems.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredItems.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredItems[selectedIndex]) {
          handleItemSelect(filteredItems[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  }, [isOpen, filteredItems, selectedIndex]);

  // 아이템 선택
  const handleItemSelect = useCallback((item: T) => {
    setQuery((item as any).name || (item as any).cropName || (item as any).varietyName || '');
    setIsOpen(false);
    setSelectedIndex(-1);
    onSelect(item);
  }, [onSelect]);

  // 포커스 처리
  const handleFocus = useCallback(() => {
    setIsOpen(true);
    if (query && query.trim().length >= minChars) {
      filterItems(query);
    }
  }, [query, filterItems, minChars]);

  // 블러 처리
  const handleBlur = useCallback((e: React.FocusEvent) => {
    // 드롭다운 아이템 클릭 시 블러 방지
    if (containerRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    setTimeout(() => setIsOpen(false), 200);
  }, []);

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

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    query,
    setQuery,
    filteredItems,
    isOpen,
    setIsOpen,
    selectedIndex,
    setSelectedIndex,
    handleInputChange,
    handleKeyDown,
    handleItemSelect,
    handleFocus,
    handleBlur,
    containerRef,
    listRef,
  };
} 