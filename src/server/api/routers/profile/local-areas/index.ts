import { createTRPCRouter } from "@/server/api/trpc";
import { locationRouter } from "./location.procedure";
import { mediaRouter } from "../../common/procedures/media.router";

export const localAreasRouter = createTRPCRouter({
  locations: locationRouter,
  media: mediaRouter,
});
