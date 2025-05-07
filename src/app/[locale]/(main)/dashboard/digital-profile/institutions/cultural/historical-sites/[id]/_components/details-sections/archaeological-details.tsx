"use client";

import { Shovel } from "lucide-react";

interface ArchaeologicalDetailsProps {
  historicalSite: any;
}

export function ArchaeologicalDetails({
  historicalSite,
}: ArchaeologicalDetailsProps) {
  // Check if there are archaeological details to display
  const hasArchaeologicalDetails =
    historicalSite.archaeologicalRemains ||
    historicalSite.artifactsFound ||
    historicalSite.excavationHistory ||
    historicalSite.excavationYear;

  if (!hasArchaeologicalDetails) {
    return null;
  }

  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="flex items-center gap-2">
        <Shovel className="h-5 w-5 text-primary" />
        <h3 className="text-base font-medium">पुरातात्विक विवरण</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {historicalSite.archaeologicalRemains && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              पुरातात्विक अवशेषहरू
            </h3>
            <p>{historicalSite.archaeologicalRemains}</p>
          </div>
        )}

        {historicalSite.artifactsFound && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              फेला परेका वस्तुहरू
            </h3>
            <p>{historicalSite.artifactsFound}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {historicalSite.excavationHistory && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              उत्खनन इतिहास
            </h3>
            <p>{historicalSite.excavationHistory}</p>
          </div>
        )}

        {historicalSite.excavationYear && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              उत्खनन वर्ष
            </h3>
            <p>{historicalSite.excavationYear}</p>
          </div>
        )}
      </div>
    </div>
  );
}
