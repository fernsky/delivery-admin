import { Droplets, Check, X } from "lucide-react";

interface FishFarmWaterDetailsProps {
  fishFarm: any;
}

export function FishFarmWaterDetails({ fishFarm }: FishFarmWaterDetailsProps) {
  // Get water source label
  const getWaterSourceLabel = (source: string | null) => {
    if (!source) return "उल्लेख नभएको";

    const sources = {
      RIVER: "नदी",
      STREAM: "खोला",
      SPRING: "झरना",
      WELL: "कुवा",
      GROUNDWATER: "भूमिगत पानी",
      RAINWATER: "वर्षातको पानी",
      CANAL: "कुलो/नहर",
      RESERVOIR: "जलाशय",
      LAKE: "ताल",
      MIXED: "मिश्रित",
    };
    return sources[source as keyof typeof sources] || source;
  };

  return (
    <div className="space-y-3 pt-6 border-t mt-6">
      <div className="flex items-center gap-2">
        <Droplets className="h-5 w-5 text-primary" />
        <h3 className="text-base font-medium">पोखरी/जलाशय विवरण</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fishFarm.totalPondCount !== null &&
          fishFarm.totalPondCount !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                जम्मा पोखरी संख्या
              </h3>
              <p>{fishFarm.totalPondCount} वटा</p>
            </div>
          )}

        {fishFarm.activePondCount !== null &&
          fishFarm.activePondCount !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                सक्रिय पोखरी संख्या
              </h3>
              <p>{fishFarm.activePondCount} वटा</p>
            </div>
          )}

        {fishFarm.averagePondSizeInSquareMeters !== null &&
          fishFarm.averagePondSizeInSquareMeters !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                औसत पोखरी आकार
              </h3>
              <p>{fishFarm.averagePondSizeInSquareMeters} वर्ग मिटर</p>
            </div>
          )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fishFarm.averageWaterDepthInMeters !== null &&
          fishFarm.averageWaterDepthInMeters !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                औसत पानी गहिराई
              </h3>
              <p>{fishFarm.averageWaterDepthInMeters} मिटर</p>
            </div>
          )}

        {fishFarm.totalWaterVolumeInCubicMeters !== null &&
          fishFarm.totalWaterVolumeInCubicMeters !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                कुल पानी आयतन
              </h3>
              <p>{fishFarm.totalWaterVolumeInCubicMeters} घन मिटर</p>
            </div>
          )}
      </div>

      {fishFarm.waterSource && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            पानीको स्रोत
          </h3>
          <p>{getWaterSourceLabel(fishFarm.waterSource)}</p>
          {fishFarm.waterSourceDetails && (
            <p className="text-sm text-muted-foreground">
              {fishFarm.waterSourceDetails}
            </p>
          )}
        </div>
      )}

      {fishFarm.waterAvailabilityIssues && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            पानीको उपलब्धता समस्याहरू
          </h3>
          <p>{fishFarm.waterAvailabilityIssues}</p>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {fishFarm.hasWaterQualityMonitoring ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <X className="h-4 w-4 text-gray-400" />
          )}
          <h3 className="text-sm font-medium">पानीको गुणस्तर निगरानी</h3>
        </div>
        {fishFarm.hasWaterQualityMonitoring &&
          fishFarm.waterQualityParameters && (
            <p className="ml-6 text-sm">{fishFarm.waterQualityParameters}</p>
          )}
      </div>
    </div>
  );
}
