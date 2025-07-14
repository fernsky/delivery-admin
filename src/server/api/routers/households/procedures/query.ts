import { z } from "zod";
import { randomUUID } from "crypto";
import { protectedProcedure } from "@/server/api/trpc";
import { 
  householdQuerySchema,
  householdDownloadSchema,
  householdStatusSchema, 
  updateHouseholdSchema 
} from "../households.schema";
import { householdEditRequests, households } from "@/server/db/schema/households/households";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";

// UUID Utility Functions
function formatDbUuid(uuid: string): string {
  // Remove any existing prefix and whitespace
  const cleanUuid = uuid.replace(/^(uuid:)?/, '').trim();
  // Add the prefix consistently
  return `uuid:${cleanUuid}`;
}

function normalizeUuid(uuid: string): string {
  // Remove any prefix and format consistently
  return uuid.replace(/^(uuid:)?/, '').trim().toLowerCase();
}

// Helper function to build array field filter conditions
function buildArrayFieldFilter(fieldName: string, values: string[]): string {
  if (!values || values.length === 0) return "";
  
  const conditions = values.map(value => 
    `${fieldName} LIKE '%${value}%'`
  ).join(' OR ');
  
  return `(${conditions})`;
}

// Procedure to get a paginated list of households with basic info for cards
export const getHouseholdsProcedure = protectedProcedure
  .input(householdQuerySchema)
  .query(async ({ ctx, input }) => {
    try {
      const { limit, offset, sortBy, sortOrder, filters } = input;
      
      // Debug: Log the filters received by backend
      console.log("🔧 Backend received filters:", JSON.stringify(filters, null, 2));

      let query = sql`
        SELECT 
          id,
          family_head_name,
          family_head_phone_no,
          ward_no,
          total_members,
          locality,
          house_symbol_no,
          date_of_interview
        FROM acme_khajura_households
        WHERE profile_id = 'khajura'
      `;
      


      if (input.search) {
        const searchTerm = `%${input.search}%`;
        query = sql`
          ${query} AND (
            family_head_name ILIKE ${searchTerm} OR
            family_head_phone_no ILIKE ${searchTerm} OR
            locality ILIKE ${searchTerm} OR
            house_symbol_no ILIKE ${searchTerm}
          )
        `;
      }

      if (filters) {
        // Location filters
        if (filters.wardNo !== undefined) {
          query = sql`${query} AND ward_no = ${filters.wardNo}`;
        }
        
        if (filters.province) {
          query = sql`${query} AND province = ${filters.province}`;
        }
        
        if (filters.district) {
          query = sql`${query} AND district = ${filters.district}`;
        }

        if (filters.localLevel) {
          query = sql`${query} AND local_level = ${filters.localLevel}`;
        }

        if (filters.locality) {
          query = sql`${query} AND locality ILIKE ${`%${filters.locality}%`}`;
        }

        if (filters.developmentOrganization) {
          query = sql`${query} AND development_organization = ${filters.developmentOrganization}`;
        }

        // Family filters
        if (filters.familyHeadName) {
          query = sql`${query} AND family_head_name ILIKE ${`%${filters.familyHeadName}%`}`;
        }

        if (filters.familyHeadPhoneNo) {
          query = sql`${query} AND family_head_phone_no ILIKE ${`%${filters.familyHeadPhoneNo}%`}`;
        }

        if (filters.totalMembersMin !== undefined) {
          query = sql`${query} AND total_members >= ${filters.totalMembersMin}`;
        }

        if (filters.totalMembersMax !== undefined) {
          query = sql`${query} AND total_members <= ${filters.totalMembersMax}`;
        }

        if (filters.areMembersElsewhere) {
          query = sql`${query} AND are_members_elsewhere = ${filters.areMembersElsewhere}`;
        }

        if (filters.totalElsewhereMembersMin !== undefined) {
          query = sql`${query} AND total_elsewhere_members >= ${filters.totalElsewhereMembersMin}`;
        }

        if (filters.totalElsewhereMembersMax !== undefined) {
          query = sql`${query} AND total_elsewhere_members <= ${filters.totalElsewhereMembersMax}`;
        }

        // House ownership filters
        if (filters.houseOwnership) {
          query = sql`${query} AND house_ownership  ILIKE ${`%${filters.houseOwnership}%`}`;
        }

        if (filters.landOwnership) {
          query = sql`${query} AND land_ownership ILIKE ${`%${filters.landOwnership}%`}`;
        }

        if (filters.houseBase) {
          query = sql`${query} AND house_base ILIKE ${`%${filters.houseBase}%`}`;
        }

        if (filters.houseOuterWall) {
          query = sql`${query} AND house_outer_wall ILIKE ${`%${filters.houseOuterWall}%`}`;
        }

        if (filters.houseRoof) {
          query = sql`${query} AND house_roof ILIKE ${`%${filters.houseRoof}%`}`;
        }

        if (filters.houseFloor) {
          query = sql`${query} AND house_floor ILIKE ${`%${filters.houseFloor}%`}`;
        }

        // Safety filters
        if (filters.isHousePassed) {
          query = sql`${query} AND is_house_passed = ${filters.isHousePassed}`;
        }

        if (filters.isMapArchived) {
          query = sql`${query} AND is_map_archived = ${filters.isMapArchived}`;
        }

        if (filters.isSafe) {
          query = sql`${query} AND is_safe = ${filters.isSafe}`;
        }

        // Water and sanitation filters
        if (filters.waterSource) {
          query = sql`${query} AND water_source ILIKE ${`%${filters.waterSource}%`}`;
        }

        if (filters.waterPurificationMethods) {
          query = sql`${query} AND water_purification_methods ILIKE ${`%${filters.waterPurificationMethods}%`}`;
        }

        if (filters.toiletType) {
          query = sql`${query} AND toilet_type  ILIKE ${`%${filters.toiletType}%`}`;
        }

        if (filters.solidWasteManagement) {
          query = sql`${query} AND solid_waste_management = ${filters.solidWasteManagement}`;
        }

        if (filters.primaryCookingFuel) {
          query = sql`${query} AND primary_cooking_fuel ILIKE ${`%${filters.primaryCookingFuel}%`}`;
        }

        if (filters.primaryEnergySource) {
          query = sql`${query} AND primary_energy_source ILIKE ${`%${filters.primaryEnergySource}%`}`;
        }

        // Accessibility filters
        if (filters.roadStatus) {
          query = sql`${query} AND road_status = ${filters.roadStatus}`;
        }

        if (filters.timeToPublicBus) {
          query = sql`${query} AND time_to_public_bus = ${filters.timeToPublicBus}`;
        }

        if (filters.timeToMarket) {
          query = sql`${query} AND time_to_market = ${filters.timeToMarket}`;
        }

        if (filters.distanceToActiveRoad) {
          query = sql`${query} AND distance_to_active_road = ${filters.distanceToActiveRoad}`;
        }

        // Economic filters
        if (filters.hasPropertiesElsewhere) {
          query = sql`${query} AND has_properties_elsewhere = ${filters.hasPropertiesElsewhere}`;
        }

        if (filters.hasFemaleNamedProperties) {
          query = sql`${query} AND has_female_named_properties = ${filters.hasFemaleNamedProperties}`;
        }

        if (filters.timeToBank) {
          query = sql`${query} AND time_to_bank ILIKE ${`%${filters.timeToBank}%`}`;
        }

        // Health filters
        if (filters.haveHealthInsurance) {
          query = sql`${query} AND have_health_insurance = ${filters.haveHealthInsurance}`;
        }

        if (filters.consultingHealthOrganization) {
          query = sql`${query} AND consulting_health_organization ILIKE ${`%${filters.consultingHealthOrganization}%`}`;
        }

        if (filters.timeToHealthOrganization) {
          query = sql`${query} AND time_to_health_organization ILIKE ${`%${filters.timeToHealthOrganization}%`}`;
        }

        // Agriculture filters
        if (filters.haveAgriculturalLand) {
          query = sql`${query} AND have_agricultural_land = ${filters.haveAgriculturalLand}`;
        }

        if (filters.areInvolvedInAgriculture) {
          query = sql`${query} AND are_involved_in_agriculture = ${filters.areInvolvedInAgriculture}`;
        }

        if (filters.areInvolvedInHusbandry) {
          query = sql`${query} AND are_involved_in_husbandry = ${filters.areInvolvedInHusbandry}`;
        }

        if (filters.haveAquaculture) {
          query = sql`${query} AND have_aquaculture = ${filters.haveAquaculture}`;
        }

        if (filters.haveApiary) {
          query = sql`${query} AND have_apiary = ${filters.haveApiary}`;
        }

        if (filters.hasAgriculturalInsurance) {
          query = sql`${query} AND has_agricultural_insurance = ${filters.hasAgriculturalInsurance}`;
        }

        if (filters.monthsInvolvedInAgriculture) {
          query = sql`${query} AND months_involved_in_agriculture = ${filters.monthsInvolvedInAgriculture}`;
        }

        // Remittance filters
        if (filters.haveRemittance) {
          query = sql`${query} AND have_remittance = ${filters.haveRemittance}`;
        }

        // Business filters
        if (filters.hasBusiness) {
          query = sql`${query} AND has_business = ${filters.hasBusiness}`;
        }

        // Migration filters
        if (filters.birthProvince) {
          query = sql`${query} AND birth_province = ${filters.birthProvince}`;
        }

        if (filters.birthDistrict) {
          query = sql`${query} AND birth_district = ${filters.birthDistrict}`;
        }

        if (filters.birthCountry) {
          query = sql`${query} AND birth_country = ${filters.birthCountry}`;
        }

        if (filters.priorProvince) {
          query = sql`${query} AND prior_province = ${filters.priorProvince}`;
        }

        if (filters.priorDistrict) {
          query = sql`${query} AND prior_district = ${filters.priorDistrict}`;
        }

        if (filters.priorCountry) {
          query = sql`${query} AND prior_country = ${filters.priorCountry}`;
        }

        if (filters.residenceReason) {
          query = sql`${query} AND residence_reason = ${filters.residenceReason}`;
        }

        // Date range filters
        if (filters.dateOfInterviewFrom) {
          query = sql`${query} AND date_of_interview >= ${filters.dateOfInterviewFrom}`;
        }

        if (filters.dateOfInterviewTo) {
          query = sql`${query} AND date_of_interview <= ${filters.dateOfInterviewTo}`;
        }

        // Array field filters
        if (filters.naturalDisasters && filters.naturalDisasters.length > 0) {
          const conditions = filters.naturalDisasters.map(disaster => 
            `natural_disasters LIKE '%${disaster}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.facilities && filters.facilities.length > 0) {
          const conditions = filters.facilities.map(facility => 
            `facilities LIKE '%${facility}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.financialAccounts && filters.financialAccounts.length > 0) {
          const conditions = filters.financialAccounts.map(account => 
            `financial_accounts LIKE '%${account}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.incomeSources && filters.incomeSources.length > 0) {
          const conditions = filters.incomeSources.map(source => 
            `income_sources LIKE '%${source}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.foodCrops && filters.foodCrops.length > 0) {
          const conditions = filters.foodCrops.map(crop => 
            `food_crops LIKE '%${crop}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.pulses && filters.pulses.length > 0) {
          const conditions = filters.pulses.map(pulse => 
            `pulses LIKE '%${pulse}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.oilSeeds && filters.oilSeeds.length > 0) {
          const conditions = filters.oilSeeds.map(seed => 
            `oil_seeds LIKE '%${seed}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.vegetables && filters.vegetables.length > 0) {
          const conditions = filters.vegetables.map(vegetable => 
            `vegetables LIKE '%${vegetable}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.fruits && filters.fruits.length > 0) {
          const conditions = filters.fruits.map(fruit => 
            `fruits LIKE '%${fruit}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.spices && filters.spices.length > 0) {
          const conditions = filters.spices.map(spice => 
            `spices LIKE '%${spice}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.cashCrops && filters.cashCrops.length > 0) {
          const conditions = filters.cashCrops.map(crop => 
            `cash_crops LIKE '%${crop}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.animals && filters.animals.length > 0) {
          const conditions = filters.animals.map(animal => 
            `animals LIKE '%${animal}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.animalProducts && filters.animalProducts.length > 0) {
          const conditions = filters.animalProducts.map(product => 
            `animal_products LIKE '%${product}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.agriculturalMachines && filters.agriculturalMachines.length > 0) {
          const conditions = filters.agriculturalMachines.map(machine => 
            `agricultural_machines LIKE '%${machine}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }
      }

      if (sortBy === "family_head_name") {
        query = sortOrder === "asc" 
          ? sql`${query} ORDER BY regexp_replace(family_head_name, '[0-9]', '', 'g') ASC NULLS LAST`
          : sql`${query} ORDER BY regexp_replace(family_head_name, '[0-9]', '', 'g') DESC NULLS LAST`;
      } else if (sortBy === "ward_no") {
        query = sortOrder === "asc" 
          ? sql`${query} ORDER BY ward_no ASC NULLS LAST`
          : sql`${query} ORDER BY ward_no DESC NULLS LAST`;
      } else if (sortBy === "date_of_interview") {
        query = sortOrder === "asc" 
          ? sql`${query} ORDER BY date_of_interview ASC NULLS LAST`
          : sql`${query} ORDER BY date_of_interview DESC NULLS LAST`;
      } else {
        query = sql`${query} ORDER BY regexp_replace(family_head_name, '[0-9]', '', 'g') ASC NULLS LAST`;
      }

      query = sql`${query} LIMIT ${limit} OFFSET ${offset}`;

      // Debug: Log the final query and results
      console.log("🔧 Final SQL query:", query);
      const result = await ctx.db.execute(query);
      console.log("🔧 Query returned", result.length, "results");
      
      const households = result.map(row => ({
        id: row.id,
        familyHeadName: row.family_head_name || "",
        familyHeadPhoneNo: row.family_head_phone_no || "",
        wardNo: typeof row.ward_no === 'number' ? row.ward_no : null,
        totalMembers: typeof row.total_members === 'number' ? row.total_members : null,
        locality: row.locality || "",
        houseSymbolNo: row.house_symbol_no || "",
        dateOfInterview: row.date_of_interview && (typeof row.date_of_interview === 'string' || typeof row.date_of_interview === 'number' || row.date_of_interview instanceof Date) ? new Date(row.date_of_interview) : null
      }));

      let countQuery = sql`
        SELECT COUNT(*) as total 
        FROM acme_khajura_households
        WHERE profile_id = 'khajura'
      `;
      
      if (input.search) {
        const searchTerm = `%${input.search}%`;
        countQuery = sql`
          ${countQuery} AND (
            family_head_name ILIKE ${searchTerm} OR
            family_head_phone_no ILIKE ${searchTerm} OR
            locality ILIKE ${searchTerm} OR
            house_symbol_no ILIKE ${searchTerm}
          )
        `;
      }
      
      if (filters) {
        // Location filters
        if (filters.wardNo !== undefined) {
          countQuery = sql`${countQuery} AND ward_no = ${filters.wardNo}`;
        }
        
        if (filters.province) {
          countQuery = sql`${countQuery} AND province = ${filters.province}`;
        }
        
        if (filters.district) {
          countQuery = sql`${countQuery} AND district = ${filters.district}`;
        }

        if (filters.localLevel) {
          countQuery = sql`${countQuery} AND local_level = ${filters.localLevel}`;
        }

        if (filters.locality) {
          countQuery = sql`${countQuery} AND locality ILIKE ${`%${filters.locality}%`}`;
        }

        if (filters.developmentOrganization) {
          countQuery = sql`${countQuery} AND development_organization = ${filters.developmentOrganization}`;
        }

        // Family filters
        if (filters.familyHeadName) {
          countQuery = sql`${countQuery} AND family_head_name ILIKE ${`%${filters.familyHeadName}%`}`;
        }

        if (filters.familyHeadPhoneNo) {
          countQuery = sql`${countQuery} AND family_head_phone_no ILIKE ${`%${filters.familyHeadPhoneNo}%`}`;
        }

        if (filters.totalMembersMin !== undefined) {
          countQuery = sql`${countQuery} AND total_members >= ${filters.totalMembersMin}`;
        }

        if (filters.totalMembersMax !== undefined) {
          countQuery = sql`${countQuery} AND total_members <= ${filters.totalMembersMax}`;
        }

        if (filters.areMembersElsewhere) {
          countQuery = sql`${countQuery} AND are_members_elsewhere = ${filters.areMembersElsewhere}`;
        }

        if (filters.totalElsewhereMembersMin !== undefined) {
          countQuery = sql`${countQuery} AND total_elsewhere_members >= ${filters.totalElsewhereMembersMin}`;
        }

        if (filters.totalElsewhereMembersMax !== undefined) {
          countQuery = sql`${countQuery} AND total_elsewhere_members <= ${filters.totalElsewhereMembersMax}`;
        }

        // House ownership filters
        if (filters.houseOwnership) {
          countQuery = sql`${countQuery} AND house_ownership = ${filters.houseOwnership}`;
        }

        if (filters.landOwnership) {
          countQuery = sql`${countQuery} AND land_ownership = ${filters.landOwnership}`;
        }

        if (filters.houseBase) {
          countQuery = sql`${countQuery} AND house_base = ${filters.houseBase}`;
        }

        if (filters.houseOuterWall) {
          countQuery = sql`${countQuery} AND house_outer_wall = ${filters.houseOuterWall}`;
        }

        if (filters.houseRoof) {
          countQuery = sql`${countQuery} AND house_roof = ${filters.houseRoof}`;
        }

        if (filters.houseFloor) {
          countQuery = sql`${countQuery} AND house_floor = ${filters.houseFloor}`;
        }

        // Safety filters
        if (filters.isHousePassed) {
          countQuery = sql`${countQuery} AND is_house_passed = ${filters.isHousePassed}`;
        }

        if (filters.isMapArchived) {
          countQuery = sql`${countQuery} AND is_map_archived = ${filters.isMapArchived}`;
        }

        if (filters.isSafe) {
          countQuery = sql`${countQuery} AND is_safe = ${filters.isSafe}`;
        }

        // Water and sanitation filters
        if (filters.waterSource) {
          countQuery = sql`${countQuery} AND water_source = ${filters.waterSource}`;
        }

        if (filters.waterPurificationMethods) {
          countQuery = sql`${countQuery} AND water_purification_methods = ${filters.waterPurificationMethods}`;
        }

        if (filters.toiletType) {
          countQuery = sql`${countQuery} AND toilet_type = ${filters.toiletType}`;
        }

        if (filters.solidWasteManagement) {
          countQuery = sql`${countQuery} AND solid_waste_management = ${filters.solidWasteManagement}`;
        }

        if (filters.primaryCookingFuel) {
          countQuery = sql`${countQuery} AND primary_cooking_fuel = ${filters.primaryCookingFuel}`;
        }

        if (filters.primaryEnergySource) {
          countQuery = sql`${countQuery} AND primary_energy_source = ${filters.primaryEnergySource}`;
        }

        // Accessibility filters
        if (filters.roadStatus) {
          countQuery = sql`${countQuery} AND road_status = ${filters.roadStatus}`;
        }

        if (filters.timeToPublicBus) {
          countQuery = sql`${countQuery} AND time_to_public_bus = ${filters.timeToPublicBus}`;
        }

        if (filters.timeToMarket) {
          countQuery = sql`${countQuery} AND time_to_market = ${filters.timeToMarket}`;
        }

        if (filters.distanceToActiveRoad) {
          countQuery = sql`${countQuery} AND distance_to_active_road = ${filters.distanceToActiveRoad}`;
        }

        // Economic filters
        if (filters.hasPropertiesElsewhere) {
          countQuery = sql`${countQuery} AND has_properties_elsewhere = ${filters.hasPropertiesElsewhere}`;
        }

        if (filters.hasFemaleNamedProperties) {
          countQuery = sql`${countQuery} AND has_female_named_properties = ${filters.hasFemaleNamedProperties}`;
        }

        if (filters.timeToBank) {
          countQuery = sql`${countQuery} AND time_to_bank = ${filters.timeToBank}`;
        }

        // Health filters
        if (filters.haveHealthInsurance) {
          countQuery = sql`${countQuery} AND have_health_insurance = ${filters.haveHealthInsurance}`;
        }

        if (filters.consultingHealthOrganization) {
          countQuery = sql`${countQuery} AND consulting_health_organization = ${filters.consultingHealthOrganization}`;
        }

        if (filters.timeToHealthOrganization) {
          countQuery = sql`${countQuery} AND time_to_health_organization = ${filters.timeToHealthOrganization}`;
        }

        // Agriculture filters
        if (filters.haveAgriculturalLand) {
          countQuery = sql`${countQuery} AND have_agricultural_land = ${filters.haveAgriculturalLand}`;
        }

        if (filters.areInvolvedInAgriculture) {
          countQuery = sql`${countQuery} AND are_involved_in_agriculture = ${filters.areInvolvedInAgriculture}`;
        }

        if (filters.areInvolvedInHusbandry) {
          countQuery = sql`${countQuery} AND are_involved_in_husbandry = ${filters.areInvolvedInHusbandry}`;
        }

        if (filters.haveAquaculture) {
          countQuery = sql`${countQuery} AND have_aquaculture = ${filters.haveAquaculture}`;
        }

        if (filters.haveApiary) {
          countQuery = sql`${countQuery} AND have_apiary = ${filters.haveApiary}`;
        }

        if (filters.hasAgriculturalInsurance) {
          countQuery = sql`${countQuery} AND has_agricultural_insurance = ${filters.hasAgriculturalInsurance}`;
        }

        if (filters.monthsInvolvedInAgriculture) {
          countQuery = sql`${countQuery} AND months_involved_in_agriculture = ${filters.monthsInvolvedInAgriculture}`;
        }

        // Remittance filters
        if (filters.haveRemittance) {
          countQuery = sql`${countQuery} AND have_remittance = ${filters.haveRemittance}`;
        }

        // Business filters
        if (filters.hasBusiness) {
          countQuery = sql`${countQuery} AND has_business = ${filters.hasBusiness}`;
        }

        // Migration filters
        if (filters.birthProvince) {
          countQuery = sql`${countQuery} AND birth_province = ${filters.birthProvince}`;
        }

        if (filters.birthDistrict) {
          countQuery = sql`${countQuery} AND birth_district = ${filters.birthDistrict}`;
        }

        if (filters.birthCountry) {
          countQuery = sql`${countQuery} AND birth_country = ${filters.birthCountry}`;
        }

        if (filters.priorProvince) {
          countQuery = sql`${countQuery} AND prior_province = ${filters.priorProvince}`;
        }

        if (filters.priorDistrict) {
          countQuery = sql`${countQuery} AND prior_district = ${filters.priorDistrict}`;
        }

        if (filters.priorCountry) {
          countQuery = sql`${countQuery} AND prior_country = ${filters.priorCountry}`;
        }

        if (filters.residenceReason) {
          countQuery = sql`${countQuery} AND residence_reason = ${filters.residenceReason}`;
        }

        // Date range filters
        if (filters.dateOfInterviewFrom) {
          countQuery = sql`${countQuery} AND date_of_interview >= ${filters.dateOfInterviewFrom}`;
        }

        if (filters.dateOfInterviewTo) {
          countQuery = sql`${countQuery} AND date_of_interview <= ${filters.dateOfInterviewTo}`;
        }

        // Array field filters
        if (filters.naturalDisasters && filters.naturalDisasters.length > 0) {
          const conditions = filters.naturalDisasters.map(disaster => 
            `natural_disasters LIKE '%${disaster}%'`
          ).join(' OR ');
          countQuery = sql`${countQuery} AND (${conditions})`;
        }

        if (filters.facilities && filters.facilities.length > 0) {
          const conditions = filters.facilities.map(facility => 
            `facilities LIKE '%${facility}%'`
          ).join(' OR ');
          countQuery = sql`${countQuery} AND (${conditions})`;
        }

        if (filters.financialAccounts && filters.financialAccounts.length > 0) {
          const conditions = filters.financialAccounts.map(account => 
            `financial_accounts LIKE '%${account}%'`
          ).join(' OR ');
          countQuery = sql`${countQuery} AND (${conditions})`;
        }

        if (filters.incomeSources && filters.incomeSources.length > 0) {
          const conditions = filters.incomeSources.map(source => 
            `income_sources LIKE '%${source}%'`
          ).join(' OR ');
          countQuery = sql`${countQuery} AND (${conditions})`;
        }

        if (filters.foodCrops && filters.foodCrops.length > 0) {
          const conditions = filters.foodCrops.map(crop => 
            `food_crops LIKE '%${crop}%'`
          ).join(' OR ');
          countQuery = sql`${countQuery} AND (${conditions})`;
        }

        if (filters.pulses && filters.pulses.length > 0) {
          const conditions = filters.pulses.map(pulse => 
            `pulses LIKE '%${pulse}%'`
          ).join(' OR ');
          countQuery = sql`${countQuery} AND (${conditions})`;
        }

        if (filters.oilSeeds && filters.oilSeeds.length > 0) {
          const conditions = filters.oilSeeds.map(seed => 
            `oil_seeds LIKE '%${seed}%'`
          ).join(' OR ');
          countQuery = sql`${countQuery} AND (${conditions})`;
        }

        if (filters.vegetables && filters.vegetables.length > 0) {
          const conditions = filters.vegetables.map(vegetable => 
            `vegetables LIKE '%${vegetable}%'`
          ).join(' OR ');
          countQuery = sql`${countQuery} AND (${conditions})`;
        }

        if (filters.fruits && filters.fruits.length > 0) {
          const conditions = filters.fruits.map(fruit => 
            `fruits LIKE '%${fruit}%'`
          ).join(' OR ');
          countQuery = sql`${countQuery} AND (${conditions})`;
        }

        if (filters.spices && filters.spices.length > 0) {
          const conditions = filters.spices.map(spice => 
            `spices LIKE '%${spice}%'`
          ).join(' OR ');
          countQuery = sql`${countQuery} AND (${conditions})`;
        }

        if (filters.cashCrops && filters.cashCrops.length > 0) {
          const conditions = filters.cashCrops.map(crop => 
            `cash_crops LIKE '%${crop}%'`
          ).join(' OR ');
          countQuery = sql`${countQuery} AND (${conditions})`;
        }

        if (filters.animals && filters.animals.length > 0) {
          const conditions = filters.animals.map(animal => 
            `animals LIKE '%${animal}%'`
          ).join(' OR ');
          countQuery = sql`${countQuery} AND (${conditions})`;
        }

        if (filters.animalProducts && filters.animalProducts.length > 0) {
          const conditions = filters.animalProducts.map(product => 
            `animal_products LIKE '%${product}%'`
          ).join(' OR ');
          countQuery = sql`${countQuery} AND (${conditions})`;
        }

        if (filters.agriculturalMachines && filters.agriculturalMachines.length > 0) {
          const conditions = filters.agriculturalMachines.map(machine => 
            `agricultural_machines LIKE '%${machine}%'`
          ).join(' OR ');
          countQuery = sql`${countQuery} AND (${conditions})`;
        }
      }
      
      const countResult = await ctx.db.execute(countQuery);
      const total = parseInt(countResult[0]?.total?.toString() || "0", 10);

      return {
        households,
        meta: {
          total,
          limit,
          offset,
          page: Math.floor(offset / limit) + 1,
          pageCount: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error fetching households:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch households list",
      });
    }
  });

// Procedure to get a specific household by ID with complete details
export const getHouseholdByIdProcedure = protectedProcedure
  .input(z.object({
    id: z.string(),
  }))
  .query(async ({ ctx, input }) => {
    try {
      const normalizedId = normalizeUuid(input.id);
      const formattedId = formatDbUuid(normalizedId);
      
      let query = sql`
        SELECT * FROM acme_khajura_households
        WHERE id = ${formattedId}
      `;
      
      let result = await ctx.db.execute(query);

      if (!result || result.length === 0) {
        query = sql`
          SELECT * FROM acme_khajura_households
          WHERE id = ${normalizedId}
        `;
        result = await ctx.db.execute(query);
      }

      if (!result || result.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Household not found",
        });
      }

      const household = result[0];
      
      const parseArrayField = (field: any): string[] => {
        if (!field) return [];
        if (Array.isArray(field)) return field;
        if (typeof field === 'string' && field.startsWith('{') && field.endsWith('}')) {
          return field
            .substring(1, field.length - 1)
            .split(',')
            .map(item => item.trim())
            .filter(Boolean);
        }
        return [];
      };

      const parseDate = (dateField: any): Date | null => {
        if (!dateField) return null;
        try {
          return new Date(dateField);
        } catch (e) {
          return null;
        }
      };

      return {
        id: household.id,
        profileId: household.profile_id || "",
        province: household.province || "",
        district: household.district || "",
        localLevel: household.local_level || "",
        wardNo: typeof household.ward_no === 'number' ? household.ward_no : null,
        houseSymbolNo: household.house_symbol_no || "",
        familySymbolNo: household.family_symbol_no || "",
        dateOfInterview: parseDate(household.date_of_interview),
        householdLocation: parseArrayField(household.household_location),
        locality: household.locality || "",
        developmentOrganization: household.development_organization || "",
        familyHeadName: household.family_head_name || "",
        familyHeadPhoneNo: household.family_head_phone_no || "",
        totalMembers: typeof household.total_members === 'number' ? household.total_members : null,
        areMembersElsewhere: household.are_members_elsewhere || "",
        totalElsewhereMembers: typeof household.total_elsewhere_members === 'number' ? household.total_elsewhere_members : null,
        houseOwnership: household.house_ownership || "",
        houseOwnershipOther: household.house_ownership_other || "",
        landOwnership: household.land_ownership || "",
        landOwnershipOther: household.land_ownership_other || "",
        houseBase: household.house_base || "",
        houseBaseOther: household.house_base_other || "",
        houseOuterWall: household.house_outer_wall || "",
        houseOuterWallOther: household.house_outer_wall_other || "",
        houseRoof: household.house_roof || "",
        houseRoofOther: household.house_roof_other || "",
        houseFloor: household.house_floor || "",
        houseFloorOther: household.house_floor_other || "",
        isHousePassed: household.is_house_passed || "",
        isMapArchived: household.is_map_archived || "",
        naturalDisasters: parseArrayField(household.natural_disasters),
        isSafe: household.is_safe || "",
        waterSource: household.water_source || "",
        waterPurificationMethods: household.water_purification_methods || "",
        toiletType: household.toilet_type || "",
        solidWasteManagement: household.solid_waste_management || "",
        primaryCookingFuel: household.primary_cooking_fuel || "",
        primaryEnergySource: household.primary_energy_source || "",
        roadStatus: household.road_status || "",
        timeToPublicBus: household.time_to_public_bus || "",
        timeToMarket: household.time_to_market || "",
        distanceToActiveRoad: household.distance_to_active_road || "",
        facilities: parseArrayField(household.facilities),
        hasPropertiesElsewhere: household.has_properties_elsewhere || "",
        hasFemaleNamedProperties: household.has_female_named_properties || "",
        organizationsLoanedFrom: parseArrayField(household.organizations_loaned_from),
        loanUses: parseArrayField(household.loan_uses),
        timeToBank: household.time_to_bank || "",
        financialAccounts: parseArrayField(household.financial_accounts),
        incomeSources: parseArrayField(household.income_sources),
        haveRemittance: household.have_remittance || "",
        remittanceExpenses: parseArrayField(household.remittance_expenses),
        haveHealthInsurance: household.have_health_insurance || "",
        consultingHealthOrganization: household.consulting_health_organization || "",
        timeToHealthOrganization: household.time_to_health_organization || "",
        municipalSuggestions: parseArrayField(household.municipal_suggestions),
        haveAgriculturalLand: household.have_agricultural_land || "",
        agriculturalLands: parseArrayField(household.agricultural_lands),
        areInvolvedInAgriculture: household.are_involved_in_agriculture || "",
        foodCrops: parseArrayField(household.food_crops),
        pulses: parseArrayField(household.pulses),
        oilSeeds: parseArrayField(household.oil_seeds),
        vegetables: parseArrayField(household.vegetables),
        fruits: parseArrayField(household.fruits),
        spices: parseArrayField(household.spices),
        cashCrops: parseArrayField(household.cash_crops),
        areInvolvedInHusbandry: household.are_involved_in_husbandry || "",
        animals: parseArrayField(household.animals),
        animalProducts: parseArrayField(household.animal_products),
        haveAquaculture: household.have_aquaculture || "",
        pondNumber: typeof household.pond_number === 'number' ? household.pond_number : null,
        pondArea: typeof household.pond_area === 'number' ? household.pond_area : null,
        fishProduction: typeof household.fish_production === 'number' ? household.fish_production : null,
        haveApiary: household.have_apiary || "",
        hiveNumber: typeof household.hive_number === 'number' ? household.hive_number : null,
        honeyProduction: typeof household.honey_production === 'number' ? household.honey_production : null,
        honeySales: typeof household.honey_sales === 'number' ? household.honey_sales : null,
        honeyRevenue: typeof household.honey_revenue === 'number' ? household.honey_revenue : null,
        hasAgriculturalInsurance: household.has_agricultural_insurance || "",
        monthsInvolvedInAgriculture: household.months_involved_in_agriculture || "",
        agriculturalMachines: parseArrayField(household.agricultural_machines),
        birthPlace: household.birth_place || "",
        birthProvince: household.birth_province || "",
        birthDistrict: household.birth_district || "",
        birthCountry: household.birth_country || "",
        priorLocation: household.prior_location || "",
        priorProvince: household.prior_province || "",
        priorDistrict: household.prior_district || "",
        priorCountry: household.prior_country || "",
        residenceReason: household.residence_reason || "",
        hasBusiness: household.has_business || "",
        deviceId: household.device_id || "",
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error("Error fetching household by ID:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch household details",
      });
    }
  });

// Procedure to request edits for a household
export const requestHouseholdEditProcedure = protectedProcedure
  .input(householdStatusSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const formattedHouseholdId = formatDbUuid(input.householdId);
      
      const existingHousehold = await ctx.db.select()
        .from(households)
        .where(eq(households.id, formattedHouseholdId))
        .limit(1)
        .then(results => results[0]);
      
      if (!existingHousehold) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Household not found"
        });
      }
      
      const editRequestId = randomUUID();
      
      await ctx.db.insert(householdEditRequests).values({
        id: formatDbUuid(editRequestId),
        householdId: formattedHouseholdId,
        message: input.message || "Edit requested",
        requestedAt: new Date()
      });
      
      return {
        success: true,
        message: "Edit request submitted successfully",
        id: editRequestId
      };
    } catch (error) {
      console.error("Error requesting household edit:", error);
      
      if (error instanceof TRPCError) {
        throw error;
      }
      
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to request household edit",
        cause: error
      });
    }
  });

