
import { apiClient } from './apiClient';

export type UserProfileUpdateData = {
  name?: string;
  email?: string;
  avatar?: string;
  phone?: string;
  location?: string;
  // Add other fields as needed (no password here for now)
};

export const userService = {
  async updateProfile(userId: string, data: UserProfileUpdateData) {
    // Only allow editing these fields, and require userId
    const response = await apiClient.put(`/users/${userId}`, data);
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data;
  },
};
