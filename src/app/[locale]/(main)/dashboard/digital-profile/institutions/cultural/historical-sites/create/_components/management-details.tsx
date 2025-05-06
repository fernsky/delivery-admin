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

interface ManagementDetailsProps {
  form: UseFormReturn<any>;
}

export default function ManagementDetails({ form }: ManagementDetailsProps) {
  const t = useTranslations("HistoricalSites");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">
          {t("create.management.title")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("create.management.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="managedBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("create.management.managedByLabel")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("create.management.managedByPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.management.managedByDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactPerson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("create.management.contactPersonLabel")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("create.management.contactPersonPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.management.contactPersonDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("create.management.contactPhoneLabel")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("create.management.contactPhonePlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.management.contactPhoneDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("create.management.contactEmailLabel")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("create.management.contactEmailPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.management.contactEmailDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("create.management.websiteLabel")}</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder={t("create.management.websitePlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.management.websiteDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-1 md:col-span-2">
          <h3 className="text-lg font-medium mb-4">
            {t("create.management.openingHoursTitle")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="dailyOpeningTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("create.management.openingTimeLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "create.management.openingTimePlaceholder",
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("create.management.openingTimeDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dailyClosingTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("create.management.closingTimeLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "create.management.closingTimePlaceholder",
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("create.management.closingTimeDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isOpenAllDay"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-8">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      {t("create.management.isOpenAllDayLabel")}
                    </FormLabel>
                    <FormDescription>
                      {t("create.management.isOpenAllDayDescription")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="weeklyClosedDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("create.management.closedDaysLabel")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("create.management.closedDaysPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.management.closedDaysDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-1"></div>

        <div className="col-span-1 md:col-span-2">
          <h3 className="text-lg font-medium mb-4">
            {t("create.management.preservationTitle")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="hasRegularMaintenance"
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
                      {t("create.management.hasMaintenanceLabel")}
                    </FormLabel>
                    <FormDescription>
                      {t("create.management.hasMaintenanceDescription")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="maintenanceDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.management.maintenanceDetailsLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.management.maintenanceDetailsPlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.management.maintenanceDetailsDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="restorationDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.management.restorationDetailsLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.management.restorationDetailsPlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.management.restorationDetailsDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fundingSource"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("create.management.fundingSourceLabel")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("create.management.fundingSourcePlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.management.fundingSourceDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="conservationChallenges"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.management.conservationChallengesLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.management.conservationChallengesPlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.management.conservationChallengesDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
