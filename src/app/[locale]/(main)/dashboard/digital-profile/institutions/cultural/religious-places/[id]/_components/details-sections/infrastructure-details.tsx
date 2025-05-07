"use client";

import { Building, CheckIcon, XIcon } from "lucide-react";

interface ReligiousPlaceInfrastructureProps {
  religiousPlace: any;
}

export function ReligiousPlaceInfrastructure({
  religiousPlace,
}: ReligiousPlaceInfrastructureProps) {
  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="flex items-center gap-2">
        <Building className="h-5 w-5 text-primary" />
        <h3 className="text-base font-medium">पूर्वाधार र सुविधाहरू</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {religiousPlace.hasMainHall !== undefined && (
          <div className="flex items-center gap-2">
            {religiousPlace.hasMainHall ? (
              <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
              <XIcon className="h-4 w-4 text-gray-400" />
            )}
            <span>मुख्य हल</span>
          </div>
        )}

        {religiousPlace.hasCommunitySpace !== undefined && (
          <div className="flex items-center gap-2">
            {religiousPlace.hasCommunitySpace ? (
              <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
              <XIcon className="h-4 w-4 text-gray-400" />
            )}
            <span>सामुदायिक स्थान</span>
          </div>
        )}

        {religiousPlace.hasAccommodation !== undefined && (
          <div className="flex items-center gap-2">
            {religiousPlace.hasAccommodation ? (
              <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
              <XIcon className="h-4 w-4 text-gray-400" />
            )}
            <span>आवास सुविधा</span>
          </div>
        )}

        {religiousPlace.hasKitchen !== undefined && (
          <div className="flex items-center gap-2">
            {religiousPlace.hasKitchen ? (
              <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
              <XIcon className="h-4 w-4 text-gray-400" />
            )}
            <span>भान्सा</span>
          </div>
        )}

        {religiousPlace.hasDiningHall !== undefined && (
          <div className="flex items-center gap-2">
            {religiousPlace.hasDiningHall ? (
              <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
              <XIcon className="h-4 w-4 text-gray-400" />
            )}
            <span>भोजनालय</span>
          </div>
        )}

        {religiousPlace.hasLibrary !== undefined && (
          <div className="flex items-center gap-2">
            {religiousPlace.hasLibrary ? (
              <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
              <XIcon className="h-4 w-4 text-gray-400" />
            )}
            <span>पुस्तकालय</span>
          </div>
        )}

        {religiousPlace.hasMuseum !== undefined && (
          <div className="flex items-center gap-2">
            {religiousPlace.hasMuseum ? (
              <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
              <XIcon className="h-4 w-4 text-gray-400" />
            )}
            <span>संग्रहालय</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {religiousPlace.hasParking !== undefined && (
          <div className="flex items-center gap-2">
            {religiousPlace.hasParking ? (
              <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
              <XIcon className="h-4 w-4 text-gray-400" />
            )}
            <span>पार्किङ</span>
          </div>
        )}

        {religiousPlace.hasToilets !== undefined && (
          <div className="flex items-center gap-2">
            {religiousPlace.hasToilets ? (
              <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
              <XIcon className="h-4 w-4 text-gray-400" />
            )}
            <span>शौचालय</span>
          </div>
        )}

        {religiousPlace.hasHandicapAccess !== undefined && (
          <div className="flex items-center gap-2">
            {religiousPlace.hasHandicapAccess ? (
              <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
              <XIcon className="h-4 w-4 text-gray-400" />
            )}
            <span>अपाङ्ग पहुँच</span>
          </div>
        )}

        {religiousPlace.hasElectricity !== undefined && (
          <div className="flex items-center gap-2">
            {religiousPlace.hasElectricity ? (
              <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
              <XIcon className="h-4 w-4 text-gray-400" />
            )}
            <span>बिजुली</span>
          </div>
        )}

        {religiousPlace.hasWaterSupply !== undefined && (
          <div className="flex items-center gap-2">
            {religiousPlace.hasWaterSupply ? (
              <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
              <XIcon className="h-4 w-4 text-gray-400" />
            )}
            <span>पानीको आपूर्ति</span>
          </div>
        )}

        {religiousPlace.hasDrinkingWater !== undefined && (
          <div className="flex items-center gap-2">
            {religiousPlace.hasDrinkingWater ? (
              <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
              <XIcon className="h-4 w-4 text-gray-400" />
            )}
            <span>पिउने पानी</span>
          </div>
        )}

        {religiousPlace.hasFootwear !== undefined && (
          <div className="flex items-center gap-2">
            {religiousPlace.hasFootwear ? (
              <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
              <XIcon className="h-4 w-4 text-gray-400" />
            )}
            <span>जुत्ता सुविधा</span>
          </div>
        )}

        {religiousPlace.hasClothStorage !== undefined && (
          <div className="flex items-center gap-2">
            {religiousPlace.hasClothStorage ? (
              <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
              <XIcon className="h-4 w-4 text-gray-400" />
            )}
            <span>कपडा भण्डारण</span>
          </div>
        )}
      </div>
    </div>
  );
}
