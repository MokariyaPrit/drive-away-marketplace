
import { FileCheck, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ActionCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Car Submissions</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <a href="/admin/car-submissions">
                View All
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
          <CardDescription>
            Review and manage car submissions from users
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <FileCheck className="h-10 w-10 text-blue-500 mx-auto mb-2" />
            <Button asChild>
              <a href="/admin/car-submissions">Manage Car Submissions</a>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>User Management</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <a href="/admin/users">
                View All
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
          <CardDescription>
            Manage users and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <Users className="h-10 w-10 text-blue-500 mx-auto mb-2" />
            <Button asChild>
              <a href="/admin/users">Manage Users</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
