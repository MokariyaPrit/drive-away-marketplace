
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2 } from 'lucide-react';
import { EnhancedTestDriveRequest } from '@/types/requests';
import { useContext } from 'react';

interface ApproveDialogProps {
  request: EnhancedTestDriveRequest;
  isResponseDialogOpen: boolean;
  selectedRequest: EnhancedTestDriveRequest | null;
  responseAction: 'approved' | 'rejected' | null;
  openResponseDialog: (request: EnhancedTestDriveRequest, action: 'approved' | 'rejected') => void;
  setIsResponseDialogOpen: (isOpen: boolean) => void;
  handleResponseSubmit: () => void;
}

export function ApproveDialog({
  request,
  isResponseDialogOpen,
  selectedRequest,
  responseAction,
  openResponseDialog,
  setIsResponseDialogOpen,
  handleResponseSubmit
}: ApproveDialogProps) {
  return (
    <Dialog
      open={isResponseDialogOpen && selectedRequest?.id === request.id && responseAction === 'approved'}
      onOpenChange={(open) => {
        if (!open) setIsResponseDialogOpen(false);
      }}
    >
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          size="sm"
          onClick={() => openResponseDialog(request, 'approved')}
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Approve
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Test Drive Request</DialogTitle>
          <DialogDescription>
            You are approving the test drive request from {request.user.name} for the {request.car.make} {request.car.model}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="approve-message">Additional Note (Optional)</Label>
            <Textarea
              id="approve-message"
              placeholder="Add any specific instructions or notes for the customer..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleResponseSubmit}>
            Confirm Approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ApproveDialog;
