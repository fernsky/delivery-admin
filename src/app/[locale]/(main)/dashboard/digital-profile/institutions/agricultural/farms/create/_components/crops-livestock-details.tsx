"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface FormData {
  // Land details
  soilType?: string;
  irrigationType?: string;
  irrigationSourceDetails?: string;
  irrigatedAreaInHectares?: number;

  // Crop details
  mainCrops?: string;
  secondaryCrops?: string;
  cropRotation?: boolean;
  cropRotationDetails?: string;
  intercropping?: boolean;
  croppingSeasons?: string;
  annualCropYieldMT?: number;
  recordedYearCrops?: string;

  // Livestock details
  hasLivestock?: boolean;
  livestockTypes?: string;
  cattleCount?: number;
  buffaloCount?: number;
  goatCount?: number;
  sheepCount?: number;
  pigCount?: number;
  poultryCount?: number;
  otherLivestockCount?: number;
  otherLivestockDetails?: string;
  livestockHousingType?: string;
  livestockManagementDetails?: string;
  annualMilkProductionLiters?: number;
  annualEggProduction?: number;
  annualMeatProductionKg?: number;
  recordedYearLivestock?: string;
  [key: string]: any;
}

interface CropsAndLivestockDetailsProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
}

export default function CropsAndLivestockDetails({
  formData,
  updateFormData,
}: CropsAndLivestockDetailsProps) {
  const t = useTranslations("Farms");
  const currentYear = new Date().getFullYear();

  // Generate last 10 years for dropdown
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-8">
      {/* Land Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t("create.land.title")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="soilType">{t("create.land.soilType")}</Label>
            <Select
              value={formData.soilType || ""}
              onValueChange={(value) => updateFormData("soilType", value)}
            >
              <SelectTrigger id="soilType" className="mt-1">
                <SelectValue
                  placeholder={t("create.land.soilTypePlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CLAY">{t("soilTypes.CLAY")}</SelectItem>
                <SelectItem value="SANDY">{t("soilTypes.SANDY")}</SelectItem>
                <SelectItem value="LOAM">{t("soilTypes.LOAM")}</SelectItem>
                <SelectItem value="SILT">{t("soilTypes.SILT")}</SelectItem>
                <SelectItem value="CLAY_LOAM">
                  {t("soilTypes.CLAY_LOAM")}
                </SelectItem>
                <SelectItem value="SANDY_LOAM">
                  {t("soilTypes.SANDY_LOAM")}
                </SelectItem>
                <SelectItem value="SILTY_CLAY">
                  {t("soilTypes.SILTY_CLAY")}
                </SelectItem>
                <SelectItem value="ROCKY">{t("soilTypes.ROCKY")}</SelectItem>
                <SelectItem value="PEATY">{t("soilTypes.PEATY")}</SelectItem>
                <SelectItem value="CHALKY">{t("soilTypes.CHALKY")}</SelectItem>
                <SelectItem value="MIXED">{t("soilTypes.MIXED")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="irrigationType">
              {t("create.land.irrigationType")}
            </Label>
            <Select
              value={formData.irrigationType || ""}
              onValueChange={(value) => updateFormData("irrigationType", value)}
            >
              <SelectTrigger id="irrigationType" className="mt-1">
                <SelectValue
                  placeholder={t("create.land.irrigationTypePlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RAINFED">
                  {t("irrigationTypes.RAINFED")}
                </SelectItem>
                <SelectItem value="CANAL">
                  {t("irrigationTypes.CANAL")}
                </SelectItem>
                <SelectItem value="DRIP">
                  {t("irrigationTypes.DRIP")}
                </SelectItem>
                <SelectItem value="SPRINKLER">
                  {t("irrigationTypes.SPRINKLER")}
                </SelectItem>
                <SelectItem value="FLOOD">
                  {t("irrigationTypes.FLOOD")}
                </SelectItem>
                <SelectItem value="GROUNDWATER">
                  {t("irrigationTypes.GROUNDWATER")}
                </SelectItem>
                <SelectItem value="RAINWATER_HARVESTING">
                  {t("irrigationTypes.RAINWATER_HARVESTING")}
                </SelectItem>
                <SelectItem value="NONE">
                  {t("irrigationTypes.NONE")}
                </SelectItem>
                <SelectItem value="MIXED">
                  {t("irrigationTypes.MIXED")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="irrigationSourceDetails">
              {t("create.land.irrigationSourceDetails")}
            </Label>
            <Input
              id="irrigationSourceDetails"
              value={formData.irrigationSourceDetails || ""}
              onChange={(e) =>
                updateFormData("irrigationSourceDetails", e.target.value)
              }
              placeholder={t("create.land.irrigationSourceDetailsPlaceholder")}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="irrigatedAreaInHectares">
              {t("create.land.irrigatedAreaInHectares")}
            </Label>
            <Input
              id="irrigatedAreaInHectares"
              type="number"
              step="0.01"
              min="0"
              value={formData.irrigatedAreaInHectares || ""}
              onChange={(e) =>
                updateFormData(
                  "irrigatedAreaInHectares",
                  parseFloat(e.target.value) || null,
                )
              }
              placeholder={t("create.land.irrigatedAreaInHectaresPlaceholder")}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Crop Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t("create.crops.title")}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mainCrops">{t("create.crops.mainCrops")}</Label>
            <Input
              id="mainCrops"
              value={formData.mainCrops || ""}
              onChange={(e) => updateFormData("mainCrops", e.target.value)}
              placeholder={t("create.crops.mainCropsPlaceholder")}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="secondaryCrops">
              {t("create.crops.secondaryCrops")}
            </Label>
            <Input
              id="secondaryCrops"
              value={formData.secondaryCrops || ""}
              onChange={(e) => updateFormData("secondaryCrops", e.target.value)}
              placeholder={t("create.crops.secondaryCropsPlaceholder")}
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="croppingSeasons">
              {t("create.crops.croppingSeasons")}
            </Label>
            <Input
              id="croppingSeasons"
              value={formData.croppingSeasons || ""}
              onChange={(e) =>
                updateFormData("croppingSeasons", e.target.value)
              }
              placeholder={t("create.crops.croppingSeasonsPlaceholder")}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="annualCropYieldMT">
              {t("create.crops.annualCropYieldMT")}
            </Label>
            <Input
              id="annualCropYieldMT"
              type="number"
              step="0.01"
              min="0"
              value={formData.annualCropYieldMT || ""}
              onChange={(e) =>
                updateFormData(
                  "annualCropYieldMT",
                  parseFloat(e.target.value) || null,
                )
              }
              placeholder={t("create.crops.annualCropYieldMTPlaceholder")}
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="cropRotation"
                checked={formData.cropRotation || false}
                onCheckedChange={(checked) =>
                  updateFormData("cropRotation", checked)
                }
              />
              <Label htmlFor="cropRotation">
                {t("create.crops.cropRotation")}
              </Label>
            </div>
            {formData.cropRotation && (
              <Textarea
                id="cropRotationDetails"
                value={formData.cropRotationDetails || ""}
                onChange={(e) =>
                  updateFormData("cropRotationDetails", e.target.value)
                }
                placeholder={t("create.crops.cropRotationDetailsPlaceholder")}
                className="min-h-[80px]"
              />
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="intercropping"
                checked={formData.intercropping || false}
                onCheckedChange={(checked) =>
                  updateFormData("intercropping", checked)
                }
              />
              <Label htmlFor="intercropping">
                {t("create.crops.intercropping")}
              </Label>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="recordedYearCrops">
            {t("create.crops.recordedYearCrops")}
          </Label>
          <Select
            value={formData.recordedYearCrops || ""}
            onValueChange={(value) =>
              updateFormData("recordedYearCrops", value)
            }
          >
            <SelectTrigger
              id="recordedYearCrops"
              className="mt-1 w-full md:w-1/4"
            >
              <SelectValue
                placeholder={t("create.crops.recordedYearCropsPlaceholder")}
              />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={`crop-year-${year}`} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Livestock Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{t("create.livestock.title")}</h3>
          <div className="flex items-center space-x-2">
            <Switch
              id="hasLivestock"
              checked={formData.hasLivestock || false}
              onCheckedChange={(checked) =>
                updateFormData("hasLivestock", checked)
              }
            />
            <Label htmlFor="hasLivestock">
              {t("create.livestock.hasLivestock")}
            </Label>
          </div>
        </div>

        {formData.hasLivestock && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="livestockTypes">
                {t("create.livestock.livestockTypes")}
              </Label>
              <Input
                id="livestockTypes"
                value={formData.livestockTypes || ""}
                onChange={(e) =>
                  updateFormData("livestockTypes", e.target.value)
                }
                placeholder={t("create.livestock.livestockTypesPlaceholder")}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cattleCount">
                  {t("create.livestock.cattleCount")}
                </Label>
                <Input
                  id="cattleCount"
                  type="number"
                  min="0"
                  value={formData.cattleCount || ""}
                  onChange={(e) =>
                    updateFormData(
                      "cattleCount",
                      parseInt(e.target.value) || null,
                    )
                  }
                  placeholder="0"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="buffaloCount">
                  {t("create.livestock.buffaloCount")}
                </Label>
                <Input
                  id="buffaloCount"
                  type="number"
                  min="0"
                  value={formData.buffaloCount || ""}
                  onChange={(e) =>
                    updateFormData(
                      "buffaloCount",
                      parseInt(e.target.value) || null,
                    )
                  }
                  placeholder="0"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="goatCount">
                  {t("create.livestock.goatCount")}
                </Label>
                <Input
                  id="goatCount"
                  type="number"
                  min="0"
                  value={formData.goatCount || ""}
                  onChange={(e) =>
                    updateFormData(
                      "goatCount",
                      parseInt(e.target.value) || null,
                    )
                  }
                  placeholder="0"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="sheepCount">
                  {t("create.livestock.sheepCount")}
                </Label>
                <Input
                  id="sheepCount"
                  type="number"
                  min="0"
                  value={formData.sheepCount || ""}
                  onChange={(e) =>
                    updateFormData(
                      "sheepCount",
                      parseInt(e.target.value) || null,
                    )
                  }
                  placeholder="0"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="pigCount">
                  {t("create.livestock.pigCount")}
                </Label>
                <Input
                  id="pigCount"
                  type="number"
                  min="0"
                  value={formData.pigCount || ""}
                  onChange={(e) =>
                    updateFormData("pigCount", parseInt(e.target.value) || null)
                  }
                  placeholder="0"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="poultryCount">
                  {t("create.livestock.poultryCount")}
                </Label>
                <Input
                  id="poultryCount"
                  type="number"
                  min="0"
                  value={formData.poultryCount || ""}
                  onChange={(e) =>
                    updateFormData(
                      "poultryCount",
                      parseInt(e.target.value) || null,
                    )
                  }
                  placeholder="0"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="otherLivestockCount">
                  {t("create.livestock.otherLivestockCount")}
                </Label>
                <Input
                  id="otherLivestockCount"
                  type="number"
                  min="0"
                  value={formData.otherLivestockCount || ""}
                  onChange={(e) =>
                    updateFormData(
                      "otherLivestockCount",
                      parseInt(e.target.value) || null,
                    )
                  }
                  placeholder="0"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="otherLivestockDetails">
                  {t("create.livestock.otherLivestockDetails")}
                </Label>
                <Input
                  id="otherLivestockDetails"
                  value={formData.otherLivestockDetails || ""}
                  onChange={(e) =>
                    updateFormData("otherLivestockDetails", e.target.value)
                  }
                  placeholder={t(
                    "create.livestock.otherLivestockDetailsPlaceholder",
                  )}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="livestockHousingType">
                {t("create.livestock.livestockHousingType")}
              </Label>
              <Select
                value={formData.livestockHousingType || ""}
                onValueChange={(value) =>
                  updateFormData("livestockHousingType", value)
                }
              >
                <SelectTrigger id="livestockHousingType" className="mt-1">
                  <SelectValue
                    placeholder={t(
                      "create.livestock.livestockHousingTypePlaceholder",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN_SHED">
                    {t("livestockHousing.OPEN_SHED")}
                  </SelectItem>
                  <SelectItem value="BARN">
                    {t("livestockHousing.BARN")}
                  </SelectItem>
                  <SelectItem value="FREE_STALL">
                    {t("livestockHousing.FREE_STALL")}
                  </SelectItem>
                  <SelectItem value="TIE_STALL">
                    {t("livestockHousing.TIE_STALL")}
                  </SelectItem>
                  <SelectItem value="DEEP_LITTER">
                    {t("livestockHousing.DEEP_LITTER")}
                  </SelectItem>
                  <SelectItem value="CAGE_SYSTEM">
                    {t("livestockHousing.CAGE_SYSTEM")}
                  </SelectItem>
                  <SelectItem value="FREE_RANGE">
                    {t("livestockHousing.FREE_RANGE")}
                  </SelectItem>
                  <SelectItem value="MOVABLE_PEN">
                    {t("livestockHousing.MOVABLE_PEN")}
                  </SelectItem>
                  <SelectItem value="ZERO_GRAZING">
                    {t("livestockHousing.ZERO_GRAZING")}
                  </SelectItem>
                  <SelectItem value="MIXED">
                    {t("livestockHousing.MIXED")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="livestockManagementDetails">
                {t("create.livestock.livestockManagementDetails")}
              </Label>
              <Textarea
                id="livestockManagementDetails"
                value={formData.livestockManagementDetails || ""}
                onChange={(e) =>
                  updateFormData("livestockManagementDetails", e.target.value)
                }
                placeholder={t(
                  "create.livestock.livestockManagementDetailsPlaceholder",
                )}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="annualMilkProductionLiters">
                  {t("create.livestock.annualMilkProductionLiters")}
                </Label>
                <Input
                  id="annualMilkProductionLiters"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.annualMilkProductionLiters || ""}
                  onChange={(e) =>
                    updateFormData(
                      "annualMilkProductionLiters",
                      parseFloat(e.target.value) || null,
                    )
                  }
                  placeholder="0"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="annualEggProduction">
                  {t("create.livestock.annualEggProduction")}
                </Label>
                <Input
                  id="annualEggProduction"
                  type="number"
                  min="0"
                  value={formData.annualEggProduction || ""}
                  onChange={(e) =>
                    updateFormData(
                      "annualEggProduction",
                      parseInt(e.target.value) || null,
                    )
                  }
                  placeholder="0"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="annualMeatProductionKg">
                  {t("create.livestock.annualMeatProductionKg")}
                </Label>
                <Input
                  id="annualMeatProductionKg"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.annualMeatProductionKg || ""}
                  onChange={(e) =>
                    updateFormData(
                      "annualMeatProductionKg",
                      parseFloat(e.target.value) || null,
                    )
                  }
                  placeholder="0"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="recordedYearLivestock">
                {t("create.livestock.recordedYearLivestock")}
              </Label>
              <Select
                value={formData.recordedYearLivestock || ""}
                onValueChange={(value) =>
                  updateFormData("recordedYearLivestock", value)
                }
              >
                <SelectTrigger
                  id="recordedYearLivestock"
                  className="mt-1 w-full md:w-1/4"
                >
                  <SelectValue
                    placeholder={t(
                      "create.livestock.recordedYearLivestockPlaceholder",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem
                      key={`livestock-year-${year}`}
                      value={year.toString()}
                    >
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
