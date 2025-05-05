import { pgTable } from "../../../../schema/basic";
import {
  integer,
  timestamp,
  varchar,
  text,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { geometry } from "../../../../geographical";

// Define location type enum
export const locationTypeEnum = pgEnum("location_type", [
  "VILLAGE",
  "SETTLEMENT",
  "TOLE",
  "WARD",
  "SQUATTER_AREA",
]);

// Base location table
export const location = pgTable("location", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: locationTypeEnum("type").notNull(),
  isNewSettlement: boolean("is_new_settlement").default(false),
  isTownPlanned: boolean("is_town_planned").default(false),

  // Point geometry stored as PostGIS point
  pointGeometry: geometry("point_geometry", { type: "Point" }),

  // Polygon geometry stored as PostGIS polygon or GeoJSON
  polygonGeometry: geometry("polygon_geometry", { type: "Polygon" }),

  // Optional parent location (for hierarchical relationships)
  parentId: varchar("parent_id", { length: 36 }),

  // Status and metadata
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
  createdBy: varchar("created_by", { length: 36 }),
  updatedBy: varchar("updated_by", { length: 36 }),
});

export type Location = typeof location.$inferSelect;
export type NewLocation = typeof location.$inferInsert;
