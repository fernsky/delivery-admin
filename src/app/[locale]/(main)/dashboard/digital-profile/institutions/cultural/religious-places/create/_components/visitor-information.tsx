"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormData {
  // Visitor information
  estimatedDailyVisitors?: number;
  estimatedYearlyVisitors?: number;
  peakVisitationMonths?: string;
  hasOverseasVisitors?: boolean;
  guidesAvailable?: boolean;
  visitorDressCode?: string;
  photoAllowed?: boolean;
  photoRestrictions?: string;

  // Community engagement
  communityBenefits?: string;
  socialServicesOffered?: string;
  educationalActivities?: string;

  // Economic aspects
  hasShops?: boolean;
  shopCount?: number;
  shopTypes?: string;
  economicImpact?: string;
  totalAnnualRevenue?: number;
  annualOperatingBudget?: number;

  // Challenges and needs
  currentChallenges?: string;
  conservationNeeds?: string;
  developmentPlans?: string;
  [key: string]: any;
}

interface VisitorInformationProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
}

export default function VisitorInformation({
  formData,
  updateFormData,
}: VisitorInformationProps) {
  const t = useTranslations("ReligiousPlaces");

  // Array of months for selection
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Function to handle multiple month selection for peak visitation
  const handleMonthSelectionChange = (selectedMonth: string) => {
    const currentMonths = formData.peakVisitationMonths
      ? formData.peakVisitationMonths.split(",").map((m) => m.trim())
      : [];

    if (currentMonths.includes(selectedMonth)) {
      // Remove month if already selected
      const updatedMonths = currentMonths
        .filter((m) => m !== selectedMonth)
        .join(", ");
      updateFormData("peakVisitationMonths", updatedMonths);
    } else {
      // Add month if not already selected
      const updatedMonths = [...currentMonths, selectedMonth].join(", ");
      updateFormData("peakVisitationMonths", updatedMonths);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("create.visitors.visitorDataTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimatedDailyVisitors">
                {t("create.visitors.estimatedDailyVisitors")}
              </Label>
              <Input
                id="estimatedDailyVisitors"
                type="number"
                min="0"
                value={formData.estimatedDailyVisitors || ""}
                onChange={(e) =>
                  updateFormData(
                    "estimatedDailyVisitors",
                    parseInt(e.target.value) || undefined,
                  )
                }
                placeholder={t(
                  "create.visitors.estimatedDailyVisitorsPlaceholder",
                )}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="estimatedYearlyVisitors">
                {t("create.visitors.estimatedYearlyVisitors")}
              </Label>
              <Input
                id="estimatedYearlyVisitors"
                type="number"
                min="0"
                value={formData.estimatedYearlyVisitors || ""}
                onChange={(e) =>
                  updateFormData(
                    "estimatedYearlyVisitors",
                    parseInt(e.target.value) || undefined,
                  )
                }
                placeholder={t(
                  "create.visitors.estimatedYearlyVisitorsPlaceholder",
                )}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="peakVisitationMonths">
              {t("create.visitors.peakVisitationMonths")}
            </Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {months.map((month) => (
                <button
                  key={month}
                  type="button"
                  onClick={() => handleMonthSelectionChange(month)}
                  className={`px-3 py-1 text-sm rounded-full border ${
                    formData.peakVisitationMonths?.includes(month)
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted"
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="hasOverseasVisitors"
              checked={formData.hasOverseasVisitors || false}
              onCheckedChange={(checked) =>
                updateFormData("hasOverseasVisitors", checked)
              }
            />
            <Label htmlFor="hasOverseasVisitors">
              {t("create.visitors.hasOverseasVisitors")}
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="guidesAvailable"
              checked={formData.guidesAvailable || false}
              onCheckedChange={(checked) =>
                updateFormData("guidesAvailable", checked)
              }
            />
            <Label htmlFor="guidesAvailable">
              {t("create.visitors.guidesAvailable")}
            </Label>
          </div>

          <div>
            <Label htmlFor="visitorDressCode">
              {t("create.visitors.visitorDressCode")}
            </Label>
            <Input
              id="visitorDressCode"
              value={formData.visitorDressCode || ""}
              onChange={(e) =>
                updateFormData("visitorDressCode", e.target.value)
              }
              placeholder={t("create.visitors.visitorDressCodePlaceholder")}
              className="mt-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="photoAllowed"
              checked={
                formData.photoAllowed !== undefined
                  ? formData.photoAllowed
                  : true
              }
              onCheckedChange={(checked) =>
                updateFormData("photoAllowed", checked)
              }
            />
            <Label htmlFor="photoAllowed">
              {t("create.visitors.photoAllowed")}
            </Label>
          </div>

          {formData.photoAllowed === false && (
            <div>
              <Label htmlFor="photoRestrictions">
                {t("create.visitors.photoRestrictions")}
              </Label>
              <Input
                id="photoRestrictions"
                value={formData.photoRestrictions || ""}
                onChange={(e) =>
                  updateFormData("photoRestrictions", e.target.value)
                }
                placeholder={t("create.visitors.photoRestrictionsPlaceholder")}
                className="mt-1"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("create.visitors.communityTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="communityBenefits">
              {t("create.visitors.communityBenefits")}
            </Label>
            <Textarea
              id="communityBenefits"
              value={formData.communityBenefits || ""}
              onChange={(e) =>
                updateFormData("communityBenefits", e.target.value)
              }
              placeholder={t("create.visitors.communityBenefitsPlaceholder")}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="socialServicesOffered">
              {t("create.visitors.socialServicesOffered")}
            </Label>
            <Input
              id="socialServicesOffered"
              value={formData.socialServicesOffered || ""}
              onChange={(e) =>
                updateFormData("socialServicesOffered", e.target.value)
              }
              placeholder={t(
                "create.visitors.socialServicesOfferedPlaceholder",
              )}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="educationalActivities">
              {t("create.visitors.educationalActivities")}
            </Label>
            <Input
              id="educationalActivities"
              value={formData.educationalActivities || ""}
              onChange={(e) =>
                updateFormData("educationalActivities", e.target.value)
              }
              placeholder={t(
                "create.visitors.educationalActivitiesPlaceholder",
              )}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("create.visitors.economicTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="hasShops"
              checked={formData.hasShops || false}
              onCheckedChange={(checked) => updateFormData("hasShops", checked)}
            />
            <Label htmlFor="hasShops">{t("create.visitors.hasShops")}</Label>
          </div>

          {formData.hasShops && (
            <>
              <div>
                <Label htmlFor="shopCount">
                  {t("create.visitors.shopCount")}
                </Label>
                <Input
                  id="shopCount"
                  type="number"
                  min="0"
                  value={formData.shopCount || ""}
                  onChange={(e) =>
                    updateFormData(
                      "shopCount",
                      parseInt(e.target.value) || undefined,
                    )
                  }
                  placeholder={t("create.visitors.shopCountPlaceholder")}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="shopTypes">
                  {t("create.visitors.shopTypes")}
                </Label>
                <Input
                  id="shopTypes"
                  value={formData.shopTypes || ""}
                  onChange={(e) => updateFormData("shopTypes", e.target.value)}
                  placeholder={t("create.visitors.shopTypesPlaceholder")}
                  className="mt-1"
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="economicImpact">
              {t("create.visitors.economicImpact")}
            </Label>
            <Textarea
              id="economicImpact"
              value={formData.economicImpact || ""}
              onChange={(e) => updateFormData("economicImpact", e.target.value)}
              placeholder={t("create.visitors.economicImpactPlaceholder")}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalAnnualRevenue">
                {t("create.visitors.totalAnnualRevenue")}
              </Label>
              <Input
                id="totalAnnualRevenue"
                type="number"
                min="0"
                value={formData.totalAnnualRevenue || ""}
                onChange={(e) =>
                  updateFormData(
                    "totalAnnualRevenue",
                    parseFloat(e.target.value) || undefined,
                  )
                }
                placeholder={t("create.visitors.totalAnnualRevenuePlaceholder")}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="annualOperatingBudget">
                {t("create.visitors.annualOperatingBudget")}
              </Label>
              <Input
                id="annualOperatingBudget"
                type="number"
                min="0"
                value={formData.annualOperatingBudget || ""}
                onChange={(e) =>
                  updateFormData(
                    "annualOperatingBudget",
                    parseFloat(e.target.value) || undefined,
                  )
                }
                placeholder={t(
                  "create.visitors.annualOperatingBudgetPlaceholder",
                )}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("create.visitors.challengesTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentChallenges">
              {t("create.visitors.currentChallenges")}
            </Label>
            <Textarea
              id="currentChallenges"
              value={formData.currentChallenges || ""}
              onChange={(e) =>
                updateFormData("currentChallenges", e.target.value)
              }
              placeholder={t("create.visitors.currentChallengesPlaceholder")}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="conservationNeeds">
              {t("create.visitors.conservationNeeds")}
            </Label>
            <Textarea
              id="conservationNeeds"
              value={formData.conservationNeeds || ""}
              onChange={(e) =>
                updateFormData("conservationNeeds", e.target.value)
              }
              placeholder={t("create.visitors.conservationNeedsPlaceholder")}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="developmentPlans">
              {t("create.visitors.developmentPlans")}
            </Label>
            <Textarea
              id="developmentPlans"
              value={formData.developmentPlans || ""}
              onChange={(e) =>
                updateFormData("developmentPlans", e.target.value)
              }
              placeholder={t("create.visitors.developmentPlansPlaceholder")}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
