import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MapLayersState {
  // For road layers
  showPoints: boolean;
  showLines: boolean;
  setShowPoints: (show: boolean) => void;
  setShowLines: (show: boolean) => void;

  // For parking facility layers
  showPolygons: boolean;
  setShowPolygons: (show: boolean) => void;
}

export const useMapLayersStore = create<MapLayersState>()(
  persist(
    (set) => ({
      // For road layers
      showPoints: true, // Show points by default
      showLines: true, // Show lines by default
      setShowPoints: (show: boolean) => set({ showPoints: show }),
      setShowLines: (show: boolean) => set({ showLines: show }),

      // For parking facility layers
      showPolygons: true, // Show polygons by default
      setShowPolygons: (show: boolean) => set({ showPolygons: show }),
    }),
    {
      name: "map-layers", // Unique name for localStorage
    },
  ),
);
