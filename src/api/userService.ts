import apiClient from './axiosConfig';
import type { UserResponse, ApiResponse } from '../types/user';

// 내 정보 조회 API
export const fetchMyUser = async (): Promise<UserResponse> => {
  const response = await apiClient.get<ApiResponse<UserResponse>>('/api/v1/users/profile');
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
export const updateMyUserProfile = async (profileData: UpdateProfileRequest): Promise<UserResponse> => {
  const response = await apiClient.put<ApiResponse<UserResponse>>('/api/v1/users/profile', profileData);
  if (response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || '사용자 정보 수정에 실패했습니다.');
}; 