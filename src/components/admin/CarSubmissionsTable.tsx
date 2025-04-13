
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
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CarSubmissionsTableProps {
  submissions: CarSubmissionRequest[];
  onSubmissionUpdate: (updatedSubmission: CarSubmissionRequest) => void;
}

export function CarSubmissionsTable({ submissions, onSubmissionUpdate }: CarSubmissionsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
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

  // Filter submissions based on search query and status filter
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.carDetails.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.carDetails.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.userName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-auto sm:flex-1">
          <Input
            placeholder="Search cars or sellers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Submissions</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
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
          {filteredSubmissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                {searchQuery || statusFilter !== 'all' 
                  ? "No submissions match your filters" 
                  : "No car submissions found"}
              </TableCell>
            </TableRow>
          ) : (
            filteredSubmissions.map((submission) => (
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
    </div>
  );
}

export default CarSubmissionsTable;
