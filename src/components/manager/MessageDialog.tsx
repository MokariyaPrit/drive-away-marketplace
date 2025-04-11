
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { EnhancedTestDriveRequest } from '@/types/requests';
import { useState } from 'react';

interface MessageDialogProps {
  request: EnhancedTestDriveRequest;
  isResponseDialogOpen: boolean;
  selectedRequest: EnhancedTestDriveRequest | null;
  setIsResponseDialogOpen: (isOpen: boolean) => void;
  setResponseMessage: (message: string) => void;
  setSelectedRequest: (request: EnhancedTestDriveRequest | null) => void;
}

export function MessageDialog({
  request,
  isResponseDialogOpen,
  selectedRequest,
  setIsResponseDialogOpen,
  setResponseMessage,
  setSelectedRequest
}: MessageDialogProps) {
  const [message, setMessage] = useState('');

  return (
    <Dialog
      open={isResponseDialogOpen && selectedRequest?.id === request.id && !selectedRequest.status}
      onOpenChange={setIsResponseDialogOpen}
    >
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setMessage(`Hello ${request.user.name},\n\nI'd like to discuss your test drive request for the ${request.car.make} ${request.car.model}.`);
          setSelectedRequest(request);
          setResponseMessage(`Hello ${request.user.name},\n\nI'd like to discuss your test drive request for the ${request.car.make} ${request.car.model}.`);
          setIsResponseDialogOpen(true);
        }}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Message
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Message to {request.user.name}</DialogTitle>
          <DialogDescription>
            Regarding test drive request for {request.car.make} {request.car.model}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setResponseMessage(e.target.value);
              }}
              className="min-h-[150px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              toast.success(`Message sent to ${request.user.name}`);
              setIsResponseDialogOpen(false);
              setMessage('');
              setResponseMessage('');
            }}
          >
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MessageDialog;
