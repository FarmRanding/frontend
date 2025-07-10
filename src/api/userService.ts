import apiClient from './axiosConfig';

// UserProfileResponse 타입 정의 (백엔드와 맞춤)
export interface UserProfileResponse {
  id: number;
  email: string;
  name?: string;
  membershipType: string;
  farmName?: string;
  location?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

// 내 정보 조회 API
export const fetchMyUser = async (): Promise<UserProfileResponse> => {
  const response = await apiClient.get<ApiResponse<UserProfileResponse>>('/api/v1/users/profile');
  if (response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || '사용자 정보 조회에 실패했습니다.');
};

// 프로필 수정 요청 타입
export interface UpdateProfileRequest {
  name: string;
  farmName: string;
  location: string;
}

// 내 정보 수정 API
export const updateMyUserProfile = async (profileData: UpdateProfileRequest): Promise<UserProfileResponse> => {
  const response = await apiClient.put<ApiResponse<UserProfileResponse>>('/api/v1/users/profile', profileData);
  if (response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || '사용자 정보 수정에 실패했습니다.');
};

// 프리미엄 멤버십 업그레이드 API
export const upgradeToPremium = async (): Promise<UserProfileResponse> => {
  const response = await apiClient.post<ApiResponse<UserProfileResponse>>('/api/v1/users/upgrade/premium');
  if (response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || '프리미엄 멤버십 업그레이드에 실패했습니다.');
};

// 프리미엄 플러스 멤버십 업그레이드 API
export const upgradeToPremiumPlus = async (): Promise<UserProfileResponse> => {
  const response = await apiClient.post<ApiResponse<UserProfileResponse>>('/api/v1/users/upgrade/premium-plus');
  if (response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || '프리미엄 플러스 멤버십 업그레이드에 실패했습니다.');
};

// 프리미엄 멤버십 다운그레이드 API
export const downgradeToPremium = async (): Promise<UserProfileResponse> => {
  const response = await apiClient.post<ApiResponse<UserProfileResponse>>('/api/v1/users/downgrade/premium');
  if (response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || '프리미엄 멤버십 다운그레이드에 실패했습니다.');
};

// 무료 멤버십 다운그레이드 API
export const downgradeToFree = async (): Promise<UserProfileResponse> => {
  const response = await apiClient.post<ApiResponse<UserProfileResponse>>('/api/v1/users/downgrade/free');
  if (response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || '무료 멤버십 다운그레이드에 실패했습니다.');
}; 