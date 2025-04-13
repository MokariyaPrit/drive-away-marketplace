
import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const RequestInfoCard = () => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Request Information</CardTitle>
        <p className="text-sm text-gray-500">
          Your listing request will be reviewed by a manager or admin before being published.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center p-3 bg-blue-50 rounded-md mb-4">
          <Info className="h-5 w-5 mr-2 text-blue-500" />
          <span className="text-sm text-blue-700">
            Please provide detailed and accurate information about your car to speed up the approval process.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
