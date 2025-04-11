
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { XCircle } from 'lucide-react';
import { EnhancedTestDriveRequest } from '@/types/requests';

interface RejectDialogProps {
  request: EnhancedTestDriveRequest;
  isResponseDialogOpen: boolean;
  selectedRequest: EnhancedTestDriveRequest | null;
  responseAction: 'approved' | 'rejected' | null;
  openResponseDialog: (request: EnhancedTestDriveRequest, action: 'approved' | 'rejected') => void;
  setIsResponseDialogOpen: (isOpen: boolean) => void;
  handleResponseSubmit: () => void;
}

export function RejectDialog({
  request,
  isResponseDialogOpen,
  selectedRequest,
  responseAction,
  openResponseDialog,
  setIsResponseDialogOpen,
  handleResponseSubmit
}: RejectDialogProps) {
  return (
    <Dialog
      open={isResponseDialogOpen && selectedRequest?.id === request.id && responseAction === 'rejected'}
      onOpenChange={(open) => {
        if (!open) setIsResponseDialogOpen(false);
      }}
    >
      <DialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => openResponseDialog(request, 'rejected')}
        >
          <XCircle className="h-4 w-4 mr-2" />
          Reject
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Test Drive Request</DialogTitle>
          <DialogDescription>
            You are rejecting the test drive request from {request.user.name} for the {request.car.make} {request.car.model}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Reason for Rejection</Label>
            <Textarea
              id="reject-reason"
              placeholder="Please provide a reason for rejecting this request..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleResponseSubmit}>
            Confirm Rejection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RejectDialog;
