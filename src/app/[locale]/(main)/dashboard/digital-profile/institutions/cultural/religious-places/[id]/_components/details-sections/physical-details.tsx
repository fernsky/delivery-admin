"use client";

import { Building } from "lucide-react";

interface ReligiousPlacePhysicalDetailsProps {
  religiousPlace: any;
}

export function ReligiousPlacePhysicalDetails({
  religiousPlace,
}: ReligiousPlacePhysicalDetailsProps) {
  // Get architectural style label
  const getArchitecturalStyleLabel = (style: string | null) => {
    if (!style) return "उल्लेख नभएको";

    const styles = {
      TRADITIONAL_NEPALI: "पारम्परिक नेपाली",
      PAGODA: "पगोडा",
      STUPA: "स्तुप",
      SHIKHARA: "शिखर",
      MODERN: "आधुनिक",
      COLONIAL: "औपनिवेशिक",
      GOTHIC: "गोथिक",
      MUGHAL: "मुगल",
      DOME: "गुम्बज",
      MIXED: "मिश्रित",
      VERNACULAR: "स्थानीय",
      OTHER: "अन्य",
    };
    return styles[style as keyof typeof styles] || style;
  };

  // Get construction material label
  const getConstructionMaterialLabel = (material: string | null) => {
    if (!material) return "उल्लेख नभएको";

    const materials = {
      STONE: "ढुङ्गा",
      BRICK: "इँटा",
      WOOD: "काठ",
      MUD: "माटो",
      CONCRETE: "कंक्रिट",
      MARBLE: "संगमरमर",
      METAL: "धातु",
      MIXED: "मिश्रित",
      OTHER: "अन्य",
    };
    return materials[material as keyof typeof materials] || material;
  };

  // Check if there are physical details to display
  const hasPhysicalDetails =
    (religiousPlace.areaInSquareMeters !== null &&
      religiousPlace.areaInSquareMeters !== undefined) ||
    religiousPlace.architecturalStyle ||
    religiousPlace.constructionMaterial ||
    religiousPlace.yearEstablished ||
    religiousPlace.yearRenovated;

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
        {religiousPlace.areaInSquareMeters !== null &&
          religiousPlace.areaInSquareMeters !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                क्षेत्रफल
              </h3>
              <p>{religiousPlace.areaInSquareMeters} वर्ग मिटर</p>
            </div>
          )}

        {religiousPlace.architecturalStyle && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              वास्तुकला शैली
            </h3>
            <p>
              {getArchitecturalStyleLabel(religiousPlace.architecturalStyle)}
            </p>
          </div>
        )}

        {religiousPlace.constructionMaterial && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              निर्माण सामग्री
            </h3>
            <p>
              {getConstructionMaterialLabel(
                religiousPlace.constructionMaterial,
              )}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {religiousPlace.yearEstablished && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              स्थापना वर्ष
            </h3>
            <p>{religiousPlace.yearEstablished}</p>
          </div>
        )}

        {religiousPlace.yearRenovated && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              जीर्णोद्धार वर्ष
            </h3>
            <p>{religiousPlace.yearRenovated}</p>
          </div>
        )}
      </div>
    </div>
  );
}
