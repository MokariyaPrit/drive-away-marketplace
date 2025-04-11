
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Gauge } from 'lucide-react';
import { Car as CarType } from '@/data/mock-data';
import { formatCurrency } from '@/lib/utils';

interface CarCardProps {
  car: CarType;
}

export function CarCard({ car }: CarCardProps) {
  return (
    <Link to={`/cars/${car.id}`} className="car-card block group">
      <div className="aspect-[16/9] overflow-hidden relative rounded-t-lg">
        <img 
          src={car.images[0]} 
          alt={car.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <span className="text-white font-bold text-xl">{formatCurrency(car.price)}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {car.title}
        </h3>
        <div className="mt-2 flex items-center text-gray-500 text-sm">
          <MapPin size={14} className="mr-1" />
          <span>{car.location}</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar size={14} className="mr-1" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Gauge size={14} className="mr-1" />
            <span>{car.mileage.toLocaleString()} mi</span>
          </div>
        </div>
        <div className="mt-3 flex items-center">
          <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {car.make} {car.model}
          </span>
          <span className="ml-2 text-sm font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded capitalize">
            {car.transmission}
          </span>
        </div>
      </div>
    </Link>
  );
}
