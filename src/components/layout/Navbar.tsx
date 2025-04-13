import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Car, UserCircle, LogOut, Menu, X, Home, Calendar, Gavel, Users, User, FileEdit, FileText, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';

export function Navbar() {
  const { currentUser, isAuthenticated, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Car className="h-6 w-6 text-blue-600 mr-2" />
              <span className="font-bold text-xl">AutoMarket</span>
            </Link>

            {!isMobile && (
              <nav className="ml-10 space-x-4">
                <Link to="/" className="text-gray-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                <Link to="/cars" className="text-gray-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium">Browse Cars</Link>
                {isAuthenticated && (
                  <>
                    <Link to="/user/listings" className="text-gray-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium">My Listings</Link>
                    <Link to="/user/requests" className="text-gray-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium">Test Drives</Link>
                  </>
                )}
              </nav>
            )}
          </div>

          {/* Auth buttons or user dropdown */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center">
                {hasRole('admin') && !isMobile && (
                  <Button variant="outline" className="mr-4" onClick={() => navigate('/admin')}>
                    Admin Dashboard
                  </Button>
                )}
                
                {hasRole('manager') && !isMobile && (
                  <Button variant="outline" className="mr-4" onClick={() => navigate('/manager/requests')}>
                    Manage Requests
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser?.avatar} alt={currentUser?.name || 'User'} />
                        <AvatarFallback>{currentUser?.name ? getInitials(currentUser.name) : 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{currentUser?.name}</p>
                        <p className="text-xs text-gray-500">{currentUser?.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={() => navigate('/user/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate('/user/listings')}>
                      <List className="mr-2 h-4 w-4" />
                      <span>My Listings</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate('/user/requests')}>
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Test Drive Requests</span>
                    </DropdownMenuItem>

                    {hasRole('user') && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/user/list-car')}>
                          <FileEdit className="mr-2 h-4 w-4" />
                          <span>List a Car</span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => navigate('/user/request-listing')}>
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Request Listing</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    {hasRole('admin') && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Gavel className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    )}
                    
                    {hasRole('manager') && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/manager/requests')}>
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>Manage Test Drives</span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => navigate('/manager/listing-requests')}>
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Listing Requests</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              !isMobile && (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={() => navigate('/login')}>
                    Log In
                  </Button>
                  <Button onClick={() => navigate('/signup')}>
                    Sign Up
                  </Button>
                </div>
              )
            )}

            {isMobile && (
              <Button variant="ghost" onClick={toggleMenu} className="p-2">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 top-16 bg-white z-40 flex flex-col">
          <div className="p-4 flex-1 overflow-y-auto">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={closeMenu}
              >
                <Home className="h-5 w-5 mr-3" />
                Home
              </Link>
              <Link
                to="/cars"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={closeMenu}
              >
                <Car className="h-5 w-5 mr-3" />
                Browse Cars
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/user/profile"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
                    onClick={closeMenu}
                  >
                    <User className="h-5 w-5 mr-3" />
                    Profile
                  </Link>
                  
                  <Link
                    to="/user/listings"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
                    onClick={closeMenu}
                  >
                    <List className="h-5 w-5 mr-3" />
                    My Listings
                  </Link>
                  
                  <Link
                    to="/user/requests"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
                    onClick={closeMenu}
                  >
                    <Calendar className="h-5 w-5 mr-3" />
                    Test Drive Requests
                  </Link>
                  
                  {hasRole('user') && (
                    <>
                      <Link
                        to="/user/list-car"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={closeMenu}
                      >
                        <FileEdit className="h-5 w-5 mr-3" />
                        List a Car
                      </Link>
                      
                      <Link
                        to="/user/request-listing"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={closeMenu}
                      >
                        <FileText className="h-5 w-5 mr-3" />
                        Request Listing
                      </Link>
                    </>
                  )}
                  
                  {hasRole('admin') && (
                    <Link
                      to="/admin"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={closeMenu}
                    >
                      <Gavel className="h-5 w-5 mr-3" />
                      Admin Dashboard
                    </Link>
                  )}
                  
                  {hasRole('manager') && (
                    <>
                      <Link
                        to="/manager/requests"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={closeMenu}
                      >
                        <Calendar className="h-5 w-5 mr-3" />
                        Manage Test Drives
                      </Link>
                      
                      <Link
                        to="/manager/listing-requests"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={closeMenu}
                      >
                        <FileText className="h-5 w-5 mr-3" />
                        Listing Requests
                      </Link>
                    </>
                  )}
                  
                  <button
                    className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-md"
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Log Out
                  </button>
                </>
              ) : (
                <div className="space-y-2 pt-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate('/login');
                      closeMenu();
                    }}
                  >
                    <UserCircle className="h-5 w-5 mr-3" />
                    Log In
                  </Button>
                  <Button
                    className="w-full justify-start"
                    onClick={() => {
                      navigate('/signup');
                      closeMenu();
                    }}
                  >
                    <UserCircle className="h-5 w-5 mr-3" />
                    Sign Up
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
