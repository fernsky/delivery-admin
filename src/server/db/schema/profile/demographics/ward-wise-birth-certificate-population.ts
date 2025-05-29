import { pgTable } from "../../basic";
import { integer, timestamp, varchar } from "drizzle-orm/pg-core";

export const wardWiseBirthCertificatePopulation = pgTable(
  "acme_ward_wise_birth_certificate_population",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Reference to the ward entity
    wardNumber: integer("ward_number").notNull(),

    // Number of birth certificate holders below 5 years in this ward
    birthCertificateHoldersBelow5years: integer("birth_certificate_holders_below_5years").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardWiseBirthCertificatePopulation = 
  typeof wardWiseBirthCertificatePopulation.$inferSelect;
export type NewWardWiseBirthCertificatePopulation = 
  typeof wardWiseBirthCertificatePopulation.$inferInsert;
