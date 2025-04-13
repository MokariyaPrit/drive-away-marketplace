
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserManagementTable } from '@/components/admin/UserManagementTable';
import { mockUsers, User as UserType } from '@/data/mock-data';
import { DashboardLoadingSkeleton } from '@/components/admin/DashboardLoadingSkeleton';

const Users = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch users
    setLoading(true);
    setTimeout(() => {
      setUsers([...mockUsers]);
      setLoading(false);
    }, 800);
  }, []);

  const handleUserDelete = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    // In a real app, this would also update the database
  };

  const handleUserUpdate = (updatedUser: UserType) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    // In a real app, this would also update the database
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8 flex-grow">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">User Management</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Manage users and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <DashboardLoadingSkeleton />
              ) : (
                <UserManagementTable 
                  users={users} 
                  onUserDelete={handleUserDelete}
                  onUserUpdate={handleUserUpdate}
                />
              )}
            </CardContent>
          </Card>
        </div>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Users;
