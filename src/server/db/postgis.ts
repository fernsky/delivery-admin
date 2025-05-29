import { customType } from "drizzle-orm/pg-core";

// Helper function for PostGIS geometry types
export const postgis = (name: string) => 
  customType<string | [number, number]>({
    dataType() {
      return 'geometry(Point, 4326)';
    },
    toDriver(value) {
      if (typeof value === 'string') return value;
      if (Array.isArray(value) && value.length === 2) {
        const [lng, lat] = value;
        return `SRID=4326;POINT(${lng} ${lat})`;
      }
      return null;
    }
  })(name);
