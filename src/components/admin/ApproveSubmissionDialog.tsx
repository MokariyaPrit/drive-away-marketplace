
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CarSubmissionRequest } from '@/types/carSubmission';

interface ApproveSubmissionDialogProps {
  submission: CarSubmissionRequest;
  onApprove: (submission: CarSubmissionRequest, feedback: string) => void;
}

export const ApproveSubmissionDialog = ({ submission, onApprove }: ApproveSubmissionDialogProps) => {
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Approve Car Submission</DialogTitle>
        <DialogDescription>
          This will publish the car listing to the marketplace.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 my-4">
        <div>
          <p className="font-medium mb-2">
            {submission.carDetails.make} {submission.carDetails.model} ({submission.carDetails.year})
          </p>
          <p className="text-sm text-gray-500">
            Submitted by {submission.userName}
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
          onClick={() => onApprove(submission, feedbackMessage)}
        >
          Approve & Publish
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
