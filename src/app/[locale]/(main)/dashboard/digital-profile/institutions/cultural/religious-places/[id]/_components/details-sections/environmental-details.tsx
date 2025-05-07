"use client";

import { TreePine, CheckIcon } from "lucide-react";

interface ReligiousPlaceEnvironmentalProps {
  religiousPlace: any;
}

export function ReligiousPlaceEnvironmental({
  religiousPlace,
}: ReligiousPlaceEnvironmentalProps) {
  // Check if there are environmental details to display
  const hasEnvironmentalDetails =
    religiousPlace.hasGarden !== undefined ||
    religiousPlace.hasSignificantTrees !== undefined ||
    religiousPlace.hasWaterBody !== undefined;

  if (!hasEnvironmentalDetails) {
    return null;
  }

  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="flex items-center gap-2">
        <TreePine className="h-5 w-5 text-primary" />
        <h3 className="text-base font-medium">वातावरणीय पक्षहरू</h3>
      </div>

      <div className="space-y-4">
        {religiousPlace.hasGarden !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {religiousPlace.hasGarden ? (
                <CheckIcon className="h-4 w-4 text-green-600" />
              ) : (
                <span className="h-4 w-4"></span>
              )}
              <span>बगैंचा</span>
            </div>
            {religiousPlace.hasGarden &&
              religiousPlace.gardenAreaInSquareMeters && (
                <p className="ml-6">
                  क्षेत्रफल: {religiousPlace.gardenAreaInSquareMeters} वर्ग मिटर
                </p>
              )}
          </div>
        )}

        {religiousPlace.hasSignificantTrees !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {religiousPlace.hasSignificantTrees ? (
                <CheckIcon className="h-4 w-4 text-green-600" />
              ) : (
                <span className="h-4 w-4"></span>
              )}
              <span>महत्त्वपूर्ण रूखहरू</span>
            </div>
            {religiousPlace.hasSignificantTrees &&
              religiousPlace.significantTreeDetails && (
                <p className="ml-6">{religiousPlace.significantTreeDetails}</p>
              )}
          </div>
        )}

        {religiousPlace.hasWaterBody !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {religiousPlace.hasWaterBody ? (
                <CheckIcon className="h-4 w-4 text-green-600" />
              ) : (
                <span className="h-4 w-4"></span>
              )}
              <span>जलाशय</span>
            </div>
            {religiousPlace.hasWaterBody && religiousPlace.waterBodyDetails && (
              <p className="ml-6">{religiousPlace.waterBodyDetails}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
