"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  // Cultural and historical significance
  historicalSignificance?: string;
  culturalSignificance?: string;
  isHeritageSite?: boolean;
  heritageDesignation?: string;
  inscriptions?: string;
  hasArchaeologicalValue?: boolean;
  archaeologicalDetails?: string;
  [key: string]: any;
}

interface CulturalHistoricalDetailsProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
}

export default function CulturalHistoricalDetails({
  formData,
  updateFormData,
}: CulturalHistoricalDetailsProps) {
  const t = useTranslations("ReligiousPlaces");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          {t("create.culturalDetails.title")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("create.culturalDetails.description")}
        </p>
      </div>

      <div>
        <Label htmlFor="historicalSignificance">
          {t("create.culturalDetails.historicalSignificance")}
        </Label>
        <Textarea
          id="historicalSignificance"
          value={formData.historicalSignificance || ""}
          onChange={(e) =>
            updateFormData("historicalSignificance", e.target.value)
          }
          placeholder={t(
            "create.culturalDetails.historicalSignificancePlaceholder",
          )}
          className="mt-1"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="culturalSignificance">
          {t("create.culturalDetails.culturalSignificance")}
        </Label>
        <Textarea
          id="culturalSignificance"
          value={formData.culturalSignificance || ""}
          onChange={(e) =>
            updateFormData("culturalSignificance", e.target.value)
          }
          placeholder={t(
            "create.culturalDetails.culturalSignificancePlaceholder",
          )}
          className="mt-1"
          rows={4}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isHeritageSite"
          checked={formData.isHeritageSite || false}
          onCheckedChange={(checked) =>
            updateFormData("isHeritageSite", checked)
          }
        />
        <Label htmlFor="isHeritageSite">
          {t("create.culturalDetails.isHeritageSite")}
        </Label>
      </div>

      {formData.isHeritageSite && (
        <div>
          <Label htmlFor="heritageDesignation">
            {t("create.culturalDetails.heritageDesignation")}
          </Label>
          <Input
            id="heritageDesignation"
            value={formData.heritageDesignation || ""}
            onChange={(e) =>
              updateFormData("heritageDesignation", e.target.value)
            }
            placeholder={t(
              "create.culturalDetails.heritageDesignationPlaceholder",
            )}
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            {t("create.culturalDetails.heritageDesignationHelp")}
          </p>
        </div>
      )}

      <div>
        <Label htmlFor="inscriptions">
          {t("create.culturalDetails.inscriptions")}
        </Label>
        <Textarea
          id="inscriptions"
          value={formData.inscriptions || ""}
          onChange={(e) => updateFormData("inscriptions", e.target.value)}
          placeholder={t("create.culturalDetails.inscriptionsPlaceholder")}
          className="mt-1"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="hasArchaeologicalValue"
          checked={formData.hasArchaeologicalValue || false}
          onCheckedChange={(checked) =>
            updateFormData("hasArchaeologicalValue", checked)
          }
        />
        <Label htmlFor="hasArchaeologicalValue">
          {t("create.culturalDetails.hasArchaeologicalValue")}
        </Label>
      </div>

      {formData.hasArchaeologicalValue && (
        <div>
          <Label htmlFor="archaeologicalDetails">
            {t("create.culturalDetails.archaeologicalDetails")}
          </Label>
          <Textarea
            id="archaeologicalDetails"
            value={formData.archaeologicalDetails || ""}
            onChange={(e) =>
              updateFormData("archaeologicalDetails", e.target.value)
            }
            placeholder={t(
              "create.culturalDetails.archaeologicalDetailsPlaceholder",
            )}
            className="mt-1"
          />
        </div>
      )}

      {/* Preservation Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium">
          {t("create.preservation.title")}
        </h3>
      </div>

      <div>
        <Label htmlFor="preservationStatus">
          {t("create.preservation.preservationStatus")}
        </Label>
        <select
          id="preservationStatus"
          value={formData.preservationStatus || ""}
          onChange={(e) => updateFormData("preservationStatus", e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">
            {t("create.preservation.preservationStatusPlaceholder")}
          </option>
          <option value="EXCELLENT">{t("preservationStatus.EXCELLENT")}</option>
          <option value="GOOD">{t("preservationStatus.GOOD")}</option>
          <option value="FAIR">{t("preservationStatus.FAIR")}</option>
          <option value="POOR">{t("preservationStatus.POOR")}</option>
          <option value="DAMAGED">{t("preservationStatus.DAMAGED")}</option>
          <option value="UNDER_RENOVATION">
            {t("preservationStatus.UNDER_RENOVATION")}
          </option>
          <option value="REBUILT">{t("preservationStatus.REBUILT")}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="lastRestorationYear">
            {t("create.preservation.lastRestorationYear")}
          </Label>
          <Input
            id="lastRestorationYear"
            type="number"
            min="1000"
            max={new Date().getFullYear()}
            value={formData.lastRestorationYear || ""}
            onChange={(e) =>
              updateFormData(
                "lastRestorationYear",
                parseInt(e.target.value) || undefined,
              )
            }
            placeholder={t(
              "create.preservation.lastRestorationYearPlaceholder",
            )}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="fundingSource">
            {t("create.preservation.fundingSource")}
          </Label>
          <Input
            id="fundingSource"
            value={formData.fundingSource || ""}
            onChange={(e) => updateFormData("fundingSource", e.target.value)}
            placeholder={t("create.preservation.fundingSourcePlaceholder")}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="hasRegularMaintenance"
          checked={formData.hasRegularMaintenance || false}
          onCheckedChange={(checked) =>
            updateFormData("hasRegularMaintenance", checked)
          }
        />
        <Label htmlFor="hasRegularMaintenance">
          {t("create.preservation.hasRegularMaintenance")}
        </Label>
      </div>

      {formData.hasRegularMaintenance && (
        <div>
          <Label htmlFor="maintenanceDetails">
            {t("create.preservation.maintenanceDetails")}
          </Label>
          <Textarea
            id="maintenanceDetails"
            value={formData.maintenanceDetails || ""}
            onChange={(e) =>
              updateFormData("maintenanceDetails", e.target.value)
            }
            placeholder={t("create.preservation.maintenanceDetailsPlaceholder")}
            className="mt-1"
          />
        </div>
      )}

      <div>
        <Label htmlFor="restorationDetails">
          {t("create.preservation.restorationDetails")}
        </Label>
        <Textarea
          id="restorationDetails"
          value={formData.restorationDetails || ""}
          onChange={(e) => updateFormData("restorationDetails", e.target.value)}
          placeholder={t("create.preservation.restorationDetailsPlaceholder")}
          className="mt-1"
        />
      </div>
    </div>
  );
}
