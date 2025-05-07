"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, InfoIcon, MapPin, Check, X, Sprout } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface GrazingAreaDetailsProps {
  grazingArea: any;
}

export function GrazingAreaDetails({ grazingArea }: GrazingAreaDetailsProps) {
  // Get grazing area type label
  const getGrazingAreaTypeLabel = (type: string) => {
    const types = {
      OPEN_RANGE: "खुल्ला चरन क्षेत्र",
      ALPINE_MEADOW: "हिमाली घाँसे मैदान",
      COMMUNITY_PASTURE: "सामुदायिक चरन",
      FOREST_UNDERSTORY: "वन मुनिको चरन क्षेत्र",
      FLOODPLAIN: "बाढी मैदान चरन",
      SEASONAL_PASTURE: "मौसमी चरन",
      DRY_SEASON_RESERVE: "सुख्खा मौसम आरक्षित क्षेत्र",
      ROTATIONAL_PADDOCK: "चक्रीय खर्क",
      MIXED: "मिश्रित",
      OTHER: "अन्य",
    };
    return types[type as keyof typeof types] || type;
  };

  // Get terrain type label
  const getTerrainTypeLabel = (terrain: string | null) => {
    if (!terrain) return "अज्ञात";

    const terrainTypes = {
      FLAT: "समतल",
      ROLLING: "घुम्ने/ओर्लोचढाइ",
      HILLY: "पहाडी",
      MOUNTAINOUS: "हिमाली",
      VALLEY: "उपत्यका",
      RIVERINE: "नदी किनार",
      MIXED: "मिश्रित",
    };
    return terrainTypes[terrain as keyof typeof terrainTypes] || terrain;
  };

  // Get ground cover label
  const getGroundCoverLabel = (cover: string | null) => {
    if (!cover) return "अज्ञात";

    const groundCovers = {
      PRIMARILY_GRASSES: "मुख्यतः घाँस",
      SHRUB_DOMINANT: "झाडी प्रमुख",
      MIXED_VEGETATION: "मिश्रित वनस्पति",
      FORBS_DOMINANT: "जडीबुटी प्रमुख",
      TREE_SCATTERED: "छरिएका रूख",
      DEGRADED: "बिग्रेको/नष्ट भएको",
    };
    return groundCovers[cover as keyof typeof groundCovers] || cover;
  };

  // Get accessibility label
  const getAccessibilityLabel = (access: string | null) => {
    if (!access) return "अज्ञात";

    const accessOptions = {
      EASILY_ACCESSIBLE: "सजिलै पहुँच योग्य",
      MODERATELY_ACCESSIBLE: "मध्यम पहुँच योग्य",
      DIFFICULT_ACCESS: "कठिन पहुँच",
      SEASONAL_ACCESS: "मौसमी पहुँच",
      REMOTE: "दुर्गम",
    };
    return accessOptions[access as keyof typeof accessOptions] || access;
  };

  // Get utilization level label
  const getUtilizationLevelLabel = (level: string | null) => {
    if (!level) return "अज्ञात";

    const utilizationLevels = {
      UNDERUTILIZED: "कम प्रयोगमा",
      OPTIMAL_USE: "उचित प्रयोगमा",
      OVERUTILIZED: "अति प्रयोगमा",
      SEVERELY_DEGRADED: "गम्भीर रूपमा बिग्रेको",
      PROTECTED: "संरक्षित",
    };
    return utilizationLevels[level as keyof typeof utilizationLevels] || level;
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
          {grazingArea.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                विवरण
              </h3>
              <p className="text-base">{grazingArea.description}</p>
            </div>
          )}

          {/* Grazing Area Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                चरन खर्क क्षेत्रको प्रकार
              </h3>
              <div>
                <Badge variant="outline" className="text-base font-normal">
                  {getGrazingAreaTypeLabel(grazingArea.type)}
                </Badge>
              </div>
            </div>

            {grazingArea.terrain && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  भू-बनोट
                </h3>
                <div>
                  <Badge variant="outline" className="text-base font-normal">
                    {getTerrainTypeLabel(grazingArea.terrain)}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {grazingArea.wardNumber && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  वडा नं.
                </h3>
                <p>{grazingArea.wardNumber}</p>
              </div>
            )}

            {grazingArea.location && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  ठाउँ/टोल
                </h3>
                <p>{grazingArea.location}</p>
              </div>
            )}

            {grazingArea.address && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  ठेगाना
                </h3>
                <p>{grazingArea.address}</p>
              </div>
            )}
          </div>

          {/* Physical Details */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-base font-medium">भौतिक विवरण</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {grazingArea.areaInHectares && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    क्षेत्रफल
                  </h3>
                  <p>{grazingArea.areaInHectares} हेक्टर</p>
                </div>
              )}

              {grazingArea.elevationInMeters && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    उचाई
                  </h3>
                  <p>{grazingArea.elevationInMeters} मिटर</p>
                </div>
              )}

              {grazingArea.accessibility && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    पहुँचयोग्यता
                  </h3>
                  <p>{getAccessibilityLabel(grazingArea.accessibility)}</p>
                </div>
              )}
            </div>

            {grazingArea.groundCover && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  जमिनको छोपनी
                </h3>
                <p>{getGroundCoverLabel(grazingArea.groundCover)}</p>
              </div>
            )}
          </div>

          {/* Grazing Details */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-base font-medium">चराई विवरण</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grazingArea.primaryLivestockType && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    मुख्य पशु प्रकार
                  </h3>
                  <p>{grazingArea.primaryLivestockType}</p>
                </div>
              )}

              {grazingArea.livestockCapacity !== null &&
                grazingArea.livestockCapacity !== undefined && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      पशु क्षमता
                    </h3>
                    <p>{grazingArea.livestockCapacity} पशुधन</p>
                  </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grazingArea.grazingSeasons && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    चराई मौसम
                  </h3>
                  <p>{grazingArea.grazingSeasons}</p>
                </div>
              )}

              {grazingArea.grazingDuration && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    चराई अवधि
                  </h3>
                  <p>{grazingArea.grazingDuration}</p>
                </div>
              )}
            </div>

            {grazingArea.utilizationLevel && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  उपयोग स्तर
                </h3>
                <p>{getUtilizationLevelLabel(grazingArea.utilizationLevel)}</p>
              </div>
            )}

            {grazingArea.rotationalSystem && (
              <div className="mt-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  चक्रीय प्रणाली
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>चक्रीय चरन प्रणाली प्रयोग गरिन्छ</span>
                </div>
                {grazingArea.restPeriod && (
                  <div className="mt-2 ml-6">
                    <p>
                      आराम अवधि: <span>{grazingArea.restPeriod}</span>
                    </p>
                  </div>
                )}
              </div>
            )}
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
                  {grazingArea.isGovernmentOwned ? "सरकारी" : "निजी"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grazingArea.ownerName && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    मालिकको नाम
                  </h3>
                  <p>{grazingArea.ownerName}</p>
                </div>
              )}

              {grazingArea.ownerContact && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    मालिकको सम्पर्क
                  </h3>
                  <p>{grazingArea.ownerContact}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grazingArea.caretakerName && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    हेरचाहकर्ताको नाम
                  </h3>
                  <p>{grazingArea.caretakerName}</p>
                </div>
              )}

              {grazingArea.caretakerContact && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    हेरचाहकर्ताको सम्पर्क
                  </h3>
                  <p>{grazingArea.caretakerContact}</p>
                </div>
              )}
            </div>

            {grazingArea.permitRequired && (
              <div className="space-y-2 mt-3">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <h3 className="text-sm font-medium">अनुमति आवश्यक</h3>
                </div>
                {grazingArea.permitInfo && <p>{grazingArea.permitInfo}</p>}
              </div>
            )}
          </div>

          {/* Water Resources */}
          {grazingArea.hasWaterSource && (
            <div className="space-y-3 pt-4 border-t">
              <h3 className="text-base font-medium">पानीको स्रोत</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {grazingArea.waterSourceTypes && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      पानीको स्रोतको प्रकार
                    </h3>
                    <p>{grazingArea.waterSourceTypes}</p>
                  </div>
                )}

                {grazingArea.waterAvailability && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      पानीको उपलब्धता
                    </h3>
                    <p>{grazingArea.waterAvailability}</p>
                  </div>
                )}

                {grazingArea.waterSourceDistance && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      पानीको स्रोतको दूरी
                    </h3>
                    <p>{grazingArea.waterSourceDistance} मिटर</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Infrastructure */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-base font-medium">पूर्वाधार विवरण</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                {grazingArea.hasFencing ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>बाडा तारबार</span>
              </div>

              <div className="flex items-center gap-2">
                {grazingArea.hasWindbreaks ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>हावा रोक्ने संरचना</span>
              </div>

              <div className="flex items-center gap-2">
                {grazingArea.hasShelters ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span>आश्रय स्थल</span>
              </div>
            </div>

            {grazingArea.infrastructureNotes && (
              <div className="space-y-2 mt-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  अतिरिक्त जानकारी
                </h3>
                <p>{grazingArea.infrastructureNotes}</p>
              </div>
            )}
          </div>

          {/* Health and Sustainability */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-base font-medium">स्वास्थ्य र दिगोपना</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grazingArea.invasiveSpecies && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    आक्रामक प्रजातिहरू
                  </h3>
                  <p>{grazingArea.invasiveSpecies}</p>
                </div>
              )}

              <div className="flex items-center gap-2">
                {grazingArea.erosionIssues ? (
                  <Check className="h-4 w-4 text-red-600" />
                ) : (
                  <X className="h-4 w-4 text-green-600" />
                )}
                <span>माटो क्षरण समस्या</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {grazingArea.conservationStatus && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    संरक्षण स्थिति
                  </h3>
                  <p>{grazingArea.conservationStatus}</p>
                </div>
              )}

              {grazingArea.restorationEfforts && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    पुनर्स्थापना प्रयासहरू
                  </h3>
                  <p>{grazingArea.restorationEfforts}</p>
                </div>
              )}
            </div>
          </div>

          {/* Cultural Significance */}
          {(grazingArea.traditionalUse || grazingArea.culturalSignificance) && (
            <div className="space-y-3 pt-4 border-t">
              <h3 className="text-base font-medium">सांस्कृतिक महत्त्व</h3>

              {grazingArea.traditionalUse && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    परम्परागत उपयोग
                  </h3>
                  <p>{grazingArea.traditionalUse}</p>
                </div>
              )}

              {grazingArea.culturalSignificance && (
                <div className="space-y-2 mt-3">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    सांस्कृतिक महत्त्व
                  </h3>
                  <p>{grazingArea.culturalSignificance}</p>
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
                <span>{formatDate(grazingArea.createdAt)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                अपडेट मिति
              </h3>
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(grazingArea.updatedAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Information */}
      {(grazingArea.metaTitle ||
        grazingArea.metaDescription ||
        grazingArea.keywords) && (
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
            {grazingArea.metaTitle && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Meta Title
                </h3>
                <p>{grazingArea.metaTitle}</p>
              </div>
            )}
            {grazingArea.metaDescription && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Meta Description
                </h3>
                <p>{grazingArea.metaDescription}</p>
              </div>
            )}
            {grazingArea.keywords && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Keywords
                </h3>
                <p>{grazingArea.keywords}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
