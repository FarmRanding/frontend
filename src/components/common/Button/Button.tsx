import React from 'react';
import styled from 'styled-components';

export type ButtonVariant = 'primary' | 'secondary' | 'disabled';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const MOBILE_WIDTH = 375;

const getButtonStyles = (variant: ButtonVariant, disabled: boolean) => {
  if (disabled) {
    return {
      background: '#D9D9D9',
      color: '#9E9E9E',
      cursor: 'not-allowed',
    };
  }

  switch (variant) {
    case 'primary':
      return {
        background: '#1F41BB',
        color: '#FFFFFF',
        hoverBackground: '#1A3A9E',
        activeBackground: '#163285',
      };
    case 'secondary':
      return {
        background: '#9E9E9E',
        color: '#FFFFFF',
        hoverBackground: '#757575',
        activeBackground: '#616161',
      };
    default:
      return {
        background: '#1F41BB',
        color: '#FFFFFF',
        hoverBackground: '#1A3A9E',
        activeBackground: '#163285',
      };
  }
};

const StyledButton = styled.button<{ variant: ButtonVariant; disabled: boolean }>`
  width: 100%;
  max-width: ${MOBILE_WIDTH}px;
  min-height: 53px;
  padding: 17px 24px;
  background: ${({ variant, disabled }) => getButtonStyles(variant, disabled).background};
  color: ${({ variant, disabled }) => getButtonStyles(variant, disabled).color};
  border: none;
  border-radius: 8px;
  font-family: var(--font-jalnan) !important;
  font-size: 16px;
  font-weight: normal;
  line-height: 1.18;
  text-align: center;
  white-space: nowrap;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  box-sizing: border-box;
  
  &:hover:not(:disabled) {
    background: ${({ variant, disabled }) => {
      const styles = getButtonStyles(variant, disabled);
      return styles.hoverBackground || styles.background;
    }};
  }
  
  &:active:not(:disabled) {
    background: ${({ variant, disabled }) => {
      const styles = getButtonStyles(variant, disabled);
      return styles.activeBackground || styles.background;
    }};
    transform: scale(0.98);
  }
  
  &:disabled {
    background: #D9D9D9;
    color: #9E9E9E;
    cursor: not-allowed;
  }
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  type = 'button',
  className,
}) => {
  return (
    <StyledButton
      variant={variant}
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={className}
      aria-disabled={disabled}
    >
      {children}
    </StyledButton>
  );
};

export default Button; 