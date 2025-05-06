"use client";

import { Card } from "@/components/ui/card";
import { FishFarmBasicInfo } from "./details/fish-farm-basic-info";
import { FishFarmWaterDetails } from "./details/fish-farm-water-details";
import { FishFarmCultureDetails } from "./details/fish-farm-culture-details";
import { FishFarmProductionDetails } from "./details/fish-farm-production-details";
import { FishFarmInfrastructure } from "./details/fish-farm-infrastructure";
import { FishFarmEconomics } from "./details/fish-farm-economics";
import { FishFarmSustainability } from "./details/fish-farm-sustainability";
import { FishFarmPersonnel } from "./details/fish-farm-personnel";
import { FishFarmMeta } from "./details/fish-farm-meta";

interface FishFarmDetailsProps {
  fishFarm: any;
}

export function FishFarmDetails({ fishFarm }: FishFarmDetailsProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        {/* Basic Information */}
        <FishFarmBasicInfo fishFarm={fishFarm} />

        {/* Water Body Details */}
        <FishFarmWaterDetails fishFarm={fishFarm} />

        {/* Culture and Management */}
        <FishFarmCultureDetails fishFarm={fishFarm} />

        {/* Production Details */}
        <FishFarmProductionDetails fishFarm={fishFarm} />

        {/* Infrastructure */}
        <FishFarmInfrastructure fishFarm={fishFarm} />

        {/* Personnel and Management */}
        <FishFarmPersonnel fishFarm={fishFarm} />

        {/* Economics Details */}
        <FishFarmEconomics fishFarm={fishFarm} />

        {/* Sustainability and Environmental */}
        <FishFarmSustainability fishFarm={fishFarm} />

        {/* Metadata */}
        <FishFarmMeta fishFarm={fishFarm} />
      </Card>
    </div>
  );
}
