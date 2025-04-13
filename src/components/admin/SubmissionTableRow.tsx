
import { useState } from 'react';
import { Check, Eye, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { CarSubmissionRequest } from '@/types/carSubmission';
import { SubmissionDetailsView } from './SubmissionDetailsView';
import { ApproveSubmissionDialog } from './ApproveSubmissionDialog';
import { RejectSubmissionDialog } from './RejectSubmissionDialog';
import { FeedbackDialog } from './FeedbackDialog';

interface SubmissionTableRowProps {
  submission: CarSubmissionRequest;
  onApprove: (submission: CarSubmissionRequest, feedback: string) => void;
  onReject: (submission: CarSubmissionRequest, feedback: string) => void;
}

export const SubmissionTableRow = ({ submission, onApprove, onReject }: SubmissionTableRowProps) => {
  const [viewDetails, setViewDetails] = useState(false);
  
  return (
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
                onClick={() => setViewDetails(true)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </DialogTrigger>
            {viewDetails && <SubmissionDetailsView submission={submission} />}
          </Dialog>
          
          {submission.status === 'pending' && (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => setViewDetails(false)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </DialogTrigger>
                {!viewDetails && <ApproveSubmissionDialog submission={submission} onApprove={onApprove} />}
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setViewDetails(false)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </DialogTrigger>
                {!viewDetails && <RejectSubmissionDialog submission={submission} onReject={onReject} />}
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
              <FeedbackDialog submission={submission} />
            </Dialog>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
