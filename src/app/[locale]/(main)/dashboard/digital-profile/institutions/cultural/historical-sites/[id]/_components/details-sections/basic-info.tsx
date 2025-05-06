"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";

interface HistoricalSiteBasicInfoProps {
  historicalSite: any;
}

export function HistoricalSiteBasicInfo({
  historicalSite,
}: HistoricalSiteBasicInfoProps) {
  // Get historical site type label
  const getHistoricalSiteTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      PALACE: "दरबार",
      FORT: "किल्ला",
      ANCIENT_SETTLEMENT: "प्राचीन बस्ती",
      ARCHAEOLOGICAL_SITE: "पुरातात्विक स्थल",
      ANCIENT_MONUMENT: "प्राचीन स्मारक",
      HERITAGE_BUILDING: "सम्पदा भवन",
      HISTORIC_HOUSE: "ऐतिहासिक घर",
      MEDIEVAL_TOWN: "मध्यकालीन शहर",
      ROYAL_RESIDENCE: "राजकीय निवास",
      HISTORIC_GARDEN: "ऐतिहासिक बगैंचा",
      HISTORIC_INFRASTRUCTURE: "ऐतिहासिक पूर्वाधार",
      BATTLEFIELD: "युद्धक्षेत्र",
      ANCIENT_RUINS: "प्राचीन भग्नावशेष",
      HISTORIC_LANDMARK: "ऐतिहासिक चिन्ह",
      OTHER: "अन्य",
    };
    return types[type] || type;
  };

  // Get historical significance label
  const getHistoricalSignificanceLabel = (significance: string | null) => {
    if (!significance) return "उल्लेख नभएको";

    const significances: Record<string, string> = {
      LOCAL: "स्थानीय",
      REGIONAL: "क्षेत्रीय",
      NATIONAL: "राष्ट्रिय",
      INTERNATIONAL: "अन्तर्राष्ट्रिय",
    };
    return significances[significance] || significance;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />
          आधारभूत जानकारी
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Description */}
        {historicalSite.description && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">विवरण</h3>
            <p className="text-base">{historicalSite.description}</p>
          </div>
        )}

        {/* Historical Site Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              ऐतिहासिक स्थलको प्रकार
            </h3>
            <div>
              <Badge variant="outline" className="text-base font-normal">
                {getHistoricalSiteTypeLabel(historicalSite.type)}
              </Badge>
            </div>
          </div>

          {historicalSite.historicalSignificance && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                ऐतिहासिक महत्व
              </h3>
              <div>
                <Badge
                  variant="outline"
                  className={`text-base font-normal ${
                    historicalSite.historicalSignificance === "INTERNATIONAL"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : historicalSite.historicalSignificance === "NATIONAL"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }`}
                >
                  {getHistoricalSignificanceLabel(
                    historicalSite.historicalSignificance,
                  )}
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Location Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {historicalSite.wardNumber && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                वडा नं.
              </h3>
              <p>{historicalSite.wardNumber}</p>
            </div>
          )}

          {historicalSite.location && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                ठाउँ/टोल
              </h3>
              <p>{historicalSite.location}</p>
            </div>
          )}

          {historicalSite.address && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                ठेगाना
              </h3>
              <p>{historicalSite.address}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
