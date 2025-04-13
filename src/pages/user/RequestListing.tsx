
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Info } from 'lucide-react';

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
            
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Request Information</CardTitle>
                <p className="text-sm text-gray-500">
                  Your listing request will be reviewed by a manager or admin before being published.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center p-3 bg-blue-50 rounded-md mb-4">
                  <Info className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="text-sm text-blue-700">
                    Please provide detailed and accurate information about your car to speed up the approval process.
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <form onSubmit={handleSubmit}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">Basic Information</CardTitle>
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <CardTitle className="text-xl">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="description">Car Description*</Label>
                    <Textarea 
                      id="description" 
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your car, its condition, history, and any other relevant details..."
                      className="min-h-[150px]"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">Request Reason</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="requestReason">Why are you requesting this listing?*</Label>
                    <Textarea 
                      id="requestReason" 
                      name="requestReason"
                      value={formData.requestReason}
                      onChange={handleChange}
                      placeholder="Please provide details about your request..."
                      className="min-h-[100px]"
                      required
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
