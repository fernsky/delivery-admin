"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormData {
  // Physical infrastructure
  totalBuildingCount?: number;
  hasMainHall?: boolean;
  mainHallCapacity?: number;
  hasCommunitySpace?: boolean;
  hasAccommodation?: boolean;
  accommodationCapacity?: number;
  hasKitchen?: boolean;
  hasDiningHall?: boolean;
  diningCapacity?: number;
  hasLibrary?: boolean;
  hasMuseum?: boolean;

  // Facilities and amenities
  hasParking?: boolean;
  parkingCapacity?: number;
  hasToilets?: boolean;
  hasHandicapAccess?: boolean;
  hasElectricity?: boolean;
  hasWaterSupply?: boolean;
  hasDrinkingWater?: boolean;
  hasFootwear?: boolean;
  hasClothStorage?: boolean;

  // Artworks and treasures
  hasSignificantArtwork?: boolean;
  artworkDetails?: string;
  hasHistoricalArtifacts?: boolean;
  artifactsDetails?: string;
  hasRegisteredTreasures?: boolean;
  treasureDetails?: string;

  // Safety and security
  hasSecurityPersonnel?: boolean;
  hasCCTV?: boolean;
  hasFireSafety?: boolean;
  disasterPreparedness?: string;
  [key: string]: any;
}

interface InfrastructureDetailsProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
}

