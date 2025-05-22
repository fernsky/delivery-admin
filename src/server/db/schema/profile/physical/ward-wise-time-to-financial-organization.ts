import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define time to financial organization type enum
export const timeToFinancialOrganizationTypeEnum = pgEnum(
  "time_to_financial_organization_type",
  ["UNDER_15_MIN", "UNDER_30_MIN", "UNDER_1_HOUR", "1_HOUR_OR_MORE"],
);

export const wardWiseTimeToFinancialOrganization = pgTable(
  "ward_wise_time_to_financial_organization",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Ward reference
    wardNumber: integer("ward_number").notNull(),

    // Time category to reach financial organization
    timeToFinancialOrganization: timeToFinancialOrganizationTypeEnum(
      "time_to_financial_organization",
    ).notNull(),

    // Number of households in this time category
    households: integer("households").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardWiseTimeToFinancialOrganization =
  typeof wardWiseTimeToFinancialOrganization.$inferSelect;
export type NewWardWiseTimeToFinancialOrganization =
  typeof wardWiseTimeToFinancialOrganization.$inferInsert;
