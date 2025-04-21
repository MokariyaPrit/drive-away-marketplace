
import { apiClient } from './apiClient';
import type { User } from '@/data/mock-data';

export type UserProfileUpdateData = {
  name?: string;
  email?: string;
  avatar?: string;
  phone?: string;
  location?: string;
  // Add other fields as needed (no password here for now)
};

export const userService = {
  async updateProfile(userId: string, data: UserProfileUpdateData): Promise<User | null> {
    // Only allow editing these fields, and require userId
    const response = await apiClient.put<User>(`/users/${userId}`, data);
    if (response.error) {
      throw new Error(response.error);
    }
    // To match what the frontend expects, return a full User object (not a partial)
    return response.data || null;
  },
};
