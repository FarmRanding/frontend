import React from 'react';
import styled, { keyframes } from 'styled-components';
import iconClose from '../../../assets/icon-close.svg';

// 애니메이션
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ModalOverlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isVisible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContainer = styled.div<{ isVisible: boolean }>`
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: ${slideUp} 0.3s ease-out;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #E5E7EB;
`;

const ModalTitle = styled.h2`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.3;
  color: #1F2937;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #F3F4F6;
  }

  img {
    width: 20px;
    height: 20px;
  }
`;

const LocationList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding: 8px 0;
`;

const LocationItem = styled.button<{ isSelected: boolean }>`
  width: 100%;
  padding: 16px 24px;
  background: ${props => props.isSelected ? '#F4FAFF' : 'transparent'};
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
  font-weight: ${props => props.isSelected ? '600' : '400'};
  font-size: 16px;
  line-height: 1.3;
  color: ${props => props.isSelected ? '#1F41BB' : '#1F2937'};

  &:hover {
    background: ${props => props.isSelected ? '#F4FAFF' : '#F9FAFB'};
  }

  &:active {
    background: #E5E7EB;
  }
`;

interface LocationSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: string) => void;
  selectedLocation?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedLocation
}) => {
  const locations = [
    { code: '서울', name: '서울특별시' },
    { code: '부산', name: '부산광역시' },
    { code: '대구', name: '대구광역시' },
    { code: '인천', name: '인천광역시' },
    { code: '광주', name: '광주광역시' },
    { code: '대전', name: '대전광역시' },
    { code: '울산', name: '울산광역시' },
    { code: '세종', name: '세종특별자치시' },
    { code: '경기', name: '경기도' },
    { code: '강원', name: '강원도' },
    { code: '충북', name: '충청북도' },
    { code: '충남', name: '충청남도' },
    { code: '전북', name: '전라북도' },
    { code: '전남', name: '전라남도' },
    { code: '경북', name: '경상북도' },
    { code: '경남', name: '경상남도' },
    { code: '제주', name: '제주특별자치도' }
  ];

  const handleLocationSelect = (locationCode: string) => {
    onSelect(locationCode);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isVisible={isOpen} onClick={handleOverlayClick}>
      <ModalContainer isVisible={isOpen}>
        <ModalHeader>
          <ModalTitle>지역 선택</ModalTitle>
          <CloseButton onClick={onClose}>
            <img src={iconClose} alt="닫기" />
          </CloseButton>
        </ModalHeader>

        <LocationList>
          {locations.map((location) => (
            <LocationItem
              key={location.code}
              isSelected={selectedLocation === location.code}
              onClick={() => handleLocationSelect(location.code)}
            >
              {location.name}
            </LocationItem>
          ))}
        </LocationList>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default LocationSelector; 