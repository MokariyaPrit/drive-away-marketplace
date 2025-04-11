
import { Car } from '@/data/mock-data';

export interface CarSubmissionRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  carDetails: Omit<Car, 'id' | 'ownerId' | 'managerId' | 'createdAt'>;
  status: 'pending' | 'approved' | 'rejected';
  submissionDate: string;
  notes?: string;
  adminFeedback?: string;
}
