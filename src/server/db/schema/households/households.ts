import {
  pgTable,
  text,
  integer,
  decimal,
  timestamp,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";
import { postgis } from "../../postgis";

// Enum for household status
export const householdStatusEnum = pgEnum("household_status_enum", [
  "approved",
  "pending",
  "requested_for_edit",
  "rejected",
]);

// Main household table
export const households = pgTable("acme_khajura_household", {
  // Primary identification
  id: text("id").primaryKey().notNull(),
  profileId: text("profile_id").default("khajura"),
  
  // Location information
  province: text("province"),
  district: text("district"),
  localLevel: text("local_level"),
  wardNo: integer("ward_no"),
  houseSymbolNo: text("house_symbol_no"),
  familySymbolNo: text("family_symbol_no"),
  dateOfInterview: timestamp("date_of_interview"),
  householdLocation: text("household_location").array(),
  locality: text("locality"),
  developmentOrganization: text("development_organization"),
  
  // Family information
  familyHeadName: text("family_head_name"),
  familyHeadPhoneNo: text("family_head_phone_no"),
  totalMembers: integer("total_members"),
  areMembersElsewhere: text("are_members_elsewhere"),
  totalElsewhereMembers: integer("total_elsewhere_members"),
  
  // House details
  houseOwnership: text("house_ownership"),
  houseOwnershipOther: text("house_ownership_other"),
  landOwnership: text("land_ownership"),
  landOwnershipOther: text("land_ownership_other"),
  houseBase: text("house_base"),
  houseBaseOther: text("house_base_other"),
  houseOuterWall: text("house_outer_wall"),
  houseOuterWallOther: text("house_outer_wall_other"),
  houseRoof: text("house_roof"),
  houseRoofOther: text("house_roof_other"),
  houseFloor: text("house_floor"),
  houseFloorOther: text("house_floor_other"),
  houseFloors: integer("house_floors"),
  roomCount: integer("room_count"),
  
  // Safety information
  isHousePassed: text("is_house_passed"),
  isMapArchived: text("is_map_archived"),
  isEarthquakeResistant: text("is_earthquake_resistant"),
  disasterRiskStatus: text("disaster_risk_status"),
  naturalDisasters: text("natural_disasters").array(),
  isSafe: text("is_safe"),
  
  // Water, sanitation and energy
  waterSource: text("water_source"),
  waterPurificationMethods: text("water_purification_methods").array(),
  toiletType: text("toilet_type"),
  solidWasteManagement: text("solid_waste_management"),
  primaryCookingFuel: text("primary_cooking_fuel"),
  primaryEnergySource: text("primary_energy_source"),
  
  // Accessibility
  roadStatus: text("road_status"),
  timeToPublicBus: text("time_to_public_bus"),
  timeToMarket: text("time_to_market"),
  distanceToActiveRoad: text("distance_to_active_road"),
  facilities: text("facilities").array(),
  
  // Economic details
  hasPropertiesElsewhere: text("has_properties_elsewhere"),
  hasFemaleNamedProperties: text("has_female_named_properties"),
  organizationsLoanedFrom: text("organizations_loaned_from").array(),
  loanUses: text("loan_uses").array(),
  timeToBank: text("time_to_bank"),
  financialAccounts: text("financial_accounts").array(),
  haveRemittance: text("have_remittance"),
  remittanceExpenses: text("remittance_expenses").array(),
  
  // Health
  haveHealthInsurance: text("have_health_insurance"),
  consultingHealthOrganization: text("consulting_health_organization"),
  timeToHealthOrganization: text("time_to_health_organization"),
  
  // Municipal & Suggestions
  municipalSuggestions: text("municipal_suggestions").array(),
  
  // Agriculture & Livestock
  haveAgriculturalLand: text("have_agricultural_land"),
  agriculturalLands: text("agricultural_lands").array(),
  areInvolvedInAgriculture: text("are_involved_in_agriculture"),
  foodCrops: text("food_crops").array(),
  pulses: text("pulses").array(),
  oilSeeds: text("oil_seeds").array(),
  vegetables: text("vegetables").array(),
  fruits: text("fruits").array(),
  spices: text("spices").array(),
  cashCrops: text("cash_crops").array(),
  areInvolvedInHusbandry: text("are_involved_in_husbandry"),
  animals: text("animals").array(),
  animalProducts: text("animal_products").array(),
  
  // Aquaculture & Apiary
  haveAquaculture: text("have_aquaculture"),
  pondNumber: integer("pond_number"),
  pondArea: decimal("pond_area"),
  fishProduction: decimal("fish_production"),
  haveApiary: text("have_apiary"),
  hiveNumber: integer("hive_number"),
  honeyProduction: decimal("honey_production"),
  honeySales: decimal("honey_sales"),
  honeyRevenue: decimal("honey_revenue"),
  
  // Agricultural operations
  hasAgriculturalInsurance: text("has_agricultural_insurance"),
  monthsInvolvedInAgriculture: text("months_involved_in_agriculture"),
  agriculturalMachines: text("agricultural_machines").array(),
  
  // Migration details
  birthPlace: text("birth_place"),
  birthProvince: text("birth_province"),
  birthDistrict: text("birth_district"),
  birthCountry: text("birth_country"),
  priorLocation: text("prior_location"),
  priorProvince: text("prior_province"),
  priorDistrict: text("prior_district"),
  priorCountry: text("prior_country"),
  residenceReason: text("residence_reason"),
  
  // Business
  hasBusiness: text("has_business"),
  
  // System fields
  deviceId: text("device_id"),
  geom: postgis("geom"),
  name: text("name"),
  
  // Status for workflow
  status: householdStatusEnum("status").default("pending"),
});

// Staging table for data validation
export const stagingHouseholds = pgTable("staging_acme_khajura_household", {
  // Copy the same structure as the main households table
  id: text("id").primaryKey().notNull(),
  profileId: text("profile_id").default("khajura"),
  
  // Location information
  province: text("province"),
  district: text("district"),
  localLevel: text("local_level"),
  wardNo: integer("ward_no"),
  houseSymbolNo: text("house_symbol_no"),
  familySymbolNo: text("family_symbol_no"),
  dateOfInterview: timestamp("date_of_interview"),
  householdLocation: text("household_location").array(),
  locality: text("locality"),
  developmentOrganization: text("development_organization"),
  
  // Family information
  familyHeadName: text("family_head_name"),
  familyHeadPhoneNo: text("family_head_phone_no"),
  totalMembers: integer("total_members"),
  areMembersElsewhere: text("are_members_elsewhere"),
  totalElsewhereMembers: integer("total_elsewhere_members"),
  
  // House details
  houseOwnership: text("house_ownership"),
  houseOwnershipOther: text("house_ownership_other"),
  landOwnership: text("land_ownership"),
  landOwnershipOther: text("land_ownership_other"),
  houseBase: text("house_base"),
  houseBaseOther: text("house_base_other"),
  houseOuterWall: text("house_outer_wall"),
  houseOuterWallOther: text("house_outer_wall_other"),
  houseRoof: text("house_roof"),
  houseRoofOther: text("house_roof_other"),
  houseFloor: text("house_floor"),
  houseFloorOther: text("house_floor_other"),
  houseFloors: integer("house_floors"),
  roomCount: integer("room_count"),
  
  // Safety information
  isHousePassed: text("is_house_passed"),
  isMapArchived: text("is_map_archived"),
  isEarthquakeResistant: text("is_earthquake_resistant"),
  disasterRiskStatus: text("disaster_risk_status"),
  naturalDisasters: text("natural_disasters").array(),
  isSafe: text("is_safe"),
  
  // Water, sanitation and energy
  waterSource: text("water_source"),
  waterPurificationMethods: text("water_purification_methods").array(),
  toiletType: text("toilet_type"),
  solidWasteManagement: text("solid_waste_management"),
  primaryCookingFuel: text("primary_cooking_fuel"),
  primaryEnergySource: text("primary_energy_source"),
  
  // Accessibility
  roadStatus: text("road_status"),
  timeToPublicBus: text("time_to_public_bus"),
  timeToMarket: text("time_to_market"),
  distanceToActiveRoad: text("distance_to_active_road"),
  facilities: text("facilities").array(),
  
  // Economic details
  hasPropertiesElsewhere: text("has_properties_elsewhere"),
  hasFemaleNamedProperties: text("has_female_named_properties"),
  organizationsLoanedFrom: text("organizations_loaned_from").array(),
  loanUses: text("loan_uses").array(),
  timeToBank: text("time_to_bank"),
  financialAccounts: text("financial_accounts").array(),
  haveRemittance: text("have_remittance"),
  remittanceExpenses: text("remittance_expenses").array(),
  
  // Health
  haveHealthInsurance: text("have_health_insurance"),
  consultingHealthOrganization: text("consulting_health_organization"),
  timeToHealthOrganization: text("time_to_health_organization"),
  
  // Municipal & Suggestions
  municipalSuggestions: text("municipal_suggestions").array(),
  
  // Agriculture & Livestock
  haveAgriculturalLand: text("have_agricultural_land"),
  agriculturalLands: text("agricultural_lands").array(),
  areInvolvedInAgriculture: text("are_involved_in_agriculture"),
  foodCrops: text("food_crops").array(),
  pulses: text("pulses").array(),
  oilSeeds: text("oil_seeds").array(),
  vegetables: text("vegetables").array(),
  fruits: text("fruits").array(),
  spices: text("spices").array(),
  cashCrops: text("cash_crops").array(),
  areInvolvedInHusbandry: text("are_involved_in_husbandry"),
  animals: text("animals").array(),
  animalProducts: text("animal_products").array(),
  
  // Aquaculture & Apiary
  haveAquaculture: text("have_aquaculture"),
  pondNumber: integer("pond_number"),
  pondArea: decimal("pond_area"),
  fishProduction: decimal("fish_production"),
  haveApiary: text("have_apiary"),
  hiveNumber: integer("hive_number"),
  honeyProduction: decimal("honey_production"),
  honeySales: decimal("honey_sales"),
  honeyRevenue: decimal("honey_revenue"),
  
  // Agricultural operations
  hasAgriculturalInsurance: text("has_agricultural_insurance"),
  monthsInvolvedInAgriculture: text("months_involved_in_agriculture"),
  agriculturalMachines: text("agricultural_machines").array(),
  
  // Migration details
  birthPlace: text("birth_place"),
  birthProvince: text("birth_province"),
  birthDistrict: text("birth_district"),
  birthCountry: text("birth_country"),
  priorLocation: text("prior_location"),
  priorProvince: text("prior_province"),
  priorDistrict: text("prior_district"),
  priorCountry: text("prior_country"),
  residenceReason: text("residence_reason"),
  
  // Business
  hasBusiness: text("has_business"),
  
  // System fields
  deviceId: text("device_id"),
  geom: postgis("geom"),
  name: text("name"),
});

// Edit requests for households
export const householdEditRequests = pgTable("acme_khajura_household_edit_requests", {
  id: varchar("id", { length: 48 }).primaryKey(),
  householdId: varchar("household_id", { length: 48 }).references(() => households.id),
  message: text("message").notNull(),
  requestedAt: timestamp("requested_at").defaultNow(),
});

// Export types for TypeScript
export type Household = typeof households.$inferSelect;
export type NewHousehold = typeof households.$inferInsert;
export type StagingHousehold = typeof stagingHouseholds.$inferSelect;
export type HouseholdEditRequest = typeof householdEditRequests.$inferSelect;
