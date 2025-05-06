import { Scale, Check, X } from "lucide-react";

interface FishFarmProductionDetailsProps {
  fishFarm: any;
}

export function FishFarmProductionDetails({
  fishFarm,
}: FishFarmProductionDetailsProps) {
  return (
    <div className="space-y-3 pt-6 border-t mt-6">
      <div className="flex items-center gap-2">
        <Scale className="h-5 w-5 text-primary" />
        <h3 className="text-base font-medium">उत्पादन विवरण</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fishFarm.annualProductionInKg !== null &&
          fishFarm.annualProductionInKg !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                वार्षिक उत्पादन
              </h3>
              <p>{fishFarm.annualProductionInKg} के.जी.</p>
            </div>
          )}

        {fishFarm.averageYieldPerHectareInKg !== null &&
          fishFarm.averageYieldPerHectareInKg !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                प्रति हेक्टर औसत उत्पादन
              </h3>
              <p>{fishFarm.averageYieldPerHectareInKg} के.जी./हेक्टर</p>
            </div>
          )}

        {fishFarm.recordedYearProduction && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              रेकर्ड गरिएको वर्ष
            </h3>
            <p>{fishFarm.recordedYearProduction}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fishFarm.survivalRatePercentage !== null &&
          fishFarm.survivalRatePercentage !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                जीवित रहने दर
              </h3>
              <p>{fishFarm.survivalRatePercentage}%</p>
            </div>
          )}

        {fishFarm.averageFishSizeInGrams !== null &&
          fishFarm.averageFishSizeInGrams !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                औसत माछा आकार
              </h3>
              <p>{fishFarm.averageFishSizeInGrams} ग्राम</p>
            </div>
          )}

        {fishFarm.productionCycles !== null &&
          fishFarm.productionCycles !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                उत्पादन चक्रहरू
              </h3>
              <p>{fishFarm.productionCycles} प्रति वर्ष</p>
            </div>
          )}
      </div>

      {/* Health management */}
      <div className="pt-2 border-t mt-4 space-y-3">
        <h3 className="text-base font-medium">स्वास्थ्य व्यवस्थापन</h3>

        {fishFarm.commonDiseases && (
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">
              साधारण रोगहरू
            </h3>
            <p>{fishFarm.commonDiseases}</p>
          </div>
        )}

        {fishFarm.diseasePreventionMethods && (
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">
              रोग रोकथाम विधिहरू
            </h3>
            <p>{fishFarm.diseasePreventionMethods}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {fishFarm.usesChemicals ? (
                <Check className="h-4 w-4 text-amber-600" />
              ) : (
                <X className="h-4 w-4 text-green-600" />
              )}
              <span>रसायन प्रयोग</span>
            </div>
            {fishFarm.usesChemicals && fishFarm.chemicalUsageDetails && (
              <p className="ml-6 text-sm">{fishFarm.chemicalUsageDetails}</p>
            )}
          </div>

          {fishFarm.mortalityPercentage !== null &&
            fishFarm.mortalityPercentage !== undefined && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  मृत्यु दर
                </h3>
                <p>{fishFarm.mortalityPercentage}%</p>
              </div>
            )}

          {fishFarm.healthMonitoringFrequency && (
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                स्वास्थ्य निगरानी आवृत्ति
              </h3>
              <p>{fishFarm.healthMonitoringFrequency}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
