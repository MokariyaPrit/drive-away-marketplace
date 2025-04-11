
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Check, 
  MapPin, 
  Calendar, 
  Gauge, 
  Fuel, 
  Award, 
  Send, 
  ArrowLeft, 
  MessageSquare,
  Zap,
  ThumbsUp,
  BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { mockCars, Car } from '@/data/mock-data';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/utils';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [testDriveDialogOpen, setTestDriveDialogOpen] = useState(false);
  const { isAuthenticated, currentUser, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call to fetch car details
    setLoading(true);
    setTimeout(() => {
      const foundCar = mockCars.find(car => car.id === id);
      if (foundCar) {
        setCar(foundCar);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleSendMessage = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to send a message');
      navigate('/login', { state: { from: `/cars/${id}` } });
      return;
    }

    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    // In a real app, this would send the message to the backend
    toast.success('Message sent successfully!');
    setMessage('');
    setMessageDialogOpen(false);
  };

  const handleRequestTestDrive = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to request a test drive');
      navigate('/login', { state: { from: `/cars/${id}` } });
      return;
    }

    if (!preferredDate) {
      toast.error('Please select a preferred date');
      return;
    }

    if (!preferredTime) {
      toast.error('Please select a preferred time');
      return;
    }

    // In a real app, this would send the test drive request to the backend
    toast.success('Test drive requested successfully!');
    setPreferredDate('');
    setPreferredTime('');
    setTestDriveDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-6"></div>
            <div className="aspect-[16/9] bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="h-8 w-full bg-gray-200 rounded mb-4"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded mb-6"></div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Car Not Found</h1>
          <p className="text-gray-600 mb-6">The car you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/cars')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cars
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-6">
          <Button variant="ghost" className="p-0 h-auto" onClick={() => navigate('/cars')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cars
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Car Images and Info */}
          <div className="md:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <Carousel>
                <CarouselContent>
                  {car.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-[16/9] overflow-hidden rounded-lg">
                        <img 
                          src={image} 
                          alt={`${car.make} ${car.model} - Image ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
              
              <div className="flex mt-4 space-x-2 overflow-x-auto pb-2">
                {car.images.map((image, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 w-24 h-16 overflow-hidden rounded ${selectedImageIndex === index ? 'ring-2 ring-blue-600' : 'opacity-70'}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img 
                      src={image} 
                      alt={`Thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="description">Description</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-sm text-gray-500">Make & Model</h2>
                      <p className="font-medium">{car.make} {car.model}</p>
                    </div>
                    
                    <div>
                      <h2 className="text-sm text-gray-500">Year</h2>
                      <p className="font-medium">{car.year}</p>
                    </div>
                    
                    <div>
                      <h2 className="text-sm text-gray-500">Mileage</h2>
                      <p className="font-medium">{car.mileage.toLocaleString()} miles</p>
                    </div>
                    
                    <div>
                      <h2 className="text-sm text-gray-500">Location</h2>
                      <p className="font-medium">{car.location}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-sm text-gray-500">Transmission</h2>
                      <p className="font-medium capitalize">{car.transmission}</p>
                    </div>
                    
                    <div>
                      <h2 className="text-sm text-gray-500">Fuel Type</h2>
                      <p className="font-medium capitalize">{car.fuelType}</p>
                    </div>
                    
                    <div>
                      <h2 className="text-sm text-gray-500">Listed</h2>
                      <p className="font-medium">{new Date(car.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div>
                      <h2 className="text-sm text-gray-500">Vehicle ID</h2>
                      <p className="font-medium">{car.id}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="text-green-500 h-5 w-5 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="description">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{car.description}</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar with Price and Actions */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{formatCurrency(car.price)}</h2>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-700">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{car.location}</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{car.year} Model</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <Gauge className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{car.mileage.toLocaleString()} miles</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <Fuel className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="capitalize">{car.fuelType}</span>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-3">
                <Dialog open={testDriveDialogOpen} onOpenChange={setTestDriveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      Request Test Drive
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule a Test Drive</DialogTitle>
                      <DialogDescription>
                        Select your preferred date and time for the test drive. The dealer will confirm the appointment.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Preferred Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Preferred Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={preferredTime}
                          onChange={(e) => setPreferredTime(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="test-drive-message">Additional Notes (Optional)</Label>
                        <Textarea
                          id="test-drive-message"
                          placeholder="Any specific questions or requests for the test drive?"
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setTestDriveDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleRequestTestDrive}>
                        Submit Request
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Dealer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Message the Dealer</DialogTitle>
                      <DialogDescription>
                        Send a message to the dealer about this {car.make} {car.model}. They'll respond as soon as possible.
                      </DialogDescription>
                    </DialogHeader>
                    <Textarea
                      placeholder="I'm interested in this car and would like to know more about..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[150px]"
                    />
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSendMessage}>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium mb-4">Why buy from DriveAway?</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-1 rounded text-blue-600 mr-3">
                      <Zap size={16} />
                    </div>
                    <span className="text-sm">Verified dealers with quality checks</span>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-1 rounded text-blue-600 mr-3">
                      <ThumbsUp size={16} />
                    </div>
                    <span className="text-sm">Hassle-free test drive booking</span>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-1 rounded text-blue-600 mr-3">
                      <BarChart size={16} />
                    </div>
                    <span className="text-sm">Transparent pricing with no hidden fees</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CarDetail;
