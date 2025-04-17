
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { RequestInfoCard } from '@/components/user/RequestInfoCard';
import { ListingRequestForm } from '@/components/user/ListingRequestForm';

const RequestListing = () => {
  const { currentUser } = useAuth();
  
  return (
    <ProtectedRoute allowedRoles={['user']}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Request Car Listing</h1>
            
            <RequestInfoCard />
            
            <ListingRequestForm user={currentUser} />
          </div>
        </div>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default RequestListing;
