import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import SignupModal from '../../components/common/SignupModal';

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const handleAuthCallback = () => {
      const accessToken = searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken');
      const userId = searchParams.get('userId');
      const email = searchParams.get('email');
      const nickname = searchParams.get('nickname');
      const membershipType = searchParams.get('membershipType');
      const isNewUser = searchParams.get('isNewUser') === 'true';

      if (!accessToken || !refreshToken || !userId) {
        console.error('인증 정보가 없습니다.');
        navigate('/');
        return;
      }

      // 토큰 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userId', userId);
      localStorage.setItem('email', email || '');
      localStorage.setItem('nickname', nickname || '');
      localStorage.setItem('membershipType', membershipType || '');

      // 사용자 정보 설정
      const currentUserInfo = {
        userId,
        email,
        nickname,
        membershipType
      };
      
      setUserInfo(currentUserInfo);

      // AuthContext에 로그인 상태 저장
      login(currentUserInfo);

      // 신규 유저인 경우 모달 표시, 기존 유저는 홈으로 이동
      if (isNewUser) {
        setShowSignupModal(true);
      } else {
        navigate('/home');
      }
    };

    // URL 파라미터가 있을 때만 실행
    if (searchParams.has('accessToken')) {
      handleAuthCallback();
    }
  }, [searchParams, navigate, login]); // 의존성 배열 유지 (이제 login이 메모이제이션됨)

  const handleSignupComplete = () => {
    setShowSignupModal(false);
    navigate('/home');
  };

  const handleSignupClose = () => {
    setShowSignupModal(false);
    navigate('/');
  };

  return (
    <Container>
      {/* 로딩 스피너 또는 처리 중 메시지 */}
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>로그인 처리 중...</LoadingText>
      </LoadingContainer>

      {/* 신규 유저 가입 모달 */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={handleSignupClose}
        onComplete={handleSignupComplete}
        userInfo={userInfo || {}}
      />
    </Container>
  );
};

export default AuthCallback;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(31, 65, 187, 0.2);
  border-left: 4px solid #1F41BB;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 16px;
  color: #374151;
  margin: 0;
  font-weight: 500;
`; 