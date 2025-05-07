"use client";

import { Accessibility } from "lucide-react";

interface ReligiousPlaceCommunityProps {
  religiousPlace: any;
}

export function ReligiousPlaceCommunity({
  religiousPlace,
}: ReligiousPlaceCommunityProps) {
  // Check if there are community engagement details to display
  const hasCommunityDetails =
    religiousPlace.communityBenefits ||
    religiousPlace.socialServicesOffered ||
    religiousPlace.educationalActivities;

  if (!hasCommunityDetails) {
    return null;
  }

  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="flex items-center gap-2">
        <Accessibility className="h-5 w-5 text-primary" />
        <h3 className="text-base font-medium">सामुदायिक सहभागिता</h3>
      </div>

      {religiousPlace.communityBenefits && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            समुदायलाई लाभ
          </h3>
          <p>{religiousPlace.communityBenefits}</p>
        </div>
      )}

      {religiousPlace.socialServicesOffered && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            सामाजिक सेवाहरू
          </h3>
          <p>{religiousPlace.socialServicesOffered}</p>
        </div>
      )}

      {religiousPlace.educationalActivities && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            शैक्षिक गतिविधि
          </h3>
          <p>{religiousPlace.educationalActivities}</p>
        </div>
      )}
    </div>
  );
}
