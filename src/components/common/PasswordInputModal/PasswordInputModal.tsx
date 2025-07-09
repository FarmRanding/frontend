import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import iconClose from '../../../assets/icon-close.svg';
import iconProfile from '../../../assets/icon-profile.svg';

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

const Overlay = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: ${fadeIn} 0.3s ease-out;
  padding: 20px;
  box-sizing: border-box;
  opacity: ${props => props.$isVisible ? 1 : 0};
  backdrop-filter: blur(8px);
`;

const ModalContainer = styled.div<{ $isVisible: boolean }>`
  background: #FFFFFF;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  animation: ${slideUp} 0.4s ease-out;
  opacity: ${props => props.$isVisible ? 1 : 0};
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #F3F4F6;
  position: relative;
`;

const HeaderIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(245, 124, 0, 0.05) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const HeaderIconImage = styled.img`
  width: 20px;
  height: 20px;
  filter: brightness(0) saturate(100%) invert(59%) sepia(100%) saturate(1949%) hue-rotate(18deg) brightness(100%) contrast(101%);
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const ModalTitle = styled.h2`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.3;
  color: #FF9800;
  margin: 0 0 4px 0;
`;

const ModalSubtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4;
  color: #6B7280;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const CloseIcon = styled.img`
  width: 16px;
  height: 16px;
  opacity: 0.7;
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const InputContainer = styled.div`
  margin-bottom: 24px;
`;

const InputLabel = styled.label`
  font-family: 'Jalnan 2', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4;
  color: #374151;
  display: block;
  margin-bottom: 8px;
`;

const PasswordInput = styled.input`
  width: 100%;
  height: 48px;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 0 16px;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  color: #374151;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #FF9800;
    box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.1);
  }

  &::placeholder {
    color: #9CA3AF;
  }
`;

const HintText = styled.p`
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.4;
  color: #6B7280;
  margin: 8px 0 0 0;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  flex: 1;
  height: 48px;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid;

  ${props => props.$variant === 'primary' ? `
    background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
    border-color: #FF9800;
    color: white;
    box-shadow: 0 4px 16px rgba(255, 152, 0, 0.25);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(255, 152, 0, 0.35);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  ` : `
    background: #F9FAFB;
    border-color: #E5E7EB;
    color: #6B7280;

    &:hover {
      background: #F3F4F6;
      border-color: #D1D5DB;
    }

    &:active {
      background: #E5E7EB;
    }
  `}
`;

interface PasswordInputModalProps {
  isOpen: boolean;
  onConfirm: (password: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const PasswordInputModal: React.FC<PasswordInputModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false
}) => {
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // 스크롤 방지
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
      setPassword(''); // 모달 닫을 때 입력값 초기화
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onCancel, isLoading]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onCancel();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() && !isLoading) {
      onConfirm(password.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && password.trim() && !isLoading) {
      e.preventDefault();
      onConfirm(password.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay $isVisible={isVisible} onClick={handleOverlayClick}>
      <ModalContainer $isVisible={isVisible}>
        <ModalHeader>
          <HeaderIcon>
            <HeaderIconImage src={iconProfile} alt="테스트 로그인" />
          </HeaderIcon>
          <HeaderContent>
            <ModalTitle>테스트 로그인</ModalTitle>
            <ModalSubtitle>평가용 계정으로 로그인</ModalSubtitle>
          </HeaderContent>
          <CloseButton onClick={onCancel} disabled={isLoading}>
            <CloseIcon src={iconClose} alt="닫기" />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <form onSubmit={handleSubmit}>
            <InputContainer>
              <InputLabel htmlFor="test-password">패스워드</InputLabel>
              <PasswordInput
                id="test-password"
                type="password"
                placeholder="테스트 계정 패스워드를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                autoFocus
              />
              <HintText>
                공모전 평가를 위한 테스트 계정입니다
              </HintText>
            </InputContainer>

            <ButtonContainer>
              <Button 
                type="button" 
                $variant="secondary" 
                onClick={onCancel}
                disabled={isLoading}
              >
                취소
              </Button>
              <Button 
                type="submit" 
                $variant="primary"
                disabled={!password.trim() || isLoading}
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>
            </ButtonContainer>
          </form>
        </ModalBody>
      </ModalContainer>
    </Overlay>
  );
};

export default PasswordInputModal; 