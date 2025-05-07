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
import { historicalSiteTypeEnum } from "@/utils/enums/historical-sites-enums";

interface BasicHistoricalSiteDetailsProps {
  form: UseFormReturn<any>;
}

export default function BasicHistoricalSiteDetails({
  form,
}: BasicHistoricalSiteDetailsProps) {
  const t = useTranslations("HistoricalSites");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">
          {t("create.basicDetails.title")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("create.basicDetails.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("create.basicDetails.nameLabel")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("create.basicDetails.namePlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.basicDetails.nameDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("create.basicDetails.typeLabel")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("create.basicDetails.typePlaceholder")}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {historicalSiteTypeEnum.map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(`enums.historicalSiteType.${type}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                {t("create.basicDetails.typeDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="wardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("create.basicDetails.wardNumberLabel")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={t("create.basicDetails.wardNumberPlaceholder")}
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
                {t("create.basicDetails.wardNumberDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("create.basicDetails.locationLabel")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("create.basicDetails.locationPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.basicDetails.locationDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("create.basicDetails.addressLabel")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("create.basicDetails.addressPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.basicDetails.addressDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-1 md:col-span-2">
              <FormLabel>{t("create.basicDetails.descriptionLabel")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("create.basicDetails.descriptionPlaceholder")}
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.basicDetails.descriptionDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
