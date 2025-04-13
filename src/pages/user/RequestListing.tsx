
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RequestInfoCard } from '@/components/user/RequestInfoCard';
import { BasicCarInfoForm } from '@/components/car/BasicCarInfoForm';
import { CarFeaturesForm } from '@/components/car/CarFeaturesForm';
import { CarDescriptionForm } from '@/components/car/CarDescriptionForm';
import { RequestReasonForm } from '@/components/user/RequestReasonForm';

const RequestListing = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuelType: 'gasoline' as 'gasoline' | 'diesel' | 'electric' | 'hybrid',
    transmission: 'automatic' as 'automatic' | 'manual',
    features: [] as string[],
    description: '',
    location: '',
    requestReason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const availableFeatures = [
    'Leather seats', 'Navigation system', 'Sunroof', 'Backup camera',
    'Bluetooth', 'Heated seats', 'Parking sensors', 'Premium sound system'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'mileage' || name === 'year' ? Number(value) : value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => {
      const features = [...prev.features];
      if (features.includes(feature)) {
        return { ...prev, features: features.filter(f => f !== feature) };
      } else {
        return { ...prev, features: [...features, feature] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('You must be logged in to submit a request');
      return;
    }
    
    setIsSubmitting(true);
    
    // Validate form
    if (!formData.title || !formData.make || !formData.model || !formData.description || !formData.location || !formData.requestReason) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }
    
    // In a real app, this would send data to the backend for manager/admin approval
    setTimeout(() => {
      toast.success('Your car listing request has been submitted for review');
      setIsSubmitting(false);
      navigate('/user/listings');
    }, 1500);
  };
  
  return (
    <ProtectedRoute allowedRoles={['user']}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Request Car Listing</h1>
            
            <RequestInfoCard />
            
            <form onSubmit={handleSubmit}>
              <BasicCarInfoForm 
                formData={formData}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
              />
              
              <CarFeaturesForm 
                features={formData.features}
                availableFeatures={availableFeatures}
                handleFeatureToggle={handleFeatureToggle}
              />
              
              <CarDescriptionForm 
                description={formData.description}
                handleChange={handleChange}
              />
              
              <RequestReasonForm 
                requestReason={formData.requestReason}
                handleChange={handleChange}
              />
              
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="mr-4"
                  onClick={() => navigate('/user/listings')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default RequestListing;
