"use client";

import { CheckIcon } from "lucide-react";

interface ReligiousPlaceCulturalAssetsProps {
  religiousPlace: any;
}

export function ReligiousPlaceCulturalAssets({
  religiousPlace,
}: ReligiousPlaceCulturalAssetsProps) {
  // Check if there are cultural assets to display
  const hasCulturalAssets =
    religiousPlace.hasSignificantArtwork ||
    religiousPlace.hasHistoricalArtifacts ||
    religiousPlace.hasRegisteredTreasures;

  if (!hasCulturalAssets) {
    return null;
  }

  return (
    <div className="space-y-3 pt-4 border-t">
      <h3 className="text-base font-medium">सांस्कृतिक सम्पत्तिहरू</h3>

      <div className="space-y-4">
        {religiousPlace.hasSignificantArtwork && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-green-600" />
              <h3 className="text-sm font-medium">महत्त्वपूर्ण कलाकृति</h3>
            </div>
            {religiousPlace.artworkDetails && (
              <p className="ml-6">{religiousPlace.artworkDetails}</p>
            )}
          </div>
        )}

        {religiousPlace.hasHistoricalArtifacts && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-green-600" />
              <h3 className="text-sm font-medium">ऐतिहासिक वस्तुहरू</h3>
            </div>
            {religiousPlace.artifactsDetails && (
              <p className="ml-6">{religiousPlace.artifactsDetails}</p>
            )}
          </div>
        )}

        {religiousPlace.hasRegisteredTreasures && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-green-600" />
              <h3 className="text-sm font-medium">दर्ता गरिएका खजानाहरू</h3>
            </div>
            {religiousPlace.treasureDetails && (
              <p className="ml-6">{religiousPlace.treasureDetails}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
