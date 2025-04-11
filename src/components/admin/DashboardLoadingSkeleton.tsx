
import { Skeleton } from '@/components/ui/skeleton';

export const DashboardLoadingSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
      <div className="h-96 bg-gray-200 rounded-lg"></div>
    </div>
  );
};
