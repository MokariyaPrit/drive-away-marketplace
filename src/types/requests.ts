
import { Car, User } from '@/data/mock-data';

export interface EnhancedTestDriveRequest {
  id: string;
  carId: string;
  userId: string;
  managerId: string;
  requestDate: string;
  preferredDate: string;
  preferredTimeSlot?: string;
  message?: string;
  car: Car;
  user: User;
  status: 'pending' | 'approved' | 'rejected';
}
