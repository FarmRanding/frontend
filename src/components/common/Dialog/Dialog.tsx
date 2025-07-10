import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

export type DialogType = 'alert' | 'confirm';

export interface DialogProps {
  type: DialogType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
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

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const Overlay = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  animation: ${fadeIn} 0.2s ease-out;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.2s ease-out;

  @media (max-width: 402px) {
    padding: 16px;
  }
`;

const DialogContainer = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 380px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0px 20px 60px rgba(0, 0, 0, 0.15);
  animation: ${scaleIn} 0.3s ease-out;
  overflow: hidden;
  box-sizing: border-box;

  @media (max-width: 402px) {
    max-width: calc(100vw - 32px);
    margin: 0 16px;
  }
`;

const Header = styled.div`
  padding: 24px 24px 0 24px;

  @media (max-width: 402px) {
    padding: 20px 20px 0 20px;
  }
`;

const Title = styled.h3`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 1.4;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  word-break: keep-all;

  @media (max-width: 402px) {
    font-size: 16px;
  }
`;

const Message = styled.p`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
  color: #666666;
  margin: 0;
  word-break: keep-all;

  @media (max-width: 402px) {
    font-size: 13px;
  }
`;

const ButtonContainer = styled.div<{ $isSingle: boolean }>`
  padding: 24px;
  display: flex;
  gap: 12px;
  justify-content: ${props => props.$isSingle ? 'center' : 'flex-end'};

  @media (max-width: 402px) {
    padding: 20px;
    flex-direction: ${props => props.$isSingle ? 'row' : 'column-reverse'};
    gap: ${props => props.$isSingle ? '12px' : '8px'};
  }
`;

const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
  box-sizing: border-box;

  ${props => props.$variant === 'primary' && `
    background: #1F41BB;
    color: #ffffff;

    &:hover {
      background: #1a3aa3;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  `}

  ${props => props.$variant === 'secondary' && `
    background: #f5f5f5;
    color: #666666;

    &:hover {
      background: #e8e8e8;
      color: #555555;
    }

    &:active {
      background: #d9d9d9;
    }
  `}

  @media (max-width: 402px) {
    width: 100%;
    padding: 14px 24px;
  }
`;

export const Dialog: React.FC<DialogProps> = ({
  type,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  isVisible
}) => {
  useEffect(() => {
    if (isVisible) {
      // 스크롤 방지
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
        if (type === 'confirm' && onCancel) {
          onCancel();
        } else {
          onConfirm();
        }
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, type, onConfirm, onCancel]);

  if (!isVisible) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (type === 'confirm' && onCancel) {
        onCancel();
      } else {
        onConfirm();
      }
    }
  };

  return (
    <Overlay $isVisible={isVisible} onClick={handleOverlayClick}>
      <DialogContainer $isVisible={isVisible}>
        <Header>
          <Title>{title}</Title>
          <Message>{message}</Message>
        </Header>
        <ButtonContainer $isSingle={type === 'alert'}>
          {type === 'confirm' && onCancel && (
            <Button $variant="secondary" onClick={onCancel}>
              {cancelText}
            </Button>
          )}
          <Button $variant="primary" onClick={onConfirm}>
            {confirmText}
          </Button>
        </ButtonContainer>
      </DialogContainer>
    </Overlay>
  );
}; 