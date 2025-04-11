
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { mockUsers, mockCars, mockTestDriveRequests, User as UserType } from '@/data/mock-data';
import { DashboardSummaryCards } from '@/components/admin/DashboardSummaryCards';
import { ActionCards } from '@/components/admin/ActionCards';
import { RecentUsersTable } from '@/components/admin/RecentUsersTable';
import { DashboardLoadingSkeleton } from '@/components/admin/DashboardLoadingSkeleton';

const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [managerCount, setManagerCount] = useState(0);
  const [carCount, setCarCount] = useState(0);
  const [testDriveCount, setTestDriveCount] = useState(0);
  const [recentUsers, setRecentUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDeleteUser = (userId: string) => {
    setRecentUsers(recentUsers.filter(user => user.id !== userId));
  };
  
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8 flex-grow">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
          
          {loading ? (
            <DashboardLoadingSkeleton />
          ) : (
            <>
              <DashboardSummaryCards 
                userCount={userCount}
                managerCount={managerCount}
                carCount={carCount}
                testDriveCount={testDriveCount}
              />
              
              <ActionCards />
              
              <div className="grid grid-cols-1 gap-6">
                <RecentUsersTable 
                  recentUsers={recentUsers} 
                  onUserDelete={handleDeleteUser} 
                />
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
