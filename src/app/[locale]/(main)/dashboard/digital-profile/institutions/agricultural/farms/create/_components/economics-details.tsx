"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormData {
  // Labor and economics
  familyLaborCount?: number;
  hiredLaborCount?: number;
  annualInvestmentNPR?: number;
  annualIncomeNPR?: number;
  profitableOperation?: boolean;
  marketAccessDetails?: string;
  majorBuyerTypes?: string;

  // Linked entities
  linkedGrazingAreas?: Array<{ id: string; name?: string }>;
  linkedProcessingCenters?: Array<{ id: string; name?: string }>;
  linkedAgricZones?: Array<{ id: string; name?: string }>;
  linkedGrasslands?: Array<{ id: string; name?: string }>;
  [key: string]: any;
}

interface EconomicsDetailsProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
}

export default function EconomicsDetails({
  formData,
  updateFormData,
}: EconomicsDetailsProps) {
  const t = useTranslations("Farms");

  // State for combobox/autocomplete selections
  const [processingCentersSearchTerm, setProcessingCentersSearchTerm] =
    useState("");
  const [agricZonesSearchTerm, setAgricZonesSearchTerm] = useState("");
  const [grazingAreasSearchTerm, setGrazingAreasSearchTerm] = useState("");
  const [grasslandsSearchTerm, setGrasslandsSearchTerm] = useState("");

  // Initialize linked entity arrays
  useEffect(() => {
    if (!formData.linkedProcessingCenters) {
      updateFormData("linkedProcessingCenters", []);
    }
    if (!formData.linkedAgricZones) {
      updateFormData("linkedAgricZones", []);
    }
    if (!formData.linkedGrazingAreas) {
      updateFormData("linkedGrazingAreas", []);
    }
    if (!formData.linkedGrasslands) {
      updateFormData("linkedGrasslands", []);
    }
  }, [formData, updateFormData]);

  // Example fetching of related entities - these would be replaced with actual API calls
  const { data: processingCenters = [] } = api.processingCenter.getAll.useQuery(
    { pageSize: 100 },
    { enabled: true },
  );
  const { data: agricZones = [] } = api.agricZone.getAll.useQuery(
    { pageSize: 100 },
    { enabled: true },
  );
  const { data: grazingAreas = [] } = api.grazingArea.getAll.useQuery(
    { pageSize: 100 },
    { enabled: true },
  );
  const { data: grasslands = [] } = api.grassland.getAll.useQuery(
    { pageSize: 100 },
    { enabled: true },
  );

  // Helper functions for managing linked entities
  const addLinkedEntity = (
    field: keyof FormData,
    entity: { id: string; name: string },
  ) => {
    const currentLinks = [...(formData[field] || [])];
    if (!currentLinks.some((item) => item.id === entity.id)) {
      updateFormData(field, [
        ...currentLinks,
        { id: entity.id, name: entity.name },
      ]);
    }
  };

  const removeLinkedEntity = (field: keyof FormData, entityId: string) => {
    const currentLinks = [...(formData[field] || [])];
    updateFormData(
      field,
      currentLinks.filter((item) => item.id !== entityId),
    );
  };

  return (
    <div className="space-y-8">
      {/* Labor and Economics Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {t("create.economics.laborTitle")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="familyLaborCount">
              {t("create.economics.familyLaborCount")}
            </Label>
            <Input
              id="familyLaborCount"
              type="number"
              min="0"
              value={formData.familyLaborCount || ""}
              onChange={(e) =>
                updateFormData(
                  "familyLaborCount",
                  parseInt(e.target.value) || null,
                )
              }
              placeholder={t("create.economics.familyLaborCountPlaceholder")}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="hiredLaborCount">
              {t("create.economics.hiredLaborCount")}
            </Label>
            <Input
              id="hiredLaborCount"
              type="number"
              min="0"
              value={formData.hiredLaborCount || ""}
              onChange={(e) =>
                updateFormData(
                  "hiredLaborCount",
                  parseInt(e.target.value) || null,
                )
              }
              placeholder={t("create.economics.hiredLaborCountPlaceholder")}
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="annualInvestmentNPR">
              {t("create.economics.annualInvestmentNPR")}
            </Label>
            <Input
              id="annualInvestmentNPR"
              type="number"
              step="0.01"
              min="0"
              value={formData.annualInvestmentNPR || ""}
              onChange={(e) =>
                updateFormData(
                  "annualInvestmentNPR",
                  parseFloat(e.target.value) || null,
                )
              }
              placeholder={t("create.economics.annualInvestmentNPRPlaceholder")}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="annualIncomeNPR">
              {t("create.economics.annualIncomeNPR")}
            </Label>
            <Input
              id="annualIncomeNPR"
              type="number"
              step="0.01"
              min="0"
              value={formData.annualIncomeNPR || ""}
              onChange={(e) =>
                updateFormData(
                  "annualIncomeNPR",
                  parseFloat(e.target.value) || null,
                )
              }
              placeholder={t("create.economics.annualIncomeNPRPlaceholder")}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="profitableOperation"
            checked={formData.profitableOperation !== false} // Default to true if undefined
            onCheckedChange={(checked) =>
              updateFormData("profitableOperation", checked)
            }
          />
          <Label htmlFor="profitableOperation">
            {t("create.economics.profitableOperation")}
          </Label>
        </div>
      </div>

      {/* Market Access Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {t("create.economics.marketTitle")}
        </h3>

        <div>
          <Label htmlFor="marketAccessDetails">
            {t("create.economics.marketAccessDetails")}
          </Label>
          <Textarea
            id="marketAccessDetails"
            value={formData.marketAccessDetails || ""}
            onChange={(e) =>
              updateFormData("marketAccessDetails", e.target.value)
            }
            placeholder={t("create.economics.marketAccessDetailsPlaceholder")}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="majorBuyerTypes">
            {t("create.economics.majorBuyerTypes")}
          </Label>
          <Input
            id="majorBuyerTypes"
            value={formData.majorBuyerTypes || ""}
            onChange={(e) => updateFormData("majorBuyerTypes", e.target.value)}
            placeholder={t("create.economics.majorBuyerTypesPlaceholder")}
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            {t("create.economics.majorBuyerTypesHelp")}
          </p>
        </div>
      </div>

      {/* Linked Entities Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium">
          {t("create.economics.linkedEntitiesTitle")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("create.economics.linkedEntitiesDescription")}
        </p>

        {/* Processing Centers */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>
              {t("create.economics.processingCentersTitle")}
            </CardTitle>
            <CardDescription>
              {t("create.economics.processingCentersDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {t("create.economics.selectProcessingCenter")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="bottom" align="start">
                  <Command>
                    <CommandInput
                      placeholder={t(
                        "create.economics.searchProcessingCenters",
                      )}
                      onValueChange={setProcessingCentersSearchTerm}
                    />
                    <CommandEmpty>
                      {t("create.economics.noProcessingCenters")}
                    </CommandEmpty>
                    <CommandGroup className="max-h-60 overflow-y-auto">
                      {processingCenters?.items?.map((center: any) => (
                        <CommandItem
                          key={center.id}
                          value={center.id}
                          onSelect={() => {
                            addLinkedEntity("linkedProcessingCenters", {
                              id: center.id,
                              name: center.name,
                            });
                          }}
                        >
                          <span>{center.name}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              <div className="flex flex-wrap gap-2 mt-2">
                {formData.linkedProcessingCenters?.map((center) => (
                  <Badge
                    key={center.id}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    {center.name || center.id}
                    <XCircleIcon
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        removeLinkedEntity("linkedProcessingCenters", center.id)
                      }
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agricultural Zones */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>{t("create.economics.agricZonesTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {t("create.economics.selectAgricZone")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="bottom" align="start">
                  <Command>
                    <CommandInput
                      placeholder={t("create.economics.searchAgricZones")}
                      onValueChange={setAgricZonesSearchTerm}
                    />
                    <CommandEmpty>
                      {t("create.economics.noAgricZones")}
                    </CommandEmpty>
                    <CommandGroup className="max-h-60 overflow-y-auto">
                      {agricZones?.items?.map((zone: any) => (
                        <CommandItem
                          key={zone.id}
                          value={zone.id}
                          onSelect={() => {
                            addLinkedEntity("linkedAgricZones", {
                              id: zone.id,
                              name: zone.name,
                            });
                          }}
                        >
                          <span>{zone.name}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              <div className="flex flex-wrap gap-2 mt-2">
                {formData.linkedAgricZones?.map((zone) => (
                  <Badge
                    key={zone.id}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    {zone.name || zone.id}
                    <XCircleIcon
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        removeLinkedEntity("linkedAgricZones", zone.id)
                      }
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grazing Areas and Grasslands */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Grazing Areas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{t("create.economics.grazingAreasTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      {t("create.economics.selectGrazingArea")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" side="bottom" align="start">
                    <Command>
                      <CommandInput
                        placeholder={t("create.economics.searchGrazingAreas")}
                        onValueChange={setGrazingAreasSearchTerm}
                      />
                      <CommandEmpty>
                        {t("create.economics.noGrazingAreas")}
                      </CommandEmpty>
                      <CommandGroup className="max-h-60 overflow-y-auto">
                        {grazingAreas?.items?.map((area: any) => (
                          <CommandItem
                            key={area.id}
                            value={area.id}
                            onSelect={() => {
                              addLinkedEntity("linkedGrazingAreas", {
                                id: area.id,
                                name: area.name,
                              });
                            }}
                          >
                            <span>{area.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.linkedGrazingAreas?.map((area) => (
                    <Badge
                      key={area.id}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {area.name || area.id}
                      <XCircleIcon
                        className="h-3 w-3 cursor-pointer"
                        onClick={() =>
                          removeLinkedEntity("linkedGrazingAreas", area.id)
                        }
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grasslands */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{t("create.economics.grasslandsTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      {t("create.economics.selectGrassland")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" side="bottom" align="start">
                    <Command>
                      <CommandInput
                        placeholder={t("create.economics.searchGrasslands")}
                        onValueChange={setGrasslandsSearchTerm}
                      />
                      <CommandEmpty>
                        {t("create.economics.noGrasslands")}
                      </CommandEmpty>
                      <CommandGroup className="max-h-60 overflow-y-auto">
                        {grasslands?.items?.map((grassland: any) => (
                          <CommandItem
                            key={grassland.id}
                            value={grassland.id}
                            onSelect={() => {
                              addLinkedEntity("linkedGrasslands", {
                                id: grassland.id,
                                name: grassland.name,
                              });
                            }}
                          >
                            <span>{grassland.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.linkedGrasslands?.map((grassland) => (
                    <Badge
                      key={grassland.id}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {grassland.name || grassland.id}
                      <XCircleIcon
                        className="h-3 w-3 cursor-pointer"
                        onClick={() =>
                          removeLinkedEntity("linkedGrasslands", grassland.id)
                        }
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
