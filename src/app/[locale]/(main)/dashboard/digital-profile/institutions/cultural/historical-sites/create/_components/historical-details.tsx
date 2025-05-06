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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  historicalArchitecturalStyleEnum,
  historicalConstructionMaterialEnum,
  historicalPeriodEnum,
  historicalSignificanceEnum,
} from "@/utils/enums/historical-sites-enums";

interface HistoricalDetailsProps {
  form: UseFormReturn<any>;
}

export default function HistoricalDetails({ form }: HistoricalDetailsProps) {
  const t = useTranslations("HistoricalSites");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">
          {t("create.historicalDetails.title")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("create.historicalDetails.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="historicalPeriod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("create.historicalDetails.periodLabel")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t(
                        "create.historicalDetails.periodPlaceholder",
                      )}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {historicalPeriodEnum.map((period) => (
                    <SelectItem key={period} value={period}>
                      {t(`enums.historicalPeriod.${period}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                {t("create.historicalDetails.periodDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="historicalSignificance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.historicalDetails.significanceLabel")}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t(
                        "create.historicalDetails.significancePlaceholder",
                      )}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {historicalSignificanceEnum.map((significance) => (
                    <SelectItem key={significance} value={significance}>
                      {t(`enums.historicalSignificance.${significance}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                {t("create.historicalDetails.significanceDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="yearEstablished"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.historicalDetails.establishedYearLabel")}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={t(
                    "create.historicalDetails.establishedYearPlaceholder",
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
                {t("create.historicalDetails.establishedYearDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="yearAbandoned"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.historicalDetails.abandonedYearLabel")}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={t(
                    "create.historicalDetails.abandonedYearPlaceholder",
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
                {t("create.historicalDetails.abandonedYearDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="originalFunction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.historicalDetails.originalFunctionLabel")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    "create.historicalDetails.originalFunctionPlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.historicalDetails.originalFunctionDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dynastyOrRulership"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.historicalDetails.dynastyLabel")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("create.historicalDetails.dynastyPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.historicalDetails.dynastyDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="architecturalStyle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.historicalDetails.architecturalStyleLabel")}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t(
                        "create.historicalDetails.architecturalStylePlaceholder",
                      )}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {historicalArchitecturalStyleEnum.map((style) => (
                    <SelectItem key={style} value={style}>
                      {t(`enums.architecturalStyle.${style}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                {t("create.historicalDetails.architecturalStyleDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="constructionMaterial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.historicalDetails.constructionMaterialLabel")}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t(
                        "create.historicalDetails.constructionMaterialPlaceholder",
                      )}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {historicalConstructionMaterialEnum.map((material) => (
                    <SelectItem key={material} value={material}>
                      {t(`enums.constructionMaterial.${material}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                {t("create.historicalDetails.constructionMaterialDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="areaInSquareMeters"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("create.historicalDetails.areaLabel")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={t("create.historicalDetails.areaPlaceholder")}
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value
                      ? parseFloat(e.target.value)
                      : "";
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormDescription>
                {t("create.historicalDetails.areaDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastRestorationYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.historicalDetails.lastRestorationLabel")}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={t(
                    "create.historicalDetails.lastRestorationPlaceholder",
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
                {t("create.historicalDetails.lastRestorationDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notablePeople"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>
                {t("create.historicalDetails.notablePeopleLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.historicalDetails.notablePeoplePlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.historicalDetails.notablePeopleDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="historicalEvents"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>
                {t("create.historicalDetails.historicalEventsLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.historicalDetails.historicalEventsPlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.historicalDetails.historicalEventsDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="changeOfOwnership"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>
                {t("create.historicalDetails.ownershipHistoryLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.historicalDetails.ownershipHistoryPlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.historicalDetails.ownershipHistoryDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-full">
          <h3 className="text-lg font-medium mb-4">
            {t("create.historicalDetails.heritageStatusTitle")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="isHeritageSite"
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
                      {t("create.historicalDetails.isHeritageLabel")}
                    </FormLabel>
                    <FormDescription>
                      {t("create.historicalDetails.isHeritageDescription")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heritageDesignation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("create.historicalDetails.heritageDesignationLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "create.historicalDetails.heritageDesignationPlaceholder",
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t(
                      "create.historicalDetails.heritageDesignationDescription",
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heritageListingYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("create.historicalDetails.heritageYearLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t(
                        "create.historicalDetails.heritageYearPlaceholder",
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
                    {t("create.historicalDetails.heritageYearDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heritageReferenceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("create.historicalDetails.heritageReferenceLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "create.historicalDetails.heritageReferencePlaceholder",
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("create.historicalDetails.heritageReferenceDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
