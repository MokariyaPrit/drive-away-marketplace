
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock, Search, User, Car, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { mockUsers } from '@/data/mock-data';
import { ReviewListingRequestDialog } from '@/components/manager/ReviewListingRequestDialog';

// Mock listing requests data (in a real app, this would come from an API)
const mockListingRequests = [
  {
    id: 'req1',
    userId: 'user1',
    title: '2019 Toyota Camry - Excellent Condition',
    make: 'Toyota',
    model: 'Camry',
    year: 2019,
    price: 18500,
    status: 'pending',
    createdAt: '2023-08-15T10:30:00Z',
    requestReason: 'I am selling my car because I am moving overseas and cannot take it with me.',
  },
  {
    id: 'req2',
    userId: 'user1',
    title: '2020 Honda Accord - Low Mileage',
    make: 'Honda',
    model: 'Accord',
    year: 2020,
    price: 22000,
    status: 'approved',
    createdAt: '2023-08-10T14:15:00Z',
    requestReason: 'Upgrading to a larger vehicle for my growing family.',
  },
  {
    id: 'req3',
    userId: 'user1',
    title: '2018 Ford Focus - Great Commuter Car',
    make: 'Ford',
    model: 'Focus',
    year: 2018,
    price: 12500,
    status: 'rejected',
    createdAt: '2023-08-05T09:45:00Z',
    requestReason: 'No longer need this second vehicle.',
    feedbackMessage: 'We require more detailed images and service history for this vehicle.'
  }
];

const ListingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  
  useEffect(() => {
    // Simulate API fetch
    setLoading(true);
    setTimeout(() => {
      setRequests(mockListingRequests);
      setLoading(false);
    }, 1000);
  }, []);
  
  const handleApprove = (requestId) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'approved' } : req
      )
    );
    toast.success('Listing request approved');
    setOpenReviewDialog(false);
  };
  
  const handleReject = (requestId, feedbackMessage) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'rejected', feedbackMessage } : req
      )
    );
    toast.success('Listing request rejected with feedback');
    setOpenReviewDialog(false);
  };
  
  const filteredRequests = requests.filter(req =>
    req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.model.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Pending
          </Badge>
        );
    }
  };
  
  const renderRequestCard = (request) => {
    const user = mockUsers.find(u => u.id === request.userId);
    
    return (
      <Card key={request.id} className="mb-4">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{request.title}</h3>
              <p className="text-sm text-gray-500">
                {request.make} {request.model} • {request.year}
              </p>
            </div>
            {getStatusBadge(request.status)}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <span>{user?.name || 'Unknown User'}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Car className="h-4 w-4 mr-2 text-gray-500" />
              <span>Price: ${request.price.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span>Requested: {new Date(request.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-2">
            <h4 className="text-sm font-medium mb-1">Request Reason:</h4>
            <p className="text-sm text-gray-600">{request.requestReason}</p>
          </div>
          
          {request.status === 'rejected' && request.feedbackMessage && (
            <div className="mt-3 p-3 bg-red-50 rounded-md">
              <h4 className="text-sm font-medium text-red-800 mb-1">Feedback:</h4>
              <p className="text-sm text-red-700">{request.feedbackMessage}</p>
            </div>
          )}
          
          {request.status === 'pending' && (
            <div className="flex justify-end mt-4 space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSelectedRequest(request);
                  setOpenReviewDialog(true);
                }}
              >
                Review Request
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };
  
  return (
    <ProtectedRoute allowedRoles={['manager', 'admin']}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8 flex-grow">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Car Listing Requests</h1>
          
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="mb-4">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded mb-4 animate-pulse"></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {[1, 2, 3, 4].map((j) => (
                          <div key={j} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                      </div>
                      <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <TabsContent value="all">
                  {filteredRequests.length === 0 ? (
                    <div className="text-center py-10">
                      <p>No listing requests found.</p>
                    </div>
                  ) : (
                    <div>{filteredRequests.map(renderRequestCard)}</div>
                  )}
                </TabsContent>
                
                <TabsContent value="pending">
                  {filteredRequests.filter(r => r.status === 'pending').length === 0 ? (
                    <div className="text-center py-10">
                      <p>No pending requests found.</p>
                    </div>
                  ) : (
                    <div>
                      {filteredRequests
                        .filter(r => r.status === 'pending')
                        .map(renderRequestCard)}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="approved">
                  {filteredRequests.filter(r => r.status === 'approved').length === 0 ? (
                    <div className="text-center py-10">
                      <p>No approved requests found.</p>
                    </div>
                  ) : (
                    <div>
                      {filteredRequests
                        .filter(r => r.status === 'approved')
                        .map(renderRequestCard)}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="rejected">
                  {filteredRequests.filter(r => r.status === 'rejected').length === 0 ? (
                    <div className="text-center py-10">
                      <p>No rejected requests found.</p>
                    </div>
                  ) : (
                    <div>
                      {filteredRequests
                        .filter(r => r.status === 'rejected')
                        .map(renderRequestCard)}
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
        
        {selectedRequest && (
          <ReviewListingRequestDialog
            open={openReviewDialog}
            onOpenChange={setOpenReviewDialog}
            request={selectedRequest}
            onApprove={() => handleApprove(selectedRequest.id)}
            onReject={(feedback) => handleReject(selectedRequest.id, feedback)}
          />
        )}
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default ListingRequests;
