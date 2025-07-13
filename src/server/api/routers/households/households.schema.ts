import { z } from "zod";

export const householdSchema = z.object({
  // Primary identification
  id: z.string(),
  profileId: z.string(),
  
  // Location information
  province: z.string(),
  district: z.string(),
  localLevel: z.string(),
  wardNo: z.number(),
  houseSymbolNo: z.string(),
  familySymbolNo: z.string(),
  dateOfInterview: z.date().nullable(),
  householdLocation: z.array(z.string()).nullable(),
  locality: z.string(),
  developmentOrganization: z.string(),
  
  // Family information
  familyHeadName: z.string(),
  familyHeadPhoneNo: z.string(),
  totalMembers: z.number(),
  areMembersElsewhere: z.string().nullable(),
  totalElsewhereMembers: z.number().nullable(),
  
  // House details
  houseOwnership: z.string(),
  houseOwnershipOther: z.string().nullable(),
  landOwnership: z.string(),
  landOwnershipOther: z.string().nullable(),
  houseBase: z.string(),
  houseBaseOther: z.string().nullable(),
  houseOuterWall: z.string(),
  houseOuterWallOther: z.string().nullable(),
  houseRoof: z.string(),
  houseRoofOther: z.string().nullable(),
  houseFloor: z.string(),
  houseFloorOther: z.string().nullable(),
  
  // Safety information
  isHousePassed: z.string(),
  isMapArchived: z.string().nullable(),
  naturalDisasters: z.array(z.string()).nullable(),
  isSafe: z.string().nullable(),
  
  // Water, sanitation and energy
  waterSource: z.string(),
  // Changed from array to string to match schema
  waterPurificationMethods: z.string().nullable(),
  toiletType: z.string(),
  solidWasteManagement: z.string(),
  primaryCookingFuel: z.string(),
  primaryEnergySource: z.string(),
  
  // Accessibility
  roadStatus: z.string(),
  timeToPublicBus: z.string(),
  timeToMarket: z.string(),
  distanceToActiveRoad: z.string().nullable(),
  facilities: z.array(z.string()).nullable(),
  
  // Economic details
  hasPropertiesElsewhere: z.string(),
  hasFemaleNamedProperties: z.string(),
  organizationsLoanedFrom: z.array(z.string()).nullable(),
  loanUses: z.array(z.string()).nullable(),
  timeToBank: z.string(),
  financialAccounts: z.array(z.string()).nullable(),
  // Added income sources to match schema
  incomeSources: z.array(z.string()).nullable(),
  
  // Remittance (moved to match schema order)
  haveRemittance: z.string(),
  remittanceExpenses: z.array(z.string()).nullable(),
  
  // Health
  haveHealthInsurance: z.string(),
  consultingHealthOrganization: z.string(),
  timeToHealthOrganization: z.string(),
  
  // Municipal & Suggestions
  municipalSuggestions: z.array(z.string()).nullable(),
  
  // Agriculture & Livestock
  haveAgriculturalLand: z.string(),
  agriculturalLands: z.array(z.string()).nullable(),
  areInvolvedInAgriculture: z.string(),
  foodCrops: z.array(z.string()).nullable(),
  pulses: z.array(z.string()).nullable(),
  oilSeeds: z.array(z.string()).nullable(),
  vegetables: z.array(z.string()).nullable(),
  fruits: z.array(z.string()).nullable(),
  spices: z.array(z.string()).nullable(),
  cashCrops: z.array(z.string()).nullable(),
  areInvolvedInHusbandry: z.string(),
  animals: z.array(z.string()).nullable(),
  animalProducts: z.array(z.string()).nullable(),
  
  // Aquaculture & Apiary
  haveAquaculture: z.string(),
  pondNumber: z.number().nullable(),
  pondArea: z.number().nullable(),
  fishProduction: z.number().nullable(),
  haveApiary: z.string(),
  hiveNumber: z.number().nullable(),
  honeyProduction: z.number().nullable(),
  honeySales: z.number().nullable(),
  honeyRevenue: z.number().nullable(),
  
  // Agricultural operations
  hasAgriculturalInsurance: z.string(),
  monthsInvolvedInAgriculture: z.string(),
  agriculturalMachines: z.array(z.string()).nullable(),
  
  // Migration details
  birthPlace: z.string().nullable(),
  birthProvince: z.string().nullable(),
  birthDistrict: z.string().nullable(),
  birthCountry: z.string().nullable(),
  priorLocation: z.string().nullable(),
  priorProvince: z.string().nullable(),
  priorDistrict: z.string().nullable(),
  priorCountry: z.string().nullable(),
  residenceReason: z.string().nullable(),
  
  // Business
  hasBusiness: z.string().nullable(),
  
  // System fields
  deviceId: z.string().nullable(),
});

