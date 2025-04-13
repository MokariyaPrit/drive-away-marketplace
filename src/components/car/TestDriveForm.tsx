
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Car, mockTestDriveRequests } from '@/data/mock-data';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar, Clock } from 'lucide-react';

interface TestDriveFormProps {
  car: Car;
  onSuccess?: () => void;
}

export function TestDriveForm({ car, onSuccess }: TestDriveFormProps) {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [preferredDate, setPreferredDate] = useState<Date | undefined>();
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<string>('');
  const [message, setMessage] = useState('');
  const [contactMethod, setContactMethod] = useState('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please log in to request a test drive');
      navigate('/login', { state: { from: `/cars/${car.id}` } });
      return;
    }
    
    if (!preferredDate) {
      toast.error('Please select a preferred date');
      return;
    }
    
    if (!preferredTimeSlot) {
      toast.error('Please select a preferred time slot');
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, this would send a request to your backend
    setTimeout(() => {
      // Create a new test drive request object
      const newRequest = {
        id: `request-${Date.now()}`,
        carId: car.id,
        userId: currentUser?.id || '',
        managerId: car.managerId,
        requestDate: new Date().toISOString(),
        preferredDate: preferredDate.toISOString(),
        preferredTimeSlot,
        status: 'pending',
        message: message || undefined,
      };
      
      // Add to our mock data
      mockTestDriveRequests.push(newRequest as any);
      
      setIsSubmitting(false);
      toast.success('Test drive request submitted successfully!');
      
      // Reset form
      setPreferredDate(undefined);
      setPreferredTimeSlot('');
      setMessage('');
      
      if (onSuccess) {
        onSuccess();
      }
    }, 1000);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="preferredDate">Preferred Date</Label>
        <DatePicker
          date={preferredDate}
          onDateChange={setPreferredDate}
          placeholder="Select preferred date"
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="preferredTimeSlot">Preferred Time</Label>
        <Select
          value={preferredTimeSlot}
          onValueChange={setPreferredTimeSlot}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a time slot" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((slot) => (
              <SelectItem key={slot} value={slot}>
                {slot}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contactMethod">Preferred Contact Method</Label>
        <RadioGroup
          value={contactMethod}
          onValueChange={setContactMethod}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="email" />
            <Label htmlFor="email">Email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="phone" id="phone" />
            <Label htmlFor="phone">Phone</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Additional Information (Optional)</Label>
        <Textarea
          id="message"
          placeholder="Let us know if you have any questions about this car..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Requesting...' : 'Request Test Drive'}
      </Button>
      
      <div className="flex items-center text-sm text-gray-500 mt-2">
        <Calendar className="h-4 w-4 mr-1" />
        <span>You'll receive a confirmation email once your request is processed.</span>
      </div>
    </form>
  );
}
