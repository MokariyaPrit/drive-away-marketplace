
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
import { testDriveService } from '@/services/api/testDriveService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const ManagerRequests = () => {
  const { currentUser } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<EnhancedTestDriveRequest | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [responseAction, setResponseAction] = useState<'approved' | 'rejected' | null>(null);
  
  const queryClient = useQueryClient();
  
  // Use React Query to fetch test drive requests
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['testDriveRequests'],
    queryFn: async () => {
      // While integrating with backend, we can remove this fallback
      try {
        return await testDriveService.getManagerRequests();
      } catch (error) {
        console.error('Failed to fetch from API, using mock data', error);
        // Fallback to mock data during development
        return mockTestDriveRequests
          .filter(request => request.managerId === currentUser?.id)
          .map(request => {
            const car = mockCars.find(car => car.id === request.carId)!;
            const user = mockUsers.find(user => user.id === request.userId)!;
            return { 
              ...request, 
              car, 
              user,
              status: request.status as 'pending' | 'approved' | 'rejected' 
            };
          });
      }
    },
    enabled: !!currentUser
  });

  // Mutation for approving requests
  const approveMutation = useMutation({
    mutationFn: async (requestId: string) => {
      // While integrating with backend, we can update this to use the service
      try {
        // Assuming the selected request has the note in some form
        return await testDriveService.approveRequest(requestId);
      } catch (error) {
        console.error('Failed to approve via API, using mock update', error);
        // Fallback during development
        const requestIndex = mockTestDriveRequests.findIndex(r => r.id === requestId);
        if (requestIndex !== -1) {
          mockTestDriveRequests[requestIndex].status = 'approved';
        }
        return null;
      }
    },
    onSuccess: () => {
      toast.success('Test drive request approved!');
      queryClient.invalidateQueries({ queryKey: ['testDriveRequests'] });
      setIsResponseDialogOpen(false);
      setSelectedRequest(null);
      setResponseMessage('');
      setResponseAction(null);
    },
    onError: (error) => {
      toast.error(`Failed to approve request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  // Mutation for rejecting requests
  const rejectMutation = useMutation({
    mutationFn: async (requestId: string) => {
      // While integrating with backend, we can update this to use the service
      try {
        // Assuming the reject reason is in the dialog
        const reason = document.getElementById('reject-reason') as HTMLTextAreaElement;
        return await testDriveService.rejectRequest(requestId, reason?.value || 'No reason provided');
      } catch (error) {
        console.error('Failed to reject via API, using mock update', error);
        // Fallback during development
        const requestIndex = mockTestDriveRequests.findIndex(r => r.id === requestId);
        if (requestIndex !== -1) {
          mockTestDriveRequests[requestIndex].status = 'rejected';
        }
        return null;
      }
    },
    onSuccess: () => {
      toast.success('Test drive request rejected');
      queryClient.invalidateQueries({ queryKey: ['testDriveRequests'] });
      setIsResponseDialogOpen(false);
      setSelectedRequest(null);
      setResponseMessage('');
      setResponseAction(null);
    },
    onError: (error) => {
      toast.error(`Failed to reject request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  // Mutation for sending messages
  const messageMutation = useMutation({
    mutationFn: async ({ requestId, message }: { requestId: string, message: string }) => {
      try {
        await testDriveService.sendMessage(requestId, message);
      } catch (error) {
        console.error('Failed to send message via API', error);
        // No fallback for messages since they don't modify local state
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Message sent successfully');
      setIsResponseDialogOpen(false);
      setResponseMessage('');
    },
    onError: (error) => {
      toast.error(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const handleResponseSubmit = () => {
    if (!selectedRequest) return;

    if (responseAction === 'approved') {
      approveMutation.mutate(selectedRequest.id);
    } else if (responseAction === 'rejected') {
      rejectMutation.mutate(selectedRequest.id);
    } else if (responseMessage) {
      messageMutation.mutate({ 
        requestId: selectedRequest.id, 
        message: responseMessage 
      });
    }
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
            
            {isLoading ? (
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