export const createHouseholdSchema = householdSchema.omit({ id: true });

export const updateHouseholdSchema = householdSchema.partial();

export const householdQuerySchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
  sortBy: z
    .enum([
      "family_head_name", 
      "ward_no", 
      "locality", 
      "house_symbol_no",
      "date_of_interview",
      "total_members",
      "province",
      "district",
      "local_level",
    ])
    .default("family_head_name"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  filters: z
    .object({
      // Location filters
      wardNo: z.number().optional(),
      province: z.string().optional(),
      district: z.string().optional(),
      localLevel: z.string().optional(),
      locality: z.string().optional(),
      developmentOrganization: z.string().optional(),
      
      // Family filters
      familyHeadName: z.string().optional(),
      familyHeadPhoneNo: z.string().optional(),
      totalMembersMin: z.number().optional(),
      totalMembersMax: z.number().optional(),
      areMembersElsewhere: z.string().optional(),
      totalElsewhereMembersMin: z.number().optional(),
      totalElsewhereMembersMax: z.number().optional(),
      
      // House ownership filters
      houseOwnership: z.string().optional(),
      landOwnership: z.string().optional(),
      houseBase: z.string().optional(),
      houseOuterWall: z.string().optional(),
      houseRoof: z.string().optional(),
      houseFloor: z.string().optional(),
      
      // Safety filters
      isHousePassed: z.string().optional(),
      isMapArchived: z.string().optional(),
      isSafe: z.string().optional(),
      
      // Water and sanitation filters
      waterSource: z.string().optional(),
      waterPurificationMethods: z.string().optional(),
      toiletType: z.string().optional(),
      solidWasteManagement: z.string().optional(),
      primaryCookingFuel: z.string().optional(),
      primaryEnergySource: z.string().optional(),
      
      // Accessibility filters
      roadStatus: z.string().optional(),
      timeToPublicBus: z.string().optional(),
      timeToMarket: z.string().optional(),
      distanceToActiveRoad: z.string().optional(),
      
      // Economic filters
      hasPropertiesElsewhere: z.string().optional(),
      hasFemaleNamedProperties: z.string().optional(),
      timeToBank: z.string().optional(),
      
      // Health filters
      haveHealthInsurance: z.string().optional(),
      consultingHealthOrganization: z.string().optional(),
      timeToHealthOrganization: z.string().optional(),
      
      // Agriculture filters
      haveAgriculturalLand: z.string().optional(),
      areInvolvedInAgriculture: z.string().optional(),
      areInvolvedInHusbandry: z.string().optional(),
      haveAquaculture: z.string().optional(),
      haveApiary: z.string().optional(),
      hasAgriculturalInsurance: z.string().optional(),
      monthsInvolvedInAgriculture: z.string().optional(),
      
      // Remittance filters
      haveRemittance: z.string().optional(),
      
      // Business filters
      hasBusiness: z.string().optional(),
      
      // Migration filters
      birthProvince: z.string().optional(),
      birthDistrict: z.string().optional(),
      birthCountry: z.string().optional(),
      priorProvince: z.string().optional(),
      priorDistrict: z.string().optional(),
      priorCountry: z.string().optional(),
      residenceReason: z.string().optional(),
      
      // Date range filters
      dateOfInterviewFrom: z.date().optional(),
      dateOfInterviewTo: z.date().optional(),
      
      // Array field filters
      naturalDisasters: z.array(z.string()).optional(),
      facilities: z.array(z.string()).optional(),
      financialAccounts: z.array(z.string()).optional(),
      incomeSources: z.array(z.string()).optional(),
      foodCrops: z.array(z.string()).optional(),
      pulses: z.array(z.string()).optional(),
      oilSeeds: z.array(z.string()).optional(),
      vegetables: z.array(z.string()).optional(),
      fruits: z.array(z.string()).optional(),
      spices: z.array(z.string()).optional(),
      cashCrops: z.array(z.string()).optional(),
      animals: z.array(z.string()).optional(),
      animalProducts: z.array(z.string()).optional(),
      agriculturalMachines: z.array(z.string()).optional(),
    })
    .optional(),
  search: z.string().optional(),
});

// Schema for download operations that allows limit to be 0
export const householdDownloadSchema = householdQuerySchema.extend({
  limit: z.number().min(0).max(1000000).default(0), // Allow 0 for unlimited downloads
});

export const householdStatusSchema = z.object({
  householdId: z.string(),
  message: z.string().optional(), // For rejection reason or edit request details
});

export type HouseholdStatusUpdate = z.infer<typeof householdStatusSchema>;

export type Household = z.infer<typeof householdSchema>;
