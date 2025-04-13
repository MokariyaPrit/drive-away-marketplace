
import { useState } from 'react';
import { User as UserType } from '@/data/mock-data';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, Eye } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { UserDetailsDialog } from './UserDetailsDialog';
import { UserFormDialog } from './UserFormDialog';
import { DeleteUserDialog } from './DeleteUserDialog';

interface UserTableRowProps {
  user: UserType;
  onDelete: (userId: string) => void;
  onUpdate: (updatedUser: UserType) => void;
}

export function UserTableRow({ user, onDelete, onUpdate }: UserTableRowProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const handleUpdateUser = (updatedData: Omit<UserType, 'id'>) => {
    const updatedUser = {
      ...user,
      ...updatedData,
    };
    onUpdate(updatedUser);
    setShowEditDialog(false);
  };
  
  const handleDeleteUser = () => {
    onDelete(user.id);
    setShowDeleteDialog(false);
  };
  
  return (
    <TableRow>
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
          <Dialog open={showDetails} onOpenChange={setShowDetails}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </DialogTrigger>
            {showDetails && <UserDetailsDialog user={user} />}
          </Dialog>
          
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </DialogTrigger>
            {showEditDialog && <UserFormDialog 
              title="Edit User"
              user={user}
              onSubmit={handleUpdateUser}
              onCancel={() => setShowEditDialog(false)}
            />}
          </Dialog>
          
          {user.role !== 'admin' && (
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </DialogTrigger>
              <DeleteUserDialog 
                user={user} 
                onDelete={handleDeleteUser}
                onCancel={() => setShowDeleteDialog(false)}
              />
            </Dialog>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
