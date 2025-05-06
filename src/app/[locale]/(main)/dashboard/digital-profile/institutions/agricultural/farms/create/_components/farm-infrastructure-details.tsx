"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormData {
  totalAreaInHectares?: number;
  cultivatedAreaInHectares?: number;
  landOwnership?: string;
  hasFarmHouse?: boolean;
  hasStorage?: boolean;
  storageCapacityMT?: number;
  hasFarmEquipment?: boolean;
  equipmentDetails?: string;
  hasElectricity?: boolean;
  hasRoadAccess?: boolean;
  roadAccessType?: string;
  [key: string]: any;
}

interface FarmInfrastructureDetailsProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
}

export default function FarmInfrastructureDetails({
  formData,
  updateFormData,
}: FarmInfrastructureDetailsProps) {
  const t = useTranslations("Farms");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          {t("create.infrastructure.title")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("create.infrastructure.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="totalAreaInHectares">
            {t("create.infrastructure.totalAreaInHectares")}
          </Label>
          <Input
            id="totalAreaInHectares"
            type="number"
            step="0.01"
            min="0"
            value={formData.totalAreaInHectares || ""}
            onChange={(e) =>
              updateFormData(
                "totalAreaInHectares",
                parseFloat(e.target.value) || null,
              )
            }
            placeholder={t(
              "create.infrastructure.totalAreaInHectaresPlaceholder",
            )}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="cultivatedAreaInHectares">
            {t("create.infrastructure.cultivatedAreaInHectares")}
          </Label>
          <Input
            id="cultivatedAreaInHectares"
            type="number"
            step="0.01"
            min="0"
            value={formData.cultivatedAreaInHectares || ""}
            onChange={(e) =>
              updateFormData(
                "cultivatedAreaInHectares",
                parseFloat(e.target.value) || null,
              )
            }
            placeholder={t(
              "create.infrastructure.cultivatedAreaInHectaresPlaceholder",
            )}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="landOwnership">
          {t("create.infrastructure.landOwnership")}
        </Label>
        <Select
          value={formData.landOwnership || ""}
          onValueChange={(value) => updateFormData("landOwnership", value)}
        >
          <SelectTrigger id="landOwnership" className="mt-1">
            <SelectValue
              placeholder={t("create.infrastructure.landOwnershipPlaceholder")}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="OWNED">{t("landOwnership.OWNED")}</SelectItem>
            <SelectItem value="LEASED">{t("landOwnership.LEASED")}</SelectItem>
            <SelectItem value="COMMUNITY">
              {t("landOwnership.COMMUNITY")}
            </SelectItem>
            <SelectItem value="SHARED">{t("landOwnership.SHARED")}</SelectItem>
            <SelectItem value="GOVERNMENT">
              {t("landOwnership.GOVERNMENT")}
            </SelectItem>
            <SelectItem value="MIXED">{t("landOwnership.MIXED")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <h4 className="font-medium mt-6">
        {t("create.infrastructure.facilitiesTitle")}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="hasFarmHouse"
            checked={formData.hasFarmHouse || false}
            onCheckedChange={(checked) =>
              updateFormData("hasFarmHouse", checked)
            }
          />
          <Label htmlFor="hasFarmHouse">
            {t("create.infrastructure.hasFarmHouse")}
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="hasElectricity"
            checked={formData.hasElectricity || false}
            onCheckedChange={(checked) =>
              updateFormData("hasElectricity", checked)
            }
          />
          <Label htmlFor="hasElectricity">
            {t("create.infrastructure.hasElectricity")}
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="hasRoadAccess"
            checked={formData.hasRoadAccess || false}
            onCheckedChange={(checked) =>
              updateFormData("hasRoadAccess", checked)
            }
          />
          <Label htmlFor="hasRoadAccess">
            {t("create.infrastructure.hasRoadAccess")}
          </Label>
        </div>
      </div>

      {formData.hasRoadAccess && (
        <div>
          <Label htmlFor="roadAccessType">
            {t("create.infrastructure.roadAccessType")}
          </Label>
          <Input
            id="roadAccessType"
            value={formData.roadAccessType || ""}
            onChange={(e) => updateFormData("roadAccessType", e.target.value)}
            placeholder={t("create.infrastructure.roadAccessTypePlaceholder")}
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            {t("create.infrastructure.roadAccessTypeHelp")}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="hasStorage"
            checked={formData.hasStorage || false}
            onCheckedChange={(checked) => updateFormData("hasStorage", checked)}
          />
          <Label htmlFor="hasStorage">
            {t("create.infrastructure.hasStorage")}
          </Label>
        </div>

        {formData.hasStorage && (
          <div>
            <Label htmlFor="storageCapacityMT">
              {t("create.infrastructure.storageCapacityMT")}
            </Label>
            <Input
              id="storageCapacityMT"
              type="number"
              step="0.01"
              min="0"
              value={formData.storageCapacityMT || ""}
              onChange={(e) =>
                updateFormData(
                  "storageCapacityMT",
                  parseFloat(e.target.value) || null,
                )
              }
              placeholder={t(
                "create.infrastructure.storageCapacityMTPlaceholder",
              )}
              className="mt-1"
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="hasFarmEquipment"
            checked={formData.hasFarmEquipment || false}
            onCheckedChange={(checked) =>
              updateFormData("hasFarmEquipment", checked)
            }
          />
          <Label htmlFor="hasFarmEquipment">
            {t("create.infrastructure.hasFarmEquipment")}
          </Label>
        </div>

        {formData.hasFarmEquipment && (
          <div>
            <Label htmlFor="equipmentDetails">
              {t("create.infrastructure.equipmentDetails")}
            </Label>
            <Textarea
              id="equipmentDetails"
              value={formData.equipmentDetails || ""}
              onChange={(e) =>
                updateFormData("equipmentDetails", e.target.value)
              }
              placeholder={t(
                "create.infrastructure.equipmentDetailsPlaceholder",
              )}
              className="mt-1"
            />
          </div>
        )}
      </div>
    </div>
  );
}
