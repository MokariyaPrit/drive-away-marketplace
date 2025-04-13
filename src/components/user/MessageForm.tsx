
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface MessageFormProps {
  recipientName: string;
  recipientId: string;
  carMake?: string;
  carModel?: string;
}

export const MessageForm = ({ recipientName, recipientId, carMake, carModel }: MessageFormProps) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const defaultMessage = carMake && carModel
    ? `Hello ${recipientName},\n\nI'm interested in the ${carMake} ${carModel} you have listed. Could you provide more information?`
    : `Hello ${recipientName},\n\nI would like to get in touch regarding your listing.`;

  const handleOpen = () => {
    setMessage(defaultMessage);
    setOpen(true);
  };

  const handleSend = () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsSending(true);

    // In a real app, this would send the message to a backend API
    setTimeout(() => {
      toast.success(`Message sent to ${recipientName}`);
      setIsSending(false);
      setOpen(false);
      setMessage('');
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleOpen} variant="outline" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Message to {recipientName}</DialogTitle>
          <DialogDescription>
            Send a message to the owner about this vehicle.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            placeholder="Type your message here..."
            className="min-h-[150px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isSending}>
            {isSending ? 'Sending...' : 'Send Message'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
