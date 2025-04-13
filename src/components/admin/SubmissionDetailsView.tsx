
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CarSubmissionRequest } from '@/types/carSubmission';

interface SubmissionDetailsViewProps {
  submission: CarSubmissionRequest;
}

export const SubmissionDetailsView = ({ submission }: SubmissionDetailsViewProps) => {
  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Car Submission Details</DialogTitle>
        <DialogDescription>
          Submitted on {new Date(submission.submissionDate).toLocaleDateString()}
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
        <div>
          <h3 className="font-semibold mb-2">Car Information</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Title:</span> {submission.carDetails.title}</p>
            <p><span className="font-medium">Make/Model:</span> {submission.carDetails.make} {submission.carDetails.model}</p>
            <p><span className="font-medium">Year:</span> {submission.carDetails.year}</p>
            <p><span className="font-medium">Price:</span> ${submission.carDetails.price.toLocaleString()}</p>
            <p><span className="font-medium">Mileage:</span> {submission.carDetails.mileage.toLocaleString()} miles</p>
            <p><span className="font-medium">Fuel Type:</span> {submission.carDetails.fuelType}</p>
            <p><span className="font-medium">Transmission:</span> {submission.carDetails.transmission}</p>
            <p><span className="font-medium">Location:</span> {submission.carDetails.location}</p>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Seller Information</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {submission.userName}</p>
            <p><span className="font-medium">Email:</span> {submission.userEmail}</p>
            <p><span className="font-medium">User ID:</span> {submission.userId}</p>
          </div>
          
          {submission.carDetails.features.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Features</h3>
              <div className="flex flex-wrap gap-1">
                {submission.carDetails.features.map(feature => (
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
          <p className="text-gray-700">{submission.carDetails.description}</p>
        </div>
        
        {submission.notes && (
          <div>
            <h3 className="font-semibold mb-2">Seller Notes</h3>
            <p className="text-gray-700">{submission.notes}</p>
          </div>
        )}
      </div>
      
      <DialogFooter className="mt-6">
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};
