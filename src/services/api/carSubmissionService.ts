
import { apiClient } from './apiClient';
import { CarSubmissionRequest } from '@/types/carSubmission';

/**
 * Service for managing car submissions through the NestJS backend
 */
export const carSubmissionService = {
  /**
   * Get all car submissions
   */
  async getAllSubmissions(): Promise<CarSubmissionRequest[]> {
    const response = await apiClient.get<CarSubmissionRequest[]>('/car-submissions');
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data || [];
  },
  
  /**
   * Submit a new car for review
   */
  async submitCar(carData: Omit<CarSubmissionRequest, 'id' | 'status' | 'submissionDate'>): Promise<CarSubmissionRequest> {
    const response = await apiClient.post<CarSubmissionRequest>('/car-submissions', carData);
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data as CarSubmissionRequest;
  },
  
  /**
   * Approve a car submission
   */
  async approveSubmission(submissionId: string, feedback?: string): Promise<CarSubmissionRequest> {
    const response = await apiClient.put<CarSubmissionRequest>(
      `/car-submissions/${submissionId}/approve`,
      { feedback }
    );
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data as CarSubmissionRequest;
  },
  
  /**
   * Reject a car submission
   */
  async rejectSubmission(submissionId: string, feedback: string): Promise<CarSubmissionRequest> {
    const response = await apiClient.put<CarSubmissionRequest>(
      `/car-submissions/${submissionId}/reject`,
      { feedback }
    );
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data as CarSubmissionRequest;
  }
};
