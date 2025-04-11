
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { mockTestDriveRequests, mockCars, mockUsers } from '@/data/mock-data';
import { toast } from 'sonner';
import { EnhancedTestDriveRequest } from '@/types/requests';
import { RequestsTabContent } from '@/components/manager/RequestsTabContent';
import { RequestsLoadingSkeleton } from '@/components/manager/RequestsLoadingSkeleton';

const ManagerRequests = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<EnhancedTestDriveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<EnhancedTestDriveRequest | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [responseAction, setResponseAction] = useState<'approved' | 'rejected' | null>(null);

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
          // Explicit type casting to match the EnhancedTestDriveRequest interface
          return { 
            ...request, 
            car, 
            user,
            status: request.status as 'pending' | 'approved' | 'rejected' 
          };
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
          status: responseAction,
        };
      }
      return request;
    });

    // Also update the mock data for consistency
    const requestIndex = mockTestDriveRequests.findIndex(r => r.id === selectedRequest.id);
    if (requestIndex !== -1) {
      mockTestDriveRequests[requestIndex].status = responseAction;
    }

    setRequests(updatedRequests);
    toast.success(
      responseAction === 'approved'
        ? 'Test drive request approved!'
        : 'Test drive request rejected'
    );
    setIsResponseDialogOpen(false);
    setSelectedRequest(null);
    setResponseMessage('');
    setResponseAction(null);
  };

  const openResponseDialog = (request: EnhancedTestDriveRequest, action: 'approved' | 'rejected') => {
    setSelectedRequest(request);
    setResponseAction(action);
    setIsResponseDialogOpen(true);
  };

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
              <RequestsLoadingSkeleton />
            ) : (
              <>
                <TabsContent value="all">
                  <RequestsTabContent
                    requests={requests}
                    isResponseDialogOpen={isResponseDialogOpen}
                    selectedRequest={selectedRequest}
                    responseAction={responseAction}
                    setIsResponseDialogOpen={setIsResponseDialogOpen}
                    openResponseDialog={openResponseDialog}
                    setResponseMessage={setResponseMessage}
                    setSelectedRequest={setSelectedRequest}
                    handleResponseSubmit={handleResponseSubmit}
                  />
                </TabsContent>
                
                <TabsContent value="pending">
                  <RequestsTabContent
                    requests={requests}
                    status="pending"
                    isResponseDialogOpen={isResponseDialogOpen}
                    selectedRequest={selectedRequest}
                    responseAction={responseAction}
                    setIsResponseDialogOpen={setIsResponseDialogOpen}
                    openResponseDialog={openResponseDialog}
                    setResponseMessage={setResponseMessage}
                    setSelectedRequest={setSelectedRequest}
                    handleResponseSubmit={handleResponseSubmit}
                  />
                </TabsContent>
                
                <TabsContent value="approved">
                  <RequestsTabContent
                    requests={requests}
                    status="approved"
                    isResponseDialogOpen={isResponseDialogOpen}
                    selectedRequest={selectedRequest}
                    responseAction={responseAction}
                    setIsResponseDialogOpen={setIsResponseDialogOpen}
                    openResponseDialog={openResponseDialog}
                    setResponseMessage={setResponseMessage}
                    setSelectedRequest={setSelectedRequest}
                    handleResponseSubmit={handleResponseSubmit}
                  />
                </TabsContent>
                
                <TabsContent value="rejected">
                  <RequestsTabContent
                    requests={requests}
                    status="rejected"
                    isResponseDialogOpen={isResponseDialogOpen}
                    selectedRequest={selectedRequest}
                    responseAction={responseAction}
                    setIsResponseDialogOpen={setIsResponseDialogOpen}
                    openResponseDialog={openResponseDialog}
                    setResponseMessage={setResponseMessage}
                    setSelectedRequest={setSelectedRequest}
                    handleResponseSubmit={handleResponseSubmit}
                  />
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
