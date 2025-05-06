"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  // Sustainability and practices
  usesChemicalFertilizer?: boolean;
  usesPesticides?: boolean;
  usesOrganicMethods?: boolean;
  composting?: boolean;
  soilConservationPractices?: string;
  rainwaterHarvesting?: boolean;
  manureManagement?: string;
  hasCertifications?: boolean;
  certificationDetails?: string;

  // Technical support and training
  receivesExtensionServices?: boolean;
  extensionServiceProvider?: string;
  trainingReceived?: string;
  technicalSupportNeeds?: string;

  // Challenges and opportunities
  majorChallenges?: string;
  disasterVulnerabilities?: string;
  growthOpportunities?: string;
  futureExpansionPlans?: string;
  [key: string]: any;
}

interface ManagementPracticesProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
}

export default function ManagementPractices({
  formData,
  updateFormData,
}: ManagementPracticesProps) {
  const t = useTranslations("Farms");

  return (
    <div className="space-y-8">
      {/* Sustainability Practices Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {t("create.practices.sustainabilityTitle")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("create.practices.sustainabilityDescription")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="usesChemicalFertilizer"
                checked={formData.usesChemicalFertilizer || false}
                onCheckedChange={(checked) =>
                  updateFormData("usesChemicalFertilizer", checked)
                }
              />
              <Label htmlFor="usesChemicalFertilizer">
                {t("create.practices.usesChemicalFertilizer")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="usesPesticides"
                checked={formData.usesPesticides || false}
                onCheckedChange={(checked) =>
                  updateFormData("usesPesticides", checked)
                }
              />
              <Label htmlFor="usesPesticides">
                {t("create.practices.usesPesticides")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="usesOrganicMethods"
                checked={formData.usesOrganicMethods || false}
                onCheckedChange={(checked) =>
                  updateFormData("usesOrganicMethods", checked)
                }
              />
              <Label htmlFor="usesOrganicMethods">
                {t("create.practices.usesOrganicMethods")}
              </Label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="composting"
                checked={formData.composting || false}
                onCheckedChange={(checked) =>
                  updateFormData("composting", checked)
                }
              />
              <Label htmlFor="composting">
                {t("create.practices.composting")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="rainwaterHarvesting"
                checked={formData.rainwaterHarvesting || false}
                onCheckedChange={(checked) =>
                  updateFormData("rainwaterHarvesting", checked)
                }
              />
              <Label htmlFor="rainwaterHarvesting">
                {t("create.practices.rainwaterHarvesting")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="hasCertifications"
                checked={formData.hasCertifications || false}
                onCheckedChange={(checked) =>
                  updateFormData("hasCertifications", checked)
                }
              />
              <Label htmlFor="hasCertifications">
                {t("create.practices.hasCertifications")}
              </Label>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="soilConservationPractices">
            {t("create.practices.soilConservationPractices")}
          </Label>
          <Input
            id="soilConservationPractices"
            value={formData.soilConservationPractices || ""}
            onChange={(e) =>
              updateFormData("soilConservationPractices", e.target.value)
            }
            placeholder={t(
              "create.practices.soilConservationPracticesPlaceholder",
            )}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="manureManagement">
            {t("create.practices.manureManagement")}
          </Label>
          <Input
            id="manureManagement"
            value={formData.manureManagement || ""}
            onChange={(e) => updateFormData("manureManagement", e.target.value)}
            placeholder={t("create.practices.manureManagementPlaceholder")}
            className="mt-1"
          />
        </div>

        {formData.hasCertifications && (
          <div>
            <Label htmlFor="certificationDetails">
              {t("create.practices.certificationDetails")}
            </Label>
            <Textarea
              id="certificationDetails"
              value={formData.certificationDetails || ""}
              onChange={(e) =>
                updateFormData("certificationDetails", e.target.value)
              }
              placeholder={t(
                "create.practices.certificationDetailsPlaceholder",
              )}
              className="mt-1"
            />
          </div>
        )}
      </div>

      {/* Technical Support Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {t("create.practices.technicalSupportTitle")}
        </h3>

        <div className="flex items-center space-x-2">
          <Switch
            id="receivesExtensionServices"
            checked={formData.receivesExtensionServices || false}
            onCheckedChange={(checked) =>
              updateFormData("receivesExtensionServices", checked)
            }
          />
          <Label htmlFor="receivesExtensionServices">
            {t("create.practices.receivesExtensionServices")}
          </Label>
        </div>

        {formData.receivesExtensionServices && (
          <div>
            <Label htmlFor="extensionServiceProvider">
              {t("create.practices.extensionServiceProvider")}
            </Label>
            <Input
              id="extensionServiceProvider"
              value={formData.extensionServiceProvider || ""}
              onChange={(e) =>
                updateFormData("extensionServiceProvider", e.target.value)
              }
              placeholder={t(
                "create.practices.extensionServiceProviderPlaceholder",
              )}
              className="mt-1"
            />
          </div>
        )}

        <div>
          <Label htmlFor="trainingReceived">
            {t("create.practices.trainingReceived")}
          </Label>
          <Textarea
            id="trainingReceived"
            value={formData.trainingReceived || ""}
            onChange={(e) => updateFormData("trainingReceived", e.target.value)}
            placeholder={t("create.practices.trainingReceivedPlaceholder")}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="technicalSupportNeeds">
            {t("create.practices.technicalSupportNeeds")}
          </Label>
          <Textarea
            id="technicalSupportNeeds"
            value={formData.technicalSupportNeeds || ""}
            onChange={(e) =>
              updateFormData("technicalSupportNeeds", e.target.value)
            }
            placeholder={t("create.practices.technicalSupportNeedsPlaceholder")}
            className="mt-1"
          />
        </div>
      </div>

      {/* Challenges and Opportunities Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {t("create.practices.challengesTitle")}
        </h3>

        <div>
          <Label htmlFor="majorChallenges">
            {t("create.practices.majorChallenges")}
          </Label>
          <Textarea
            id="majorChallenges"
            value={formData.majorChallenges || ""}
            onChange={(e) => updateFormData("majorChallenges", e.target.value)}
            placeholder={t("create.practices.majorChallengesPlaceholder")}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="disasterVulnerabilities">
            {t("create.practices.disasterVulnerabilities")}
          </Label>
          <Input
            id="disasterVulnerabilities"
            value={formData.disasterVulnerabilities || ""}
            onChange={(e) =>
              updateFormData("disasterVulnerabilities", e.target.value)
            }
            placeholder={t(
              "create.practices.disasterVulnerabilitiesPlaceholder",
            )}
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            {t("create.practices.disasterVulnerabilitiesHelp")}
          </p>
        </div>

        <div>
          <Label htmlFor="growthOpportunities">
            {t("create.practices.growthOpportunities")}
          </Label>
          <Textarea
            id="growthOpportunities"
            value={formData.growthOpportunities || ""}
            onChange={(e) =>
              updateFormData("growthOpportunities", e.target.value)
            }
            placeholder={t("create.practices.growthOpportunitiesPlaceholder")}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="futureExpansionPlans">
            {t("create.practices.futureExpansionPlans")}
          </Label>
          <Textarea
            id="futureExpansionPlans"
            value={formData.futureExpansionPlans || ""}
            onChange={(e) =>
              updateFormData("futureExpansionPlans", e.target.value)
            }
            placeholder={t("create.practices.futureExpansionPlansPlaceholder")}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}
