
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface CarFeaturesFormProps {
  features: string[];
  onFeatureToggle: (feature: string) => void;
}

export const CarFeaturesForm = ({ features, onFeatureToggle }: CarFeaturesFormProps) => {
  const availableFeatures = [
    'Leather seats', 'Navigation system', 'Sunroof', 'Backup camera',
    'Bluetooth', 'Heated seats', 'Parking sensors', 'Premium sound system'
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">Car Features</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableFeatures.map((feature) => (
            <div key={feature} className="flex items-center space-x-2">
              <Checkbox 
                id={`feature-${feature}`} 
                checked={features.includes(feature)}
                onCheckedChange={() => onFeatureToggle(feature)}
              />
              <label
                htmlFor={`feature-${feature}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {feature}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