export default function InfrastructureDetails({
  formData,
  updateFormData,
}: InfrastructureDetailsProps) {
  const t = useTranslations("ReligiousPlaces");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("create.infrastructure.buildingsTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="totalBuildingCount">
              {t("create.infrastructure.totalBuildingCount")}
            </Label>
            <Input
              id="totalBuildingCount"
              type="number"
              min="0"
              value={formData.totalBuildingCount || ""}
              onChange={(e) =>
                updateFormData(
                  "totalBuildingCount",
                  parseInt(e.target.value) || undefined,
                )
              }
              placeholder={t(
                "create.infrastructure.totalBuildingCountPlaceholder",
              )}
              className="mt-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="hasMainHall"
              checked={formData.hasMainHall || false}
              onCheckedChange={(checked) =>
                updateFormData("hasMainHall", checked)
              }
            />
            <Label htmlFor="hasMainHall">
              {t("create.infrastructure.hasMainHall")}
            </Label>
          </div>

          {formData.hasMainHall && (
            <div>
              <Label htmlFor="mainHallCapacity">
                {t("create.infrastructure.mainHallCapacity")}
              </Label>
              <Input
                id="mainHallCapacity"
                type="number"
                min="0"
                value={formData.mainHallCapacity || ""}
                onChange={(e) =>
                  updateFormData(
                    "mainHallCapacity",
                    parseInt(e.target.value) || undefined,
                  )
                }
                placeholder={t(
                  "create.infrastructure.mainHallCapacityPlaceholder",
                )}
                className="mt-1"
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="hasCommunitySpace"
              checked={formData.hasCommunitySpace || false}
              onCheckedChange={(checked) =>
                updateFormData("hasCommunitySpace", checked)
              }
            />
            <Label htmlFor="hasCommunitySpace">
              {t("create.infrastructure.hasCommunitySpace")}
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="hasAccommodation"
              checked={formData.hasAccommodation || false}
              onCheckedChange={(checked) =>
                updateFormData("hasAccommodation", checked)
              }
            />
            <Label htmlFor="hasAccommodation">
              {t("create.infrastructure.hasAccommodation")}
            </Label>
          </div>

          {formData.hasAccommodation && (
            <div>
              <Label htmlFor="accommodationCapacity">
                {t("create.infrastructure.accommodationCapacity")}
              </Label>
              <Input
                id="accommodationCapacity"
                type="number"
                min="0"
                value={formData.accommodationCapacity || ""}
                onChange={(e) =>
                  updateFormData(
                    "accommodationCapacity",
                    parseInt(e.target.value) || undefined,
                  )
                }
                placeholder={t(
                  "create.infrastructure.accommodationCapacityPlaceholder",
                )}
                className="mt-1"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="hasKitchen"
                checked={formData.hasKitchen || false}
                onCheckedChange={(checked) =>
                  updateFormData("hasKitchen", checked)
                }
              />
              <Label htmlFor="hasKitchen">
                {t("create.infrastructure.hasKitchen")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="hasDiningHall"
                checked={formData.hasDiningHall || false}
                onCheckedChange={(checked) =>
                  updateFormData("hasDiningHall", checked)
                }
              />
              <Label htmlFor="hasDiningHall">
                {t("create.infrastructure.hasDiningHall")}
              </Label>
            </div>
          </div>

          {formData.hasDiningHall && (
            <div>
              <Label htmlFor="diningCapacity">
                {t("create.infrastructure.diningCapacity")}
              </Label>
              <Input
                id="diningCapacity"
                type="number"
                min="0"
                value={formData.diningCapacity || ""}
                onChange={(e) =>
                  updateFormData(
                    "diningCapacity",
                    parseInt(e.target.value) || undefined,
                  )
                }
                placeholder={t(
                  "create.infrastructure.diningCapacityPlaceholder",
                )}
                className="mt-1"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="hasLibrary"
                checked={formData.hasLibrary || false}
                onCheckedChange={(checked) =>
                  updateFormData("hasLibrary", checked)
                }
              />
              <Label htmlFor="hasLibrary">
                {t("create.infrastructure.hasLibrary")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="hasMuseum"
                checked={formData.hasMuseum || false}
                onCheckedChange={(checked) =>
                  updateFormData("hasMuseum", checked)
                }
              />
              <Label htmlFor="hasMuseum">
                {t("create.infrastructure.hasMuseum")}
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("create.infrastructure.facilitiesTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="hasParking"
                checked={formData.hasParking || false}
                onCheckedChange={(checked) =>
                  updateFormData("hasParking", checked)
                }
              />
              <Label htmlFor="hasParking">
                {t("create.infrastructure.hasParking")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="hasToilets"
                checked={formData.hasToilets || false}
                onCheckedChange={(checked) =>
                  updateFormData("hasToilets", checked)
                }
              />
              <Label htmlFor="hasToilets">
                {t("create.infrastructure.hasToilets")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="hasHandicapAccess"
                checked={formData.hasHandicapAccess || false}
                onCheckedChange={(checked) =>
                  updateFormData("hasHandicapAccess", checked)
                }
              />
              <Label htmlFor="hasHandicapAccess">
                {t("create.infrastructure.hasHandicapAccess")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="hasElectricity"
                checked={
                  formData.hasElectricity !== undefined
                    ? formData.hasElectricity
                    : true
                }
                onCheckedChange={(checked) =>
                  updateFormData("hasElectricity", checked)
                }
              />
              <Label htmlFor="hasElectricity">
                {t("create.infrastructure.hasElectricity")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="hasWaterSupply"
                checked={
                  formData.hasWaterSupply !== undefined
                    ? formData.hasWaterSupply
                    : true
                }
                onCheckedChange={(checked) =>
                  updateFormData("hasWaterSupply", checked)
                }
              />
              <Label htmlFor="hasWaterSupply">
                {t("create.infrastructure.hasWaterSupply")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="hasDrinkingWater"
                checked={formData.hasDrinkingWater || false}
                onCheckedChange={(checked) =>
                  updateFormData("hasDrinkingWater", checked)
                }
              />
              <Label htmlFor="hasDrinkingWater">
                {t("create.infrastructure.hasDrinkingWater")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="hasFootwear"
                checked={formData.hasFootwear || false}
                onCheckedChange={(checked) =>
                  updateFormData("hasFootwear", checked)
                }
              />
              <Label htmlFor="hasFootwear">
                {t("create.infrastructure.hasFootwear")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="hasClothStorage"
                checked={formData.hasClothStorage || false}
                onCheckedChange={(checked) =>
                  updateFormData("hasClothStorage", checked)
                }
              />
              <Label htmlFor="hasClothStorage">
                {t("create.infrastructure.hasClothStorage")}
              </Label>
            </div>
          </div>

          {formData.hasParking && (
            <div className="mt-4">
              <Label htmlFor="parkingCapacity">
                {t("create.infrastructure.parkingCapacity")}
              </Label>
              <Input
                id="parkingCapacity"
                type="number"
                min="0"
                value={formData.parkingCapacity || ""}
                onChange={(e) =>
                  updateFormData(
                    "parkingCapacity",
                    parseInt(e.target.value) || undefined,
                  )
                }
                placeholder={t(
                  "create.infrastructure.parkingCapacityPlaceholder",
                )}
                className="mt-1"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("create.infrastructure.treasuresTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="hasSignificantArtwork"
              checked={formData.hasSignificantArtwork || false}
              onCheckedChange={(checked) =>
                updateFormData("hasSignificantArtwork", checked)
              }
            />
            <Label htmlFor="hasSignificantArtwork">
              {t("create.infrastructure.hasSignificantArtwork")}
            </Label>
          </div>

          {formData.hasSignificantArtwork && (
            <div>
              <Label htmlFor="artworkDetails">
                {t("create.infrastructure.artworkDetails")}
              </Label>
              <Input
                id="artworkDetails"
                value={formData.artworkDetails || ""}
                onChange={(e) =>
                  updateFormData("artworkDetails", e.target.value)
                }
                placeholder={t(
                  "create.infrastructure.artworkDetailsPlaceholder",
                )}
                className="mt-1"
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="hasHistoricalArtifacts"
              checked={formData.hasHistoricalArtifacts || false}
              onCheckedChange={(checked) =>
                updateFormData("hasHistoricalArtifacts", checked)
              }
            />
            <Label htmlFor="hasHistoricalArtifacts">
              {t("create.infrastructure.hasHistoricalArtifacts")}
            </Label>
          </div>

          {formData.hasHistoricalArtifacts && (
            <div>
              <Label htmlFor="artifactsDetails">
                {t("create.infrastructure.artifactsDetails")}
              </Label>
              <Input
                id="artifactsDetails"
                value={formData.artifactsDetails || ""}
                onChange={(e) =>
                  updateFormData("artifactsDetails", e.target.value)
                }
                placeholder={t(
                  "create.infrastructure.artifactsDetailsPlaceholder",
                )}
                className="mt-1"
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="hasRegisteredTreasures"
              checked={formData.hasRegisteredTreasures || false}
              onCheckedChange={(checked) =>
                updateFormData("hasRegisteredTreasures", checked)
              }
            />
            <Label htmlFor="hasRegisteredTreasures">
              {t("create.infrastructure.hasRegisteredTreasures")}
            </Label>
          </div>

          {formData.hasRegisteredTreasures && (
            <div>
              <Label htmlFor="treasureDetails">
                {t("create.infrastructure.treasureDetails")}
              </Label>
              <Input
                id="treasureDetails"
                value={formData.treasureDetails || ""}
                onChange={(e) =>
                  updateFormData("treasureDetails", e.target.value)
                }
                placeholder={t(
                  "create.infrastructure.treasureDetailsPlaceholder",
                )}
                className="mt-1"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("create.infrastructure.securityTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="hasSecurityPersonnel"
                checked={formData.hasSecurityPersonnel || false}
                onCheckedChange={(checked) =>
                  updateFormData("hasSecurityPersonnel", checked)
                }
              />
              <Label htmlFor="hasSecurityPersonnel">
                {t("create.infrastructure.hasSecurityPersonnel")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="hasCCTV"
                checked={formData.hasCCTV || false}
                onCheckedChange={(checked) =>
                  updateFormData("hasCCTV", checked)
                }
              />
              <Label htmlFor="hasCCTV">
                {t("create.infrastructure.hasCCTV")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="hasFireSafety"
                checked={formData.hasFireSafety || false}
                onCheckedChange={(checked) =>
                  updateFormData("hasFireSafety", checked)
                }
              />
              <Label htmlFor="hasFireSafety">
                {t("create.infrastructure.hasFireSafety")}
              </Label>
            </div>
          </div>

          <div>
            <Label htmlFor="disasterPreparedness">
              {t("create.infrastructure.disasterPreparedness")}
            </Label>
            <Input
              id="disasterPreparedness"
              value={formData.disasterPreparedness || ""}
              onChange={(e) =>
                updateFormData("disasterPreparedness", e.target.value)
              }
              placeholder={t(
                "create.infrastructure.disasterPreparednessPlaceholder",
              )}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
