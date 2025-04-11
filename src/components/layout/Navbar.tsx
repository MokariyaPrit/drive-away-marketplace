
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, UserCog, Car, Menu, X } from 'lucide-react';

export function Navbar() {
  const { currentUser, logout, hasRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Browse Cars', path: '/cars' },
  ];

  if (hasRole('manager')) {
    menuItems.push({ label: 'My Listings', path: '/manager/listings' });
    menuItems.push({ label: 'Test Drive Requests', path: '/manager/requests' });
  }

  if (hasRole('admin')) {
    menuItems.push({ label: 'Admin Dashboard', path: '/admin' });
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl text-blue-900">DriveAway</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Authentication / User Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                      <AvatarFallback>{currentUser?.name ? getInitials(currentUser.name) : 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{currentUser?.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                    <p className="text-xs text-muted-foreground capitalize mt-1">Role: {currentUser?.role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer w-full flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {hasRole('user') && (
                    <DropdownMenuItem asChild>
                      <Link to="/user/requests" className="cursor-pointer w-full flex items-center">
                        <Car className="w-4 h-4 mr-2" />
                        <span>My Test Drives</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {hasRole(['manager', 'admin']) && (
                    <DropdownMenuItem asChild>
                      <Link to="/manager/dashboard" className="cursor-pointer w-full flex items-center">
                        <UserCog className="w-4 h-4 mr-2" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-500 focus:text-red-500"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 pt-2 bg-white border-t animate-fade-in">
          <div className="flex flex-col space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-700 hover:text-blue-600 py-2 transition-colors"
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t pt-2 mt-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                      <AvatarFallback>{currentUser?.name ? getInitials(currentUser.name) : 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{currentUser?.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">Role: {currentUser?.role}</p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center text-gray-700 hover:text-blue-600 py-2"
                    onClick={closeMenu}
                  >
                    <User className="w-4 h-4 mr-2" />
                    <span>Profile</span>
                  </Link>
                  {hasRole('user') && (
                    <Link
                      to="/user/requests"
                      className="flex items-center text-gray-700 hover:text-blue-600 py-2"
                      onClick={closeMenu}
                    >
                      <Car className="w-4 h-4 mr-2" />
                      <span>My Test Drives</span>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-0 text-red-500 hover:text-red-600 hover:bg-transparent"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" className="w-full" onClick={() => { navigate('/login'); closeMenu(); }}>
                    Login
                  </Button>
                  <Button className="w-full" onClick={() => { navigate('/signup'); closeMenu(); }}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
