
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "lucide-react";

interface TestDriveAvailabilityFormProps {
  selectedTimeSlots: string[];
  onTimeSlotToggle: (slot: string) => void;
}

export const TestDriveAvailabilityForm = ({ selectedTimeSlots, onTimeSlotToggle }: TestDriveAvailabilityFormProps) => {
  const timeSlots = [
    '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM',
    '1:00 PM - 2:00 PM', '2:00 PM - 3:00 PM', '3:00 PM - 4:00 PM'
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">Test Drive Availability</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Select time slots when you're typically available for test drives. This helps buyers know when they can schedule a test drive.
          </p>
          
          <div className="space-y-2">
            <Label>Available Time Slots</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {timeSlots.map((slot) => (
                <div key={slot} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`slot-${slot}`} 
                    checked={selectedTimeSlots.includes(slot)}
                    onCheckedChange={() => onTimeSlotToggle(slot)}
                  />
                  <label
                    htmlFor={`slot-${slot}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {slot}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-sm text-gray-600 flex items-center p-3 bg-blue-50 rounded-md">
            <Calendar className="h-5 w-5 mr-2 text-blue-500" />
            <span>In a real application, you would be able to upload images and select specific calendar dates for availability.</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
