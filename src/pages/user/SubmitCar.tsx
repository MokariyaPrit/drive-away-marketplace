
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { CarSubmissionRequest } from '@/types/carSubmission';
import { SubmissionForm } from '@/components/user/SubmissionForm';

// Mock data storage for car submissions (in a real app, this would be in a database)
const mockCarSubmissions: CarSubmissionRequest[] = [];

const SubmitCar = () => {
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
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const availableFeatures = [
    'Leather seats', 'Navigation system', 'Sunroof', 'Backup camera',
    'Bluetooth', 'Heated seats', 'Parking sensors', 'Premium sound system'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'price' || name === 'mileage' || name === 'year' ? Number(value) : value 
    }));
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
      toast.error('You must be logged in to submit a car');
      return;
    }
    
    setIsSubmitting(true);
    
    // Validate form
    if (!formData.title || !formData.make || !formData.model || !formData.description || !formData.location) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }
    
    // Create a car submission request
    setTimeout(() => {
      const newSubmission: CarSubmissionRequest = {
        id: `submission-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        carDetails: {
          title: formData.title,
          make: formData.make,
          model: formData.model,
          year: formData.year,
          price: formData.price,
          mileage: formData.mileage,
          fuelType: formData.fuelType,
          transmission: formData.transmission,
          features: formData.features,
          description: formData.description,
          images: [
            'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop'
          ],
          location: formData.location
        },
        status: 'pending',
        submissionDate: new Date().toISOString(),
        notes: formData.notes || undefined
      };
      
      // Add to our mock data (in a real app this would be an API call)
      mockCarSubmissions.push(newSubmission);
      
      toast.success('Your car has been submitted for review!');
      setIsSubmitting(false);
      
      // Navigate to the user's dashboard
      navigate('/user/listings');
    }, 1500);
  };
  
  return (
    <ProtectedRoute allowedRoles={['user']}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Your Car For Sale</h1>
            <p className="text-gray-600 mb-6">Fill out the form below to submit your car for review. An admin will review your submission before it's listed on the marketplace.</p>
            
            <SubmissionForm 
              formData={formData}
              availableFeatures={availableFeatures}
              isSubmitting={isSubmitting}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
              handleFeatureToggle={handleFeatureToggle}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default SubmitCar;
