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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { historicalPreservationStatusEnum } from "@/utils/enums/historical-sites-enums";

interface InfrastructureDetailsProps {
  form: UseFormReturn<any>;
}

export default function InfrastructureDetails({
  form,
}: InfrastructureDetailsProps) {
  const t = useTranslations("HistoricalSites");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">
          {t("create.infrastructure.title")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("create.infrastructure.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="totalStructureCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.infrastructure.structureCountLabel")}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={t(
                    "create.infrastructure.structureCountPlaceholder",
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
                {t("create.infrastructure.structureCountDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preservationStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("create.infrastructure.preservationStatusLabel")}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t(
                        "create.infrastructure.preservationStatusPlaceholder",
                      )}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {historicalPreservationStatusEnum.map((status) => (
                    <SelectItem key={status} value={status}>
                      {t(`enums.preservationStatus.${status}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                {t("create.infrastructure.preservationStatusDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-2 md:col-span-1">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="hasMainBuilding"
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
                      {t("create.infrastructure.hasMainBuildingLabel")}
                    </FormLabel>
                    <FormDescription>
                      {t("create.infrastructure.hasMainBuildingDescription")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasDefensiveWalls"
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
                      {t("create.infrastructure.hasDefensiveWallsLabel")}
                    </FormLabel>
                    <FormDescription>
                      {t("create.infrastructure.hasDefensiveWallsDescription")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasTowers"
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
                      {t("create.infrastructure.hasTowersLabel")}
                    </FormLabel>
                    <FormDescription>
                      {t("create.infrastructure.hasTowersDescription")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasMoat"
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
                      {t("create.infrastructure.hasMoatLabel")}
                    </FormLabel>
                    <FormDescription>
                      {t("create.infrastructure.hasMoatDescription")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="col-span-2 md:col-span-1">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="hasGardens"
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
                      {t("create.infrastructure.hasGardensLabel")}
                    </FormLabel>
                    <FormDescription>
                      {t("create.infrastructure.hasGardensDescription")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasCourtyards"
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
                      {t("create.infrastructure.hasCourtyardsLabel")}
                    </FormLabel>
                    <FormDescription>
                      {t("create.infrastructure.hasCourtyardsDescription")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasUndergroundStructures"
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
                      {t("create.infrastructure.hasUndergroundStructuresLabel")}
                    </FormLabel>
                    <FormDescription>
                      {t(
                        "create.infrastructure.hasUndergroundStructuresDescription",
                      )}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasDurbar"
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
                      {t("create.infrastructure.hasDurbarLabel")}
                    </FormLabel>
                    <FormDescription>
                      {t("create.infrastructure.hasDurbarDescription")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasTemple"
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
                      {t("create.infrastructure.hasTempleLabel")}
                    </FormLabel>
                    <FormDescription>
                      {t("create.infrastructure.hasTempleDescription")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasArtificialWaterBody"
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
                      {t("create.infrastructure.hasWaterBodyLabel")}
                    </FormLabel>
                    <FormDescription>
                      {t("create.infrastructure.hasWaterBodyDescription")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="structureDetails"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>
                {t("create.infrastructure.structureDetailsLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.infrastructure.structureDetailsPlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.infrastructure.structureDetailsDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="architecturalElements"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>
                {t("create.infrastructure.architecturalElementsLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.infrastructure.architecturalElementsPlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.infrastructure.architecturalElementsDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notableFeatures"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>
                {t("create.infrastructure.notableFeaturesLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.infrastructure.notableFeaturesPlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.infrastructure.notableFeaturesDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="undergroundDetails"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>
                {t("create.infrastructure.undergroundDetailsLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.infrastructure.undergroundDetailsPlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.infrastructure.undergroundDetailsDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="waterBodyDetails"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>
                {t("create.infrastructure.waterBodyDetailsLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "create.infrastructure.waterBodyDetailsPlaceholder",
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("create.infrastructure.waterBodyDetailsDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">
          {t("create.infrastructure.facilitiesTitle")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="hasParking"
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
                    {t("create.infrastructure.hasParkingLabel")}
                  </FormLabel>
                  <FormDescription>
                    {t("create.infrastructure.hasParkingDescription")}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasToilets"
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
                    {t("create.infrastructure.hasToiletsLabel")}
                  </FormLabel>
                  <FormDescription>
                    {t("create.infrastructure.hasToiletsDescription")}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasHandicapAccess"
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
                    {t("create.infrastructure.hasHandicapAccessLabel")}
                  </FormLabel>
                  <FormDescription>
                    {t("create.infrastructure.hasHandicapAccessDescription")}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasElectricity"
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
                    {t("create.infrastructure.hasElectricityLabel")}
                  </FormLabel>
                  <FormDescription>
                    {t("create.infrastructure.hasElectricityDescription")}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasWaterSupply"
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
                    {t("create.infrastructure.hasWaterSupplyLabel")}
                  </FormLabel>
                  <FormDescription>
                    {t("create.infrastructure.hasWaterSupplyDescription")}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasCafeteria"
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
                    {t("create.infrastructure.hasCafeteriaLabel")}
                  </FormLabel>
                  <FormDescription>
                    {t("create.infrastructure.hasCafeteriaDescription")}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasGiftShop"
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
                    {t("create.infrastructure.hasGiftShopLabel")}
                  </FormLabel>
                  <FormDescription>
                    {t("create.infrastructure.hasGiftShopDescription")}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
