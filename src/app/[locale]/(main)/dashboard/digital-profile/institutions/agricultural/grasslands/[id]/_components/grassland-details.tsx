"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  InfoIcon,
  MapPin,
  Check,
  X,
  GrassIcon,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface GrasslandDetailsProps {
  grassland: any;
}

export function GrasslandDetails({ grassland }: GrasslandDetailsProps) {
  // Get grassland type label
  const getGrasslandTypeLabel = (type: string) => {
    const types = {
      NATURAL_MEADOW: "प्राकृतिक घाँसे मैदान",
      IMPROVED_PASTURE: "सुधारिएको चरन क्षेत्र",
      RANGELAND: "रेञ्जल्याण्ड",
      SILVOPASTURE: "वन चरन (रूख र घाँस मिश्रित)",
      WETLAND_GRAZING: "सिमसार चरन क्षेत्र",
      ALPINE_GRASSLAND: "हिमाली घाँसे मैदान",
      COMMON_GRAZING_LAND: "सामुदायिक चरन क्षेत्र",
      OTHER: "अन्य",
    };
    return types[type as keyof typeof types] || type;
  };

  // Get vegetation density label
  const getVegetationDensityLabel = (density: string | null) => {
    if (!density) return "अज्ञात";

    const densities = {
      VERY_DENSE: "अति घना",
      DENSE: "घना",
      MODERATE: "मध्यम",
      SPARSE: "पातलो",
      VERY_SPARSE: "अति पातलो",
    };
    return densities[density as keyof typeof densities] || density;
  };

  // Get management type label
  const getManagementTypeLabel = (type: string | null) => {
    if (!type) return "अज्ञात";

    const types = {
      ROTATIONAL_GRAZING: "चक्रीय चराई",
      CONTINUOUS_GRAZING: "निरन्तर चराई",
      DEFERRED_GRAZING: "विलम्बित चराई",
      HAY_PRODUCTION: "घाँस उत्पादन",
      CONSERVATION: "संरक्षण",
      UNMANAGED: "अव्यवस्थित",
      MIXED: "मिश्रित",
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <div className="space-y-6">
      {/* Main Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <InfoIcon className="h-5 w-5 text-muted-foreground" />
            आधारभूत जानकारी
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* Description */}
          {grassland.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                विवरण
              </h3>
              <p className="text-base">{grassland.description}</p>
            </div>
          )}

          {/* Grassland Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                चरन क्षेत्रको प्रकार
              </h3>
              <div>
                <Badge variant="outline" className="text-base font-normal">
                  {getGrasslandTypeLabel(grassland.type)}
                </Badge>
              </div>
            </div>

            {grassland.vegetationDensity && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  वनस्पति घनत्व
                </h3>
                <div>
                  <Badge
                    variant="outline"
                    className={`text-base font-normal ${
                      grassland.vegetationDensity === "VERY_DENSE" ||
                      grassland.vegetationDensity === "DENSE"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : grassland.vegetationDensity === "MODERATE"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {getVegetationDensityLabel(grassland.vegetationDensity)}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {grassland.wardNumber && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  वडा नं.
                </h3>
                <p>{grassland.wardNumber}</p>
              </div>
            )}

            {grassland.location && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  ठाउँ/टोल
                </h3>
                <p>{grassland.location}</p>
              </div>
            )}

            {grassland.address && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  ठेगाना
                </h3>
                <p>{grassland.address}</p>
              </div>
            )}
          </div>

          {/* Physical Details */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-base font-medium">भौतिक विवरण</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {grassland.areaInHectares && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    क्षेत्रफल
                  </h3>
                  <p>{grassland.areaInHectares} हेक्टर</p>
                </div>
              )}

              {grassland.elevationInMeters && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    उचाई
                  </h3>
                  <p>{grassland.elevationInMeters} मिटर</p>
                </div>
              )}

              {grassland.managementType && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    व्यवस्थापन प्रकार
                  </h3>
                  <p>{getManagementTypeLabel(grassland.managementType)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Grassland Details */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-base font-medium">चरन विवरण</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grassland.dominantSpecies && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    प्रमुख घाँसका प्रजातिहरू
                  </h3>
                  <p>{grassland.dominantSpecies}</p>
                </div>
              )}

              {grassland.grazingPeriod && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    चराई अवधि
                  </h3>
                  <p>{grassland.grazingPeriod}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {grassland.carryingCapacity !== null &&
                grassland.carryingCapacity !== undefined && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      वहन क्षमता
                    </h3>
                    <p>{grassland.carryingCapacity} पशुधन एकाई प्रति हेक्टर</p>
                  </div>
                )}

              {grassland.annualFodderYield && grassland.yieldYear && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    वार्षिक उत्पादन
                  </h3>
                  <p>
                    {grassland.annualFodderYield} मेट्रिक टन (
                    {grassland.yieldYear})
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Management Details */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-base font-medium">व्यवस्थापन विवरण</h3>

            <div>
              <div className="space-y-2 mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  स्वामित्व
                </h3>
                <Badge variant="outline">
                  {grassland.isGovernmentOwned ? "सरकारी" : "निजी"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grassland.ownerName && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    मालिकको नाम
                  </h3>
                  <p>{grassland.ownerName}</p>
                </div>
              )}

              {grassland.ownerContact && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    मालिकको सम्पर्क
                  </h3>
                  <p>{grassland.ownerContact}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grassland.caretakerName && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    हेरचाहकर्ताको नाम
                  </h3>
                  <p>{grassland.caretakerName}</p>
                </div>
              )}

              {grassland.caretakerContact && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    हेरचाहकर्ताको सम्पर्क
                  </h3>
                  <p>{grassland.caretakerContact}</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Features */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-base font-medium">थप विशेषताहरू</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                {grassland.hasWaterSource ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>पानीको स्रोत</span>
              </div>

              <div className="flex items-center gap-2">
                {grassland.isFenced ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>बाडा लगाइएको</span>
              </div>

              <div className="flex items-center gap-2">
                {grassland.hasGrazingRights ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>चराई अधिकार</span>
              </div>
            </div>

            {grassland.hasWaterSource && grassland.waterSourceType && (
              <div className="mt-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  पानीको स्रोतको प्रकार
                </h3>
                <p>{grassland.waterSourceType}</p>
              </div>
            )}
          </div>

          {/* Conservation Status */}
          {grassland.hasProtectedStatus && (
            <div className="space-y-3 pt-4 border-t">
              <h3 className="text-base font-medium">संरक्षण अवस्था</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {grassland.protectionType && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      संरक्षणको प्रकार
                    </h3>
                    <p>{grassland.protectionType}</p>
                  </div>
                )}
              </div>

              {grassland.biodiversityValue && (
                <div className="space-y-2 mt-3">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    जैविक विविधता मूल्य
                  </h3>
                  <p>{grassland.biodiversityValue}</p>
                </div>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                सिर्जना मिति
              </h3>
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(grassland.createdAt)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                अपडेट मिति
              </h3>
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(grassland.updatedAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Information */}
      {(grassland.metaTitle ||
        grassland.metaDescription ||
        grassland.keywords) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <path d="M4 11h16"></path>
                <path d="M4 7h16"></path>
                <path d="M4 15h16"></path>
              </svg>
              SEO जानकारी
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {grassland.metaTitle && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Meta Title
                </h3>
                <p>{grassland.metaTitle}</p>
              </div>
            )}
            {grassland.metaDescription && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Meta Description
                </h3>
                <p>{grassland.metaDescription}</p>
              </div>
            )}
            {grassland.keywords && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Keywords
                </h3>
                <p>{grassland.keywords}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
