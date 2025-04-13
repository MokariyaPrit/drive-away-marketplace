
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle } from 'lucide-react';
import { mockUsers } from '@/data/mock-data';

interface ListingRequest {
  id: string;
  userId: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  requestReason: string;
  feedbackMessage?: string;
}

interface ReviewListingRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: ListingRequest;
  onApprove: () => void;
  onReject: (feedback: string) => void;
}

export function ReviewListingRequestDialog({
  open,
  onOpenChange,
  request,
  onApprove,
  onReject,
}: ReviewListingRequestDialogProps) {
  const [feedback, setFeedback] = useState('');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  
  const user = mockUsers.find(u => u.id === request.userId);
  
  const handleReject = () => {
    if (!feedback.trim()) {
      return;
    }
    onReject(feedback);
    setFeedback('');
    setRejectDialogOpen(false);
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Listing Request</DialogTitle>
            <DialogDescription>
              Review the details of this listing request and approve or reject it.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <h3 className="text-lg font-semibold">{request.title}</h3>
              <p className="text-sm text-gray-500">
                {request.make} {request.model} • {request.year}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 py-2">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Price</h4>
                <p>${request.price.toLocaleString()}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Requested By</h4>
                <p>{user?.name || 'Unknown User'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Date Requested</h4>
                <p>{new Date(request.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Request Reason</h4>
              <p className="mt-1 p-3 bg-gray-50 rounded-md text-gray-700">{request.requestReason}</p>
            </div>
          </div>
          
          <DialogFooter className="space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setRejectDialogOpen(true)}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button onClick={onApprove}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Listing Request</DialogTitle>
            <DialogDescription>
              Please provide feedback on why this listing request is being rejected.
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            placeholder="Enter feedback for the user..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[120px]"
          />
          
          <DialogFooter className="space-x-2">
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!feedback.trim()}>
              Reject with Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
