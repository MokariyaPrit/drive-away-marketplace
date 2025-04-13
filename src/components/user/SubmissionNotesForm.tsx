
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SubmissionNotesFormProps {
  notes: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const SubmissionNotesForm = ({ notes, handleChange }: SubmissionNotesFormProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Additional Notes for Admin (Optional)</Label>
      <Textarea 
        id="notes" 
        name="notes"
        value={notes}
        onChange={handleChange}
        placeholder="Any additional information for the admin reviewing your listing..."
        className="min-h-[80px]"
      />
    </div>
  );
};
