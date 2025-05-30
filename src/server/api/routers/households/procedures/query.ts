import { z } from "zod";
import { protectedProcedure } from "@/server/api/trpc";
import { householdQuerySchema } from "../households.schema";
import { sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Procedure to get a paginated list of households with basic info for cards
export const getHouseholdsProcedure = protectedProcedure
  .input(householdQuerySchema)
  .query(async ({ ctx, input }) => {
    try {
      const { limit, offset, sortBy, sortOrder, filters } = input;

      // Only select necessary fields for card display
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
        FROM acme_khajura_household
        WHERE profile_id = 'khajura'
      `;

      // Add search functionality
      if (input.search) {
        query = sql`${query} AND (
          family_head_name ILIKE ${`%${input.search}%`} OR
          family_head_phone_no ILIKE ${`%${input.search}%`} OR
          locality ILIKE ${`%${input.search}%`} OR
          house_symbol_no ILIKE ${`%${input.search}%`}
        )`;
      }

      // Add filters if provided
      if (filters) {
        if (filters.wardNo !== undefined) {
          query = sql`${query} AND ward_no = ${filters.wardNo}`;
        }
        
        if (filters.province) {
          query = sql`${query} AND province = ${filters.province}`;
        }
        
        if (filters.district) {
          query = sql`${query} AND district = ${filters.district}`;
        }

        // Additional filters as needed
        if (filters.haveAgriculturalLand) {
          query = sql`${query} AND have_agricultural_land = ${filters.haveAgriculturalLand}`;
        }

        if (filters.houseOwnership) {
          query = sql`${query} AND house_ownership = ${filters.houseOwnership}`;
        }
      }

      // Add sorting
      if (sortBy === "family_head_name") {
        query = sql`${query} ORDER BY family_head_name ${sql.raw(sortOrder)}`;
      } else if (sortBy === "ward_no") {
        query = sql`${query} ORDER BY ward_no ${sql.raw(sortOrder)}`;
      } else if (sortBy === "date_of_interview") {
        query = sql`${query} ORDER BY date_of_interview ${sql.raw(sortOrder)}`;
      } else {
        query = sql`${query} ORDER BY family_head_name ASC`;
      }

      // Add pagination
      query = sql`${query} LIMIT ${limit} OFFSET ${offset}`;

      // Execute the query
      const households = await ctx.db.execute(query);

      // Get total count for pagination
      const countQuery = sql`
        SELECT COUNT(*) as total 
        FROM acme_khajura_household
        WHERE profile_id = 'khajura'
      `;
      
      // Add the same search and filter conditions to the count query
      let countWithFilters = sql`${countQuery}`;
      
      if (input.search) {
        countWithFilters = sql`${countWithFilters} AND (
          family_head_name ILIKE ${`%${input.search}%`} OR
          family_head_phone_no ILIKE ${`%${input.search}%`} OR
          locality ILIKE ${`%${input.search}%`} OR
          house_symbol_no ILIKE ${`%${input.search}%`}
        )`;
      }
      
      if (filters) {
        if (filters.wardNo !== undefined) {
          countWithFilters = sql`${countWithFilters} AND ward_no = ${filters.wardNo}`;
        }
        
        if (filters.province) {
          countWithFilters = sql`${countWithFilters} AND province = ${filters.province}`;
        }
        
        if (filters.district) {
          countWithFilters = sql`${countWithFilters} AND district = ${filters.district}`;
        }

        if (filters.haveAgriculturalLand) {
          countWithFilters = sql`${countWithFilters} AND have_agricultural_land = ${filters.haveAgriculturalLand}`;
        }

        if (filters.houseOwnership) {
          countWithFilters = sql`${countWithFilters} AND house_ownership = ${filters.houseOwnership}`;
        }
      }
      
      const countResult = await ctx.db.execute(countWithFilters);
      const total = parseInt(countResult[0].total as string, 10);

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

// Procedure to get a specific household by ID with complete details for editing
export const getHouseholdByIdProcedure = protectedProcedure
  .input(z.object({
    id: z.string(),
  }))
  .query(async ({ ctx, input }) => {
    try {
      const { id } = input;

      // Query to get all household data for a specific ID
      const query = sql`
        SELECT * FROM acme_khajura_household
        WHERE id = ${id} AND profile_id = 'khajura'
      `;

      const result = await ctx.db.execute(query);

      if (!result || result.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Household not found",
        });
      }

      const household = result[0];

      // Parse array fields from PostgreSQL format
      const parseArrayField = (field: string | null): string[] => {
        if (!field || field === '{}') return [];
        try {
          return field.replace(/^\{|\}$/g, '').split(',').filter(Boolean);
        } catch {
          return [];
        }
      };

      // Map DB field names to camelCase for frontend
      return {
        id: household.id,
        profileId: household.profile_id,
        
        // Basic information
        province: household.province || "",
        district: household.district || "",
        localLevel: household.local_level || "",
        wardNo: household.ward_no || 0,
        houseSymbolNo: household.house_symbol_no || "",
        familySymbolNo: household.family_symbol_no || "",
        dateOfInterview: household.date_of_interview && typeof household.date_of_interview === 'string' ? new Date(household.date_of_interview) : null,
        householdLocation: parseArrayField(household.household_location as string | null),
        locality: household.locality || "",
        developmentOrganization: household.development_organization || "",
        
        // Family information
        familyHeadName: household.family_head_name || "",
        familyHeadPhoneNo: household.family_head_phone_no || "",
        totalMembers: household.total_members || 0,
        areMembersElsewhere: household.are_members_elsewhere || "",
        totalElsewhereMembers: household.total_elsewhere_members || 0,
        
        // House details
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
        houseFloors: household.house_floors || 0,
        roomCount: household.room_count || 0,
        
        // Safety information
        isHousePassed: household.is_house_passed || "",
        isMapArchived: household.is_map_archived || "",
        isEarthquakeResistant: household.is_earthquake_resistant || "",
        disasterRiskStatus: household.disaster_risk_status || "",
        naturalDisasters: parseArrayField(household.natural_disasters as string | null),
        isSafe: household.is_safe || "",
        
        // Water, sanitation and energy
        waterSource: household.water_source || "",
        waterPurificationMethods: parseArrayField(household.water_purification_methods as string | null),
        toiletType: household.toilet_type || "",
        solidWasteManagement: household.solid_waste_management || "",
        primaryCookingFuel: household.primary_cooking_fuel || "",
        primaryEnergySource: household.primary_energy_source || "",
        
        // Accessibility
        roadStatus: household.road_status || "",
        timeToPublicBus: household.time_to_public_bus || "",
        timeToMarket: household.time_to_market || "",
        distanceToActiveRoad: household.distance_to_active_road || "",
        facilities: parseArrayField(household.facilities as string | null),

        // Economic details
        hasPropertiesElsewhere: household.has_properties_elsewhere || "",
        hasFemaleNamedProperties: household.has_female_named_properties || "",
        organizationsLoanedFrom: parseArrayField(household.organizations_loaned_from as string | null),
        loanUses: parseArrayField(household.loan_uses as string | null),
        timeToBank: household.time_to_bank || "",
        financialAccounts: parseArrayField(household.financial_accounts as string | null),
        haveRemittance: household.have_remittance || "",
        remittanceExpenses: parseArrayField(household.remittance_expenses as string | null),

        // Health
        haveHealthInsurance: household.have_health_insurance || "",
        consultingHealthOrganization: household.consulting_health_organization || "",
        timeToHealthOrganization: household.time_to_health_organization || "",
        
        // Municipal & Suggestions
        municipalSuggestions: parseArrayField(household.municipal_suggestions as string | null),

        // Agriculture & Livestock
        haveAgriculturalLand: household.have_agricultural_land || "",
        agriculturalLands: parseArrayField(household.agricultural_lands as string | null),
        areInvolvedInAgriculture: household.are_involved_in_agriculture || "",
        foodCrops: parseArrayField(household.food_crops as string | null),
        pulses: parseArrayField(household.pulses as string | null),
        oilSeeds: parseArrayField(household.oil_seeds as string | null),
        vegetables: parseArrayField(household.vegetables as string | null),
        fruits: parseArrayField(household.fruits as string | null),
        spices: parseArrayField(household.spices as string | null),
        cashCrops: parseArrayField(household.cash_crops as string | null),
        areInvolvedInHusbandry: household.are_involved_in_husbandry || "",
        animals: parseArrayField(household.animals as string | null),
        animalProducts: parseArrayField(household.animal_products as string | null),

        // Aquaculture & Apiary
        haveAquaculture: household.have_aquaculture || "",
        pondNumber: household.pond_number || 0,
        pondArea: household.pond_area || 0,
        fishProduction: household.fish_production || 0,
        haveApiary: household.have_apiary || "",
        hiveNumber: household.hive_number || 0,
        honeyProduction: household.honey_production || 0,
        honeySales: household.honey_sales || 0,
        honeyRevenue: household.honey_revenue || 0,
        
        // Agricultural operations
        hasAgriculturalInsurance: household.has_agricultural_insurance || "",
        monthsInvolvedInAgriculture: household.months_involved_in_agriculture || "",
        agriculturalMachines: parseArrayField(household.agricultural_machines as string | null),
        
        // Migration details
        birthPlace: household.birth_place || "",
        birthProvince: household.birth_province || "",
        birthDistrict: household.birth_district || "",
        birthCountry: household.birth_country || "",
        priorLocation: household.prior_location || "",
        priorProvince: household.prior_province || "",
        priorDistrict: household.prior_district || "",
        priorCountry: household.prior_country || "",
        residenceReason: household.residence_reason || "",
        
        // Business
        hasBusiness: household.has_business || "",
        
        // System fields
        deviceId: household.device_id || "",
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error; // Re-throw TRPC errors like NOT_FOUND
      }
      console.error("Error fetching household by ID:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch household details",
      });
    }
  });
