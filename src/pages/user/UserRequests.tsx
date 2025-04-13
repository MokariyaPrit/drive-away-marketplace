
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { mockCars, mockTestDriveRequests, TestDriveRequest, Car } from '@/data/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { RequestsEmptyState } from '@/components/user/RequestsEmptyState';
import { RequestsLoading } from '@/components/user/RequestsLoading';
import { RequestsList } from '@/components/user/RequestsList';

const UserRequests = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<(TestDriveRequest & { car: Car })[]>([]);
  const [loading, setLoading] = useState(true);
  
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
              <RequestsLoading />
            ) : (
              <>
                <TabsContent value="all">
                  {requests.length === 0 ? (
                    <RequestsEmptyState />
                  ) : (
                    <RequestsList requests={requests} />
                  )}
                </TabsContent>
                
                <TabsContent value="pending">
                  {requests.filter(r => r.status === 'pending').length === 0 ? (
                    <RequestsEmptyState type="pending" />
                  ) : (
                    <RequestsList requests={requests.filter(r => r.status === 'pending')} />
                  )}
                </TabsContent>
                
                <TabsContent value="approved">
                  {requests.filter(r => r.status === 'approved').length === 0 ? (
                    <RequestsEmptyState type="approved" />
                  ) : (
                    <RequestsList requests={requests.filter(r => r.status === 'approved')} />
                  )}
                </TabsContent>
                
                <TabsContent value="rejected">
                  {requests.filter(r => r.status === 'rejected').length === 0 ? (
                    <RequestsEmptyState type="rejected" />
                  ) : (
                    <RequestsList requests={requests.filter(r => r.status === 'rejected')} />
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
