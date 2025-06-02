import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { checkAuthStatus, getCurrentUser, logout } from '../api/auth';

interface User {
  userId: string | null;
  email: string | null;
  nickname: string | null;
  membershipType: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userInfo: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // useCallback으로 함수들을 메모이제이션
  const handleLogin = useCallback((userInfo: User) => {
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
    const initializeAuth = () => {
      try {
        const authStatus = checkAuthStatus();
        if (authStatus) {
          const currentUser = getCurrentUser();
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('인증 상태 확인 중 오류:', error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [handleLogout]); // handleLogout을 의존성에 추가

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