"use client";

import { PrayingHands } from "lucide-react";

interface ReligiousPlaceReligiousDetailsProps {
  religiousPlace: any;
}

export function ReligiousPlaceReligiousDetails({
  religiousPlace,
}: ReligiousPlaceReligiousDetailsProps) {
  // Check if there are religious details to display
  const hasReligiousDetails =
    religiousPlace.mainDeity ||
    religiousPlace.secondaryDeities ||
    religiousPlace.religiousTradition ||
    religiousPlace.religiousStory ||
    religiousPlace.regularPrayers ||
    religiousPlace.specialRituals ||
    religiousPlace.specialOfferings;

  if (!hasReligiousDetails) {
    return null;
  }

  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="flex items-center gap-2">
        <PrayingHands className="h-5 w-5 text-primary" />
        <h3 className="text-base font-medium">धार्मिक विवरण</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {religiousPlace.mainDeity && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              मुख्य देवता
            </h3>
            <p>{religiousPlace.mainDeity}</p>
          </div>
        )}

        {religiousPlace.secondaryDeities && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              अन्य देवताहरू
            </h3>
            <p>{religiousPlace.secondaryDeities}</p>
          </div>
        )}
      </div>

      {religiousPlace.religiousTradition && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            धार्मिक परम्परा
          </h3>
          <p>{religiousPlace.religiousTradition}</p>
        </div>
      )}

      {religiousPlace.religiousStory && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            धार्मिक कथा
          </h3>
          <p>{religiousPlace.religiousStory}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {religiousPlace.regularPrayers && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              नियमित प्रार्थना
            </h3>
            <p>{religiousPlace.regularPrayers}</p>
          </div>
        )}

        {religiousPlace.specialRituals && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              विशेष अनुष्ठान
            </h3>
            <p>{religiousPlace.specialRituals}</p>
          </div>
        )}

        {religiousPlace.specialOfferings && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              विशेष भेटीहरू
            </h3>
            <p>{religiousPlace.specialOfferings}</p>
          </div>
        )}
      </div>
    </div>
  );
}
