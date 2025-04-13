
import { useState } from 'react';
import { TestDriveRequest, Car } from '@/data/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle2, Clock, X, MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface RequestsListProps {
  requests: (TestDriveRequest & { car: Car })[];
}

export const RequestsList = ({ requests }: RequestsListProps) => {
  const [selectedRequest, setSelectedRequest] = useState<TestDriveRequest | null>(null);
  const [message, setMessage] = useState('');
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedRequest) {
      toast.error('Please enter a message');
      return;
    }

    // In a real app, this would send the message to the backend
    toast.success('Message sent to the dealer');
    setMessage('');
    setIsMessageDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-600" />;
      case 'pending':
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {requests.map(request => (
        <div key={request.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="relative">
            <img 
              src={request.car.images[0]} 
              alt={request.car.title} 
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-3 right-3">
              <Badge 
                variant="secondary"
                className={`capitalize ${getStatusColor(request.status)}`}
              >
                {request.status}
              </Badge>
            </div>
          </div>
          
          <div className="p-5">
            <h3 className="font-bold text-lg mb-2">{request.car.title}</h3>
            
            <div className="flex items-center text-gray-600 text-sm mb-3">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                Test Drive: {new Date(request.preferredDate).toLocaleDateString()} at {
                  new Date(request.preferredDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-center mt-1">
                {getStatusIcon(request.status)}
                <span className="ml-2 text-sm">
                  {request.status === 'approved' && 'Your test drive has been approved!'}
                  {request.status === 'rejected' && 'Your test drive request was declined.'}
                  {request.status === 'pending' && 'Awaiting dealer confirmation.'}
                </span>
              </div>
            </div>

            {request.message && (
              <div className="bg-gray-50 p-3 rounded-md mb-4 text-sm">
                <p className="font-medium mb-1">Your message:</p>
                <p className="text-gray-600">{request.message}</p>
              </div>
            )}
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                asChild
              >
                <a href={`/cars/${request.carId}`}>
                  View Car
                </a>
              </Button>
              
              <Dialog
                open={isMessageDialogOpen && selectedRequest?.id === request.id}
                onOpenChange={(open) => {
                  if (open) {
                    setSelectedRequest(request);
                    setIsMessageDialogOpen(true);
                  } else {
                    setIsMessageDialogOpen(false);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message Dealer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Message the Dealer</DialogTitle>
                    <DialogDescription>
                      Send a message about your test drive request for the {request.car.make} {request.car.model}.
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="I have a question about my test drive request..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[150px]"
                  />
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSendMessage}>
                      Send Message
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
