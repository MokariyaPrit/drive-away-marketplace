
import { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Clock, X, Info, MessageSquare } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { mockCars, mockTestDriveRequests, TestDriveRequest, Car } from '@/data/mock-data';
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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const UserRequests = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<(TestDriveRequest & { car: Car })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<TestDriveRequest | null>(null);
  const [message, setMessage] = useState('');
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);
    // Simulate API call to fetch user's test drive requests
    setTimeout(() => {
      const userRequests = mockTestDriveRequests
        .filter(request => request.userId === currentUser.id)
        .map(request => {
          const car = mockCars.find(car => car.id === request.carId)!;
          return { ...request, car };
        });
      setRequests(userRequests);
      setLoading(false);
    }, 800);
  }, [currentUser]);

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

  const renderRequestCard = (request: TestDriveRequest & { car: Car }) => (
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
  );

  return (
    <ProtectedRoute allowedRoles={['user']}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8 flex-grow">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">My Test Drive Requests</h1>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Requests</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-5">
                      <div className="h-6 w-3/4 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
                      <div className="h-12 bg-gray-200 rounded mb-4"></div>
                      <div className="flex justify-between">
                        <div className="h-8 w-24 bg-gray-200 rounded"></div>
                        <div className="h-8 w-32 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <TabsContent value="all">
                  {requests.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-xl font-medium mb-2">No test drive requests yet</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        You haven't made any test drive requests yet. Browse our cars and schedule your first test drive.
                      </p>
                      <Button asChild>
                        <a href="/cars">Browse Cars</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {requests.map(request => renderRequestCard(request))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="pending">
                  {requests.filter(r => r.status === 'pending').length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Info className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">No pending test drive requests.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {requests
                        .filter(r => r.status === 'pending')
                        .map(request => renderRequestCard(request))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="approved">
                  {requests.filter(r => r.status === 'approved').length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Info className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">No approved test drive requests.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {requests
                        .filter(r => r.status === 'approved')
                        .map(request => renderRequestCard(request))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="rejected">
                  {requests.filter(r => r.status === 'rejected').length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Info className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">No rejected test drive requests.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {requests
                        .filter(r => r.status === 'rejected')
                        .map(request => renderRequestCard(request))}
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default UserRequests;
