export type UserRole = 'user' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Car {
  id: string;
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
  images: string[];
  managerId: string;
  ownerId?: string; // Added to track if a user is the seller
  createdAt: string;
  location: string;
  availability?: {
    dates: string[]; // Available dates for test drives
    timeSlots: string[]; // Available time slots
  };
}

export interface TestDriveRequest {
  id: string;
  carId: string;
  userId: string;
  managerId: string;
  requestDate: string;
  preferredDate: string;
  preferredTimeSlot?: string; // Added time slot
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
  carId?: string;
}

// Mock users with different roles
export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    createdAt: '2023-01-15T08:30:00Z'
  },
  {
    id: 'manager1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'manager',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    createdAt: '2022-11-05T14:20:00Z'
  },
  {
    id: 'admin1',
    name: 'Michael Admin',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
    createdAt: '2022-10-01T10:00:00Z'
  }
];

// Mock car listings
export const mockCars: Car[] = [
  {
    id: 'car1',
    title: '2021 BMW 3 Series - Luxury Sports Sedan',
    make: 'BMW',
    model: '3 Series',
    year: 2021,
    price: 45999,
    mileage: 15000,
    fuelType: 'gasoline',
    transmission: 'automatic',
    features: ['Leather seats', 'Navigation system', 'Sunroof', 'Parking sensors', 'Backup camera'],
    description: 'This beautiful BMW 3 Series is in excellent condition with low mileage. Features include premium leather interior, advanced navigation system, and a powerful yet efficient engine.',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2528&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop'
    ],
    managerId: 'manager1',
    createdAt: '2023-05-10T09:30:00Z',
    location: 'San Francisco, CA'
  },
  {
    id: 'car2',
    title: '2022 Tesla Model 3 - All Electric Performance',
    make: 'Tesla',
    model: 'Model 3',
    year: 2022,
    price: 52000,
    mileage: 8000,
    fuelType: 'electric',
    transmission: 'automatic',
    features: ['Autopilot', 'Glass roof', 'Premium sound system', 'Heated seats', '15" touchscreen'],
    description: 'Experience the future of driving with this Tesla Model 3. This all-electric vehicle combines impressive range with instant acceleration and cutting-edge technology.',
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554744512-d6c603f27c54?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1536700503339-1e4b06520771?q=80&w=2070&auto=format&fit=crop'
    ],
    managerId: 'manager1',
    createdAt: '2023-06-15T11:45:00Z',
    location: 'Los Angeles, CA'
  },
  {
    id: 'car3',
    title: '2020 Honda Civic - Reliable Compact Sedan',
    make: 'Honda',
    model: 'Civic',
    year: 2020,
    price: 23500,
    mileage: 25000,
    fuelType: 'gasoline',
    transmission: 'automatic',
    features: ['Apple CarPlay', 'Android Auto', 'Backup camera', 'Lane keeping assist', 'Adaptive cruise control'],
    description: 'This Honda Civic offers excellent fuel economy, reliability, and modern features at an affordable price. Perfect for daily commuting with advanced safety features included.',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551830820-330a71b99659?q=80&w=2070&auto=format&fit=crop'
    ],
    managerId: 'manager1',
    createdAt: '2023-04-20T14:20:00Z',
    location: 'Portland, OR'
  },
  {
    id: 'car4',
    title: '2021 Mercedes-Benz E-Class - Luxury Redefined',
    make: 'Mercedes-Benz',
    model: 'E-Class',
    year: 2021,
    price: 65900,
    mileage: 12000,
    fuelType: 'gasoline',
    transmission: 'automatic',
    features: ['Premium leather interior', 'Burmester sound system', 'Driver assistance package', 'Heated and ventilated seats', 'Panoramic sunroof'],
    description: 'This Mercedes-Benz E-Class combines exceptional luxury with cutting-edge technology. The premium interior, smooth ride, and elegant design make it stand out from the crowd.',
    images: [
      'https://images.unsplash.com/photo-1600705722738-d39380209f19?q=80&w=1931&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2072&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop'
    ],
    managerId: 'manager1',
    createdAt: '2023-07-05T10:15:00Z',
    location: 'New York, NY'
  },
  {
    id: 'car5',
    title: '2022 Toyota RAV4 Hybrid - Efficient SUV',
    make: 'Toyota',
    model: 'RAV4 Hybrid',
    year: 2022,
    price: 38750,
    mileage: 18000,
    fuelType: 'hybrid',
    transmission: 'automatic',
    features: ['All-wheel drive', 'Toyota Safety Sense', 'JBL premium audio', 'Wireless charging', 'Hands-free power liftgate'],
    description: 'Get the best of both worlds with this Toyota RAV4 Hybrid. It offers excellent fuel efficiency without compromising on power or space, making it perfect for families and outdoor enthusiasts.',
    images: [
      'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=2136&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=2069&auto=format&fit=crop'
    ],
    managerId: 'manager1',
    createdAt: '2023-03-25T16:40:00Z',
    location: 'Austin, TX'
  },
  {
    id: 'car6',
    title: '2019 Ford Mustang GT - American Muscle',
    make: 'Ford',
    model: 'Mustang GT',
    year: 2019,
    price: 42000,
    mileage: 30000,
    fuelType: 'gasoline',
    transmission: 'manual',
    features: ['5.0L V8 engine', 'Performance package', 'Recaro seats', 'Active valve exhaust', 'Digital instrument cluster'],
    description: 'Experience raw American muscle with this Ford Mustang GT. With its powerful V8 engine and manual transmission, it offers an exhilarating driving experience that few cars can match.',
    images: [
      'https://images.unsplash.com/photo-1584345604476-8ec5f452d1f2?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1494905998402-395d579af36f?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?q=80&w=1932&auto=format&fit=crop'
    ],
    managerId: 'manager1',
    createdAt: '2023-02-12T13:10:00Z',
    location: 'Dallas, TX'
  }
];

