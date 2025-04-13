
import { User as UserType } from '@/data/mock-data';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface UserDetailsDialogProps {
  user: UserType;
}

export function UserDetailsDialog({ user }: UserDetailsDialogProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>User Details</DialogTitle>
        <DialogDescription>
          Joined on {new Date(user.createdAt).toLocaleDateString()}
        </DialogDescription>
      </DialogHeader>
      
      <div className="flex flex-col items-center py-4">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        
        <h3 className="text-xl font-bold">{user.name}</h3>
        <p className="text-gray-500 mb-2">{user.email}</p>
        
        <Badge 
          variant={user.role === 'admin' ? 'destructive' : user.role === 'manager' ? 'default' : 'secondary'}
          className="capitalize mb-4"
        >
          {user.role}
        </Badge>
        
        <div className="w-full space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">User ID:</div>
            <div className="text-gray-600">{user.id}</div>
            
            <div className="font-medium">Phone:</div>
            <div className="text-gray-600">{user.phone || 'Not provided'}</div>
            
            <div className="font-medium">Location:</div>
            <div className="text-gray-600">{user.location || 'Not provided'}</div>
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
