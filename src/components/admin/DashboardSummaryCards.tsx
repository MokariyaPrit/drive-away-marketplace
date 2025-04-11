
import { User, UserCog, Car, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardSummaryCardsProps {
  userCount: number;
  managerCount: number;
  carCount: number;
  testDriveCount: number;
}

export const DashboardSummaryCards = ({
  userCount,
  managerCount,
  carCount,
  testDriveCount
}: DashboardSummaryCardsProps) => {
  return (
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
  );
};
