
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { mockCars, Car, mockTestDriveRequests } from '@/data/mock-data';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const ManagerListings = () => {
  const { currentUser } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [testDriveRequests, setTestDriveRequests] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);
    // Simulate API call to fetch manager's car listings
    setTimeout(() => {
      // Filter cars that belong to the current manager
      const managerCars = mockCars.filter(car => car.managerId === currentUser.id);
      setCars(managerCars);
      
      // Count test drive requests for each car
      const requestCounts: Record<string, number> = {};
      mockTestDriveRequests.forEach(request => {
        if (request.managerId === currentUser.id) {
          requestCounts[request.carId] = (requestCounts[request.carId] || 0) + 1;
        }
      });
      setTestDriveRequests(requestCounts);
      
      setLoading(false);
    }, 800);
  }, [currentUser]);

  const handleDeleteCar = () => {
    if (!selectedCar) return;
    
    // In a real app, this would send a delete request to the backend
    // For demo, we'll just remove it from our local state
    setCars(cars.filter(car => car.id !== selectedCar.id));
    toast.success(`${selectedCar.make} ${selectedCar.model} has been deleted`);
    setIsDeleteDialogOpen(false);
    setSelectedCar(null);
  };

  return (
    <ProtectedRoute allowedRoles={['manager']}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Car Listings</h1>
            <Button onClick={() => navigate('/manager/add-car')}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Car
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-5">
                    <div className="h-6 w-3/4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
                    <div className="h-12 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-8 w-24 bg-gray-200 rounded"></div>
                      <div className="h-8 w-32 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {cars.length === 0 ? (
                <Card className="text-center py-12">
                  <CardHeader>
                    <CardTitle>No Cars Listed Yet</CardTitle>
                    <CardDescription>
                      You haven't listed any cars for sale yet. Add your first car to get started.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="justify-center">
                    <Button onClick={() => navigate('/manager/add-car')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Car
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cars.map((car) => (
                    <Card key={car.id} className="overflow-hidden">
                      <div className="relative">
                        <img 
                          src={car.images[0]} 
                          alt={car.title} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          {testDriveRequests[car.id] ? (
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                              {testDriveRequests[car.id]} Test Drive {testDriveRequests[car.id] === 1 ? 'Request' : 'Requests'}
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                      
                      <CardHeader>
                        <CardTitle className="text-xl">{car.title}</CardTitle>
                        <CardDescription>
                          {car.year} • {car.mileage.toLocaleString()} miles • {car.location}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-2xl font-bold text-green-600">
                          ${car.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Listed on {new Date(car.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                      
                      <CardFooter className="flex justify-between">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/cars/${car.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/manager/edit-car/${car.id}`}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </a>
                          </Button>
                        </div>
                        <Dialog
                          open={isDeleteDialogOpen && selectedCar?.id === car.id}
                          onOpenChange={(open) => {
                            setIsDeleteDialogOpen(open);
                            if (open) {
                              setSelectedCar(car);
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Deletion</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete the listing for {car.make} {car.model}? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button variant="destructive" onClick={handleDeleteCar}>
                                Delete Listing
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default ManagerListings;
