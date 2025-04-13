
import { useState } from 'react';
import { User as UserType } from '@/data/mock-data';
import { UserTableRow } from './UserTableRow';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { UserFormDialog } from './UserFormDialog';
import { Input } from '@/components/ui/input';

interface UserManagementTableProps {
  users: UserType[];
  onUserDelete: (userId: string) => void;
  onUserUpdate: (updatedUser: UserType) => void;
}

export function UserManagementTable({ users, onUserDelete, onUserUpdate }: UserManagementTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = (newUser: Omit<UserType, 'id'>) => {
    // In a real app, this would send a request to create a new user
    // and get back the created user with an ID
    const id = `user-${Date.now()}`;
    const createdUser = {
      ...newUser,
      id,
      createdAt: new Date().toISOString(),
    };
    
    onUserUpdate(createdUser as UserType);
    setShowAddDialog(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <UserFormDialog 
            title="Add New User"
            onSubmit={handleAddUser}
            onCancel={() => setShowAddDialog(false)}
          />
        </Dialog>
      </div>
      
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
          {filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                {searchQuery ? "No users match your search" : "No users found"}
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => (
              <UserTableRow 
                key={user.id} 
                user={user} 
                onDelete={onUserDelete}
                onUpdate={onUserUpdate}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
