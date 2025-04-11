
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { mockCars, mockUsers, Car } from '@/data/mock-data';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious 
} from '@/components/ui/carousel';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { 
  Select,
  SelectContent, 
  SelectItem,
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Calendar as CalendarIcon, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const testDriveSchema = z.object({
  date: z.date({
    required_error: "Please select a date for your test drive",
  }),
  timeSlot: z.string({
    required_error: "Please select a time slot",
  }),
  message: z.string().optional(),
});

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const form = useForm<z.infer<typeof testDriveSchema>>({
    resolver: zodResolver(testDriveSchema),
  });
  
  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    // Simulate API call to fetch car details
    setTimeout(() => {
      const foundCar = mockCars.find(car => car.id === id);
      if (foundCar) {
        setCar(foundCar);
        
        // Get the seller (either manager or user who listed it)
        const sellerId = foundCar.ownerId || foundCar.managerId;
        const foundSeller = mockUsers.find(user => user.id === sellerId);
        setSeller(foundSeller);
        
        // Check if current user is the owner
        if (currentUser && (foundCar.ownerId === currentUser.id || foundCar.managerId === currentUser.id)) {
          setIsOwner(true);
        }
      }
      setLoading(false);
    }, 800);
  }, [id, currentUser]);
  
  const onSubmit = (data: z.infer<typeof testDriveSchema>) => {
    if (!currentUser) {
      toast.error("Please login to book a test drive");
      navigate('/login', { state: { from: `/cars/${id}` } });
      return;
    }
    
    if (!car) return;
    
    // Check if selected date and time slot are available
    const formattedDate = format(data.date, 'yyyy-MM-dd');
    const hasAvailability = car.availability?.dates?.includes(formattedDate) || 
                           car.availability?.timeSlots?.includes(data.timeSlot) ||
                           (!car.availability); // If no availability info, assume available
    
    if (!hasAvailability) {
      toast.error("This time slot is not available. Please select another time.");
      return;
    }
    
    // In a real app, this would send data to the backend
    // For demo, we'll just show a success message
    toast.success("Test drive request submitted successfully! The seller will contact you soon.");
    setIsDialogOpen(false);
    form.reset();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="animate-pulse max-w-6xl mx-auto">
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-2"></div>
                <div className="h-24 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-8 bg-gray-200 rounded-lg w-1/4 mb-2"></div>
                <div className="h-24 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-12 bg-gray-200 rounded-lg"></div>
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
        <div className="container mx-auto px-4 py-8 flex-grow text-center">
          <h1 className="text-2xl font-bold mb-4">Car Not Found</h1>
          <p className="mb-6">The car you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/cars')}>View All Cars</Button>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Carousel className="w-full">
              <CarouselContent>
                {car.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <div className="overflow-hidden rounded-lg aspect-video">
                        <img
                          src={image}
                          alt={`${car.make} ${car.model} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.title}</h1>
              <p className="text-lg text-gray-600 mb-6">{car.year} • {car.mileage.toLocaleString()} miles • {car.location}</p>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Car Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Make</p>
                    <p className="font-medium">{car.make}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Model</p>
                    <p className="font-medium">{car.model}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-medium">{car.year}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Fuel Type</p>
                    <p className="font-medium capitalize">{car.fuelType}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Transmission</p>
                    <p className="font-medium capitalize">{car.transmission}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Mileage</p>
                    <p className="font-medium">{car.mileage.toLocaleString()} miles</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{car.description}</p>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Features</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {car.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {car.availability && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">Test Drive Availability</h2>
                  {car.availability.timeSlots && car.availability.timeSlots.length > 0 ? (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <h3 className="font-medium mb-2">Available Time Slots:</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {car.availability.timeSlots.map((slot) => (
                          <div key={slot} className="bg-white px-3 py-2 rounded border border-blue-100 text-sm">
                            {slot}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">Contact the seller for available time slots.</p>
                  )}
                </div>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
                <p className="text-3xl font-bold text-green-600 mb-1">{formatCurrency(car.price)}</p>
                <p className="text-gray-500 mb-6">Listed on {new Date(car.createdAt).toLocaleDateString()}</p>
                
                {seller && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">Listed by:</p>
                    <div className="flex items-center">
                      {seller.avatar ? (
                        <img 
                          src={seller.avatar} 
                          alt={seller.name} 
                          className="w-10 h-10 rounded-full mr-3"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <span className="text-gray-500">{seller.name.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{seller.name}</p>
                        <p className="text-sm text-gray-500 capitalize">{seller.role}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  {!isOwner ? (
                    <>
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full">Book Test Drive</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Book a Test Drive</DialogTitle>
                            <DialogDescription>
                              Request a test drive for the {car.make} {car.model}. 
                              {car.availability?.timeSlots?.length ? 
                                " Please select from available time slots." : 
                                " Contact the seller for available time slots."}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                              <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel>Preferred Date</FormLabel>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant={"outline"}
                                            className={cn(
                                              "w-full pl-3 text-left font-normal",
                                              !field.value && "text-muted-foreground"
                                            )}
                                          >
                                            {field.value ? (
                                              format(field.value, "PPP")
                                            ) : (
                                              <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                          mode="single"
                                          selected={field.value}
                                          onSelect={field.onChange}
                                          disabled={(date) => {
                                            // Disable dates in the past and more than 30 days in the future
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);
                                            const thirtyDaysFromNow = new Date();
                                            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                                            return date < today || date > thirtyDaysFromNow;
                                          }}
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="timeSlot"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Preferred Time</FormLabel>
                                    <Select 
                                      onValueChange={field.onChange} 
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a time slot" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {car.availability?.timeSlots && car.availability.timeSlots.length > 0 ? (
                                          car.availability.timeSlots.map((slot) => (
                                            <SelectItem key={slot} value={slot}>
                                              {slot}
                                            </SelectItem>
                                          ))
                                        ) : (
                                          [
                                            "9:00 AM - 10:00 AM", 
                                            "10:00 AM - 11:00 AM",
                                            "11:00 AM - 12:00 PM",
                                            "1:00 PM - 2:00 PM",
                                            "2:00 PM - 3:00 PM",
                                            "3:00 PM - 4:00 PM"
                                          ].map((slot) => (
                                            <SelectItem key={slot} value={slot}>
                                              {slot}
                                            </SelectItem>
                                          ))
                                        )}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Message (Optional)</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Any questions or special requests?"
                                        className="resize-none"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              {!currentUser && (
                                <div className="flex items-start p-3 bg-yellow-50 rounded-md text-sm">
                                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                                  <p>You'll need to sign in to complete your test drive request.</p>
                                </div>
                              )}
                              
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button type="submit">
                                  Submit Request
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                      
                      <Button variant="outline" className="w-full">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Seller
                      </Button>
                    </>
                  ) : (
                    <div className="bg-yellow-50 p-4 rounded-lg text-sm">
                      <p className="font-medium mb-1">This is your listing</p>
                      <p className="text-gray-600">You can edit or manage your listing from your dashboard.</p>
                      <Button 
                        variant="outline" 
                        className="mt-3 w-full"
                        onClick={() => navigate(seller?.role === 'manager' ? '/manager/listings' : '/user/listings')}
                      >
                        Go to My Listings
                      </Button>
                    </div>
                  )}
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
