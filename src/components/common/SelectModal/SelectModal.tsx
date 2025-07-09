import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface SelectModalProps {
  title: string;
  options: SelectOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  onCancel: () => void;
  isVisible: boolean;
}

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

const Overlay = styled.div<{ $isVisible: boolean }>`
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: rgba(0, 0, 0, 0.7) !important;
  z-index: 999999 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 20px;
  box-sizing: border-box;
  animation: ${fadeIn} 0.2s ease-out;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.2s ease-out;
  backdrop-filter: blur(8px) !important;

  @media (max-width: 402px) {
    padding: 20px 16px;
    align-items: center !important;
  }
`;

const ModalContainer = styled.div<{ $isVisible: boolean }>`
  width: 100%;
  max-width: 380px;
  max-height: 70vh;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0px 20px 60px rgba(0, 0, 0, 0.15);
  animation: ${slideUp} 0.3s ease-out;
  overflow: hidden;
  box-sizing: border-box;
  margin: auto;

  @media (max-width: 402px) {
    max-width: 100%;
    max-height: 70vh;
    border-radius: 16px;
  }
`;

const Header = styled.div`
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #f0f0f0;

  @media (max-width: 402px) {
    padding: 20px 20px 16px 20px;
  }
`;

const Title = styled.h3`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 1.4;
  color: #1a1a1a;
  margin: 0;
  word-break: keep-all;

  @media (max-width: 402px) {
    font-size: 16px;
  }
`;

const OptionsContainer = styled.div`
  max-height: calc(50vh - 120px);
  overflow-y: auto;
  padding: 8px 0;

  @media (max-width: 402px) {
    max-height: calc(50vh - 120px);
  }
`;

const Option = styled.button<{ $isSelected: boolean }>`
  width: 100%;
  padding: 16px 24px;
  border: none;
  background: ${props => props.$isSelected ? '#f7f9ff' : 'transparent'};
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &:hover {
    background: ${props => props.$isSelected ? '#f0f4ff' : '#f9f9f9'};
  }

  &:active {
    background: ${props => props.$isSelected ? '#e8f0ff' : '#f0f0f0'};
  }

  @media (max-width: 402px) {
    padding: 14px 20px;
  }
`;

const OptionLabel = styled.span<{ $isSelected: boolean }>`
  font-family: 'Inter', sans-serif;
  font-weight: ${props => props.$isSelected ? 600 : 500};
  font-size: 14px;
  line-height: 1.4;
  color: ${props => props.$isSelected ? '#1F41BB' : '#1a1a1a'};
  word-break: keep-all;
`;

const OptionDescription = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.4;
  color: #666666;
  word-break: keep-all;
`;

const ButtonContainer = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;

  @media (max-width: 402px) {
    padding: 16px 20px;
  }
`;

const CancelButton = styled.button`
  width: 100%;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  background: #f5f5f5;
  color: #666666;
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:hover {
    background: #e8e8e8;
    color: #555555;
  }

  &:active {
    background: #d9d9d9;
  }

  @media (max-width: 402px) {
    padding: 14px 24px;
  }
`;

export const SelectModal: React.FC<SelectModalProps> = ({
  title,
  options,
  selectedValue,
  onSelect,
  onCancel,
  isVisible
}) => {
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onCancel]);

  if (!isVisible) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return createPortal(
    <Overlay $isVisible={isVisible} onClick={handleOverlayClick}>
      <ModalContainer $isVisible={isVisible}>
        <Header>
          <Title>{title}</Title>
        </Header>
        <OptionsContainer>
          {options.map((option) => (
            <Option
              key={option.value}
              $isSelected={selectedValue === option.value}
              onClick={() => onSelect(option.value)}
            >
              <OptionLabel $isSelected={selectedValue === option.value}>
                {option.label}
              </OptionLabel>
              {option.description && (
                <OptionDescription>{option.description}</OptionDescription>
              )}
            </Option>
          ))}
        </OptionsContainer>
        <ButtonContainer>
          <CancelButton onClick={onCancel}>
            취소
          </CancelButton>
        </ButtonContainer>
      </ModalContainer>
    </Overlay>,
    document.body
  );
}; 