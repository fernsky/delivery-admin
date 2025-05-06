"use client";

import { History, CheckIcon } from "lucide-react";

interface ReligiousPlaceCulturalDetailsProps {
  religiousPlace: any;
}

export function ReligiousPlaceCulturalDetails({
  religiousPlace,
}: ReligiousPlaceCulturalDetailsProps) {
  // Check if there are cultural/historical details to display
  const hasCulturalDetails =
    religiousPlace.historicalSignificance ||
    religiousPlace.culturalSignificance ||
    religiousPlace.isHeritageSite ||
    religiousPlace.hasArchaeologicalValue;

  if (!hasCulturalDetails) {
    return null;
  }

  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="flex items-center gap-2">
        <History className="h-5 w-5 text-primary" />
        <h3 className="text-base font-medium">सांस्कृतिक र ऐतिहासिक महत्व</h3>
      </div>

      {religiousPlace.historicalSignificance && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            ऐतिहासिक महत्व
          </h3>
          <p>{religiousPlace.historicalSignificance}</p>
        </div>
      )}

      {religiousPlace.culturalSignificance && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            सांस्कृतिक महत्व
          </h3>
          <p>{religiousPlace.culturalSignificance}</p>
        </div>
      )}

      {religiousPlace.isHeritageSite && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            सम्पदा स्थल
          </h3>
          <div className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4 text-green-600" />
            <span>सम्पदा स्थलको रूपमा मान्यता प्राप्त</span>
          </div>
          {religiousPlace.heritageDesignation && (
            <p className="ml-6">{religiousPlace.heritageDesignation}</p>
          )}
        </div>
      )}

      {religiousPlace.inscriptions && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            शिलालेखहरू
          </h3>
          <p>{religiousPlace.inscriptions}</p>
        </div>
      )}

      {religiousPlace.hasArchaeologicalValue && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            पुरातात्विक मूल्य
          </h3>
          <div className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4 text-green-600" />
            <span>पुरातात्विक मूल्य रहेको</span>
          </div>
          {religiousPlace.archaeologicalDetails && (
            <p className="ml-6">{religiousPlace.archaeologicalDetails}</p>
          )}
        </div>
      )}
    </div>
  );
}
