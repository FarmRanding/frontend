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
  nickname: string;
  name?: string;
  profileImage?: string;
  provider: string;
  membershipType: string;
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
    
    console.log('서버 응답:', result);
    
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

// 로그인 상태 확인 함수
export const checkAuthStatus = (): boolean => {
  const token = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId');
  return !!(token && userId);
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

// 현재 사용자 정보 가져오기
export const getCurrentUser = () => {
  return {
    userId: localStorage.getItem('userId'),
    email: localStorage.getItem('email'),
    nickname: localStorage.getItem('nickname'),
    membershipType: localStorage.getItem('membershipType'),
  };
}; 