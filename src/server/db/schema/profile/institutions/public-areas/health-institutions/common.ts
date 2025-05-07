import { pgEnum } from "drizzle-orm/pg-core";

// Define institution ownership type enum
export const healthInstitutionOwnershipEnum = pgEnum(
  "health_institution_ownership",
  [
    "GOVERNMENT",
    "PRIVATE",
    "COMMUNITY",
    "NGO",
    "INGO",
    "COOPERATIVE",
    "RELIGIOUS",
    "TRUST",
    "PUBLIC_PRIVATE_PARTNERSHIP",
    "OTHER",
  ],
);

// Define institution building condition enum
export const healthBuildingConditionEnum = pgEnum("health_building_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "NEEDS_REPAIR",
  "NEEDS_RECONSTRUCTION",
  "UNDER_CONSTRUCTION",
  "TEMPORARY",
  "RENTED",
]);

// Define service availability status enum
export const serviceAvailabilityEnum = pgEnum("service_availability", [
  "24_7",
  "DAILY_REGULAR_HOURS",
  "WEEKDAYS_ONLY",
  "SPECIFIC_DAYS",
  "ON_CALL",
  "PERIODIC",
  "UNAVAILABLE",
]);

// Define facility status enum
export const healthFacilityStatusEnum = pgEnum("health_facility_status", [
  "EXCELLENT",
  "ADEQUATE",
  "LIMITED",
  "INADEQUATE",
  "UNAVAILABLE",
  "UNDER_DEVELOPMENT",
]);

// Define earthquake safety enum
export const buildingEarthquakeSafetyEnum = pgEnum(
  "building_earthquake_safety",
  [
    "EARTHQUAKE_RESISTANT",
    "RETROFITTED",
    "ASSESSED_SAFE",
    "NEEDS_RETROFITTING",
    "NOT_ASSESSED",
    "UNSAFE",
    "UNDER_ASSESSMENT",
  ],
);

// Define performance level enum
export const healthPerformanceLevelEnum = pgEnum("health_performance_level", [
  "EXCELLENT",
  "GOOD",
  "AVERAGE",
  "BELOW_AVERAGE",
  "POOR",
  "UNASSESSED",
]);

// Define infrastructure adequacy enum
export const infrastructureAdequacyEnum = pgEnum("infrastructure_adequacy", [
  "HIGHLY_ADEQUATE",
  "ADEQUATE",
  "SOMEWHAT_ADEQUATE",
  "INADEQUATE",
  "HIGHLY_INADEQUATE",
]);

// Define service capacity level enum
export const serviceCapacityEnum = pgEnum("service_capacity", [
  "EXCEEDS_DEMAND",
  "MEETS_DEMAND",
  "SLIGHTLY_UNDER_CAPACITY",
  "SIGNIFICANTLY_UNDER_CAPACITY",
  "CRITICAL_SHORTAGE",
]);

// Define emergency preparedness enum
export const emergencyPreparednessEnum = pgEnum("emergency_preparedness", [
  "WELL_PREPARED",
  "ADEQUATELY_PREPARED",
  "SOMEWHAT_PREPARED",
  "POORLY_PREPARED",
  "UNPREPARED",
]);

// Define accessibility level enum
export const accessibilityLevelEnum = pgEnum("accessibility_level", [
  "HIGHLY_ACCESSIBLE",
  "ACCESSIBLE",
  "MODERATELY_ACCESSIBLE",
  "POORLY_ACCESSIBLE",
  "INACCESSIBLE",
]);

// Define sanitation level enum
export const sanitationLevelEnum = pgEnum("sanitation_level", [
  "EXCELLENT",
  "GOOD",
  "ACCEPTABLE",
  "POOR",
  "VERY_POOR",
]);
