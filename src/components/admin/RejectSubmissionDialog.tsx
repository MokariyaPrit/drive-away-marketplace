
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CarSubmissionRequest } from '@/types/carSubmission';

interface RejectSubmissionDialogProps {
  submission: CarSubmissionRequest;
  onReject: (submission: CarSubmissionRequest, feedback: string) => void;
}

export const RejectSubmissionDialog = ({ submission, onReject }: RejectSubmissionDialogProps) => {
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Reject Car Submission</DialogTitle>
        <DialogDescription>
          Please provide feedback on why this submission is being rejected.
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
          onClick={() => onReject(submission, feedbackMessage)}
        >
          Reject Submission
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
