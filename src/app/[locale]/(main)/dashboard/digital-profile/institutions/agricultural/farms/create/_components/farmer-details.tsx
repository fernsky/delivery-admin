"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormData {
  ownerName?: string;
  ownerContact?: string;
  farmerType?: string;
  farmerEducation?: string;
  farmerExperienceYears?: number;
  hasCooperativeMembership?: boolean;
  cooperativeName?: string;
  [key: string]: any;
}

interface FarmerDetailsProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
}

export default function FarmerDetails({
  formData,
  updateFormData,
}: FarmerDetailsProps) {
  const t = useTranslations("Farms");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("create.farmer.title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("create.farmer.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ownerName">{t("create.farmer.ownerName")}</Label>
          <Input
            id="ownerName"
            value={formData.ownerName || ""}
            onChange={(e) => updateFormData("ownerName", e.target.value)}
            placeholder={t("create.farmer.ownerNamePlaceholder")}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="ownerContact">
            {t("create.farmer.ownerContact")}
          </Label>
          <Input
            id="ownerContact"
            value={formData.ownerContact || ""}
            onChange={(e) => updateFormData("ownerContact", e.target.value)}
            placeholder={t("create.farmer.ownerContactPlaceholder")}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="farmerType">{t("create.farmer.farmerType")}</Label>
          <Input
            id="farmerType"
            value={formData.farmerType || ""}
            onChange={(e) => updateFormData("farmerType", e.target.value)}
            placeholder={t("create.farmer.farmerTypePlaceholder")}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {t("create.farmer.farmerTypeHelp")}
          </p>
        </div>
        <div>
          <Label htmlFor="farmerEducation">
            {t("create.farmer.farmerEducation")}
          </Label>
          <Select
            value={formData.farmerEducation || ""}
            onValueChange={(value) => updateFormData("farmerEducation", value)}
          >
            <SelectTrigger id="farmerEducation" className="mt-1">
              <SelectValue
                placeholder={t("create.farmer.farmerEducationPlaceholder")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NONE">{t("education.NONE")}</SelectItem>
              <SelectItem value="PRIMARY">{t("education.PRIMARY")}</SelectItem>
              <SelectItem value="SECONDARY">
                {t("education.SECONDARY")}
              </SelectItem>
              <SelectItem value="HIGHER_SECONDARY">
                {t("education.HIGHER_SECONDARY")}
              </SelectItem>
              <SelectItem value="BACHELORS">
                {t("education.BACHELORS")}
              </SelectItem>
              <SelectItem value="MASTERS">{t("education.MASTERS")}</SelectItem>
              <SelectItem value="PHD">{t("education.PHD")}</SelectItem>
              <SelectItem value="VOCATIONAL">
                {t("education.VOCATIONAL")}
              </SelectItem>
              <SelectItem value="OTHER">{t("education.OTHER")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="farmerExperienceYears">
            {t("create.farmer.farmerExperienceYears")}
          </Label>
          <Input
            id="farmerExperienceYears"
            type="number"
            min="0"
            value={formData.farmerExperienceYears || ""}
            onChange={(e) =>
              updateFormData(
                "farmerExperienceYears",
                parseInt(e.target.value) || null,
              )
            }
            placeholder={t("create.farmer.farmerExperienceYearsPlaceholder")}
            className="mt-1"
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="hasCooperativeMembership"
              checked={formData.hasCooperativeMembership || false}
              onCheckedChange={(checked) =>
                updateFormData("hasCooperativeMembership", checked)
              }
            />
            <Label htmlFor="hasCooperativeMembership">
              {t("create.farmer.hasCooperativeMembership")}
            </Label>
          </div>

          {formData.hasCooperativeMembership && (
            <div>
              <Label htmlFor="cooperativeName">
                {t("create.farmer.cooperativeName")}
              </Label>
              <Input
                id="cooperativeName"
                value={formData.cooperativeName || ""}
                onChange={(e) =>
                  updateFormData("cooperativeName", e.target.value)
                }
                placeholder={t("create.farmer.cooperativeNamePlaceholder")}
                className="mt-1"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
