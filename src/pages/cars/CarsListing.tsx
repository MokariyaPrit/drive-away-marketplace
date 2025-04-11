
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown, Gauge, Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { CarCard } from '@/components/car/CarCard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { mockCars, Car } from '@/data/mock-data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const CarsListing = () => {
  const [cars, setCars] = useState<Car[]>(mockCars);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [filteredCars, setFilteredCars] = useState<Car[]>(mockCars);
  const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [yearRange, setYearRange] = useState<[number, number]>([2010, 2023]);
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  
  const navigate = useNavigate();

  // Get unique makes for filtering
  const makes = Array.from(new Set(mockCars.map(car => car.make)));
  
  // Min and max price in the dataset
  const maxPrice = Math.max(...mockCars.map(car => car.price));
  const minPrice = Math.min(...mockCars.map(car => car.price));
  
  // Min and max year in the dataset
  const maxYear = Math.max(...mockCars.map(car => car.year));
  const minYear = Math.min(...mockCars.map(car => car.year));

  useEffect(() => {
    // Reset price and year ranges when component mounts
    setPriceRange([minPrice, maxPrice]);
    setYearRange([minYear, maxYear]);
  }, []);

  useEffect(() => {
    // Apply filters and search
    setLoading(true);
    
    let results = [...mockCars];
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(car => 
        car.title.toLowerCase().includes(term) ||
        car.make.toLowerCase().includes(term) ||
        car.model.toLowerCase().includes(term) ||
        car.description.toLowerCase().includes(term)
      );
    }
    
    // Apply make filter
    if (selectedMakes.length > 0) {
      results = results.filter(car => selectedMakes.includes(car.make));
    }
    
    // Apply transmission filter
    if (selectedTransmissions.length > 0) {
      results = results.filter(car => selectedTransmissions.includes(car.transmission));
    }
    
    // Apply fuel type filter
    if (selectedFuelTypes.length > 0) {
      results = results.filter(car => selectedFuelTypes.includes(car.fuelType));
    }
    
    // Apply price range filter
    results = results.filter(car => 
      car.price >= priceRange[0] && car.price <= priceRange[1]
    );
    
    // Apply year range filter
    results = results.filter(car => 
      car.year >= yearRange[0] && car.year <= yearRange[1]
    );
    
    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'year-new':
        results.sort((a, b) => b.year - a.year);
        break;
      case 'year-old':
        results.sort((a, b) => a.year - b.year);
        break;
      case 'mileage-low':
        results.sort((a, b) => a.mileage - b.mileage);
        break;
      case 'mileage-high':
        results.sort((a, b) => b.mileage - a.mileage);
        break;
      default:
        break;
    }
    
    // Simulate loading delay
    setTimeout(() => {
      setFilteredCars(results);
      setLoading(false);
    }, 500);
  }, [searchTerm, selectedMakes, selectedTransmissions, selectedFuelTypes, priceRange, yearRange, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  const handleMakeToggle = (make: string) => {
    if (selectedMakes.includes(make)) {
      setSelectedMakes(selectedMakes.filter(m => m !== make));
    } else {
      setSelectedMakes([...selectedMakes, make]);
    }
  };

  const handleTransmissionToggle = (transmission: string) => {
    if (selectedTransmissions.includes(transmission)) {
      setSelectedTransmissions(selectedTransmissions.filter(t => t !== transmission));
    } else {
      setSelectedTransmissions([...selectedTransmissions, transmission]);
    }
  };

  const handleFuelTypeToggle = (fuelType: string) => {
    if (selectedFuelTypes.includes(fuelType)) {
      setSelectedFuelTypes(selectedFuelTypes.filter(f => f !== fuelType));
    } else {
      setSelectedFuelTypes([...selectedFuelTypes, fuelType]);
    }
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handleYearRangeChange = (value: number[]) => {
    setYearRange([value[0], value[1]]);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedMakes([]);
    setSelectedTransmissions([]);
    setSelectedFuelTypes([]);
    setPriceRange([minPrice, maxPrice]);
    setYearRange([minYear, maxYear]);
    setSortBy('newest');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderFilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Make</h3>
        <div className="space-y-2">
          {makes.map((make) => (
            <div key={make} className="flex items-center">
              <button
                type="button"
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-sm border text-xs",
                  selectedMakes.includes(make)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input"
                )}
                onClick={() => handleMakeToggle(make)}
              >
                {selectedMakes.includes(make) && <Check className="h-3 w-3" />}
              </button>
              <label className="ml-2 text-sm cursor-pointer" onClick={() => handleMakeToggle(make)}>
                {make}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Transmission</h3>
        <div className="space-y-2">
          {['automatic', 'manual'].map((transmission) => (
            <div key={transmission} className="flex items-center">
              <button
                type="button"
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-sm border text-xs",
                  selectedTransmissions.includes(transmission)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input"
                )}
                onClick={() => handleTransmissionToggle(transmission)}
              >
                {selectedTransmissions.includes(transmission) && <Check className="h-3 w-3" />}
              </button>
              <label 
                className="ml-2 text-sm cursor-pointer capitalize" 
                onClick={() => handleTransmissionToggle(transmission)}
              >
                {transmission}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Fuel Type</h3>
        <div className="space-y-2">
          {['gasoline', 'diesel', 'electric', 'hybrid'].map((fuelType) => (
            <div key={fuelType} className="flex items-center">
              <button
                type="button"
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-sm border text-xs",
                  selectedFuelTypes.includes(fuelType)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input"
                )}
                onClick={() => handleFuelTypeToggle(fuelType)}
              >
                {selectedFuelTypes.includes(fuelType) && <Check className="h-3 w-3" />}
              </button>
              <label 
                className="ml-2 text-sm cursor-pointer capitalize" 
                onClick={() => handleFuelTypeToggle(fuelType)}
              >
                {fuelType}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Price Range</h3>
        <div className="pt-6 px-2">
          <Slider
            defaultValue={[minPrice, maxPrice]}
            value={[priceRange[0], priceRange[1]]}
            min={minPrice}
            max={maxPrice}
            step={1000}
            onValueChange={handlePriceRangeChange}
            className="mb-6"
          />
          <div className="flex justify-between">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Year</h3>
        <div className="pt-6 px-2">
          <Slider
            defaultValue={[minYear, maxYear]}
            value={[yearRange[0], yearRange[1]]}
            min={minYear}
            max={maxYear}
            step={1}
            onValueChange={handleYearRangeChange}
            className="mb-6"
          />
          <div className="flex justify-between">
            <span>{yearRange[0]}</span>
            <span>{yearRange[1]}</span>
          </div>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full mt-4"
        onClick={clearFilters}
      >
        <X className="h-4 w-4 mr-2" />
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Browse Cars</h1>
          <div className="flex items-center space-x-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="year-new">Year: Newest First</SelectItem>
                <SelectItem value="year-old">Year: Oldest First</SelectItem>
                <SelectItem value="mileage-low">Mileage: Low to High</SelectItem>
                <SelectItem value="mileage-high">Mileage: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <Input
                type="text"
                placeholder="Search by make, model, or keywords..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="shrink-0 md:hidden" type="button">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Narrow down your search with these filters
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  {renderFilterPanel()}
                </div>
              </SheetContent>
            </Sheet>
          </form>
        </div>
        
        {/* Active filters display */}
        {(selectedMakes.length > 0 || selectedTransmissions.length > 0 || selectedFuelTypes.length > 0 ||
          priceRange[0] > minPrice || priceRange[1] < maxPrice ||
          yearRange[0] > minYear || yearRange[1] < maxYear) && (
          <div className="mb-6">
            <div className="text-sm font-medium mb-2">Active Filters:</div>
            <div className="flex flex-wrap gap-2">
              {selectedMakes.map(make => (
                <Button 
                  key={`make-${make}`} 
                  variant="secondary" 
                  size="sm" 
                  className="h-7"
                  onClick={() => handleMakeToggle(make)}
                >
                  {make} <X className="ml-1 h-3 w-3" />
                </Button>
              ))}
              
              {selectedTransmissions.map(transmission => (
                <Button 
                  key={`transmission-${transmission}`} 
                  variant="secondary" 
                  size="sm" 
                  className="h-7 capitalize"
                  onClick={() => handleTransmissionToggle(transmission)}
                >
                  {transmission} <X className="ml-1 h-3 w-3" />
                </Button>
              ))}
              
              {selectedFuelTypes.map(fuelType => (
                <Button 
                  key={`fuel-${fuelType}`} 
                  variant="secondary" 
                  size="sm" 
                  className="h-7 capitalize"
                  onClick={() => handleFuelTypeToggle(fuelType)}
                >
                  {fuelType} <X className="ml-1 h-3 w-3" />
                </Button>
              ))}
              
              {(priceRange[0] > minPrice || priceRange[1] < maxPrice) && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="h-7"
                  onClick={() => setPriceRange([minPrice, maxPrice])}
                >
                  Price: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])} <X className="ml-1 h-3 w-3" />
                </Button>
              )}
              
              {(yearRange[0] > minYear || yearRange[1] < maxYear) && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="h-7"
                  onClick={() => setYearRange([minYear, maxYear])}
                >
                  Year: {yearRange[0]} - {yearRange[1]} <X className="ml-1 h-3 w-3" />
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7"
                onClick={clearFilters}
              >
                Clear All
              </Button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Desktop Filter Panel */}
          <div className="hidden md:block">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">Filters</h2>
              {renderFilterPanel()}
            </div>
          </div>
          
          {/* Car Listings */}
          <div className="md:col-span-2">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="car-card">
                    <div className="aspect-[16/9] rounded-t-lg bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredCars.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">😕</div>
                    <h3 className="text-xl font-medium mb-2">No cars found</h3>
                    <p className="text-gray-600 mb-6">
                      We couldn't find any cars matching your criteria. Try adjusting your filters.
                    </p>
                    <Button onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCars.map((car) => (
                      <CarCard key={car.id} car={car} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CarsListing;
