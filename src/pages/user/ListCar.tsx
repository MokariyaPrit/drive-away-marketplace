
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BasicCarInfoForm } from '@/components/car/BasicCarInfoForm';
import { CarFeaturesForm } from '@/components/car/CarFeaturesForm';
import { CarDescriptionForm } from '@/components/car/CarDescriptionForm';
import { TestDriveAvailabilityForm } from '@/components/car/TestDriveAvailabilityForm';

const ListCar = () => {
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
    availableDates: [] as string[],
    availableTimeSlots: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleTimeSlotToggle = (slot: string) => {
    setFormData(prev => {
      const slots = [...prev.availableTimeSlots];
      if (slots.includes(slot)) {
        return { ...prev, availableTimeSlots: slots.filter(s => s !== slot) };
      } else {
        return { ...prev, availableTimeSlots: [...slots, slot] };
      }
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'mileage' || name === 'year' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error('You must be logged in to list a car');
      return;
    }

    setIsSubmitting(true);

    if (!formData.title || !formData.make || !formData.model || !formData.description || !formData.location) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    // API call: create car
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/cars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          make: formData.make,
          model: formData.model,
          year: formData.year,
          price: formData.price,
          mileage: formData.mileage,
          images: [
            'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop'
          ],
          description: formData.description,
          color: 'Black',
          transmission: formData.transmission,
          fuelType: formData.fuelType,
          features: formData.features,
          owner: currentUser.id,
          manager: currentUser.id,
          location: formData.location,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        toast.error(`Failed to list car: ${result.message || 'Unknown error'}`);
        setIsSubmitting(false);
        return;
      }

      toast.success('Your car has been listed successfully!');
      setIsSubmitting(false);
      navigate('/user/listings');
    } catch (err) {
      toast.error('Network error, please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['user', 'manager']}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">List Your Car</h1>
            <form onSubmit={handleSubmit}>
              <BasicCarInfoForm
                formData={formData}
                handleChange={handleFormChange}
                handleSelectChange={handleSelectChange}
              />
              <CarFeaturesForm
                features={formData.features}
                onFeatureToggle={handleFeatureToggle}
              />
              <CarDescriptionForm
                description={formData.description}
                handleChange={handleFormChange}
              />
              <TestDriveAvailabilityForm
                selectedTimeSlots={formData.availableTimeSlots}
                onTimeSlotToggle={handleTimeSlotToggle}
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
                  {isSubmitting ? 'Publishing...' : 'Publish Listing'}
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

export default ListCar;
