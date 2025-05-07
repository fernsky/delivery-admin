"use client";

import { HistoricalSiteBasicInfo } from "./details-sections/basic-info";
import { HistoricalSitePhysicalDetails } from "./details-sections/physical-details";
import { HistoricalContextDetails } from "./details-sections/historical-context";
import { HeritageStatusDetails } from "./details-sections/heritage-status";
import { InscriptionDetails } from "./details-sections/inscription-details";
import { HistoricalSiteManagement } from "./details-sections/management-details";
import { HistoricalInfrastructure } from "./details-sections/infrastructure-details";
import { CulturalSignificanceDetails } from "./details-sections/cultural-significance";
import { PreservationDetails } from "./details-sections/preservation-details";
import { HistoricalSiteVisitorInfo } from "./details-sections/visitor-info";
import { ResearchDetails } from "./details-sections/research-details";
import { CommunityEngagementDetails } from "./details-sections/community-engagement";
import { HistoricalSiteEnvironmental } from "./details-sections/environmental-details";
import { HistoricalSiteChallenges } from "./details-sections/challenges-details";
import { ArchaeologicalDetails } from "./details-sections/archaeological-details";
import { SecurityDetails } from "./details-sections/security-details";

interface HistoricalSiteDetailsProps {
  historicalSite: any;
}

export function HistoricalSiteDetails({
  historicalSite,
}: HistoricalSiteDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <HistoricalSiteBasicInfo historicalSite={historicalSite} />

      {/* Physical Details */}
      <HistoricalSitePhysicalDetails historicalSite={historicalSite} />

      {/* Historical Context */}
      <HistoricalContextDetails historicalSite={historicalSite} />

      {/* Heritage Status */}
      <HeritageStatusDetails historicalSite={historicalSite} />

      {/* Inscription Details */}
      <InscriptionDetails historicalSite={historicalSite} />

      {/* Archaeological Details */}
      <ArchaeologicalDetails historicalSite={historicalSite} />

      {/* Cultural Significance */}
      <CulturalSignificanceDetails historicalSite={historicalSite} />

      {/* Management and Operations */}
      <HistoricalSiteManagement historicalSite={historicalSite} />

      {/* Infrastructure and Facilities */}
      <HistoricalInfrastructure historicalSite={historicalSite} />

      {/* Security Details */}
      <SecurityDetails historicalSite={historicalSite} />

      {/* Preservation and Restoration */}
      <PreservationDetails historicalSite={historicalSite} />

      {/* Visitor Information */}
      <HistoricalSiteVisitorInfo historicalSite={historicalSite} />

      {/* Research and Education */}
      <ResearchDetails historicalSite={historicalSite} />

      {/* Community Engagement */}
      <CommunityEngagementDetails historicalSite={historicalSite} />

      {/* Environmental Aspects */}
      <HistoricalSiteEnvironmental historicalSite={historicalSite} />

      {/* Challenges and Plans */}
      <HistoricalSiteChallenges historicalSite={historicalSite} />
    </div>
  );
}
