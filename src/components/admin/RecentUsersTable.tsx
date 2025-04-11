
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User as UserType } from '@/data/mock-data';
import { ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface RecentUsersTableProps {
  recentUsers: UserType[];
  onUserDelete: (userId: string) => void;
}

export const RecentUsersTable = ({ recentUsers, onUserDelete }: RecentUsersTableProps) => {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    // In a real app, this would send a delete request to the backend
    toast.success(`User ${selectedUser.name} has been deleted`);
    
    // Update local state to remove the user
    onUserDelete(selectedUser.id);
    
    // Close dialog
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  return (
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
  );
};
