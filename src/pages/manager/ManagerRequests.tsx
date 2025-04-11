
import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, MessageSquare, Clock, Calendar, UserSquare } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { TestDriveRequest, mockTestDriveRequests, mockCars, mockUsers, Car, User } from '@/data/mock-data';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface EnhancedTestDriveRequest extends TestDriveRequest {
  car: Car;
  user: User;
}

const ManagerRequests = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<EnhancedTestDriveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<EnhancedTestDriveRequest | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [responseAction, setResponseAction] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);
    // Simulate API call to fetch test drive requests for this manager
    setTimeout(() => {
      const managerRequests = mockTestDriveRequests
        .filter(request => request.managerId === currentUser.id)
        .map(request => {
          const car = mockCars.find(car => car.id === request.carId)!;
          const user = mockUsers.find(user => user.id === request.userId)!;
          return { ...request, car, user };
        });
      setRequests(managerRequests);
      setLoading(false);
    }, 800);
  }, [currentUser]);

  const handleResponseSubmit = () => {
    if (!selectedRequest || !responseAction) return;

    // In a real app, this would send the response to the backend
    // For demo, we'll just update our local state
    const updatedRequests = requests.map(request => {
      if (request.id === selectedRequest.id) {
        return {
          ...request,
          status: responseAction === 'approve' ? 'approved' : 'rejected',
        };
      }
      return request;
    });

    setRequests(updatedRequests);
    toast.success(
      responseAction === 'approve'
        ? 'Test drive request approved!'
        : 'Test drive request rejected'
    );
    setIsResponseDialogOpen(false);
    setSelectedRequest(null);
    setResponseMessage('');
    setResponseAction(null);
  };

  const openResponseDialog = (request: EnhancedTestDriveRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setResponseAction(action);
    setIsResponseDialogOpen(true);
  };

  const renderRequestCard = (request: EnhancedTestDriveRequest) => (
    <div key={request.id} className="bg-white rounded-lg shadow-sm overflow-hidden border">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg">{request.car.make} {request.car.model}</h3>
            <p className="text-gray-600 text-sm">{request.car.year} • ${request.car.price.toLocaleString()}</p>
          </div>
          <Badge 
            variant="secondary"
            className={
              request.status === 'approved' ? 'bg-green-100 text-green-800' :
              request.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }
          >
            {request.status === 'approved' ? (
              <span className="flex items-center"><CheckCircle2 className="h-3 w-3 mr-1" /> Approved</span>
            ) : request.status === 'rejected' ? (
              <span className="flex items-center"><XCircle className="h-3 w-3 mr-1" /> Rejected</span>
            ) : (
              <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> Pending</span>
            )}
          </Badge>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-700">
            <UserSquare className="h-4 w-4 mr-2 text-gray-500" />
            <span>{request.user.name} ({request.user.email})</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>
              Requested: {new Date(request.preferredDate).toLocaleDateString()} at {
                new Date(request.preferredDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            </span>
          </div>
        </div>
        
        {request.message && (
          <div className="bg-gray-50 p-3 rounded-md mb-4 text-sm">
            <p className="font-medium mb-1">Customer message:</p>
            <p className="text-gray-600">{request.message}</p>
          </div>
        )}
        
        <Separator className="my-4" />
        
        <div className="flex flex-wrap gap-2">
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
            open={isResponseDialogOpen && selectedRequest?.id === request.id}
            onOpenChange={setIsResponseDialogOpen}
          >
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setResponseMessage(`Hello ${request.user.name},\n\nI'd like to discuss your test drive request for the ${request.car.make} ${request.car.model}.`);
                setSelectedRequest(request);
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
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
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
                    setResponseMessage('');
                  }}
                >
                  Send Message
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {request.status === 'pending' && (
            <>
              <Dialog
                open={isResponseDialogOpen && selectedRequest?.id === request.id && responseAction === 'approve'}
                onOpenChange={(open) => {
                  if (!open) setIsResponseDialogOpen(false);
                }}
              >
                <DialogTrigger asChild>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => openResponseDialog(request, 'approve')}
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
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
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
              
              <Dialog
                open={isResponseDialogOpen && selectedRequest?.id === request.id && responseAction === 'reject'}
                onOpenChange={(open) => {
                  if (!open) setIsResponseDialogOpen(false);
                }}
              >
                <DialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => openResponseDialog(request, 'reject')}
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
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
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
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute allowedRoles={['manager']}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8 flex-grow">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Test Drive Requests</h1>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Requests</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden border">
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-6 w-24 bg-gray-200 rounded"></div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="h-4 w-full bg-gray-200 rounded"></div>
                        <div className="h-4 w-full bg-gray-200 rounded"></div>
                      </div>
                      
                      <div className="h-16 bg-gray-200 rounded mb-4"></div>
                      
                      <div className="h-px bg-gray-200 my-4"></div>
                      
                      <div className="flex gap-2">
                        <div className="h-8 w-24 bg-gray-200 rounded"></div>
                        <div className="h-8 w-24 bg-gray-200 rounded"></div>
                        <div className="h-8 w-24 bg-gray-200 rounded"></div>
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
                        You haven't received any test drive requests yet. Make sure your car listings are up to date.
                      </p>
                      <Button asChild>
                        <a href="/manager/listings">View My Listings</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {requests.map(request => renderRequestCard(request))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="pending">
                  {requests.filter(r => r.status === 'pending').length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">No pending test drive requests.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {requests
                        .filter(r => r.status === 'pending')
                        .map(request => renderRequestCard(request))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="approved">
                  {requests.filter(r => r.status === 'approved').length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <CheckCircle2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">No approved test drive requests.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {requests
                        .filter(r => r.status === 'approved')
                        .map(request => renderRequestCard(request))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="rejected">
                  {requests.filter(r => r.status === 'rejected').length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <XCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">No rejected test drive requests.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

export default ManagerRequests;
