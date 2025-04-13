
import { User as UserType } from '@/data/mock-data';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DeleteUserDialogProps {
  user: UserType;
  onDelete: () => void;
  onCancel: () => void;
}

export function DeleteUserDialog({ user, onDelete, onCancel }: DeleteUserDialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete User</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete user <span className="font-medium">{user.name}</span>? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      
      <div className="py-4">
        <p className="text-gray-600">
          This will permanently remove the user from the system along with all associated data.
        </p>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          Delete User
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
