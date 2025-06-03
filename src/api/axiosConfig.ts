import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60초로 연장 (AI 브랜딩 처리 시간 고려)
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 모든 요청에 자동으로 Authorization 헤더 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 토큰 만료 시 자동 로그아웃 처리
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 에러 또는 토큰 만료 시 자동 로그아웃
    if (error.response?.status === 401) {
      console.warn('토큰이 만료되었습니다. 로그아웃 처리합니다.');
      
      // 토큰 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
      localStorage.removeItem('nickname');
      localStorage.removeItem('membershipType');
      
      // 로그인 페이지로 리다이렉트
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 