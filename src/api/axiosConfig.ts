import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

// 토큰 갱신 요청 중복 방지용
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

// 대기열 처리 함수
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

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

// 응답 인터셉터: 토큰 만료 시 자동 갱신 시도
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // 401 에러 && refresh 요청이 아닌 경우 토큰 갱신 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // 이미 토큰 갱신 중인 경우 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        console.warn('Refresh Token이 없습니다. 로그아웃 처리합니다.');
        performLogout();
        return Promise.reject(error);
      }

      try {
        // 토큰 갱신 요청
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refreshToken: refreshToken
        });

        if (response.data?.data?.accessToken) {
          const newAccessToken = response.data.data.accessToken;
          
          // 새 토큰 저장
          localStorage.setItem('accessToken', newAccessToken);
          
          // 대기열의 모든 요청 처리
          processQueue(null, newAccessToken);
          
          // 원래 요청에 새 토큰 적용하여 재시도
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } else {
          throw new Error('토큰 갱신 응답이 올바르지 않습니다.');
        }
        
      } catch (refreshError) {
        console.warn('토큰 갱신 실패:', refreshError);
        processQueue(refreshError, null);
        performLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

// 로그아웃 처리 함수
const performLogout = () => {
  // 토큰 제거
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('email');
  localStorage.removeItem('nickname');
  localStorage.removeItem('membershipType');
  localStorage.removeItem('name');
  localStorage.removeItem('farmName');
  localStorage.removeItem('location');
  
  // 로그인 페이지로 리다이렉트
  window.location.href = '/';
};

export const api = apiClient;
export default apiClient; 