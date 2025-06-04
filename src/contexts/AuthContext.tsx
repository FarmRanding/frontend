import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { checkAuthStatus, getCurrentUser, fetchCurrentUserFromServer, logout } from '../api/auth';
import type { UserResponse } from '../types/user';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserResponse | null;
  login: (userInfo: UserResponse) => void;
  logout: () => void;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // useCallback으로 함수들을 메모이제이션
  const handleLogin = useCallback((userInfo: UserResponse) => {
    setUser(userInfo);
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    logout(); // API 함수 호출
  }, []);

  useEffect(() => {
    // 앱 시작 시 인증 상태 확인
    const initializeAuth = async () => {
      try {
        const hasTokens = checkAuthStatus();
        
        if (hasTokens) {
          // 먼저 서버에서 최신 사용자 정보 가져오기 시도
          const serverUser = await fetchCurrentUserFromServer();
          
          if (serverUser) {
            // 서버에서 정보 조회 성공
            setUser(serverUser);
            setIsAuthenticated(true);
          } else {
            // 서버에서 실패하면 로컬 정보로 폴백 (토큰 갱신이 자동으로 수행됨)
            const localUser = getCurrentUser();
            if (localUser) {
              setUser(localUser);
              setIsAuthenticated(true);
            } else {
              // 로컬 정보도 없으면 로그아웃
              handleLogout();
            }
          }
        } else {
          // 토큰이 없으면 로그아웃 상태
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('인증 상태 확인 중 오류:', error);
        // 에러 발생 시 로컬 정보로 시도
        const localUser = getCurrentUser();
        if (localUser && checkAuthStatus()) {
          setUser(localUser);
          setIsAuthenticated(true);
        } else {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [handleLogout]);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login: handleLogin,
    logout: handleLogout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 