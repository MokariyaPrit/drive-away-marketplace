
import { useState } from 'react';
import { Check, X, Eye, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CarSubmissionRequest } from '@/types/carSubmission';
import { toast } from 'sonner';
import { mockCars } from '@/data/mock-data';

interface CarSubmissionsTableProps {
  submissions: CarSubmissionRequest[];
  onSubmissionUpdate: (updatedSubmission: CarSubmissionRequest) => void;
}

export function CarSubmissionsTable({ submissions, onSubmissionUpdate }: CarSubmissionsTableProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<CarSubmissionRequest | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [viewDetails, setViewDetails] = useState(false);
  
  const handleApprove = (submission: CarSubmissionRequest) => {
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
    setFeedbackMessage('');
    setSelectedSubmission(null);
    toast.success('Car listing approved and published');
  };
  
  const handleReject = (submission: CarSubmissionRequest) => {
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
    setFeedbackMessage('');
    setSelectedSubmission(null);
    toast.success('Car submission rejected with feedback');
  };
  
  return (
    <>
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
              <TableRow key={submission.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{submission.carDetails.make} {submission.carDetails.model}</p>
                    <p className="text-sm text-gray-500">{submission.carDetails.year} • ${submission.carDetails.price.toLocaleString()}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>{submission.userName}</p>
                    <p className="text-sm text-gray-500">{submission.userEmail}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(submission.submissionDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      submission.status === 'approved' ? 'default' :
                      submission.status === 'rejected' ? 'destructive' :
                      'secondary'
                    }
                  >
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setViewDetails(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        {selectedSubmission && viewDetails && (
                          <>
                            <DialogHeader>
                              <DialogTitle>Car Submission Details</DialogTitle>
                              <DialogDescription>
                                Submitted on {new Date(selectedSubmission.submissionDate).toLocaleDateString()}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                              <div>
                                <h3 className="font-semibold mb-2">Car Information</h3>
                                <div className="space-y-2">
                                  <p><span className="font-medium">Title:</span> {selectedSubmission.carDetails.title}</p>
                                  <p><span className="font-medium">Make/Model:</span> {selectedSubmission.carDetails.make} {selectedSubmission.carDetails.model}</p>
                                  <p><span className="font-medium">Year:</span> {selectedSubmission.carDetails.year}</p>
                                  <p><span className="font-medium">Price:</span> ${selectedSubmission.carDetails.price.toLocaleString()}</p>
                                  <p><span className="font-medium">Mileage:</span> {selectedSubmission.carDetails.mileage.toLocaleString()} miles</p>
                                  <p><span className="font-medium">Fuel Type:</span> {selectedSubmission.carDetails.fuelType}</p>
                                  <p><span className="font-medium">Transmission:</span> {selectedSubmission.carDetails.transmission}</p>
                                  <p><span className="font-medium">Location:</span> {selectedSubmission.carDetails.location}</p>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="font-semibold mb-2">Seller Information</h3>
                                <div className="space-y-2">
                                  <p><span className="font-medium">Name:</span> {selectedSubmission.userName}</p>
                                  <p><span className="font-medium">Email:</span> {selectedSubmission.userEmail}</p>
                                  <p><span className="font-medium">User ID:</span> {selectedSubmission.userId}</p>
                                </div>
                                
                                {selectedSubmission.carDetails.features.length > 0 && (
                                  <div className="mt-4">
                                    <h3 className="font-semibold mb-2">Features</h3>
                                    <div className="flex flex-wrap gap-1">
                                      {selectedSubmission.carDetails.features.map(feature => (
                                        <Badge key={feature} variant="secondary">{feature}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold mb-2">Description</h3>
                                <p className="text-gray-700">{selectedSubmission.carDetails.description}</p>
                              </div>
                              
                              {selectedSubmission.notes && (
                                <div>
                                  <h3 className="font-semibold mb-2">Seller Notes</h3>
                                  <p className="text-gray-700">{selectedSubmission.notes}</p>
                                </div>
                              )}
                            </div>
                            
                            <DialogFooter className="mt-6">
                              <DialogClose asChild>
                                <Button variant="outline">Close</Button>
                              </DialogClose>
                            </DialogFooter>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    {submission.status === 'pending' && (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="default" 
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                setSelectedSubmission(submission);
                                setViewDetails(false);
                                setFeedbackMessage('');
                              }}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            {selectedSubmission && !viewDetails && (
                              <>
                                <DialogHeader>
                                  <DialogTitle>Approve Car Submission</DialogTitle>
                                  <DialogDescription>
                                    This will publish the car listing to the marketplace.
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-4 my-4">
                                  <div>
                                    <p className="font-medium mb-2">
                                      {selectedSubmission.carDetails.make} {selectedSubmission.carDetails.model} ({selectedSubmission.carDetails.year})
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Submitted by {selectedSubmission.userName}
                                    </p>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <p className="font-medium">Feedback (Optional)</p>
                                    <Textarea
                                      placeholder="Add any feedback or notes for the seller..."
                                      value={feedbackMessage}
                                      onChange={(e) => setFeedbackMessage(e.target.value)}
                                    />
                                  </div>
                                </div>
                                
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <Button 
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleApprove(selectedSubmission)}
                                  >
                                    Approve & Publish
                                  </Button>
                                </DialogFooter>
                              </>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => {
                                setSelectedSubmission(submission);
                                setViewDetails(false);
                                setFeedbackMessage('');
                              }}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            {selectedSubmission && !viewDetails && (
                              <>
                                <DialogHeader>
                                  <DialogTitle>Reject Car Submission</DialogTitle>
                                  <DialogDescription>
                                    Please provide feedback on why this submission is being rejected.
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-4 my-4">
                                  <div>
                                    <p className="font-medium mb-2">
                                      {selectedSubmission.carDetails.make} {selectedSubmission.carDetails.model} ({selectedSubmission.carDetails.year})
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Submitted by {selectedSubmission.userName}
                                    </p>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <p className="font-medium">Rejection Reason*</p>
                                    <Textarea
                                      placeholder="Explain why this submission is being rejected..."
                                      value={feedbackMessage}
                                      onChange={(e) => setFeedbackMessage(e.target.value)}
                                      required
                                    />
                                  </div>
                                </div>
                                
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <Button 
                                    variant="destructive"
                                    onClick={() => handleReject(selectedSubmission)}
                                  >
                                    Reject Submission
                                  </Button>
                                </DialogFooter>
                              </>
                            )}
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                    
                    {submission.status !== 'pending' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Feedback
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Admin Feedback</DialogTitle>
                            <DialogDescription>
                              Feedback provided to the seller
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="my-4 p-4 bg-gray-50 rounded-md">
                            {submission.adminFeedback ? (
                              <p>{submission.adminFeedback}</p>
                            ) : (
                              <p className="text-gray-500 italic">No feedback was provided</p>
                            )}
                          </div>
                          
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Close</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}

export default CarSubmissionsTable;
