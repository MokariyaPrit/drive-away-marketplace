
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Car } from '@/data/mock-data';
import { CarSubmissionRequest } from '@/types/carSubmission';

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
            
            <form onSubmit={handleSubmit}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">Car Information</CardTitle>
                  <CardDescription>Provide accurate details about your vehicle</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Listing Title*</Label>
                      <Input 
                        id="title" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange}
                        placeholder="e.g. 2020 Honda Civic - Low Mileage"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location*</Label>
                      <Input 
                        id="location" 
                        name="location" 
                        value={formData.location} 
                        onChange={handleChange}
                        placeholder="e.g. San Francisco, CA"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="make">Make*</Label>
                      <Input 
                        id="make" 
                        name="make" 
                        value={formData.make} 
                        onChange={handleChange}
                        placeholder="e.g. Honda"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="model">Model*</Label>
                      <Input 
                        id="model" 
                        name="model" 
                        value={formData.model} 
                        onChange={handleChange}
                        placeholder="e.g. Civic"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="year">Year*</Label>
                      <Input 
                        type="number"
                        id="year" 
                        name="year" 
                        value={formData.year} 
                        onChange={handleChange}
                        min={1900}
                        max={new Date().getFullYear() + 1}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (USD)*</Label>
                      <Input 
                        type="number"
                        id="price" 
                        name="price" 
                        value={formData.price} 
                        onChange={handleChange}
                        min={0}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mileage">Mileage*</Label>
                      <Input 
                        type="number"
                        id="mileage" 
                        name="mileage" 
                        value={formData.mileage} 
                        onChange={handleChange}
                        min={0}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fuelType">Fuel Type*</Label>
                      <Select 
                        value={formData.fuelType}
                        onValueChange={(value) => handleSelectChange('fuelType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gasoline">Gasoline</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="electric">Electric</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="transmission">Transmission*</Label>
                      <Select 
                        value={formData.transmission}
                        onValueChange={(value) => handleSelectChange('transmission', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select transmission" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="automatic">Automatic</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">Car Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableFeatures.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`feature-${feature}`} 
                          checked={formData.features.includes(feature)}
                          onCheckedChange={() => handleFeatureToggle(feature)}
                        />
                        <label
                          htmlFor={`feature-${feature}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {feature}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">Description & Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Car Description*</Label>
                      <Textarea 
                        id="description" 
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your car, its condition, history, and any other relevant details..."
                        className="min-h-[120px]"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes for Admin (Optional)</Label>
                      <Textarea 
                        id="notes" 
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Any additional information for the admin reviewing your listing..."
                        className="min-h-[80px]"
                      />
                    </div>
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
          </div>
        </div>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default SubmitCar;
