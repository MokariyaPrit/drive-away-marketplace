
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { CarSubmissionRequest } from '@/types/carSubmission';
import { SubmissionForm } from '@/components/user/SubmissionForm';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error('You must be logged in to submit a car');
      return;
    }

    setIsSubmitting(true);

    if (!formData.title || !formData.make || !formData.model || !formData.description || !formData.location) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    // API call: submit car for review (typically a car-submissions endpoint)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/car-submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
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
          location: formData.location,
          notes: formData.notes,
          userId: currentUser.id,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        toast.error(`Failed to submit car: ${result.message || 'Unknown error'}`);
        setIsSubmitting(false);
        return;
      }

      toast.success('Your car has been submitted for review!');
      setIsSubmitting(false);
      navigate('/user/listings');
    } catch (err) {
      toast.error('Network error, please try again.');
      setIsSubmitting(false);
    }
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
