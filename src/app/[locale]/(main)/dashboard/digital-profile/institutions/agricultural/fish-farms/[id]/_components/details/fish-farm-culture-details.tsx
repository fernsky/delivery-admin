import { Fish, Check, X } from "lucide-react";

interface FishFarmCultureDetailsProps {
  fishFarm: any;
}

export function FishFarmCultureDetails({
  fishFarm,
}: FishFarmCultureDetailsProps) {
  // Get culture system label
  const getCultureSystemLabel = (system: string | null) => {
    if (!system) return "उल्लेख नभएको";

    const systems = {
      EXTENSIVE: "विस्तृत",
      SEMI_INTENSIVE: "अर्ध-सघन",
      INTENSIVE: "सघन",
      SUPER_INTENSIVE: "अति सघन",
      POLYCULTURE: "मिश्रित मत्स्यपालन",
      MONOCULTURE: "एकल मत्स्यपालन",
    };
    return systems[system as keyof typeof systems] || system;
  };

  // Get feeding system label
  const getFeedingSystemLabel = (system: string | null) => {
    if (!system) return "उल्लेख नभएको";

    const systems = {
      MANUAL: "हातले",
      AUTOMATIC: "स्वचालित",
      DEMAND_FEEDER: "माग आधारित फीडर",
      SUPPLEMENTARY: "पूरक",
      NATURAL_FOOD_ONLY: "प्राकृतिक खाना मात्र",
      MIXED: "मिश्रित",
    };
    return systems[system as keyof typeof systems] || system;
  };

  // Get water management system label
  const getWaterManagementLabel = (system: string | null) => {
    if (!system) return "उल्लेख नभएको";

    const systems = {
      STATIC: "स्थिर",
      FLOW_THROUGH: "प्रवाह",
      RECIRCULATING: "पुन: प्रवाह",
      AERATED: "वातित",
      INTEGRATED: "एकीकृत",
      MIXED: "मिश्रित",
    };
    return systems[system as keyof typeof systems] || system;
  };

  return (
    <div className="space-y-3 pt-6 border-t mt-6">
      <div className="flex items-center gap-2">
        <Fish className="h-5 w-5 text-primary" />
        <h3 className="text-base font-medium">मत्स्य प्रजाति र व्यवस्थापन</h3>
      </div>

      {fishFarm.cultureSystem && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            पालन प्रणाली
          </h3>
          <p>{getCultureSystemLabel(fishFarm.cultureSystem)}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fishFarm.primaryFishSpecies && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              मुख्य माछा प्रजातिहरू
            </h3>
            <p>{fishFarm.primaryFishSpecies}</p>
          </div>
        )}

        {fishFarm.secondaryFishSpecies && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              सहायक माछा प्रजातिहरू
            </h3>
            <p>{fishFarm.secondaryFishSpecies}</p>
          </div>
        )}
      </div>

      {fishFarm.seedSourceDetails && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            बिउ स्रोत विवरण
          </h3>
          <p>{fishFarm.seedSourceDetails}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fishFarm.stockingDensityPerSquareMeter !== null &&
          fishFarm.stockingDensityPerSquareMeter !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                प्रति वर्ग मिटर स्टकिङ घनत्व
              </h3>
              <p>{fishFarm.stockingDensityPerSquareMeter}</p>
            </div>
          )}

        {fishFarm.growoutPeriodInMonths && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              वृद्धि अवधि
            </h3>
            <p>{fishFarm.growoutPeriodInMonths} महिना</p>
          </div>
        )}
      </div>

      {/* Feeding details */}
      {fishFarm.feedingSystem && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            दाना प्रणाली
          </h3>
          <p>{getFeedingSystemLabel(fishFarm.feedingSystem)}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fishFarm.feedTypes && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              दाना प्रकारहरू
            </h3>
            <p>{fishFarm.feedTypes}</p>
          </div>
        )}

        {fishFarm.feedConversionRatio !== null &&
          fishFarm.feedConversionRatio !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                दाना रूपान्तरण अनुपात
              </h3>
              <p>{fishFarm.feedConversionRatio}</p>
            </div>
          )}

        {fishFarm.annualFeedUsageInKg !== null &&
          fishFarm.annualFeedUsageInKg !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                वार्षिक दाना खपत
              </h3>
              <p>{fishFarm.annualFeedUsageInKg} के.जी.</p>
            </div>
          )}
      </div>

      {/* Water management system */}
      <div className="pt-2 border-t mt-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            पानी व्यवस्थापन प्रणाली
          </h3>
          <p>{getWaterManagementLabel(fishFarm.waterManagementSystem)}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
          <div className="flex items-center gap-2">
            {fishFarm.usesProbiotics ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <X className="h-4 w-4 text-gray-400" />
            )}
            <span>प्रोबायोटिक्स प्रयोग</span>
          </div>

          <div className="flex items-center gap-2">
            {fishFarm.usesAeration ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <X className="h-4 w-4 text-gray-400" />
            )}
            <span>एरेशन प्रयोग</span>
          </div>

          {fishFarm.usesAeration && fishFarm.aerationType && (
            <div className="col-span-2 space-y-1">
              <h3 className="text-xs font-medium text-muted-foreground">
                एरेशन प्रकार
              </h3>
              <p className="text-sm">{fishFarm.aerationType}</p>
            </div>
          )}
        </div>

        {(fishFarm.waterExchangeFrequency ||
          fishFarm.waterExchangePercentage) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            {fishFarm.waterExchangeFrequency && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  पानी परिवर्तन आवृत्ति
                </h3>
                <p>{fishFarm.waterExchangeFrequency}</p>
              </div>
            )}

            {fishFarm.waterExchangePercentage !== null &&
              fishFarm.waterExchangePercentage !== undefined && (
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    पानी परिवर्तन प्रतिशत
                  </h3>
                  <p>{fishFarm.waterExchangePercentage}%</p>
                </div>
              )}
          </div>
        )}

        {fishFarm.effluentManagementDetails && (
          <div className="space-y-2 mt-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              प्रदूषित पानी व्यवस्थापन विवरण
            </h3>
            <p>{fishFarm.effluentManagementDetails}</p>
          </div>
        )}
      </div>
    </div>
  );
}
