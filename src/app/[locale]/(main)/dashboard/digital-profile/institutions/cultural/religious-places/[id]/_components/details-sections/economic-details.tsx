"use client";

import { Coins, CheckIcon, XIcon } from "lucide-react";

interface ReligiousPlaceEconomicProps {
  religiousPlace: any;
}

export function ReligiousPlaceEconomic({
  religiousPlace,
}: ReligiousPlaceEconomicProps) {
  // Check if there are economic aspects to display
  const hasEconomicDetails =
    religiousPlace.hasShops !== undefined ||
    religiousPlace.totalAnnualRevenue !== null ||
    religiousPlace.annualOperatingBudget !== null ||
    religiousPlace.economicImpact;

  if (!hasEconomicDetails) {
    return null;
  }

  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="flex items-center gap-2">
        <Coins className="h-5 w-5 text-primary" />
        <h3 className="text-base font-medium">आर्थिक पक्षहरू</h3>
      </div>

      {religiousPlace.hasShops !== undefined && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {religiousPlace.hasShops ? (
              <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
              <XIcon className="h-4 w-4 text-gray-400" />
            )}
            <span>पसलहरू छन्</span>
          </div>
          {religiousPlace.hasShops && religiousPlace.shopCount && (
            <p className="ml-6">{religiousPlace.shopCount} पसल</p>
          )}
          {religiousPlace.hasShops && religiousPlace.shopTypes && (
            <p className="ml-6">पसल प्रकारहरू: {religiousPlace.shopTypes}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {religiousPlace.totalAnnualRevenue !== null &&
          religiousPlace.totalAnnualRevenue !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                कुल वार्षिक राजस्व
              </h3>
              <p>रू. {religiousPlace.totalAnnualRevenue.toLocaleString()}</p>
            </div>
          )}

        {religiousPlace.annualOperatingBudget !== null &&
          religiousPlace.annualOperatingBudget !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                वार्षिक संचालन बजेट
              </h3>
              <p>रू. {religiousPlace.annualOperatingBudget.toLocaleString()}</p>
            </div>
          )}
      </div>

      {religiousPlace.economicImpact && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            आर्थिक प्रभाव
          </h3>
          <p>{religiousPlace.economicImpact}</p>
        </div>
      )}
    </div>
  );
}
