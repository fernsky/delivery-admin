"use client";

import { AlertTriangle } from "lucide-react";

interface ReligiousPlaceChallengesProps {
  religiousPlace: any;
}

export function ReligiousPlaceChallenges({
  religiousPlace,
}: ReligiousPlaceChallengesProps) {
  // Check if there are challenges/plans to display
  const hasChallenges =
    religiousPlace.currentChallenges ||
    religiousPlace.conservationNeeds ||
    religiousPlace.developmentPlans;

  if (!hasChallenges) {
    return null;
  }

  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-primary" />
        <h3 className="text-base font-medium">चुनौती र योजनाहरू</h3>
      </div>

      {religiousPlace.currentChallenges && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            हालका चुनौतीहरू
          </h3>
          <p>{religiousPlace.currentChallenges}</p>
        </div>
      )}

      {religiousPlace.conservationNeeds && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            संरक्षण आवश्यकताहरू
          </h3>
          <p>{religiousPlace.conservationNeeds}</p>
        </div>
      )}

      {religiousPlace.developmentPlans && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            विकास योजनाहरू
          </h3>
          <p>{religiousPlace.developmentPlans}</p>
        </div>
      )}
    </div>
  );
}
