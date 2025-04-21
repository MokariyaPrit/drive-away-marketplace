
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
    try {
      console.log('Updating profile for user:', userId, 'with data:', data);
      
      // Only allow editing these fields, and require userId
      const response = await apiClient.put<User>(`/users/${userId}`, data);
      
      if (response.error) {
        console.error('Profile update error response:', response);
        throw new Error(response.error);
      }
      
      // To match what the frontend expects, return a full User object (not a partial)
      return response.data || null;
    } catch (error: any) {
      console.error('Profile update error caught:', error);
      
      if (error.message?.includes('403')) {
        throw new Error('You do not have permission to update this profile');
      }
      
      // Format server error messages to be more user-friendly
      const errorMessage = error.message || 'Internal server error';
      throw new Error(errorMessage);
    }
  },
};