// Mock test drive requests
export const mockTestDriveRequests: TestDriveRequest[] = [
  {
    id: 'request1',
    carId: 'car1',
    userId: 'user1',
    managerId: 'manager1',
    requestDate: '2023-08-10T14:30:00Z',
    preferredDate: '2023-08-15T15:00:00Z',
    status: 'approved',
    message: 'I would like to test drive this BMW. I am particularly interested in the driving dynamics and comfort.'
  },
  {
    id: 'request2',
    carId: 'car2',
    userId: 'user1',
    managerId: 'manager1',
    requestDate: '2023-08-12T09:45:00Z',
    preferredDate: '2023-08-18T10:30:00Z',
    status: 'pending',
    message: 'I have never driven an electric car before and would love to experience the Tesla Model 3.'
  }
];

// Mock chat messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg1',
    senderId: 'user1',
    receiverId: 'manager1',
    message: 'Hello, I am interested in the BMW 3 Series. Is it still available?',
    timestamp: '2023-08-11T10:20:00Z',
    read: true,
    carId: 'car1'
  },
  {
    id: 'msg2',
    senderId: 'manager1',
    receiverId: 'user1',
    message: 'Yes, it is still available. Would you like to schedule a test drive?',
    timestamp: '2023-08-11T10:25:00Z',
    read: true,
    carId: 'car1'
  },
  {
    id: 'msg3',
    senderId: 'user1',
    receiverId: 'manager1',
    message: 'That would be great. I am available this weekend.',
    timestamp: '2023-08-11T10:28:00Z',
    read: true,
    carId: 'car1'
  },
  {
    id: 'msg4',
    senderId: 'manager1',
    receiverId: 'user1',
    message: 'Perfect! How about Saturday at 2 PM?',
    timestamp: '2023-08-11T10:35:00Z',
    read: false,
    carId: 'car1'
  }
];
