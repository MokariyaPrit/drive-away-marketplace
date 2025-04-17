
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BasicCarInfoForm } from '@/components/car/BasicCarInfoForm';
import { CarFeaturesForm } from '@/components/car/CarFeaturesForm';
import { CarDescriptionForm } from '@/components/car/CarDescriptionForm';
import { RequestReasonForm } from '@/components/user/RequestReasonForm';
import { SubmissionNotesForm } from '@/components/user/SubmissionNotesForm';

interface ListingRequestFormProps {
  user: any;
}

export const ListingRequestForm = ({ user }: ListingRequestFormProps) => {
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
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    
    if (!user) {
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
    <form onSubmit={handleSubmit}>
      <BasicCarInfoForm 
        formData={formData}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
      />
      
      <CarFeaturesForm 
        features={formData.features}
        onFeatureToggle={handleFeatureToggle}
      />
      
      <CarDescriptionForm 
        description={formData.description}
        handleChange={handleChange}
      />
      
      <RequestReasonForm 
        requestReason={formData.requestReason}
        handleChange={handleChange}
      />
      
      <div className="space-y-4 mb-6">
        <SubmissionNotesForm 
          notes={formData.notes}
          handleChange={handleChange}
        />
      </div>
      
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
  );
};
