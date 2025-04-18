
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/data/mock-data';
import { authService } from '@/services/api/authService';
import { toast } from 'sonner';

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
    // Check for existing session
    const checkAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          // Map API user response to our User type, adding any missing required fields
          setCurrentUser({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role as UserRole,
            createdAt: userData.createdAt || new Date().toISOString(), // Provide default if not present
            avatar: userData.avatar,
            phone: userData.phone,
            location: userData.location
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login(email, password);
      
      if (response) {
        // Map API user response to our User type
        setCurrentUser({
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role as UserRole,
          createdAt: response.user.createdAt || new Date().toISOString(), // Provide default
          avatar: response.user.avatar,
          phone: response.user.phone,
          location: response.user.location
        });
        toast.success('Successfully logged in');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.register(name, email, password);
      
      if (response) {
        // After registration, we'll log in the user
        const loginSuccess = await login(email, password);
        if (loginSuccess) {
          toast.success('Account created successfully');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Signup failed');
      return false;
    }
  };

  const updateUserProfile = (updatedUser: User) => {
    // Update current user
    setCurrentUser(updatedUser);
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    toast.success('Successfully logged out');
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
