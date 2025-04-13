
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserRole, mockUsers } from '@/data/mock-data';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  hasRole: (role: UserRole) => boolean;
  updateUserProfile: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, you would validate credentials against your API
    // For the demo, we'll just check against our mock data
    // We're ignoring the password since we don't store passwords in mock data

    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        const user = mockUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );

        if (user) {
          setCurrentUser(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800);
    });
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // In a real app, you would send this data to your API
    // For the demo, we'll just pretend to create a new user

    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        // Check if email already exists
        const existingUser = mockUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );

        if (existingUser) {
          resolve(false);
        } else {
          // Create a new user
          const newUser: User = {
            id: `user-${Date.now()}`,
            name,
            email,
            role: 'user',
            createdAt: new Date().toISOString(),
          };

          // Add to mock data
          mockUsers.push(newUser);

          // Set as current user
          setCurrentUser(newUser);
          localStorage.setItem('currentUser', JSON.stringify(newUser));
          resolve(true);
        }
      }, 800);
    });
  };

  const updateUserProfile = (updatedUser: User) => {
    // Update in mock data
    const index = mockUsers.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      mockUsers[index] = updatedUser;
    }
    
    // Update current user
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasRole = (role: UserRole): boolean => {
    if (!currentUser) return false;
    
    // Admin can access everything
    if (currentUser.role === 'admin') return true;
    
    // Manager can access manager and user routes
    if (currentUser.role === 'manager' && (role === 'manager' || role === 'user')) return true;
    
    // User can only access user routes
    return currentUser.role === role;
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    login,
    logout,
    signup,
    hasRole,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
