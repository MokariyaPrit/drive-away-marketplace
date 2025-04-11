
import { useState, useEffect } from 'react';
import { Users, Car, Calendar, BarChart3, ChevronRight, User, UserCog, ShieldAlert } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockUsers, mockCars, mockTestDriveRequests, User as UserType } from '@/data/mock-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [managerCount, setManagerCount] = useState(0);
  const [carCount, setCarCount] = useState(0);
  const [testDriveCount, setTestDriveCount] = useState(0);
  const [recentUsers, setRecentUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch admin dashboard data
    setLoading(true);
    setTimeout(() => {
      // Count users by role
      const users = mockUsers.filter(user => user.role === 'user');
      const managers = mockUsers.filter(user => user.role === 'manager');
      
      setUserCount(users.length);
      setManagerCount(managers.length);
      setCarCount(mockCars.length);
      setTestDriveCount(mockTestDriveRequests.length);
      
      // Sort users by creation date (newest first) and take first 5
      const sortedUsers = [...mockUsers]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      
      setRecentUsers(sortedUsers);
      setLoading(false);
    }, 800);
  }, []);

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    // In a real app, this would send a delete request to the backend
    toast.success(`User ${selectedUser.name} has been deleted`);
    
    // Update local state to remove the user
    setRecentUsers(recentUsers.filter(user => user.id !== selectedUser.id));
    
    // Close dialog
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8 flex-grow">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
          
          {loading ? (
            <div className="space-y-6 animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      <CardDescription>Registered buyers</CardDescription>
                    </div>
                    <User className="h-6 w-6 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{userCount}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-medium">Total Managers</CardTitle>
                      <CardDescription>Car dealers</CardDescription>
                    </div>
                    <UserCog className="h-6 w-6 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{managerCount}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-medium">Cars Listed</CardTitle>
                      <CardDescription>Active vehicles</CardDescription>
                    </div>
                    <Car className="h-6 w-6 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{carCount}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-medium">Test Drive Requests</CardTitle>
                      <CardDescription>Total requests</CardDescription>
                    </div>
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{testDriveCount}</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Recent Users</CardTitle>
                      <Button variant="outline" size="sm" asChild>
                        <a href="/admin/users">
                          View All
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                    <CardDescription>
                      Recently registered users and managers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={user.avatar} alt={user.name} />
                                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={user.role === 'admin' ? 'destructive' : user.role === 'manager' ? 'default' : 'secondary'}
                                className="capitalize"
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(user.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  asChild
                                >
                                  <a href={`/admin/users/${user.id}`}>
                                    View
                                  </a>
                                </Button>
                                
                                {user.role !== 'admin' && (
                                  <Dialog
                                    open={isDeleteDialogOpen && selectedUser?.id === user.id}
                                    onOpenChange={(open) => {
                                      setIsDeleteDialogOpen(open);
                                      if (open) {
                                        setSelectedUser(user);
                                      }
                                    }}
                                  >
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="destructive" 
                                        size="sm"
                                      >
                                        Delete
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Delete User</DialogTitle>
                                        <DialogDescription>
                                          Are you sure you want to delete user {user.name}? This action cannot be undone.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <DialogFooter>
                                        <Button 
                                          variant="outline" 
                                          onClick={() => setIsDeleteDialogOpen(false)}
                                        >
                                          Cancel
                                        </Button>
                                        <Button 
                                          variant="destructive"
                                          onClick={handleDeleteUser}
                                        >
                                          Delete User
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
