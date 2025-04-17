
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BasicCarInfoForm } from '@/components/car/BasicCarInfoForm';
import { CarFeaturesForm } from '@/components/car/CarFeaturesForm';
import { CarDescriptionForm } from '@/components/car/CarDescriptionForm';
import { SubmissionNotesForm } from '@/components/user/SubmissionNotesForm';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SubmissionFormProps {
  formData: {
    title: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
    transmission: 'automatic' | 'manual';
    features: string[];
    description: string;
    location: string;
    notes: string;
  };
  isSubmitting: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleFeatureToggle: (feature: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const SubmissionForm = ({
  formData,
  isSubmitting,
  handleChange,
  handleSelectChange,
  handleFeatureToggle,
  handleSubmit
}: SubmissionFormProps) => {
  const navigate = useNavigate();
  
  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Car Information</CardTitle>
          <CardDescription>Provide accurate details about your vehicle</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <BasicCarInfoForm 
            formData={formData}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
          />
        </CardContent>
      </Card>
      
      <CarFeaturesForm 
        features={formData.features}
        onFeatureToggle={handleFeatureToggle}
      />
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Description & Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <CarDescriptionForm 
                description={formData.description}
                handleChange={handleChange}
              />
            </div>
            
            <SubmissionNotesForm 
              notes={formData.notes}
              handleChange={handleChange}
            />
          </div>
        </CardContent>
      </Card>
      
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
          {isSubmitting ? 'Submitting...' : 'Submit for Review'}
        </Button>
      </div>
    </form>
  );
};
