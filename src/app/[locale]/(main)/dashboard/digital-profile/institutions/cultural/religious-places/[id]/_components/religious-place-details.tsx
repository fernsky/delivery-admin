"use client";

import { ReligiousPlaceBasicInfo } from "./details-sections/basic-info";
import { ReligiousPlacePhysicalDetails } from "./details-sections/physical-details";
import { ReligiousPlaceReligiousDetails } from "./details-sections/religious-details";
import { ReligiousPlaceFestivalsDetails } from "./details-sections/festivals-details";
import { ReligiousPlaceCulturalDetails } from "./details-sections/cultural-details";
import { ReligiousPlaceManagement } from "./details-sections/management-details";
import { ReligiousPlaceInfrastructure } from "./details-sections/infrastructure-details";
import { ReligiousPlaceCulturalAssets } from "./details-sections/cultural-assets";
import { ReligiousPlaceConservation } from "./details-sections/conservation-details";
import { ReligiousPlaceVisitorInfo } from "./details-sections/visitor-info";
import { ReligiousPlaceCommunity } from "./details-sections/community-details";
import { ReligiousPlaceEconomic } from "./details-sections/economic-details";
import { ReligiousPlaceEnvironmental } from "./details-sections/environmental-details";
import { ReligiousPlaceChallenges } from "./details-sections/challenges-details";

interface ReligiousPlaceDetailsProps {
  religiousPlace: any;
}

export function ReligiousPlaceDetails({
  religiousPlace,
}: ReligiousPlaceDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <ReligiousPlaceBasicInfo religiousPlace={religiousPlace} />

      {/* Physical Details */}
      <ReligiousPlacePhysicalDetails religiousPlace={religiousPlace} />

      {/* Religious Details */}
      <ReligiousPlaceReligiousDetails religiousPlace={religiousPlace} />

      {/* Festivals */}
      <ReligiousPlaceFestivalsDetails religiousPlace={religiousPlace} />

      {/* Cultural and Historical Significance */}
      <ReligiousPlaceCulturalDetails religiousPlace={religiousPlace} />

      {/* Management and Operations */}
      <ReligiousPlaceManagement religiousPlace={religiousPlace} />

      {/* Infrastructure and Facilities */}
      <ReligiousPlaceInfrastructure religiousPlace={religiousPlace} />

      {/* Cultural Assets */}
      <ReligiousPlaceCulturalAssets religiousPlace={religiousPlace} />

      {/* Conservation and Restoration */}
      <ReligiousPlaceConservation religiousPlace={religiousPlace} />

      {/* Visitor Information */}
      <ReligiousPlaceVisitorInfo religiousPlace={religiousPlace} />

      {/* Community Engagement */}
      <ReligiousPlaceCommunity religiousPlace={religiousPlace} />

      {/* Economic Aspects */}
      <ReligiousPlaceEconomic religiousPlace={religiousPlace} />

      {/* Environmental Aspects */}
      <ReligiousPlaceEnvironmental religiousPlace={religiousPlace} />

      {/* Challenges and Plans */}
      <ReligiousPlaceChallenges religiousPlace={religiousPlace} />
    </div>
  );
}
