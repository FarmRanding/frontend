export interface UserResponse {
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

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
} 