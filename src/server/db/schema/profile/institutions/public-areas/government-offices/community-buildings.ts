import { pgTable } from "../../../../../schema/basic";
import {
  integer,
  timestamp,
  varchar,
  text,
  boolean,
  pgEnum,
  decimal,
  jsonb,
  time,
  date,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { geometry } from "../../../../../geographical";
import { generateSlug } from "@/server/utils/slug-helpers";
import { buildingConditionEnum } from "./municipality-offices";

// Define community building type enum
export const communityBuildingTypeEnum = pgEnum("community_building_type", [
  "COMMUNITY_HALL",
  "MEETING_CENTER",
  "MULTIPURPOSE_BUILDING",
  "COOPERATIVE_BUILDING",
  "COMMUNITY_LIBRARY",
  "CULTURAL_CENTER",
  "YOUTH_CENTER",
  "SENIOR_CITIZEN_CENTER",
  "WOMEN_CENTER",
  "DISASTER_SHELTER",
  "INFORMATION_CENTER",
  "TRAINING_CENTER",
  "OTHER",
]);

// Define management type enum
export const managementTypeEnum = pgEnum("management_type", [
  "GOVERNMENT_MANAGED",
  "COMMUNITY_MANAGED",
  "NGO_MANAGED",
  "PRIVATE_PUBLIC_PARTNERSHIP",
  "COOPERATIVE_MANAGED",
  "USER_COMMITTEE_MANAGED",
  "OTHER",
]);

// Define usage frequency enum
export const usageFrequencyEnum = pgEnum("usage_frequency", [
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "OCCASIONALLY",
  "SEASONALLY",
  "RARELY",
  "NOT_IN_USE",
]);

// Define accessibility level enum
export const accessibilityLevelEnum = pgEnum("accessibility_level", [
  "HIGHLY_ACCESSIBLE",
  "MODERATELY_ACCESSIBLE",
  "LIMITED_ACCESSIBILITY",
  "POORLY_ACCESSIBLE",
  "NOT_ACCESSIBLE",
]);

// Community Building table
export const communityBuilding = pgTable("community_building", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  buildingType: communityBuildingTypeEnum("building_type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Basic information
  establishedYear: integer("established_year"),
  managementType: managementTypeEnum("management_type").notNull(),
  managingBody: text("managing_body"), // Name of the committee/organization managing
  registrationNumber: varchar("registration_number", { length: 50 }),
  registeredWith: text("registered_with"), // Which govt body it's registered with

  // Physical infrastructure
  totalAreaSqm: decimal("total_area_sq_m", { precision: 10, scale: 2 }),
  buildingCondition: buildingConditionEnum("building_condition"),
  constructionYear: integer("construction_year"),
  lastRenovatedYear: integer("last_renovated_year"),
  totalFloors: integer("total_floors"),
  totalRooms: integer("total_rooms"),
  mainHallCapacity: integer("main_hall_capacity"), // Number of people
  hasStage: boolean("has_stage").default(false),
  hasSoundSystem: boolean("has_sound_system").default(false),
  hasProjector: boolean("has_projector").default(false),
  chairsCount: integer("chairs_count"),
  tablesCount: integer("tables_count"),
  hasKitchen: boolean("has_kitchen").default(false),
  hasStorage: boolean("has_storage").default(false),
  hasOffice: boolean("has_office").default(false),

  // Basic facilities
  hasElectricity: boolean("has_electricity").default(true),
  hasPowerBackup: boolean("has_power_backup").default(false),
  powerBackupType: text("power_backup_type"), // E.g., "Generator", "Solar", "UPS"
  hasWaterSupply: boolean("has_water_supply").default(true),
  waterSourceType: text("water_source_type"), // E.g., "Municipal", "Well", "Tanker"
  hasInternetConnectivity: boolean("has_internet_connectivity").default(false),
  internetType: text("internet_type"), // E.g., "Fiber", "DSL", "4G"
  hasHeatingSystem: boolean("has_heating_system").default(false),
  hasCoolingSystem: boolean("has_cooling_system").default(false),

  // Public facilities
  hasPublicToilets: boolean("has_public_toilets").default(true),
  maleToiletsCount: integer("male_toilets_count"),
  femaleToiletsCount: integer("female_toilets_count"),
  hasHandicapToilets: boolean("has_handicap_toilets").default(false),
  hasDrinkingWater: boolean("has_drinking_water").default(false),
  hasParking: boolean("has_parking").default(false),
  parkingCapacity: integer("parking_capacity"),
  hasDisabledAccess: boolean("has_disabled_access").default(false),

  // Usage and operations
  mainPurposes: text("main_purposes"), // What the building is primarily used for
  usageFrequency: usageFrequencyEnum("usage_frequency"),
  averageMonthlyUsers: integer("average_monthly_users"),
  majorEvents: text("major_events"), // Description of major events held
  regularActivities: text("regular_activities"),
  isOpenToPublic: boolean("is_open_to_public").default(true),
  accessRestrictions: text("access_restrictions"),
  openingTime: time("opening_time"),
  closingTime: time("closing_time"),
  weeklyOffDays: text("weekly_off_days"), // E.g., "Saturday" or "Sunday"

  // Booking and fees
  canBeBooked: boolean("can_be_booked").default(true),
  bookingProcedure: text("booking_procedure"),
  rentalFeeStructure: text("rental_fee_structure"),
  averageDailyRentalFeeNPR: decimal("average_daily_rental_fee_npr", {
    precision: 10,
    scale: 2,
  }),
  discountForCommunityMembers: boolean(
    "discount_for_community_members",
  ).default(false),
  feeWaiverConditions: text("fee_waiver_conditions"),

  // Management and staff
  managementCommitteeSize: integer("management_committee_size"),
  womenInManagementCommittee: integer("women_in_management_committee"),
  dalitsInManagementCommittee: integer("dalits_in_management_committee"),
  managementCommitteeFormationDate: date("management_committee_formation_date"),
  managementCommitteeTenureYears: integer("management_committee_tenure_years"),
  hasCaretaker: boolean("has_caretaker").default(false),
  permanentStaffCount: integer("permanent_staff_count"),
  temporaryStaffCount: integer("temporary_staff_count"),

  // Financial aspects
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 18, scale: 2 }),
  maintenanceFundNPR: decimal("maintenance_fund_npr", {
    precision: 14,
    scale: 2,
  }),
  incomeSources: text("income_sources"),
  majorExpenses: text("major_expenses"),
  hasRegularAudit: boolean("has_regular_audit").default(false),
  lastAuditDate: date("last_audit_date"),
  receivesExternalFunding: boolean("receives_external_funding").default(false),
  externalFundingSources: text("external_funding_sources"),

  // Accessibility and inclusion
  accessibilityLevel: accessibilityLevelEnum("accessibility_level"),
  distanceFromMainRoadKm: decimal("distance_from_main_road_km", {
    precision: 6,
    scale: 2,
  }),
  distanceFromCityOrBazarKm: decimal("distance_from_city_or_bazar_km", {
    precision: 6,
    scale: 2,
  }),
  publicTransportAccessibility: text("public_transport_accessibility"),
  facilitiesForWomen: text("facilities_for_women"),
  facilitiesForChildren: text("facilities_for_children"),
  facilitiesForElderly: text("facilities_for_elderly"),
  facilitiesForDisabled: text("facilities_for_disabled"),

  // Environmental aspects
  hasGardenArea: boolean("has_garden_area").default(false),
  gardenAreaSqm: decimal("garden_area_sq_m", { precision: 10, scale: 2 }),
  hasTreePlantation: boolean("has_tree_plantation").default(false),
  hasWasteManagement: boolean("has_waste_management").default(false),
  wasteManagementType: text("waste_management_type"),
  hasRainwaterHarvesting: boolean("has_rainwater_harvesting").default(false),
  hasSolarPanels: boolean("has_solar_panels").default(false),
  solarCapacityKW: decimal("solar_capacity_kw", { precision: 8, scale: 2 }),

  // Security and safety
  hasSecurityPersonnel: boolean("has_security_personnel").default(false),
  securityPersonnelCount: integer("security_personnel_count"),
  hasCctv: boolean("has_cctv").default(false),
  cctvCameraCount: integer("cctv_camera_count"),
  hasFireSafetyEquipment: boolean("has_fire_safety_equipment").default(false),
  fireSafetyEquipmentDetails: text("fire_safety_equipment_details"),
  hasEmergencyExits: boolean("has_emergency_exits").default(false),
  emergencyExitCount: integer("emergency_exit_count"),
  hasFirstAidKit: boolean("has_first_aid_kit").default(false),

  // Services and activities
  offersTrainingPrograms: boolean("offers_training_programs").default(false),
  trainingProgramTypes: text("training_program_types"),
  offersCommunityMeetings: boolean("offers_community_meetings").default(true),
  offersCulturalEvents: boolean("offers_cultural_events").default(false),
  offersYouthActivities: boolean("offers_youth_activities").default(false),
  offersWomenActivities: boolean("offers_women_activities").default(false),
  offersElderlyActivities: boolean("offers_elderly_activities").default(false),
  offersLibraryServices: boolean("offers_library_services").default(false),
  hasComputerLab: boolean("has_computer_lab").default(false),
  computerCount: integer("computer_count"),
  offersInternet: boolean("offers_internet").default(false),
  additionalServiceDetails: text("additional_service_details"),

  // Community involvement
  communityParticipationLevel: text("community_participation_level"),
  annualEventCount: integer("annual_event_count"),
  communityContributionType: text("community_contribution_type"), // Labor, cash, materials, etc.
  communityManagementDescription: text("community_management_description"),

  // Governance and transparency
  hasOperationalManual: boolean("has_operational_manual").default(false),
  hasPublicNoticeBoard: boolean("has_public_notice_board").default(false),
  publicMeetingsFrequency: text("public_meetings_frequency"),
  decisionMakingProcess: text("decision_making_process"),
  transparencyMeasures: text("transparency_measures"),

  // Usage statistics
  maleUserPercentage: integer("male_user_percentage"),
  femaleUserPercentage: integer("female_user_percentage"),
  childUserPercentage: integer("child_user_percentage"),
  youthUserPercentage: integer("youth_user_percentage"),
  adultUserPercentage: integer("adult_user_percentage"),
  elderlyUserPercentage: integer("elderly_user_percentage"),

  // Plans and needs
  futureDevelopmentPlans: text("future_development_plans"),
  maintenanceNeeds: text("maintenance_needs"),
  infrastructureNeeds: text("infrastructure_needs"),
  expandInFuture: boolean("expand_in_future").default(false),
  expansionPlans: text("expansion_plans"),

  // Contact information
  contactPersonName: text("contact_person_name"),
  contactPersonTitle: text("contact_person_title"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  alternateContactName: text("alternate_contact_name"),
  alternateContactPhone: text("alternate_contact_phone"),

  // Social media and online presence
  facebookPage: text("facebook_page"),
  websiteUrl: text("website_url"),
  otherSocialMedia: text("other_social_media"),

  // Challenges and issues
  infrastructureChallenges: text("infrastructure_challenges"),
  managementChallenges: text("management_challenges"),
  financialChallenges: text("financial_challenges"),
  communityRelatedChallenges: text("community_related_challenges"),

  // Linkages to other entities
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedCommunityGroups: jsonb("linked_community_groups").default(
    sql`'[]'::jsonb`,
  ),
  linkedSchools: jsonb("linked_schools").default(sql`'[]'::jsonb`),
  linkedNGOs: jsonb("linked_ngos").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  buildingFootprint: geometry("building_footprint", { type: "Polygon" }),
  compoundArea: geometry("compound_area", { type: "Polygon" }),

  // Status and metadata
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),
  verificationDate: timestamp("verification_date"),
  verifiedBy: varchar("verified_by", { length: 36 }),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
  createdBy: varchar("created_by", { length: 36 }),
  updatedBy: varchar("updated_by", { length: 36 }),
});

export type CommunityBuilding = typeof communityBuilding.$inferSelect;
export type NewCommunityBuilding = typeof communityBuilding.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
