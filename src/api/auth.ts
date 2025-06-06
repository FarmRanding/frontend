import apiClient from './axiosConfig';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

interface SignupRequest {
  name: string;
  farmName: string;
  location: string;
}

interface UserResponse {
  id: number;
  email: string;
  nickname?: string;
  name?: string;
  profileImage?: string;
  provider?: string;
  membershipType: string | { name: string } | any;
  farmName?: string;
  location?: string;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

export const signupUser = async (signupData: SignupRequest): Promise<UserResponse> => {
  try {
    const response = await apiClient.post('/api/auth/signup', signupData);
    
    const result: ApiResponse<UserResponse> = response.data;
    
    // 성공 케이스 (success가 true이거나 message가 "성공"인 경우)
    if (result.success || result.message === '성공') {
      return result.data;
    }
    
    // 실제 실패 케이스
    throw new Error(result.message || '회원가입에 실패했습니다.');
  } catch (error: any) {
    console.error('signupUser 에러:', error);
    
    // 네트워크 에러나 기타 에러 처리
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw error;
  }
};

// 토큰 상태 확인
export const checkAuthStatus = (): boolean => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  return !!(accessToken && refreshToken);
};

// 로그아웃 함수
export const logout = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('email');
  localStorage.removeItem('nickname');
  localStorage.removeItem('membershipType');
  
  window.location.href = '/';
};

// 현재 사용자 정보 가져오기 (서버에서)
export const fetchCurrentUserFromServer = async (): Promise<UserResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.data) {
        return data.data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('서버에서 사용자 정보 조회 실패:', error);
    return null;
  }
};

// 현재 사용자 정보 가져오기 (로컬 스토리지에서)
export const getCurrentUser = (): UserResponse | null => {
  const userId = localStorage.getItem('userId');
  const email = localStorage.getItem('email');
  const nickname = localStorage.getItem('nickname');
  const membershipType = localStorage.getItem('membershipType');
  const name = localStorage.getItem('name');
  const farmName = localStorage.getItem('farmName');
  const location = localStorage.getItem('location');
  
  if (!userId || !email || !nickname) {
    return null;
  }
  
  return {
    id: parseInt(userId),
    email,
    nickname,
    name: name || undefined,
    profileImage: undefined,
    provider: 'kakao', // 기본값
    membershipType: membershipType || 'FREE',
    farmName: farmName || undefined,
    location: location || undefined,
    createdAt: new Date().toISOString()
  };
};

export const login = async (provider: string, code: string, redirectUri: string): Promise<UserResponse> => {
  try {
    const response = await apiClient.post('/api/auth/oauth/login', {
      provider,
      code,
      redirectUri
    });

    const result = response.data;
    
    if (result.success && result.data) {
      return result.data;
    }
    
    throw new Error(result.message || '로그인에 실패했습니다.');
  } catch (error: any) {
    console.error('login 에러:', error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw error;
  }
}; 