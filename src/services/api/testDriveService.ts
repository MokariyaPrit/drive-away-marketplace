
import { apiClient } from './apiClient';
import { EnhancedTestDriveRequest } from '@/types/requests';

/**
 * Service for managing test drive requests through the NestJS backend
 */
export const testDriveService = {
  /**
   * Get all test drive requests for a manager
   */
  async getManagerRequests(): Promise<EnhancedTestDriveRequest[]> {
    const response = await apiClient.get<EnhancedTestDriveRequest[]>('/test-drive-requests/manager');
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data || [];
  },
  
  /**
   * Approve a test drive request
   */
  async approveRequest(requestId: string, note?: string): Promise<EnhancedTestDriveRequest> {
    const response = await apiClient.put<EnhancedTestDriveRequest>(
      `/test-drive-requests/${requestId}/approve`,
      { note }
    );
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data as EnhancedTestDriveRequest;
  },
  
  /**
   * Reject a test drive request
   */
  async rejectRequest(requestId: string, reason: string): Promise<EnhancedTestDriveRequest> {
    const response = await apiClient.put<EnhancedTestDriveRequest>(
      `/test-drive-requests/${requestId}/reject`,
      { reason }
    );
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data as EnhancedTestDriveRequest;
  },
  
  /**
   * Send a message to a user about their test drive request
   */
  async sendMessage(requestId: string, message: string): Promise<void> {
    const response = await apiClient.post<void>(
      `/test-drive-requests/${requestId}/message`,
      { message }
    );
    if (response.error) {
      throw new Error(response.error);
    }
  }
};
