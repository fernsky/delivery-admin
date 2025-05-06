"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type FormData = {
  name: string;
  description: string;
  farmType: string;
  farmingSystem?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  isVerified?: boolean;
  [key: string]: any;
};

interface BasicFarmDetailsProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
}

export default function BasicFarmDetails({
  formData,
  updateFormData,
}: BasicFarmDetailsProps) {
  const t = useTranslations("Farms");

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {t("create.basicDetails.title")}
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">{t("create.basicDetails.name")}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateFormData("name", e.target.value)}
              placeholder={t("create.basicDetails.namePlaceholder")}
              className="mt-1"
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              {t("create.basicDetails.nameDescription")}
            </p>
          </div>

          <div>
            <Label htmlFor="description">
              {t("create.basicDetails.description")}
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              placeholder={t("create.basicDetails.descriptionPlaceholder")}
              className="mt-1 h-24"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="farmType">
                {t("create.basicDetails.farmType")}
              </Label>
              <Select
                value={formData.farmType}
                onValueChange={(value) => updateFormData("farmType", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue
                    placeholder={t("create.basicDetails.farmTypePlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CROP_FARM">
                    {t("farmTypes.CROP_FARM")}
                  </SelectItem>
                  <SelectItem value="LIVESTOCK_FARM">
                    {t("farmTypes.LIVESTOCK_FARM")}
                  </SelectItem>
                  <SelectItem value="MIXED_FARM">
                    {t("farmTypes.MIXED_FARM")}
                  </SelectItem>
                  <SelectItem value="POULTRY_FARM">
                    {t("farmTypes.POULTRY_FARM")}
                  </SelectItem>
                  <SelectItem value="DAIRY_FARM">
                    {t("farmTypes.DAIRY_FARM")}
                  </SelectItem>
                  <SelectItem value="AQUACULTURE_FARM">
                    {t("farmTypes.AQUACULTURE_FARM")}
                  </SelectItem>
                  <SelectItem value="HORTICULTURE_FARM">
                    {t("farmTypes.HORTICULTURE_FARM")}
                  </SelectItem>
                  <SelectItem value="APICULTURE_FARM">
                    {t("farmTypes.APICULTURE_FARM")}
                  </SelectItem>
                  <SelectItem value="SERICULTURE_FARM">
                    {t("farmTypes.SERICULTURE_FARM")}
                  </SelectItem>
                  <SelectItem value="ORGANIC_FARM">
                    {t("farmTypes.ORGANIC_FARM")}
                  </SelectItem>
                  <SelectItem value="COMMERCIAL_FARM">
                    {t("farmTypes.COMMERCIAL_FARM")}
                  </SelectItem>
                  <SelectItem value="SUBSISTENCE_FARM">
                    {t("farmTypes.SUBSISTENCE_FARM")}
                  </SelectItem>
                  <SelectItem value="AGROFORESTRY">
                    {t("farmTypes.AGROFORESTRY")}
                  </SelectItem>
                  <SelectItem value="OTHER">{t("farmTypes.OTHER")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="farmingSystem">
                {t("create.basicDetails.farmingSystem")}
              </Label>
              <Select
                value={formData.farmingSystem || ""}
                onValueChange={(value) =>
                  updateFormData("farmingSystem", value)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue
                    placeholder={t(
                      "create.basicDetails.farmingSystemPlaceholder",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONVENTIONAL">
                    {t("farmingSystems.CONVENTIONAL")}
                  </SelectItem>
                  <SelectItem value="ORGANIC">
                    {t("farmingSystems.ORGANIC")}
                  </SelectItem>
                  <SelectItem value="INTEGRATED">
                    {t("farmingSystems.INTEGRATED")}
                  </SelectItem>
                  <SelectItem value="CONSERVATION">
                    {t("farmingSystems.CONSERVATION")}
                  </SelectItem>
                  <SelectItem value="HYDROPONIC">
                    {t("farmingSystems.HYDROPONIC")}
                  </SelectItem>
                  <SelectItem value="PERMACULTURE">
                    {t("farmingSystems.PERMACULTURE")}
                  </SelectItem>
                  <SelectItem value="BIODYNAMIC">
                    {t("farmingSystems.BIODYNAMIC")}
                  </SelectItem>
                  <SelectItem value="TRADITIONAL">
                    {t("farmingSystems.TRADITIONAL")}
                  </SelectItem>
                  <SelectItem value="MIXED">
                    {t("farmingSystems.MIXED")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t("create.seo.title")}</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="metaTitle">{t("create.seo.metaTitle")}</Label>
            <Input
              id="metaTitle"
              value={formData.metaTitle || ""}
              onChange={(e) => updateFormData("metaTitle", e.target.value)}
              placeholder={t("create.seo.metaTitlePlaceholder")}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="metaDescription">
              {t("create.seo.metaDescription")}
            </Label>
            <Textarea
              id="metaDescription"
              value={formData.metaDescription || ""}
              onChange={(e) =>
                updateFormData("metaDescription", e.target.value)
              }
              placeholder={t("create.seo.metaDescriptionPlaceholder")}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {t("create.seo.metaDescriptionHelp")}
            </p>
          </div>

          <div>
            <Label htmlFor="keywords">{t("create.seo.keywords")}</Label>
            <Input
              id="keywords"
              value={formData.keywords || ""}
              onChange={(e) => updateFormData("keywords", e.target.value)}
              placeholder={t("create.seo.keywordsPlaceholder")}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {t("create.seo.keywordsHelp")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
