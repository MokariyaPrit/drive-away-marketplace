
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CarSubmissionRequest } from '@/types/carSubmission';
import { SubmissionTableRow } from './SubmissionTableRow';
import { mockCars } from '@/data/mock-data';

interface CarSubmissionsTableProps {
  submissions: CarSubmissionRequest[];
  onSubmissionUpdate: (updatedSubmission: CarSubmissionRequest) => void;
}

export function CarSubmissionsTable({ submissions, onSubmissionUpdate }: CarSubmissionsTableProps) {
  const handleApprove = (submission: CarSubmissionRequest, feedbackMessage: string) => {
    // Create a new car from the submission
    const newCar = {
      id: `car-${Date.now()}`,
      title: submission.carDetails.title,
      make: submission.carDetails.make,
      model: submission.carDetails.model,
      year: submission.carDetails.year,
      price: submission.carDetails.price,
      mileage: submission.carDetails.mileage,
      fuelType: submission.carDetails.fuelType,
      transmission: submission.carDetails.transmission,
      features: submission.carDetails.features,
      description: submission.carDetails.description,
      images: submission.carDetails.images,
      location: submission.carDetails.location,
      ownerId: submission.userId,
      managerId: '',
      createdAt: new Date().toISOString(),
    };
    
    // Add to mockCars (in a real app, this would be a database operation)
    mockCars.push(newCar);
    
    // Update the submission status
    const updatedSubmission = {
      ...submission,
      status: 'approved' as const,
      adminFeedback: feedbackMessage || 'Your car listing has been approved and is now live.'
    };
    
    onSubmissionUpdate(updatedSubmission);
    toast.success('Car listing approved and published');
  };
  
  const handleReject = (submission: CarSubmissionRequest, feedbackMessage: string) => {
    if (!feedbackMessage) {
      toast.error('Please provide feedback on why the submission was rejected');
      return;
    }
    
    const updatedSubmission = {
      ...submission,
      status: 'rejected' as const,
      adminFeedback: feedbackMessage
    };
    
    onSubmissionUpdate(updatedSubmission);
    toast.success('Car submission rejected with feedback');
  };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Car</TableHead>
          <TableHead>Submitted By</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-6 text-gray-500">
              No car submissions found
            </TableCell>
          </TableRow>
        ) : (
          submissions.map((submission) => (
            <SubmissionTableRow 
              key={submission.id}
              submission={submission}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
}

export default CarSubmissionsTable;
