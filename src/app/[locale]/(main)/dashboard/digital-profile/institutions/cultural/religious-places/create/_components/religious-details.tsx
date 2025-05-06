"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  mainDeity?: string;
  secondaryDeities?: string;
  religiousTradition?: string;
  religiousSignificance?: string;
  religiousStory?: string;
  regularPrayers?: string;
  specialRituals?: string;
  annualFestivals?: string;
  festivalMonths?: string;
  festivalDetails?: string;
  specialOfferings?: string;
  [key: string]: any;
}

interface ReligiousDetailsProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
}

export default function ReligiousDetails({
  formData,
  updateFormData,
}: ReligiousDetailsProps) {
  const t = useTranslations("ReligiousPlaces");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          {t("create.religiousDetails.title")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("create.religiousDetails.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="mainDeity">
            {t("create.religiousDetails.mainDeity")}
          </Label>
          <Input
            id="mainDeity"
            value={formData.mainDeity || ""}
            onChange={(e) => updateFormData("mainDeity", e.target.value)}
            placeholder={t("create.religiousDetails.mainDeityPlaceholder")}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="secondaryDeities">
            {t("create.religiousDetails.secondaryDeities")}
          </Label>
          <Input
            id="secondaryDeities"
            value={formData.secondaryDeities || ""}
            onChange={(e) => updateFormData("secondaryDeities", e.target.value)}
            placeholder={t(
              "create.religiousDetails.secondaryDeitiesPlaceholder",
            )}
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            {t("create.religiousDetails.secondaryDeitiesHelp")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="religiousTradition">
            {t("create.religiousDetails.religiousTradition")}
          </Label>
          <Input
            id="religiousTradition"
            value={formData.religiousTradition || ""}
            onChange={(e) =>
              updateFormData("religiousTradition", e.target.value)
            }
            placeholder={t(
              "create.religiousDetails.religiousTraditionPlaceholder",
            )}
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            {t("create.religiousDetails.religiousTraditionHelp")}
          </p>
        </div>

        <div>
          <Label htmlFor="religiousSignificance">
            {t("create.religiousDetails.religiousSignificance")}
          </Label>
          <Select
            value={formData.religiousSignificance || ""}
            onValueChange={(value) =>
              updateFormData("religiousSignificance", value)
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue
                placeholder={t(
                  "create.religiousDetails.religiousSignificancePlaceholder",
                )}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOCAL">
                {t("religiousSignificance.LOCAL")}
              </SelectItem>
              <SelectItem value="REGIONAL">
                {t("religiousSignificance.REGIONAL")}
              </SelectItem>
              <SelectItem value="NATIONAL">
                {t("religiousSignificance.NATIONAL")}
              </SelectItem>
              <SelectItem value="INTERNATIONAL">
                {t("religiousSignificance.INTERNATIONAL")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="religiousStory">
          {t("create.religiousDetails.religiousStory")}
        </Label>
        <Textarea
          id="religiousStory"
          value={formData.religiousStory || ""}
          onChange={(e) => updateFormData("religiousStory", e.target.value)}
          placeholder={t("create.religiousDetails.religiousStoryPlaceholder")}
          className="mt-1"
          rows={5}
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium">
          {t("create.religiousDetails.activitiesTitle")}
        </h3>
      </div>

      <div>
        <Label htmlFor="regularPrayers">
          {t("create.religiousDetails.regularPrayers")}
        </Label>
        <Textarea
          id="regularPrayers"
          value={formData.regularPrayers || ""}
          onChange={(e) => updateFormData("regularPrayers", e.target.value)}
          placeholder={t("create.religiousDetails.regularPrayersPlaceholder")}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="specialRituals">
          {t("create.religiousDetails.specialRituals")}
        </Label>
        <Textarea
          id="specialRituals"
          value={formData.specialRituals || ""}
          onChange={(e) => updateFormData("specialRituals", e.target.value)}
          placeholder={t("create.religiousDetails.specialRitualsPlaceholder")}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="annualFestivals">
            {t("create.religiousDetails.annualFestivals")}
          </Label>
          <Input
            id="annualFestivals"
            value={formData.annualFestivals || ""}
            onChange={(e) => updateFormData("annualFestivals", e.target.value)}
            placeholder={t(
              "create.religiousDetails.annualFestivalsPlaceholder",
            )}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="festivalMonths">
            {t("create.religiousDetails.festivalMonths")}
          </Label>
          <Input
            id="festivalMonths"
            value={formData.festivalMonths || ""}
            onChange={(e) => updateFormData("festivalMonths", e.target.value)}
            placeholder={t("create.religiousDetails.festivalMonthsPlaceholder")}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="festivalDetails">
          {t("create.religiousDetails.festivalDetails")}
        </Label>
        <Textarea
          id="festivalDetails"
          value={formData.festivalDetails || ""}
          onChange={(e) => updateFormData("festivalDetails", e.target.value)}
          placeholder={t("create.religiousDetails.festivalDetailsPlaceholder")}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="specialOfferings">
          {t("create.religiousDetails.specialOfferings")}
        </Label>
        <Input
          id="specialOfferings"
          value={formData.specialOfferings || ""}
          onChange={(e) => updateFormData("specialOfferings", e.target.value)}
          placeholder={t("create.religiousDetails.specialOfferingsPlaceholder")}
          className="mt-1"
        />
        <p className="text-sm text-muted-foreground mt-1">
          {t("create.religiousDetails.specialOfferingsHelp")}
        </p>
      </div>
    </div>
  );
}
