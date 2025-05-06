"use client";

import { Building } from "lucide-react";

interface HistoricalSitePhysicalDetailsProps {
  historicalSite: any;
}

export function HistoricalSitePhysicalDetails({
  historicalSite,
}: HistoricalSitePhysicalDetailsProps) {
  // Get architectural style label
  const getArchitecturalStyleLabel = (style: string | null) => {
    if (!style) return "उल्लेख नभएको";

    const styles: Record<string, string> = {
      TRADITIONAL_NEPALI: "पारम्परिक नेपाली",
      PAGODA: "पगोडा",
      NEWAR: "नेवार",
      MALLA: "मल्ल",
      SHAH: "शाह",
      RAI: "राई",
      LIMBU: "लिम्बु",
      MEDIEVAL: "मध्यकालीन",
      COLONIAL: "औपनिवेशिक",
      GOTHIC: "गोथिक",
      MUGHAL: "मुगल",
      RANA_PALACE: "राणा दरबार",
      SHIKHARA: "शिखर",
      STUPA: "स्तुप",
      MIXED: "मिश्रित",
      VERNACULAR: "स्थानीय",
      OTHER: "अन्य",
    };
    return styles[style] || style;
  };

  // Get construction material label
  const getConstructionMaterialLabel = (material: string | null) => {
    if (!material) return "उल्लेख नभएको";

    const materials: Record<string, string> = {
      STONE: "ढुङ्गा",
      BRICK: "इँटा",
      WOOD: "काठ",
      MUD: "माटो",
      CLAY: "चिम्टाइलो माटो",
      MARBLE: "संगमरमर",
      METAL: "धातु",
      TERRACOTTA: "पाको माटो",
      MIXED: "मिश्रित",
      OTHER: "अन्य",
    };
    return materials[material] || material;
  };

  // Get historical period label
  const getHistoricalPeriodLabel = (period: string | null) => {
    if (!period) return "उल्लेख नभएको";

    const periods: Record<string, string> = {
      ANCIENT: "प्राचीन काल",
      MEDIEVAL: "मध्यकालीन",
      LICCHAVI: "लिच्छवि काल",
      MALLA: "मल्ल काल",
      SHAH: "शाह काल",
      RANA: "राणा काल",
      PRE_UNIFICATION: "एकीकरण पूर्व",
      COLONIAL: "औपनिवेशिक काल",
      MODERN: "आधुनिक",
      CONTEMPORARY: "समकालीन",
      MULTIPLE_PERIODS: "विभिन्न कालखण्ड",
      OTHER: "अन्य",
    };
    return periods[period] || period;
  };

  // Check if there are physical details to display
  const hasPhysicalDetails =
    (historicalSite.areaInSquareMeters !== null &&
      historicalSite.areaInSquareMeters !== undefined) ||
    historicalSite.architecturalStyle ||
    historicalSite.constructionMaterial ||
    historicalSite.yearEstablished ||
    historicalSite.yearAbandoned ||
    historicalSite.historicalPeriod ||
    historicalSite.lastRestorationYear;

  if (!hasPhysicalDetails) {
    return null;
  }

  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="flex items-center gap-2">
        <Building className="h-5 w-5 text-primary" />
        <h3 className="text-base font-medium">भौतिक विवरण</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {historicalSite.areaInSquareMeters !== null &&
          historicalSite.areaInSquareMeters !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                क्षेत्रफल
              </h3>
              <p>{historicalSite.areaInSquareMeters} वर्ग मिटर</p>
            </div>
          )}

        {historicalSite.architecturalStyle && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              वास्तुकला शैली
            </h3>
            <p>
              {getArchitecturalStyleLabel(historicalSite.architecturalStyle)}
            </p>
          </div>
        )}

        {historicalSite.constructionMaterial && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              निर्माण सामग्री
            </h3>
            <p>
              {getConstructionMaterialLabel(
                historicalSite.constructionMaterial,
              )}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {historicalSite.yearEstablished && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              स्थापना वर्ष
            </h3>
            <p>{historicalSite.yearEstablished}</p>
          </div>
        )}

        {historicalSite.yearAbandoned && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              परित्याग वर्ष
            </h3>
            <p>{historicalSite.yearAbandoned}</p>
          </div>
        )}

        {historicalSite.lastRestorationYear && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              अन्तिम जीर्णोद्धार वर्ष
            </h3>
            <p>{historicalSite.lastRestorationYear}</p>
          </div>
        )}
      </div>

      {historicalSite.historicalPeriod && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            ऐतिहासिक कालखण्ड
          </h3>
          <p>{getHistoricalPeriodLabel(historicalSite.historicalPeriod)}</p>
        </div>
      )}
    </div>
  );
}
