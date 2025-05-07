import { Badge } from "@/components/ui/badge";
import { InfoIcon, MapPin, CalendarIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface FishFarmBasicInfoProps {
  fishFarm: any;
}

export function FishFarmBasicInfo({ fishFarm }: FishFarmBasicInfoProps) {
  // Get fish farm type label
  const getFishFarmTypeLabel = (type: string) => {
    const types = {
      POND_CULTURE: "पोखरी मत्स्य पालन",
      CAGE_CULTURE: "पिंजडा मत्स्य पालन",
      TANK_CULTURE: "ट्यांक मत्स्य पालन",
      RACEWAY_CULTURE: "रेसवे मत्स्य पालन",
      RECIRCULATING_AQUACULTURE_SYSTEM: "रिसर्कुलेटिङ एक्वाकल्चर प्रणाली",
      HATCHERY: "ह्याचरी",
      NURSERY: "नर्सरी",
      INTEGRATED_FARMING: "एकीकृत मत्स्य पालन",
      RICE_FISH_CULTURE: "धान-माछा खेती",
      ORNAMENTAL_FISH_FARM: "सजावटी माछा फार्म",
      RESEARCH_FACILITY: "अनुसन्धान केन्द्र",
      MIXED: "मिश्रित",
      OTHER: "अन्य",
    };
    return types[type as keyof typeof types] || type;
  };

  // Get ownership type label
  const getOwnershipTypeLabel = (type: string | null) => {
    if (!type) return "उल्लेख नभएको";

    const types = {
      PRIVATE: "निजी",
      GOVERNMENT: "सरकारी",
      COMMUNITY: "सामुदायिक",
      COOPERATIVE: "सहकारी",
      PUBLIC_PRIVATE_PARTNERSHIP: "सार्वजनिक-निजी साझेदारी",
      NGO_MANAGED: "गैर सरकारी संस्था द्वारा व्यवस्थित",
      MIXED: "मिश्रित",
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <InfoIcon className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">आधारभूत जानकारी</h3>
        </div>

        {/* Description */}
        {fishFarm.description && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">विवरण</h3>
            <p className="text-base">{fishFarm.description}</p>
          </div>
        )}

        {/* Fish Farm Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              मत्स्य फार्म प्रकार
            </h3>
            <div>
              <Badge variant="outline" className="text-base font-normal">
                {getFishFarmTypeLabel(fishFarm.farmType)}
              </Badge>
            </div>
          </div>

          {fishFarm.ownershipType && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                स्वामित्व प्रकार
              </h3>
              <div>
                <Badge variant="outline" className="text-base font-normal">
                  {getOwnershipTypeLabel(fishFarm.ownershipType)}
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Location Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fishFarm.wardNumber && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                वडा नं.
              </h3>
              <p>{fishFarm.wardNumber}</p>
            </div>
          )}

          {fishFarm.location && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                ठाउँ/टोल
              </h3>
              <p>{fishFarm.location}</p>
            </div>
          )}

          {fishFarm.address && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                ठेगाना
              </h3>
              <p>{fishFarm.address}</p>
            </div>
          )}
        </div>

        {/* Fish Farm Size and Physical Details */}
        <div className="space-y-3 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fishFarm.totalAreaInHectares !== null &&
              fishFarm.totalAreaInHectares !== undefined && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    जम्मा क्षेत्रफल
                  </h3>
                  <p>{fishFarm.totalAreaInHectares} हेक्टर</p>
                </div>
              )}

            {fishFarm.waterSurfaceAreaInHectares !== null &&
              fishFarm.waterSurfaceAreaInHectares !== undefined && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    पानी सतह क्षेत्रफल
                  </h3>
                  <p>{fishFarm.waterSurfaceAreaInHectares} हेक्टर</p>
                </div>
              )}

            {fishFarm.operationalSince && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  संचालनमा आएको वर्ष
                </h3>
                <p>{fishFarm.operationalSince}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
