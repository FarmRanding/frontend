import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div<{ $type: ToastType; $isVisible: boolean }>`
  position: relative;
  width: 100%;
  max-width: 380px;
  margin-bottom: 12px;
  padding: 16px 20px;
  background: #ffffff;
  border-radius: 12px;
  border-left: 4px solid ${props => getTypeColor(props.$type)};
  box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.12);
  animation: ${props => props.$isVisible ? slideIn : slideOut} 0.3s ease-out forwards;
  backdrop-filter: blur(20px);
  box-sizing: border-box;

  @media (max-width: 402px) {
    max-width: calc(100vw - 32px);
    margin: 0 16px 12px 16px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const IconContainer = styled.div<{ $type: ToastType }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => getTypeColor(props.$type)}20;
  position: relative;
`;

const Icon = styled.div<{ $type: ToastType }>`
  width: 14px;
  height: 14px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  ${props => props.$type === 'success' && css`
    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 3px;
      height: 6px;
      border: solid ${getTypeColor(props.$type)};
      border-width: 0 2px 2px 0;
      transform: translate(-50%, -60%) rotate(45deg);
    }
  `}

  ${props => props.$type === 'error' && css`
    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 2px;
      height: 10px;
      background: ${getTypeColor(props.$type)};
      border-radius: 1px;
      transform: translate(-50%, -50%) rotate(45deg);
    }
    &::after {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  `}

  ${props => props.$type === 'warning' && css`
    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 2px;
      height: 6px;
      background: ${getTypeColor(props.$type)};
      border-radius: 1px;
      transform: translate(-50%, -65%);
    }
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 2px;
      height: 2px;
      background: ${getTypeColor(props.$type)};
      border-radius: 50%;
      transform: translate(-50%, 35%);
    }
  `}

  ${props => props.$type === 'info' && css`
    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 2px;
      height: 2px;
      background: ${getTypeColor(props.$type)};
      border-radius: 50%;
      transform: translate(-50%, -120%);
    }
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 2px;
      height: 6px;
      background: ${getTypeColor(props.$type)};
      border-radius: 1px;
      transform: translate(-50%, -10%);
    }
  `}
`;

const TextContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.div<{ $type: ToastType }>`
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.4;
  color: ${props => getTypeColor(props.$type)};
  margin-bottom: 2px;
  word-break: keep-all;
`;

const Message = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 13px;
  line-height: 1.4;
  color: #666666;
  word-break: keep-all;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 1px;
    background: #999999;
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }
`;

const ProgressBar = styled.div<{ $type: ToastType; $duration: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: ${props => getTypeColor(props.$type)};
  border-radius: 0 0 12px 12px;
  animation: progressShrink ${props => props.$duration}ms linear forwards;

  @keyframes progressShrink {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
`;

function getTypeColor(type: ToastType): string {
  switch (type) {
    case 'success':
      return '#10B981';
    case 'error':
      return '#EF4444';
    case 'warning':
      return '#F59E0B';
    case 'info':
      return '#1F41BB';
    default:
      return '#1F41BB';
  }
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 4000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  return (
    <ToastContainer $type={type} $isVisible={isVisible}>
      <ContentWrapper>
        <IconContainer $type={type}>
          <Icon $type={type} />
        </IconContainer>
        <TextContent>
          <Title $type={type}>{title}</Title>
          {message && <Message>{message}</Message>}
        </TextContent>
      </ContentWrapper>
      <CloseButton onClick={handleClose} />
      {duration > 0 && <ProgressBar $type={type} $duration={duration} />}
    </ToastContainer>
  );
}; 