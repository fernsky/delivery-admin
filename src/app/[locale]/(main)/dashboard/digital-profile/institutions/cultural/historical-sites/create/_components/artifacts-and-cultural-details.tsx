"use client";

import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface ArtifactsAndCulturalDetailsProps {
  form: UseFormReturn<any>;
}

export default function ArtifactsAndCulturalDetails({
  form,
}: ArtifactsAndCulturalDetailsProps) {
  const t = useTranslations("HistoricalSites");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">
          {t("create.artifactsCultural.title")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("create.artifactsCultural.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="culturalSignificance"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>
                {t("create.artifactsCultural.culturalSignificanceLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.artifactsCultural.culturalSignificancePlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.artifactsCultural.culturalSignificanceDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-full">
          <h3 className="text-lg font-medium mb-4">
            {t("create.artifactsCultural.archaeologicalDetailsTitle")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="hasArchaeologicalArtifacts"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      {t("create.artifactsCultural.hasArtifactsLabel")}
                    </FormLabel>
                    <FormDescription>
                      {t("create.artifactsCultural.hasArtifactsDescription")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasOnSiteMuseum"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      {t("create.artifactsCultural.hasMuseumLabel")}
                    </FormLabel>
                    <FormDescription>
                      {t("create.artifactsCultural.hasMuseumDescription")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="archaeologicalRemains"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.artifactsCultural.archaeologicalRemainsLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.artifactsCultural.archaeologicalRemainsPlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.artifactsCultural.archaeologicalRemainsDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="artifactsFound"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.artifactsCultural.artifactsFoundLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.artifactsCultural.artifactsFoundPlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.artifactsCultural.artifactsFoundDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excavationHistory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.artifactsCultural.excavationHistoryLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.artifactsCultural.excavationHistoryPlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.artifactsCultural.excavationHistoryDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excavationYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.artifactsCultural.excavationYearLabel")}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={t(
                    "create.artifactsCultural.excavationYearPlaceholder",
                  )}
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value
                      ? parseInt(e.target.value)
                      : "";
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormDescription>
                {t("create.artifactsCultural.excavationYearDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="artifactStorageLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.artifactsCultural.artifactStorageLabel")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    "create.artifactsCultural.artifactStoragePlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.artifactsCultural.artifactStorageDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="museumDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.artifactsCultural.museumDetailsLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.artifactsCultural.museumDetailsPlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.artifactsCultural.museumDetailsDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notableCollections"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.artifactsCultural.notableCollectionsLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.artifactsCultural.notableCollectionsPlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.artifactsCultural.notableCollectionsDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-full">
          <h3 className="text-lg font-medium mb-4">
            {t("create.artifactsCultural.inscriptionsTitle")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="hasInscriptions"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      {t("create.artifactsCultural.hasInscriptionsLabel")}
                    </FormLabel>
                    <FormDescription>
                      {t("create.artifactsCultural.hasInscriptionsDescription")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasHistoricalDocuments"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      {t("create.artifactsCultural.hasDocumentsLabel")}
                    </FormLabel>
                    <FormDescription>
                      {t("create.artifactsCultural.hasDocumentsDescription")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="inscriptionDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.artifactsCultural.inscriptionDetailsLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.artifactsCultural.inscriptionDetailsPlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.artifactsCultural.inscriptionDetailsDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="documentationDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.artifactsCultural.documentationDetailsLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.artifactsCultural.documentationDetailsPlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.artifactsCultural.documentationDetailsDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="researchValue"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>
                {t("create.artifactsCultural.researchValueLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.artifactsCultural.researchValuePlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.artifactsCultural.researchValueDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ongoingResearch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.artifactsCultural.ongoingResearchLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.artifactsCultural.ongoingResearchPlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.artifactsCultural.ongoingResearchDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="publicationReferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.artifactsCultural.publicationReferencesLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.artifactsCultural.publicationReferencesPlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.artifactsCultural.publicationReferencesDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
