
import { Button } from '@/components/ui/button';
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CarSubmissionRequest } from '@/types/carSubmission';

interface FeedbackDialogProps {
  submission: CarSubmissionRequest;
}

export const FeedbackDialog = ({ submission }: FeedbackDialogProps) => {
  return (
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
  );
};
