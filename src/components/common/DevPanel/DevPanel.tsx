import React, { useState } from 'react';
import styled from 'styled-components';

interface DevPanelProps {
  className?: string;
}

const DevPanel: React.FC<DevPanelProps> = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 프로덕션 환경에서는 렌더링하지 않음
  if (!import.meta.env.DEV) {
    return null;
  }

  const handleCreateNewUserDirectly = () => {
    (window as any).devTools?.createNewUserDirectly();
  };

  const handleSimulateNewUser = () => {
    (window as any).devTools?.simulateNewUser();
  };

  const handleSimulateExistingUser = () => {
    (window as any).devTools?.simulateExistingUser();
  };

  const handleRestoreUser = () => {
    (window as any).devTools?.restoreOriginalUser();
  };

  const handleShowBackup = () => {
    (window as any).devTools?.showBackupData();
  };

  const handleTriggerModal = () => {
    (window as any).devTools?.triggerSignupModal();
  };

  const hasBackup = () => {
    return (window as any).devTools?.hasBackup() || false;
  };

  return (
    <DevPanelContainer className={className} $isExpanded={isExpanded}>
      <ToggleButton onClick={() => setIsExpanded(!isExpanded)} $isExpanded={isExpanded}>
        🛠️ DEV
        {isExpanded ? ' ⬇️' : ' ⬆️'}
      </ToggleButton>
      
      {isExpanded && (
        <DevContent>
          <DevTitle>🔧 개발자 도구</DevTitle>
          
          <SectionTitle>🚀 빠른 테스트</SectionTitle>
          <ButtonGroup>
            <DevButton onClick={handleCreateNewUserDirectly} variant="primary">
              🎯 바로 신규 유저 생성
            </DevButton>
            
            <DevButton onClick={handleTriggerModal} variant="secondary">
              📝 회원가입 모달만 표시
            </DevButton>
          </ButtonGroup>

          <SectionTitle>🔄 완전한 시뮬레이션</SectionTitle>
          <ButtonGroup>
            <DevButton onClick={handleSimulateNewUser} variant="warning">
              🆕 신규 유저 시뮬레이션
            </DevButton>
            
            <DevButton onClick={handleSimulateExistingUser} variant="info">
              👤 기존 유저 시뮬레이션
            </DevButton>
          </ButtonGroup>

          {hasBackup() && (
            <>
              <SectionTitle>🔧 복구</SectionTitle>
              <ButtonGroup>
                <DevButton onClick={handleRestoreUser} variant="success">
                  🔄 원본 사용자 복구
                </DevButton>
              </ButtonGroup>
            </>
          )}
          
          <SectionTitle>📊 정보</SectionTitle>
          <ButtonGroup>
            <DevButton onClick={handleShowBackup} variant="info">
              📊 백업 데이터 확인
            </DevButton>
          </ButtonGroup>
          
          <DevInfo>
            💡 콘솔에서 <code>window.devTools</code>로 더 많은 기능 사용 가능
          </DevInfo>
        </DevContent>
      )}
    </DevPanelContainer>
  );
};

export default DevPanel;

// Styled Components
const DevPanelContainer = styled.div<{ $isExpanded: boolean }>`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, rgba(31, 65, 187, 0.95) 0%, rgba(79, 70, 229, 0.95) 100%);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-bottom: none;
  border-radius: 16px 16px 0 0;
  color: white;
  z-index: 10000;
  min-width: 250px;
  max-width: 90vw;
  box-shadow: 0 -8px 32px rgba(31, 65, 187, 0.3);
  
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${props => props.$isExpanded ? `
    height: auto;
    max-height: 80vh;
    overflow-y: auto;
  ` : `
    height: auto;
  `}
`;

const ToggleButton = styled.button<{ $isExpanded: boolean }>`
  width: 100%;
  padding: 12px 20px;
  background: transparent;
  border: none;
  color: white;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &:active {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const DevContent = styled.div`
  padding: 0 20px 20px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const DevTitle = styled.h3`
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  margin: 16px 0 20px 0;
  text-align: center;
  color: white;
`;

const SectionTitle = styled.h4`
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  margin: 16px 0 8px 0;
  color: rgba(255, 255, 255, 0.8);
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
`;

const DevButton = styled.button<{ variant?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' }>`
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: rgba(239, 68, 68, 0.8);
          color: white;
          &:hover { background: rgba(239, 68, 68, 0.9); }
        `;
      case 'success':
        return `
          background: rgba(34, 197, 94, 0.8);
          color: white;
          &:hover { background: rgba(34, 197, 94, 0.9); }
        `;
      case 'info':
        return `
          background: rgba(59, 130, 246, 0.8);
          color: white;
          &:hover { background: rgba(59, 130, 246, 0.9); }
        `;
      case 'warning':
        return `
          background: rgba(245, 158, 11, 0.8);
          color: white;
          &:hover { background: rgba(245, 158, 11, 0.9); }
        `;
      case 'secondary':
      default:
        return `
          background: rgba(107, 114, 128, 0.8);
          color: white;
          &:hover { background: rgba(107, 114, 128, 0.9); }
        `;
    }
  }}
  
  &:active {
    transform: translateY(1px);
  }
`;

const DevInfo = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  line-height: 1.4;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  
  code {
    background: rgba(255, 255, 255, 0.2);
    padding: 2px 4px;
    border-radius: 3px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 9px;
  }
`; 