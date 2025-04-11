
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CarSubmissionsTable from '@/components/admin/CarSubmissionsTable';
import { CarSubmissionRequest } from '@/types/carSubmission';

// Mock car submissions (in a real app, this would come from a database)
const mockCarSubmissions: CarSubmissionRequest[] = [];

const CarSubmissions = () => {
  const [submissions, setSubmissions] = useState<CarSubmissionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch submissions
    setTimeout(() => {
      setSubmissions(mockCarSubmissions);
      setLoading(false);
    }, 800);
  }, []);

  const handleSubmissionUpdate = (updatedSubmission: CarSubmissionRequest) => {
    // In a real app, this would send an update to the backend
    setSubmissions(prev => 
      prev.map(sub => 
        sub.id === updatedSubmission.id ? updatedSubmission : sub
      )
    );
    
    // Also update the mock data (simulating database update)
    const index = mockCarSubmissions.findIndex(sub => sub.id === updatedSubmission.id);
    if (index !== -1) {
      mockCarSubmissions[index] = updatedSubmission;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8 flex-grow">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Car Submissions</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Review Car Listings</CardTitle>
              <CardDescription>
                Approve or reject cars submitted by users for listing on the marketplace
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-md"></div>
                  ))}
                </div>
              ) : (
                <CarSubmissionsTable 
                  submissions={submissions} 
                  onSubmissionUpdate={handleSubmissionUpdate} 
                />
              )}
            </CardContent>
          </Card>
        </div>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default CarSubmissions;
