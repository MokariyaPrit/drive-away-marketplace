
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CarDescriptionFormProps {
  description: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const CarDescriptionForm = ({ description, handleChange }: CarDescriptionFormProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">Description</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="description">Car Description*</Label>
          <Textarea 
            id="description" 
            name="description"
            value={description}
            onChange={handleChange}
            placeholder="Describe your car, its condition, history, and any other relevant details..."
            className="min-h-[150px]"
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};
