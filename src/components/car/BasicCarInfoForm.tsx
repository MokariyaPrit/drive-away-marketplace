
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicCarInfoFormProps {
  formData: {
    title: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
    transmission: 'automatic' | 'manual';
    location: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export const BasicCarInfoForm = ({ formData, handleChange, handleSelectChange }: BasicCarInfoFormProps) => {
  return (
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
  );
};
