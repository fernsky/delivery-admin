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

interface FormData {
  totalAreaInHectares?: number;
  waterSurfaceAreaInHectares?: number;
  totalPondCount?: number;
  activePondCount?: number;
  averagePondSizeInSquareMeters?: number;
  averageWaterDepthInMeters?: number;
  totalWaterVolumeInCubicMeters?: number;
  waterSource?: string;
  waterSourceDetails?: string;
  waterAvailabilityIssues?: string;
  hasWaterQualityMonitoring?: boolean;
  waterQualityParameters?: string;
  [key: string]: any;
}

interface WaterBodyDetailsProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
}

export default function WaterBodyDetails({
  formData,
  updateFormData,
}: WaterBodyDetailsProps) {
  const t = useTranslations("FishFarms");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("create.waterBody.title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("create.waterBody.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="totalAreaInHectares">
            {t("create.waterBody.totalAreaInHectares")}
          </Label>
          <Input
            id="totalAreaInHectares"
            type="number"
            step="0.01"
            min="0"
            value={formData.totalAreaInHectares || ""}
            onChange={(e) =>
              updateFormData(
                "totalAreaInHectares",
                parseFloat(e.target.value) || null,
              )
            }
            placeholder={t("create.waterBody.totalAreaInHectaresPlaceholder")}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="waterSurfaceAreaInHectares">
            {t("create.waterBody.waterSurfaceAreaInHectares")}
          </Label>
          <Input
            id="waterSurfaceAreaInHectares"
            type="number"
            step="0.01"
            min="0"
            value={formData.waterSurfaceAreaInHectares || ""}
            onChange={(e) =>
              updateFormData(
                "waterSurfaceAreaInHectares",
                parseFloat(e.target.value) || null,
              )
            }
            placeholder={t(
              "create.waterBody.waterSurfaceAreaInHectaresPlaceholder",
            )}
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            {t("create.waterBody.waterSurfaceAreaHelp")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="totalPondCount">
            {t("create.waterBody.totalPondCount")}
          </Label>
          <Input
            id="totalPondCount"
            type="number"
            min="0"
            value={formData.totalPondCount || ""}
            onChange={(e) =>
              updateFormData("totalPondCount", parseInt(e.target.value) || null)
            }
            placeholder={t("create.waterBody.totalPondCountPlaceholder")}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="activePondCount">
            {t("create.waterBody.activePondCount")}
          </Label>
          <Input
            id="activePondCount"
            type="number"
            min="0"
            value={formData.activePondCount || ""}
            onChange={(e) =>
              updateFormData(
                "activePondCount",
                parseInt(e.target.value) || null,
              )
            }
            placeholder={t("create.waterBody.activePondCountPlaceholder")}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="averagePondSizeInSquareMeters">
            {t("create.waterBody.averagePondSizeInSquareMeters")}
          </Label>
          <Input
            id="averagePondSizeInSquareMeters"
            type="number"
            step="0.01"
            min="0"
            value={formData.averagePondSizeInSquareMeters || ""}
            onChange={(e) =>
              updateFormData(
                "averagePondSizeInSquareMeters",
                parseFloat(e.target.value) || null,
              )
            }
            placeholder={t(
              "create.waterBody.averagePondSizeInSquareMetersPlaceholder",
            )}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="averageWaterDepthInMeters">
            {t("create.waterBody.averageWaterDepthInMeters")}
          </Label>
          <Input
            id="averageWaterDepthInMeters"
            type="number"
            step="0.01"
            min="0"
            value={formData.averageWaterDepthInMeters || ""}
            onChange={(e) =>
              updateFormData(
                "averageWaterDepthInMeters",
                parseFloat(e.target.value) || null,
              )
            }
            placeholder={t(
              "create.waterBody.averageWaterDepthInMetersPlaceholder",
            )}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="totalWaterVolumeInCubicMeters">
            {t("create.waterBody.totalWaterVolumeInCubicMeters")}
          </Label>
          <Input
            id="totalWaterVolumeInCubicMeters"
            type="number"
            step="0.01"
            min="0"
            value={formData.totalWaterVolumeInCubicMeters || ""}
            onChange={(e) =>
              updateFormData(
                "totalWaterVolumeInCubicMeters",
                parseFloat(e.target.value) || null,
              )
            }
            placeholder={t(
              "create.waterBody.totalWaterVolumeInCubicMetersPlaceholder",
            )}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="waterSource">
            {t("create.waterBody.waterSource")}
          </Label>
          <Select
            value={formData.waterSource || ""}
            onValueChange={(value) => updateFormData("waterSource", value)}
          >
            <SelectTrigger id="waterSource" className="mt-1">
              <SelectValue
                placeholder={t("create.waterBody.waterSourcePlaceholder")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RIVER">{t("waterSources.RIVER")}</SelectItem>
              <SelectItem value="STREAM">{t("waterSources.STREAM")}</SelectItem>
              <SelectItem value="SPRING">{t("waterSources.SPRING")}</SelectItem>
              <SelectItem value="WELL">{t("waterSources.WELL")}</SelectItem>
              <SelectItem value="GROUNDWATER">
                {t("waterSources.GROUNDWATER")}
              </SelectItem>
              <SelectItem value="RAINWATER">
                {t("waterSources.RAINWATER")}
              </SelectItem>
              <SelectItem value="CANAL">{t("waterSources.CANAL")}</SelectItem>
              <SelectItem value="RESERVOIR">
                {t("waterSources.RESERVOIR")}
              </SelectItem>
              <SelectItem value="LAKE">{t("waterSources.LAKE")}</SelectItem>
              <SelectItem value="MIXED">{t("waterSources.MIXED")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="waterSourceDetails">
            {t("create.waterBody.waterSourceDetails")}
          </Label>
          <Input
            id="waterSourceDetails"
            value={formData.waterSourceDetails || ""}
            onChange={(e) =>
              updateFormData("waterSourceDetails", e.target.value)
            }
            placeholder={t("create.waterBody.waterSourceDetailsPlaceholder")}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="waterAvailabilityIssues">
          {t("create.waterBody.waterAvailabilityIssues")}
        </Label>
        <Textarea
          id="waterAvailabilityIssues"
          value={formData.waterAvailabilityIssues || ""}
          onChange={(e) =>
            updateFormData("waterAvailabilityIssues", e.target.value)
          }
          placeholder={t("create.waterBody.waterAvailabilityIssuesPlaceholder")}
          className="mt-1"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="hasWaterQualityMonitoring"
            checked={formData.hasWaterQualityMonitoring || false}
            onCheckedChange={(checked) =>
              updateFormData("hasWaterQualityMonitoring", checked)
            }
          />
          <Label htmlFor="hasWaterQualityMonitoring">
            {t("create.waterBody.hasWaterQualityMonitoring")}
          </Label>
        </div>

        {formData.hasWaterQualityMonitoring && (
          <div>
            <Label htmlFor="waterQualityParameters">
              {t("create.waterBody.waterQualityParameters")}
            </Label>
            <Input
              id="waterQualityParameters"
              value={formData.waterQualityParameters || ""}
              onChange={(e) =>
                updateFormData("waterQualityParameters", e.target.value)
              }
              placeholder={t(
                "create.waterBody.waterQualityParametersPlaceholder",
              )}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {t("create.waterBody.waterQualityParametersHelp")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