// Procedure to edit a household
export const editHouseholdProcedure = protectedProcedure
  .input(z.object({
    householdId: z.string(),
    editRequestId: z.string().optional(),
    ...updateHouseholdSchema.shape
  }))
  .mutation(async ({ ctx, input }) => {
    try {
      const formattedHouseholdId = formatDbUuid(input.householdId);
      const formattedEditRequestId = input.editRequestId 
        ? formatDbUuid(input.editRequestId)
        : undefined;

      const { editRequestId: _, householdId: __, ...updateData } = input;

      const existingHousehold = await ctx.db.select()
        .from(households)
        .where(eq(households.id, formattedHouseholdId))
        .limit(1)
        .then(results => results[0]);
      
      if (!existingHousehold) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Household not found"
        });
      }
      
      await ctx.db.update(households)
        .set(updateData)
        .where(eq(households.id, formattedHouseholdId));
      
      if (formattedEditRequestId) {
        await ctx.db.delete(householdEditRequests)
          .where(eq(householdEditRequests.id, formattedEditRequestId));
      }
      
      const updatedHousehold = await ctx.db.select()
        .from(households)
        .where(eq(households.id, formattedHouseholdId))
        .limit(1)
        .then(results => results[0]);
      
      return {
        success: true,
        message: "Household updated successfully",
        data: updatedHousehold
      };
    } catch (error) {
      console.error("Error updating household:", error);
      
      if (error instanceof TRPCError) {
        throw error;
      }
      
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update household",
        cause: error
      });
    }
  });

