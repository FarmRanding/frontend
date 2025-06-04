import React from 'react';
import styled from 'styled-components';

const TAG_WIDTH = 85;
const TAG_HEIGHT = 34;

const TagContainer = styled.button<{ variant: KeywordTagVariant }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: ${TAG_WIDTH}px;
  height: ${TAG_HEIGHT}px;
  padding: 8px 36px;
  background: #ffffff;
  border-radius: 16px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => {
    switch (props.variant) {
      case 'default':
        return `
          border: 1px solid #EDEDEF;
        `;
      case 'hover':
        return `
          border: 2px solid #EDEDEF;
        `;
      case 'selected':
        return `
          border: 2px solid #1F41BB;
        `;
      default:
        return `
          border: 1px solid #EDEDEF;
        `;
    }
  }}

  &:hover:not(:disabled) {
    ${props => props.variant !== 'selected' && `
      border: 2px solid #EDEDEF;
    `}
  }

  &:focus {
    ${props => props.variant !== 'selected' && `
      outline: 2px solid #1F41BB;
      outline-offset: 2px;
    `}
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TagText = styled.span<{ variant: KeywordTagVariant }>`
  font-family: 'Inter', sans-serif !important;
  font-size: 10px !important;
  line-height: 1.21 !important;
  letter-spacing: -5% !important;
  text-align: center !important;
  white-space: nowrap !important;
  margin: 0 !important;

  ${props => {
    switch (props.variant) {
      case 'default':
        return `
          font-weight: 400 !important;
          color: #000000 !important;
        `;
      case 'hover':
        return `
          font-weight: 600 !important;
          color: #000000 !important;
        `;
      case 'selected':
        return `
          font-weight: 700 !important;
          color: #1F41BB !important;
        `;
      default:
        return `
          font-weight: 400 !important;
          color: #000000 !important;
        `;
    }
  }}
`;

export type KeywordTagVariant = 'default' | 'hover' | 'selected';

interface KeywordTagProps {
  children: string;
  variant?: KeywordTagVariant;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const KeywordTag: React.FC<KeywordTagProps> = ({
  children,
  variant = 'default',
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
    <TagContainer
      variant={variant}
      onClick={handleClick}
      disabled={disabled}
      className={className}
      type="button"
      aria-pressed={variant === 'selected'}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <TagText variant={variant} style={{ fontFamily: "'Inter', sans-serif" }}>
        {children}
      </TagText>
    </TagContainer>
  );
};

export default KeywordTag; 