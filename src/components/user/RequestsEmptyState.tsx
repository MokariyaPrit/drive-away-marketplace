
import { Calendar, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RequestsEmptyStateProps {
  type?: 'all' | 'pending' | 'approved' | 'rejected';
}

export const RequestsEmptyState = ({ type = 'all' }: RequestsEmptyStateProps) => {
  if (type === 'all') {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-medium mb-2">No test drive requests yet</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          You haven't made any test drive requests yet. Browse our cars and schedule your first test drive.
        </p>
        <Button asChild>
          <a href="/cars">Browse Cars</a>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <Info className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <p className="text-gray-600">No {type} test drive requests.</p>
    </div>
  );
};
