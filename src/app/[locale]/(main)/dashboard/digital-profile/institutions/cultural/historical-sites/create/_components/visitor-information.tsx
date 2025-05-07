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

interface VisitorInformationProps {
  form: UseFormReturn<any>;
}

export default function VisitorInformation({ form }: VisitorInformationProps) {
  const t = useTranslations("HistoricalSites");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">
          {t("create.visitorInfo.title")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("create.visitorInfo.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="estimatedDailyVisitors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.visitorInfo.dailyVisitorsLabel")}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={t("create.visitorInfo.dailyVisitorsPlaceholder")}
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
                {t("create.visitorInfo.dailyVisitorsDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estimatedYearlyVisitors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.visitorInfo.yearlyVisitorsLabel")}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={t(
                    "create.visitorInfo.yearlyVisitorsPlaceholder",
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
                {t("create.visitorInfo.yearlyVisitorsDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="peakVisitationMonths"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("create.visitorInfo.peakMonthsLabel")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("create.visitorInfo.peakMonthsPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.visitorInfo.peakMonthsDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="visitDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.visitorInfo.visitDurationLabel")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("create.visitorInfo.visitDurationPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.visitorInfo.visitDurationDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-2 md:col-span-1">
          <FormField
            control={form.control}
            name="hasOverseasVisitors"
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
                    {t("create.visitorInfo.hasOverseasVisitorsLabel")}
                  </FormLabel>
                  <FormDescription>
                    {t("create.visitorInfo.hasOverseasVisitorsDescription")}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <FormField
            control={form.control}
            name="guidesAvailable"
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
                    {t("create.visitorInfo.guidesAvailableLabel")}
                  </FormLabel>
                  <FormDescription>
                    {t("create.visitorInfo.guidesAvailableDescription")}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="entryFeeNPR"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("create.visitorInfo.entryFeeLabel")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={t("create.visitorInfo.entryFeePlaceholder")}
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
                {t("create.visitorInfo.entryFeeDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="entryFeeDetailsForeigners"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("create.visitorInfo.foreignerFeeLabel")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("create.visitorInfo.foreignerFeePlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.visitorInfo.foreignerFeeDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-2">
          <h3 className="text-lg font-medium mb-4">
            {t("create.visitorInfo.photoAndTourismTitle")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="photoAllowed"
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
                      {t("create.visitorInfo.photoAllowedLabel")}
                    </FormLabel>
                    <FormDescription>
                      {t("create.visitorInfo.photoAllowedDescription")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasTourismInfrastructure"
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
                      {t("create.visitorInfo.tourismInfrastructureLabel")}
                    </FormLabel>
                    <FormDescription>
                      {t("create.visitorInfo.tourismInfrastructureDescription")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="photoRestrictions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.visitorInfo.photoRestrictionsLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.visitorInfo.photoRestrictionsPlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.visitorInfo.photoRestrictionsDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tourismDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.visitorInfo.tourismDetailsLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.visitorInfo.tourismDetailsPlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.visitorInfo.tourismDetailsDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="visitorFacilities"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                {t("create.visitorInfo.visitorFacilitiesLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.visitorInfo.visitorFacilitiesPlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.visitorInfo.visitorFacilitiesDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
