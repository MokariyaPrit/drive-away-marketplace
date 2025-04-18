
import { apiClient } from './apiClient';
import { toast } from 'sonner';

export type LoginResponse = {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt?: string; // Make this optional to match backend response
    avatar?: string;
    phone?: string;
    location?: string;
  };
  token?: string;
};

export type RegisterResponse = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: string; // Make this optional to match backend response
};

export const authService = {
  async login(email: string, password: string) {
    console.log('Attempting login with:', { email, password: '********' });
    
    const response = await apiClient.post<LoginResponse>('/auth/login', { email, password });
    
    if (response.error) {
      console.error('Login error:', response.error, 'Status:', response.status);
      toast.error(response.error);
      return null;
    }
    
    console.log('Login successful:', response.data);
    return response.data;
  },
  
  async register(name: string, email: string, password: string) {
    const response = await apiClient.post<RegisterResponse>('/auth/register', { 
      name, 
      email, 
      password 
    });
    
    if (response.error) {
      toast.error(response.error);
      return null;
    }
    
    return response.data;
  },
  
  async logout() {
    const response = await apiClient.post('/auth/logout', {});
    
    if (response.error) {
      toast.error(response.error);
      return false;
    }
    
    return true;
  },
  
  async getCurrentUser() {
    const response = await apiClient.get<any>('/auth/me');
    
    if (response.error) {
      // Don't show error toast for auth check
      return null;
    }
    
    return response.data;
  }
};
