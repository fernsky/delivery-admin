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
import { Switch } from "@/components/ui/switch";

type FormData = {
  name: string;
  description: string;
  farmType: string;
  ownershipType?: string;
  operationalSince?: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  isVerified?: boolean;
  [key: string]: any;
};

interface BasicFishFarmDetailsProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
}

export default function BasicFishFarmDetails({
  formData,
  updateFormData,
}: BasicFishFarmDetailsProps) {
  const t = useTranslations("FishFarms");
  const currentYear = new Date().getFullYear();

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
                  <SelectItem value="POND_CULTURE">
                    {t("farmTypes.POND_CULTURE")}
                  </SelectItem>
                  <SelectItem value="CAGE_CULTURE">
                    {t("farmTypes.CAGE_CULTURE")}
                  </SelectItem>
                  <SelectItem value="TANK_CULTURE">
                    {t("farmTypes.TANK_CULTURE")}
                  </SelectItem>
                  <SelectItem value="RACEWAY_CULTURE">
                    {t("farmTypes.RACEWAY_CULTURE")}
                  </SelectItem>
                  <SelectItem value="RECIRCULATING_AQUACULTURE_SYSTEM">
                    {t("farmTypes.RECIRCULATING_AQUACULTURE_SYSTEM")}
                  </SelectItem>
                  <SelectItem value="HATCHERY">
                    {t("farmTypes.HATCHERY")}
                  </SelectItem>
                  <SelectItem value="NURSERY">
                    {t("farmTypes.NURSERY")}
                  </SelectItem>
                  <SelectItem value="INTEGRATED_FARMING">
                    {t("farmTypes.INTEGRATED_FARMING")}
                  </SelectItem>
                  <SelectItem value="RICE_FISH_CULTURE">
                    {t("farmTypes.RICE_FISH_CULTURE")}
                  </SelectItem>
                  <SelectItem value="ORNAMENTAL_FISH_FARM">
                    {t("farmTypes.ORNAMENTAL_FISH_FARM")}
                  </SelectItem>
                  <SelectItem value="RESEARCH_FACILITY">
                    {t("farmTypes.RESEARCH_FACILITY")}
                  </SelectItem>
                  <SelectItem value="MIXED">{t("farmTypes.MIXED")}</SelectItem>
                  <SelectItem value="OTHER">{t("farmTypes.OTHER")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="ownershipType">
                {t("create.basicDetails.ownershipType")}
              </Label>
              <Select
                value={formData.ownershipType || ""}
                onValueChange={(value) =>
                  updateFormData("ownershipType", value)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue
                    placeholder={t(
                      "create.basicDetails.ownershipTypePlaceholder",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRIVATE">
                    {t("ownershipTypes.PRIVATE")}
                  </SelectItem>
                  <SelectItem value="GOVERNMENT">
                    {t("ownershipTypes.GOVERNMENT")}
                  </SelectItem>
                  <SelectItem value="COMMUNITY">
                    {t("ownershipTypes.COMMUNITY")}
                  </SelectItem>
                  <SelectItem value="COOPERATIVE">
                    {t("ownershipTypes.COOPERATIVE")}
                  </SelectItem>
                  <SelectItem value="PUBLIC_PRIVATE_PARTNERSHIP">
                    {t("ownershipTypes.PUBLIC_PRIVATE_PARTNERSHIP")}
                  </SelectItem>
                  <SelectItem value="NGO_MANAGED">
                    {t("ownershipTypes.NGO_MANAGED")}
                  </SelectItem>
                  <SelectItem value="MIXED">
                    {t("ownershipTypes.MIXED")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="operationalSince">
              {t("create.basicDetails.operationalSince")}
            </Label>
            <Input
              id="operationalSince"
              type="number"
              min="1950"
              max={currentYear}
              value={formData.operationalSince || ""}
              onChange={(e) =>
                updateFormData(
                  "operationalSince",
                  e.target.value ? parseInt(e.target.value) : undefined,
                )
              }
              placeholder={t("create.basicDetails.operationalSincePlaceholder")}
              className="mt-1 w-full md:w-1/3"
            />
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

      {/* Verification Status */}
      <div className="pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Switch
            id="isVerified"
            checked={formData.isVerified || false}
            onCheckedChange={(checked) => updateFormData("isVerified", checked)}
          />
          <Label htmlFor="isVerified">{t("create.verificationStatus")}</Label>
        </div>
        <p className="text-sm text-muted-foreground mt-1 ml-7">
          {t("create.verificationDescription")}
        </p>
      </div>
    </div>
  );
}
