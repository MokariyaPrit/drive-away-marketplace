import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  status: number;
};

/**
 * Base API client for making requests to the NestJS backend
 */
export const apiClient = {
  /**
   * Send a GET request to the API
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API error response:', errorData);
        return {
          error: errorData.message || 'An error occurred',
          status: response.status,
        };
      }
      
      const data = await response.json();
      return {
        data,
        status: response.status,
      };
    } catch (error) {
      console.error('API request failed:', error);
      toast.error('Network error. Please try again later.');
      return {
        error: 'Network error',
        status: 500,
      };
    }
  },
  
  /**
   * Send a POST request to the API
   */
  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    try {
      console.log(`Making POST request to ${API_URL}${endpoint}`);
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify(body),
      });
      
      // Always try to parse response JSON
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        responseData = {};
      }
      
      console.log('Response status:', response.status);
      console.log('Response data:', responseData);
      
      if (!response.ok) {
        return {
          error: responseData.message || 'An error occurred',
          status: response.status,
        };
      }
      
      return {
        data: responseData,
        status: response.status,
      };
    } catch (error) {
      console.error('API request failed:', error);
      toast.error('Network error. Please try again later.');
      return {
        error: 'Network error',
        status: 500,
      };
    }
  },
  
  /**
   * Send a PUT request to the API
   */
  async put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      
      return {
        data: response.ok ? data : undefined,
        error: !response.ok ? data.message || 'An error occurred' : undefined,
        status: response.status,
      };
    } catch (error) {
      console.error('API request failed:', error);
      toast.error('Network error. Please try again later.');
      return {
        error: 'Network error',
        status: 500,
      };
    }
  },
  
  /**
   * Send a DELETE request to the API
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
      });
      
      const data = await response.json();
      
      return {
        data: response.ok ? data : undefined,
        error: !response.ok ? data.message || 'An error occurred' : undefined,
        status: response.status,
      };
    } catch (error) {
      console.error('API request failed:', error);
      toast.error('Network error. Please try again later.');
      return {
        error: 'Network error',
        status: 500,
      };
    }
  },
};
