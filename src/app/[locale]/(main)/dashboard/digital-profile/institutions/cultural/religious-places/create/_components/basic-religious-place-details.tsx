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

type FormData = {
  name: string;
  description: string;
  type: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  isVerified?: boolean;
  [key: string]: any;
};

interface BasicReligiousPlaceDetailsProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
}

export default function BasicReligiousPlaceDetails({
  formData,
  updateFormData,
}: BasicReligiousPlaceDetailsProps) {
  const t = useTranslations("ReligiousPlaces");

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

          <div>
            <Label htmlFor="type">{t("create.basicDetails.type")}</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => updateFormData("type", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue
                  placeholder={t("create.basicDetails.typePlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HINDU_TEMPLE">
                  {t("types.HINDU_TEMPLE")}
                </SelectItem>
                <SelectItem value="BUDDHIST_TEMPLE">
                  {t("types.BUDDHIST_TEMPLE")}
                </SelectItem>
                <SelectItem value="MOSQUE">{t("types.MOSQUE")}</SelectItem>
                <SelectItem value="CHURCH">{t("types.CHURCH")}</SelectItem>
                <SelectItem value="GURUDWARA">
                  {t("types.GURUDWARA")}
                </SelectItem>
                <SelectItem value="SHRINE">{t("types.SHRINE")}</SelectItem>
                <SelectItem value="MONASTERY">
                  {t("types.MONASTERY")}
                </SelectItem>
                <SelectItem value="SYNAGOGUE">
                  {t("types.SYNAGOGUE")}
                </SelectItem>
                <SelectItem value="JAIN_TEMPLE">
                  {t("types.JAIN_TEMPLE")}
                </SelectItem>
                <SelectItem value="MEDITATION_CENTER">
                  {t("types.MEDITATION_CENTER")}
                </SelectItem>
                <SelectItem value="PAGODA">{t("types.PAGODA")}</SelectItem>
                <SelectItem value="SACRED_GROVE">
                  {t("types.SACRED_GROVE")}
                </SelectItem>
                <SelectItem value="SACRED_POND">
                  {t("types.SACRED_POND")}
                </SelectItem>
                <SelectItem value="SACRED_RIVER">
                  {t("types.SACRED_RIVER")}
                </SelectItem>
                <SelectItem value="SACRED_HILL">
                  {t("types.SACRED_HILL")}
                </SelectItem>
                <SelectItem value="PRAYER_HALL">
                  {t("types.PRAYER_HALL")}
                </SelectItem>
                <SelectItem value="RELIGIOUS_COMPLEX">
                  {t("types.RELIGIOUS_COMPLEX")}
                </SelectItem>
                <SelectItem value="OTHER">{t("types.OTHER")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="architecturalStyle">
                {t("create.physicalDetails.architecturalStyle")}
              </Label>
              <Select
                value={formData.architecturalStyle || ""}
                onValueChange={(value) =>
                  updateFormData("architecturalStyle", value)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue
                    placeholder={t(
                      "create.physicalDetails.architecturalStylePlaceholder",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRADITIONAL_NEPALI">
                    {t("architecturalStyles.TRADITIONAL_NEPALI")}
                  </SelectItem>
                  <SelectItem value="PAGODA">
                    {t("architecturalStyles.PAGODA")}
                  </SelectItem>
                  <SelectItem value="STUPA">
                    {t("architecturalStyles.STUPA")}
                  </SelectItem>
                  <SelectItem value="SHIKHARA">
                    {t("architecturalStyles.SHIKHARA")}
                  </SelectItem>
                  <SelectItem value="MODERN">
                    {t("architecturalStyles.MODERN")}
                  </SelectItem>
                  <SelectItem value="COLONIAL">
                    {t("architecturalStyles.COLONIAL")}
                  </SelectItem>
                  <SelectItem value="GOTHIC">
                    {t("architecturalStyles.GOTHIC")}
                  </SelectItem>
                  <SelectItem value="MUGHAL">
                    {t("architecturalStyles.MUGHAL")}
                  </SelectItem>
                  <SelectItem value="DOME">
                    {t("architecturalStyles.DOME")}
                  </SelectItem>
                  <SelectItem value="MIXED">
                    {t("architecturalStyles.MIXED")}
                  </SelectItem>
                  <SelectItem value="VERNACULAR">
                    {t("architecturalStyles.VERNACULAR")}
                  </SelectItem>
                  <SelectItem value="OTHER">
                    {t("architecturalStyles.OTHER")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="constructionMaterial">
                {t("create.physicalDetails.constructionMaterial")}
              </Label>
              <Select
                value={formData.constructionMaterial || ""}
                onValueChange={(value) =>
                  updateFormData("constructionMaterial", value)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue
                    placeholder={t(
                      "create.physicalDetails.constructionMaterialPlaceholder",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STONE">
                    {t("constructionMaterials.STONE")}
                  </SelectItem>
                  <SelectItem value="BRICK">
                    {t("constructionMaterials.BRICK")}
                  </SelectItem>
                  <SelectItem value="WOOD">
                    {t("constructionMaterials.WOOD")}
                  </SelectItem>
                  <SelectItem value="MUD">
                    {t("constructionMaterials.MUD")}
                  </SelectItem>
                  <SelectItem value="CONCRETE">
                    {t("constructionMaterials.CONCRETE")}
                  </SelectItem>
                  <SelectItem value="MARBLE">
                    {t("constructionMaterials.MARBLE")}
                  </SelectItem>
                  <SelectItem value="METAL">
                    {t("constructionMaterials.METAL")}
                  </SelectItem>
                  <SelectItem value="MIXED">
                    {t("constructionMaterials.MIXED")}
                  </SelectItem>
                  <SelectItem value="OTHER">
                    {t("constructionMaterials.OTHER")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="yearEstablished">
                {t("create.physicalDetails.yearEstablished")}
              </Label>
              <Input
                id="yearEstablished"
                type="number"
                value={formData.yearEstablished || ""}
                onChange={(e) =>
                  updateFormData(
                    "yearEstablished",
                    parseInt(e.target.value) || undefined,
                  )
                }
                placeholder={t(
                  "create.physicalDetails.yearEstablishedPlaceholder",
                )}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="yearRenovated">
                {t("create.physicalDetails.yearRenovated")}
              </Label>
              <Input
                id="yearRenovated"
                type="number"
                value={formData.yearRenovated || ""}
                onChange={(e) =>
                  updateFormData(
                    "yearRenovated",
                    parseInt(e.target.value) || undefined,
                  )
                }
                placeholder={t(
                  "create.physicalDetails.yearRenovatedPlaceholder",
                )}
                className="mt-1"
              />
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
