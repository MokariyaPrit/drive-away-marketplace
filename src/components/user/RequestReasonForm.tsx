
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface RequestReasonFormProps {
  requestReason: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const RequestReasonForm = ({ requestReason, handleChange }: RequestReasonFormProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">Request Reason</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="requestReason">Why are you requesting this listing?*</Label>
          <Textarea 
            id="requestReason" 
            name="requestReason"
            value={requestReason}
            onChange={handleChange}
            placeholder="Please provide details about your request..."
            className="min-h-[100px]"
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};
