import React from 'react';
import styled from 'styled-components';
import iconChevronDown from '../../../assets/icon-chevrondown.svg';

const MORE_BUTTON_WIDTH = 320;

const ButtonContainer = styled.button`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 8px;
  padding: 12px 16px;
  background: rgba(31, 65, 187, 0.05);
  border: 1px solid rgba(31, 65, 187, 0.2);
  border-radius: 8px;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(31, 65, 187, 0.1);
    border-color: rgba(31, 65, 187, 0.3);
    transform: translateY(-1px);
    box-shadow: 0px 4px 12px rgba(31, 65, 187, 0.15);
  }

  &:active {
    transform: translateY(0px);
    background: rgba(31, 65, 187, 0.08);
  }

  &:focus {
    outline: 2px solid #1F41BB;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ChevronIconContainer = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 8px;
`;

const ChevronIcon = styled.img`
  width: 16px;
  height: 16px;
  display: block;
  opacity: 0.7;
`;

const ButtonText = styled.span`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.18;
  color: #1F41BB;
  text-align: center;
  white-space: nowrap;
  margin: 0;
`;

interface MoreButtonProps {
  children?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const MoreButton: React.FC<MoreButtonProps> = ({
  children = '프리미엄 구독하고 더 보기',
  onClick,
  disabled = false,
  className,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onClick?.();
    }
  };

  return (
    <ButtonContainer
      onClick={handleClick}
      disabled={disabled}
      className={className}
      type="button"
      aria-label={children}
    >
      <ChevronIconContainer>
        <ChevronIcon src={iconChevronDown} alt="" />
      </ChevronIconContainer>
      <ButtonText>{children}</ButtonText>
    </ButtonContainer>
  );
};

export default MoreButton; 