// Procedure to get all edit requests
export const getHouseholdEditRequestsProcedure = protectedProcedure
  .input(z.object({
    limit: z.number().min(1).max(100).default(50),
    offset: z.number().min(0).default(0),
  }))
  .query(async ({ ctx, input }) => {
    try {
      const { limit, offset } = input;
      
      const query = sql`
        SELECT 
          e.id, 
          e.household_id, 
          e.message, 
          e.requested_at,
          h.family_head_name,
          h.ward_no,
          h.locality
        FROM acme_khajura_household_edit_requests e
        JOIN acme_khajura_households h ON h.id = e.household_id
        ORDER BY e.requested_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      
      const editRequests = await ctx.db.execute(query);
      
      const countQuery = sql`
        SELECT COUNT(*) as total 
        FROM acme_khajura_household_edit_requests
      `;
      
      const countResult = await ctx.db.execute(countQuery);
      const total = parseInt(countResult[0]?.total?.toString() || "0", 10);
      
      const mappedRequests = editRequests.map(req => ({
        id: req.id,
        householdId: req.household_id,
        message: req.message || "",
        requestedAt: req.requested_at && (typeof req.requested_at === 'string' || typeof req.requested_at === 'number' || req.requested_at instanceof Date) ? new Date(req.requested_at) : null,
        familyHeadName: req.family_head_name || "",
        wardNo: typeof req.ward_no === 'number' ? req.ward_no : null,
        locality: req.locality || ""
      }));
      
      return {
        editRequests: mappedRequests,
        meta: {
          total,
          limit,
          offset,
          page: Math.floor(offset / limit) + 1,
          pageCount: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error fetching edit requests:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch edit requests",
      });
    }
  });

// Procedure to download filtered households as CSV
export const downloadHouseholdsProcedure = protectedProcedure
  .input(householdDownloadSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const { filters } = input;
      
      // Debug: Log the filters received by backend
      console.log("🔧 Download - Backend received filters:", JSON.stringify(filters, null, 2));

      let query = sql`
        SELECT 
          family_head_name,
          family_head_phone_no,
          ward_no,
          total_members,
          locality,
          house_symbol_no,
          date_of_interview,
          province,
          district,
          local_level,
          development_organization,
          are_members_elsewhere,
          total_elsewhere_members,
          house_ownership,
          land_ownership,
          house_base,
          house_outer_wall,
          house_roof,
          house_floor,
          is_house_passed,
          is_map_archived,
          is_safe,
          water_source,
          water_purification_methods,
          toilet_type,
          solid_waste_management,
          primary_cooking_fuel,
          primary_energy_source,
          road_status,
          time_to_public_bus,
          time_to_market,
          distance_to_active_road,
          has_properties_elsewhere,
          has_female_named_properties,
          time_to_bank,
          have_remittance,
          have_health_insurance,
          consulting_health_organization,
          time_to_health_organization,
          have_agricultural_land,
          are_involved_in_agriculture,
          are_involved_in_husbandry,
          have_aquaculture,
          have_apiary,
          has_agricultural_insurance,
          months_involved_in_agriculture,
          has_business,
          birth_province,
          birth_district,
          birth_country,
          prior_province,
          prior_district,
          prior_country,
          residence_reason
        FROM acme_khajura_households
        WHERE profile_id = 'khajura'
      `;

      if (input.search) {
        const searchTerm = `%${input.search}%`;
        query = sql`
          ${query} AND (
            family_head_name ILIKE ${searchTerm} OR
            family_head_phone_no ILIKE ${searchTerm} OR
            locality ILIKE ${searchTerm} OR
            house_symbol_no ILIKE ${searchTerm}
          )
        `;
      }

      if (filters) {
        // Location filters
        if (filters.wardNo !== undefined) {
          query = sql`${query} AND ward_no = ${filters.wardNo}`;
        }
        
        if (filters.province) {
          query = sql`${query} AND province = ${filters.province}`;
        }
        
        if (filters.district) {
          query = sql`${query} AND district = ${filters.district}`;
        }

        if (filters.localLevel) {
          query = sql`${query} AND local_level = ${filters.localLevel}`;
        }

        if (filters.locality) {
          query = sql`${query} AND locality ILIKE ${`%${filters.locality}%`}`;
        }

        if (filters.developmentOrganization) {
          query = sql`${query} AND development_organization = ${filters.developmentOrganization}`;
        }

        // Family filters
        if (filters.familyHeadName) {
          query = sql`${query} AND family_head_name ILIKE ${`%${filters.familyHeadName}%`}`;
        }

        if (filters.familyHeadPhoneNo) {
          query = sql`${query} AND family_head_phone_no ILIKE ${`%${filters.familyHeadPhoneNo}%`}`;
        }

        if (filters.totalMembersMin !== undefined) {
          query = sql`${query} AND total_members >= ${filters.totalMembersMin}`;
        }

        if (filters.totalMembersMax !== undefined) {
          query = sql`${query} AND total_members <= ${filters.totalMembersMax}`;
        }

        if (filters.areMembersElsewhere) {
          query = sql`${query} AND are_members_elsewhere = ${filters.areMembersElsewhere}`;
        }

        if (filters.totalElsewhereMembersMin !== undefined) {
          query = sql`${query} AND total_elsewhere_members >= ${filters.totalElsewhereMembersMin}`;
        }

        if (filters.totalElsewhereMembersMax !== undefined) {
          query = sql`${query} AND total_elsewhere_members <= ${filters.totalElsewhereMembersMax}`;
        }

        // House ownership filters
        if (filters.houseOwnership) {
          query = sql`${query} AND house_ownership ILIKE ${`%${filters.houseOwnership}%`}`;
        }

        if (filters.landOwnership) {
          query = sql`${query} AND land_ownership ILIKE ${`%${filters.landOwnership}%`}`;
        }

        if (filters.houseBase) {
          query = sql`${query} AND house_base ILIKE ${`%${filters.houseBase}%`}`;
        }

        if (filters.houseOuterWall) {
          query = sql`${query} AND house_outer_wall ILIKE ${`%${filters.houseOuterWall}%`}`;
        }

        if (filters.houseRoof) {
          query = sql`${query} AND house_roof ILIKE ${`%${filters.houseRoof}%`}`;
        }

        if (filters.houseFloor) {
          query = sql`${query} AND house_floor ILIKE ${`%${filters.houseFloor}%`}`;
        }

        // Safety filters
        if (filters.isHousePassed) {
          query = sql`${query} AND is_house_passed = ${filters.isHousePassed}`;
        }

        if (filters.isMapArchived) {
          query = sql`${query} AND is_map_archived = ${filters.isMapArchived}`;
        }

        if (filters.isSafe) {
          query = sql`${query} AND is_safe = ${filters.isSafe}`;
        }

        // Water and sanitation filters
        if (filters.waterSource) {
          query = sql`${query} AND water_source ILIKE ${`%${filters.waterSource}%`}`;
        }

        if (filters.waterPurificationMethods) {
          query = sql`${query} AND water_purification_methods ILIKE ${`%${filters.waterPurificationMethods}%`}`;
        }

        if (filters.toiletType) {
          query = sql`${query} AND toilet_type ILIKE ${`%${filters.toiletType}%`}`;
        }

        if (filters.solidWasteManagement) {
          query = sql`${query} AND solid_waste_management = ${filters.solidWasteManagement}`;
        }

        if (filters.primaryCookingFuel) {
          query = sql`${query} AND primary_cooking_fuel ILIKE ${`%${filters.primaryCookingFuel}%`}`;
        }

        if (filters.primaryEnergySource) {
          query = sql`${query} AND primary_energy_source ILIKE ${`%${filters.primaryEnergySource}%`}`;
        }

        // Accessibility filters
        if (filters.roadStatus) {
          query = sql`${query} AND road_status = ${filters.roadStatus}`;
        }

        if (filters.timeToPublicBus) {
          query = sql`${query} AND time_to_public_bus = ${filters.timeToPublicBus}`;
        }

        if (filters.timeToMarket) {
          query = sql`${query} AND time_to_market = ${filters.timeToMarket}`;
        }

        if (filters.distanceToActiveRoad) {
          query = sql`${query} AND distance_to_active_road = ${filters.distanceToActiveRoad}`;
        }

        // Economic filters
        if (filters.hasPropertiesElsewhere) {
          query = sql`${query} AND has_properties_elsewhere = ${filters.hasPropertiesElsewhere}`;
        }

        if (filters.hasFemaleNamedProperties) {
          query = sql`${query} AND has_female_named_properties = ${filters.hasFemaleNamedProperties}`;
        }

        if (filters.timeToBank) {
          query = sql`${query} AND time_to_bank ILIKE ${`%${filters.timeToBank}%`}`;
        }

        // Health filters
        if (filters.haveHealthInsurance) {
          query = sql`${query} AND have_health_insurance = ${filters.haveHealthInsurance}`;
        }

        if (filters.consultingHealthOrganization) {
          query = sql`${query} AND consulting_health_organization ILIKE ${`%${filters.consultingHealthOrganization}%`}`;
        }

        if (filters.timeToHealthOrganization) {
          query = sql`${query} AND time_to_health_organization ILIKE ${`%${filters.timeToHealthOrganization}%`}`;
        }

        // Agriculture filters
        if (filters.haveAgriculturalLand) {
          query = sql`${query} AND have_agricultural_land = ${filters.haveAgriculturalLand}`;
        }

        if (filters.areInvolvedInAgriculture) {
          query = sql`${query} AND are_involved_in_agriculture = ${filters.areInvolvedInAgriculture}`;
        }

        if (filters.areInvolvedInHusbandry) {
          query = sql`${query} AND are_involved_in_husbandry = ${filters.areInvolvedInHusbandry}`;
        }

        if (filters.haveAquaculture) {
          query = sql`${query} AND have_aquaculture = ${filters.haveAquaculture}`;
        }

        if (filters.haveApiary) {
          query = sql`${query} AND have_apiary = ${filters.haveApiary}`;
        }

        if (filters.hasAgriculturalInsurance) {
          query = sql`${query} AND has_agricultural_insurance = ${filters.hasAgriculturalInsurance}`;
        }

        if (filters.monthsInvolvedInAgriculture) {
          query = sql`${query} AND months_involved_in_agriculture = ${filters.monthsInvolvedInAgriculture}`;
        }

        // Remittance filters
        if (filters.haveRemittance) {
          query = sql`${query} AND have_remittance = ${filters.haveRemittance}`;
        }

        // Business filters
        if (filters.hasBusiness) {
          query = sql`${query} AND has_business = ${filters.hasBusiness}`;
        }

        // Migration filters
        if (filters.birthProvince) {
          query = sql`${query} AND birth_province = ${filters.birthProvince}`;
        }

        if (filters.birthDistrict) {
          query = sql`${query} AND birth_district = ${filters.birthDistrict}`;
        }

        if (filters.birthCountry) {
          query = sql`${query} AND birth_country = ${filters.birthCountry}`;
        }

        if (filters.priorProvince) {
          query = sql`${query} AND prior_province = ${filters.priorProvince}`;
        }

        if (filters.priorDistrict) {
          query = sql`${query} AND prior_district = ${filters.priorDistrict}`;
        }

        if (filters.priorCountry) {
          query = sql`${query} AND prior_country = ${filters.priorCountry}`;
        }

        if (filters.residenceReason) {
          query = sql`${query} AND residence_reason = ${filters.residenceReason}`;
        }

        // Date range filters
        if (filters.dateOfInterviewFrom) {
          query = sql`${query} AND date_of_interview >= ${filters.dateOfInterviewFrom}`;
        }

        if (filters.dateOfInterviewTo) {
          query = sql`${query} AND date_of_interview <= ${filters.dateOfInterviewTo}`;
        }

        // Array field filters
        if (filters.naturalDisasters && filters.naturalDisasters.length > 0) {
          const conditions = filters.naturalDisasters.map(disaster => 
            `natural_disasters LIKE '%${disaster}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.facilities && filters.facilities.length > 0) {
          const conditions = filters.facilities.map(facility => 
            `facilities LIKE '%${facility}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.financialAccounts && filters.financialAccounts.length > 0) {
          const conditions = filters.financialAccounts.map(account => 
            `financial_accounts LIKE '%${account}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.incomeSources && filters.incomeSources.length > 0) {
          const conditions = filters.incomeSources.map(source => 
            `income_sources LIKE '%${source}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.foodCrops && filters.foodCrops.length > 0) {
          const conditions = filters.foodCrops.map(crop => 
            `food_crops LIKE '%${crop}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.pulses && filters.pulses.length > 0) {
          const conditions = filters.pulses.map(pulse => 
            `pulses LIKE '%${pulse}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.oilSeeds && filters.oilSeeds.length > 0) {
          const conditions = filters.oilSeeds.map(seed => 
            `oil_seeds LIKE '%${seed}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.vegetables && filters.vegetables.length > 0) {
          const conditions = filters.vegetables.map(vegetable => 
            `vegetables LIKE '%${vegetable}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.fruits && filters.fruits.length > 0) {
          const conditions = filters.fruits.map(fruit => 
            `fruits LIKE '%${fruit}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.spices && filters.spices.length > 0) {
          const conditions = filters.spices.map(spice => 
            `spices LIKE '%${spice}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.cashCrops && filters.cashCrops.length > 0) {
          const conditions = filters.cashCrops.map(crop => 
            `cash_crops LIKE '%${crop}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.animals && filters.animals.length > 0) {
          const conditions = filters.animals.map(animal => 
            `animals LIKE '%${animal}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.animalProducts && filters.animalProducts.length > 0) {
          const conditions = filters.animalProducts.map(product => 
            `animal_products LIKE '%${product}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }

        if (filters.agriculturalMachines && filters.agriculturalMachines.length > 0) {
          const conditions = filters.agriculturalMachines.map(machine => 
            `agricultural_machines LIKE '%${machine}%'`
          ).join(' OR ');
          query = sql`${query} AND (${conditions})`;
        }
      }

      // Order by family head name for consistent results
      query = sql`${query} ORDER BY regexp_replace(family_head_name, '[0-9]', '', 'g') ASC NULLS LAST`;

      // Debug: Log the final query
      console.log("🔧 Download - Final SQL query:", query);
      const result = await ctx.db.execute(query);
      console.log("🔧 Download - Query returned", result.length, "results");
      
      // Convert to CSV format
      const headers = [
        "परिवार मूलीको नाम",
        "फोन नम्बर",
        "वडा नं.",
        "कुल सदस्य",
        "स्थानीयता",
        "घर चिह्न नं.",
        "अन्तरवार्ता मिति",
        "प्रान्त",
        "जिल्ला",
        "स्थानीय तह",
        "विकास संगठन",
        "अन्यत्र सदस्य छन्",
        "अन्यत्र सदस्य संख्या",
        "घर स्वामित्व",
        "जग्गा स्वामित्व",
        "घरको आधार",
        "घरको बाहिरी भित्ता",
        "घरको छाना",
        "घरको भुइँ",
        "घर पास भएको",
        "नक्सा संग्रहित",
        "सुरक्षित छ",
        "पानीको स्रोत",
        "पानी शुद्धिकरण विधि",
        "शौचालयको प्रकार",
        "ठोस फोहोर व्यवस्थापन",
        "मुख्य खाना पकाउने इन्धन",
        "मुख्य ऊर्जा स्रोत",
        "सडकको स्थिति",
        "सार्वजनिक बस समय",
        "बजार समय",
        "सक्रिय सडकको दूरी",
        "अन्यत्र सम्पत्ति छ",
        "महिला नामक सम्पत्ति छ",
        "बैंक समय",
        "रेमिट्यान्स छ",
        "स्वास्थ्य बीमा छ",
        "सल्लाहकारी स्वास्थ्य संगठन",
        "स्वास्थ्य संगठन समय",
        "कृषि जग्गा छ",
        "कृषिमा संलग्न छन्",
        "पशुपालनमा संलग्न छन्",
        "माछापालन छ",
        "मौरीपालन छ",
        "कृषि बीमा छ",
        "कृषिमा संलग्न महिना",
        "व्यवसाय छ",
        "जन्म प्रान्त",
        "जन्म जिल्ला",
        "जन्म देश",
        "पूर्व प्रान्त",
        "पूर्व जिल्ला",
        "पूर्व देश",
        "बसोबासको कारण"
      ];

      const csvRows = [headers];

      result.forEach((row: any) => {
        const csvRow = [
          row.family_head_name || "",
          row.family_head_phone_no || "",
          row.ward_no || "",
          row.total_members || "",
          row.locality || "",
          row.house_symbol_no || "",
          row.date_of_interview ? new Date(row.date_of_interview).toLocaleDateString('ne-NP') : "",
          row.province || "",
          row.district || "",
          row.local_level || "",
          row.development_organization || "",
          row.are_members_elsewhere || "",
          row.total_elsewhere_members || "",
          row.house_ownership || "",
          row.land_ownership || "",
          row.house_base || "",
          row.house_outer_wall || "",
          row.house_roof || "",
          row.house_floor || "",
          row.is_house_passed || "",
          row.is_map_archived || "",
          row.is_safe || "",
          row.water_source || "",
          row.water_purification_methods || "",
          row.toilet_type || "",
          row.solid_waste_management || "",
          row.primary_cooking_fuel || "",
          row.primary_energy_source || "",
          row.road_status || "",
          row.time_to_public_bus || "",
          row.time_to_market || "",
          row.distance_to_active_road || "",
          row.has_properties_elsewhere || "",
          row.has_female_named_properties || "",
          row.time_to_bank || "",
          row.have_remittance || "",
          row.have_health_insurance || "",
          row.consulting_health_organization || "",
          row.time_to_health_organization || "",
          row.have_agricultural_land || "",
          row.are_involved_in_agriculture || "",
          row.are_involved_in_husbandry || "",
          row.have_aquaculture || "",
          row.have_apiary || "",
          row.has_agricultural_insurance || "",
          row.months_involved_in_agriculture || "",
          row.has_business || "",
          row.birth_province || "",
          row.birth_district || "",
          row.birth_country || "",
          row.prior_province || "",
          row.prior_district || "",
          row.prior_country || "",
          row.residence_reason || ""
        ];
        csvRows.push(csvRow);
      });

      const csvContent = csvRows.map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ).join('\n');

      return {
        csvContent,
        totalRecords: result.length,
        filename: `घरधुरी_सूची_${new Date().toISOString().split('T')[0]}.csv`
      };
    } catch (error) {
      console.error("Error downloading households:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to download households data",
      });
    }
  });

// Procedure to get total count of households
export const getTotalCountProcedure = protectedProcedure
  .query(async ({ ctx }) => {
    try {
      const query = sql`
        SELECT COUNT(*) as total 
        FROM acme_khajura_households
        WHERE profile_id = 'khajura'
      `;
      
      const result = await ctx.db.execute(query);
      const total = parseInt(result[0]?.total?.toString() || "0", 10);
      
      return { total };
    } catch (error) {
      console.error("Error fetching total household count:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch total household count",
      });
    }
  });