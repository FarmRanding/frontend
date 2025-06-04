import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNotification } from '../../../contexts/NotificationContext';
import { signupUser } from '../../../api/auth';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  userInfo: {
    userId: string;
    email: string;
    nickname: string;
    membershipType: string;
  };
}

interface SignupData {
  name: string;
  farmName: string;
  farmLocation: string;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onComplete, userInfo }) => {
  const { showSuccess, showError, showWarning } = useNotification();
  const [formData, setFormData] = useState<SignupData>({
    name: '',
    farmName: '',
    farmLocation: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressSearchResults, setAddressSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (field: keyof SignupData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // 농가 위치 필드의 경우 입력 시 검색 결과 초기화
    if (field === 'farmLocation') {
      setShowDropdown(false);
      setAddressSearchResults([]);
    }
  };

  // 주소 검색 함수
  const searchAddress = async (query: string) => {
    if (!query.trim()) {
      setAddressSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    
    try {
      // 목업 데이터로 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockResults = [
        '서울특별시 강남구 역삼동',
        '서울특별시 서초구 서초동',
        '경기도 화성시 동탄면',
        '경기도 화성시 봉담읍',
        '경기도 화성시 남양읍',
        '경기도 성남시 분당구 정자동',
        '경기도 용인시 기흥구 구갈동',
        '부산광역시 해운대구 우동',
        '대구광역시 수성구 범어동',
        '인천광역시 연수구 송도동'
      ];
      
      const filteredResults = mockResults.filter(address => 
        address.toLowerCase().includes(query.toLowerCase())
      );
      
      setAddressSearchResults(filteredResults);
      setShowDropdown(true);
    } catch (error) {
      console.error('주소 검색 실패:', error);
      setAddressSearchResults([]);
      setShowDropdown(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddressSearch = () => {
    searchAddress(formData.farmLocation);
  };

  const handleAddressSelect = (selectedAddress: string) => {
    setFormData(prev => ({
      ...prev,
      farmLocation: selectedAddress
    }));
    setShowDropdown(false);
    setAddressSearchResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.farmName.trim() || !formData.farmLocation.trim()) {
      showWarning('입력 확인', '모든 필드를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await signupUser({
        name: formData.name,
        farmName: formData.farmName,
        location: formData.farmLocation
      });
      
      console.log('회원가입 성공:', result);
      showSuccess('회원가입 완료', '회원가입이 완료되었습니다!');
      onComplete();
    } catch (error: any) {
      console.error('회원가입 실패:', error);
      
      // 에러 메시지가 "성공"인 경우 실제로는 성공으로 처리
      if (error?.message === '성공' || error?.toString().includes('성공')) {
        console.log('실제로는 성공');
        showSuccess('회원가입 완료', '회원가입이 완료되었습니다!');
        onComplete();
      } else {
        showError('회원가입 실패', '회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
      setShowDropdown(false);
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const isFormValid = formData.name.trim() && formData.farmName.trim() && formData.farmLocation.trim();

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer isOpen={isOpen} onClick={handleContainerClick}>
        <CloseButton onClick={onClose} type="button">
          ×
        </CloseButton>
        
        <ModalHeader>
          <ModalTitle>환영합니다!</ModalTitle>
          <ModalSubtitle>
            팜랜딩 서비스 이용을 위해<br />
            기본 정보를 입력해주세요.
          </ModalSubtitle>
        </ModalHeader>
        
        <ModalForm onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel htmlFor="name">이름</FormLabel>
            <FormInput
              id="name"
              type="text"
              placeholder="실명을 입력해주세요"
              value={formData.name}
              onChange={handleInputChange('name')}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="farmName">농가명</FormLabel>
            <FormInput
              id="farmName"
              type="text"
              placeholder="농가 이름을 입력해주세요"
              value={formData.farmName}
              onChange={handleInputChange('farmName')}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="farmLocation">농가 위치</FormLabel>
            <AddressSearchContainer>
              <AddressSearchInput
                id="farmLocation"
                type="text"
                placeholder="화성, 서울, 부산 등 입력 후 검색 버튼 클릭"
                value={formData.farmLocation}
                onChange={handleInputChange('farmLocation')}
                required
              />
              <SearchButton onClick={handleAddressSearch} disabled={isSearching} type="button">
                {isSearching ? '검색중...' : '검색'}
              </SearchButton>
            </AddressSearchContainer>
            
            {showDropdown && (
              <SearchResultsDropdown isVisible={showDropdown}>
                {addressSearchResults.length > 0 ? (
                  addressSearchResults.map((address, index) => (
                    <SearchResultItem key={index} onClick={() => handleAddressSelect(address)}>
                      {address}
                    </SearchResultItem>
                  ))
                ) : (
                  <NoResultsMessage>
                    검색 결과가 없습니다.
                  </NoResultsMessage>
                )}
              </SearchResultsDropdown>
            )}
          </FormGroup>
          
          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={onClose}>
              취소
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? '가입 중...' : '가입 완료'}
            </Button>
          </ButtonGroup>
        </ModalForm>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default SignupModal;

// Styled Components
const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ModalContainer = styled.div<{ isOpen: boolean }>`
  width: 100%;
  max-width: 480px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 255, 0.95) 100%);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 
    0 24px 80px rgba(31, 65, 187, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: visible;
  transform: ${props => props.isOpen ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  @media (min-width: 768px) {
    max-width: 520px;
    border-radius: 36px;
  }
  
  @media (min-width: 1024px) {
    max-width: 560px;
    border-radius: 40px;
  }
`;

const ModalHeader = styled.div`
  padding: 40px 32px 24px 32px;
  text-align: center;
  
  @media (min-width: 768px) {
    padding: 48px 40px 28px 40px;
  }
  
  @media (min-width: 1024px) {
    padding: 56px 48px 32px 48px;
  }
`;

const ModalTitle = styled.h2`
  font-family: 'Jalnan 2', sans-serif !important;
  font-size: 28px;
  background: linear-gradient(135deg, #1F41BB 0%, #4F46E5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 12px 0;
  letter-spacing: -0.02em;
  
  @media (min-width: 768px) {
    font-size: 32px;
    margin: 0 0 16px 0;
  }
  
  @media (min-width: 1024px) {
    font-size: 36px;
    margin: 0 0 20px 0;
  }
`;

const ModalSubtitle = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 16px;
  color: #6B7280;
  line-height: 1.5;
  margin: 0;
  
  @media (min-width: 768px) {
    font-size: 17px;
  }
  
  @media (min-width: 1024px) {
    font-size: 18px;
  }
`;

const ModalForm = styled.form`
  padding: 0 32px 40px 32px;
  
  @media (min-width: 768px) {
    padding: 0 40px 48px 40px;
  }
  
  @media (min-width: 1024px) {
    padding: 0 48px 56px 48px;
  }
`;

const FormGroup = styled.div`
  position: relative;
  margin-bottom: 24px;
  
  @media (min-width: 768px) {
    margin-bottom: 28px;
  }
  
  @media (min-width: 1024px) {
    margin-bottom: 32px;
  }
`;

const FormLabel = styled.label`
  display: block;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  
  @media (min-width: 768px) {
    font-size: 15px;
    margin-bottom: 10px;
  }
  
  @media (min-width: 1024px) {
    font-size: 16px;
    margin-bottom: 12px;
  }
`;

const FormInput = styled.input`
  width: 100%;
  height: 56px;
  padding: 0 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 16px;
  color: #1F2937;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(31, 65, 187, 0.1);
  border-radius: 16px;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
  
  &::placeholder {
    color: #9CA3AF;
  }
  
  &:focus {
    border-color: #1F41BB;
    background: rgba(255, 255, 255, 0.95);
    color: #111827;
    box-shadow: 
      0 0 0 4px rgba(31, 65, 187, 0.1),
      0 4px 12px rgba(31, 65, 187, 0.1);
  }
  
  &:hover:not(:focus) {
    border-color: rgba(31, 65, 187, 0.2);
    background: rgba(255, 255, 255, 0.9);
  }
  
  @media (min-width: 768px) {
    height: 60px;
    padding: 0 24px;
    font-size: 17px;
    border-radius: 18px;
  }
  
  @media (min-width: 1024px) {
    height: 64px;
    padding: 0 28px;
    font-size: 18px;
    border-radius: 20px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
  
  @media (min-width: 768px) {
    gap: 20px;
    margin-top: 36px;
  }
  
  @media (min-width: 1024px) {
    gap: 24px;
    margin-top: 40px;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  height: 56px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #1F41BB 0%, #4F46E5 100%);
    color: white;
    box-shadow: 
      0 8px 24px rgba(31, 65, 187, 0.25),
      0 2px 8px rgba(0, 0, 0, 0.1);
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
      transition: left 0.5s ease;
    }
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 
        0 12px 32px rgba(31, 65, 187, 0.35),
        0 4px 12px rgba(0, 0, 0, 0.15);
        
      &::before {
        left: 100%;
      }
    }
    
    &:active {
      transform: translateY(0);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      
      &:hover {
        transform: none;
        box-shadow: 
          0 8px 24px rgba(31, 65, 187, 0.25),
          0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
  ` : `
    background: rgba(107, 114, 128, 0.1);
    color: #6B7280;
    border: 2px solid rgba(107, 114, 128, 0.2);
    
    &:hover {
      background: rgba(107, 114, 128, 0.15);
      border-color: rgba(107, 114, 128, 0.3);
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
  
  @media (min-width: 768px) {
    height: 60px;
    font-size: 17px;
    border-radius: 18px;
  }
  
  @media (min-width: 1024px) {
    height: 64px;
    font-size: 18px;
    border-radius: 20px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #6B7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 300;
  transition: all 0.3s ease;
  font-family: Arial, sans-serif;
  
  &:hover {
    color: #374151;
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(1.05);
  }
  
  @media (min-width: 768px) {
    top: 28px;
    right: 28px;
    width: 36px;
    height: 36px;
    font-size: 28px;
  }
  
  @media (min-width: 1024px) {
    top: 32px;
    right: 32px;
    width: 40px;
    height: 40px;
    font-size: 32px;
  }
`;

// 주소 검색 관련 컴포넌트
const AddressSearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const AddressSearchInput = styled(FormInput)`
  padding-right: 70px;
  
  @media (min-width: 768px) {
    padding-right: 80px;
  }
  
  @media (min-width: 1024px) {
    padding-right: 90px;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 40px;
  border: none;
  background: linear-gradient(135deg, #1F41BB 0%, #4F46E5 100%);
  color: white;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover:not(:disabled) {
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 4px 12px rgba(31, 65, 187, 0.3);
  }
  
  &:active:not(:disabled) {
    transform: translateY(-50%) scale(1.02);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: translateY(-50%);
  }
  
  @media (min-width: 768px) {
    right: 10px;
    width: 68px;
    height: 44px;
    border-radius: 14px;
    font-size: 13px;
  }
  
  @media (min-width: 1024px) {
    right: 12px;
    width: 76px;
    height: 48px;
    border-radius: 16px;
    font-size: 14px;
  }
`;

const SearchResultsDropdown = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 16px;
  border: 2px solid rgba(31, 65, 187, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 99999;
  max-height: 240px;
  overflow-y: auto;
  margin-top: 8px;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transform: ${props => props.isVisible ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  @media (min-width: 768px) {
    border-radius: 18px;
    margin-top: 10px;
  }
  
  @media (min-width: 1024px) {
    border-radius: 20px;
    margin-top: 12px;
  }
`;

const SearchResultItem = styled.button`
  width: 100%;
  padding: 16px 20px;
  text-align: left;
  border: none;
  background: white;
  color: #374151;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(31, 65, 187, 0.05);
  
  &:first-child {
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }
  
  &:last-child {
    border-bottom: none;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
  }
  
  &:hover {
    background: rgba(31, 65, 187, 0.05);
    color: #1F41BB;
  }
  
  &:active {
    background: rgba(31, 65, 187, 0.1);
  }
  
  @media (min-width: 768px) {
    padding: 18px 24px;
    font-size: 17px;
    
    &:first-child {
      border-top-left-radius: 18px;
      border-top-right-radius: 18px;
    }
    
    &:last-child {
      border-bottom-left-radius: 18px;
      border-bottom-right-radius: 18px;
    }
  }
  
  @media (min-width: 1024px) {
    padding: 20px 28px;
    font-size: 18px;
    
    &:first-child {
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
    }
    
    &:last-child {
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
    }
  }
`;

const NoResultsMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #9CA3AF;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  
  @media (min-width: 768px) {
    padding: 24px;
    font-size: 15px;
  }
  
  @media (min-width: 1024px) {
    padding: 28px;
    font-size: 16px;
  }
`; 