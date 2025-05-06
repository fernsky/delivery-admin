import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MapLayersState {
  showPoints: boolean;
  showLines: boolean;
  togglePoints: () => void;
  toggleLines: () => void;
  setShowPoints: (show: boolean) => void;
  setShowLines: (show: boolean) => void;
}

export const useMapLayersStore = create<MapLayersState>()(
  persist(
    (set) => ({
      showPoints: true, // Show points by default
      showLines: true, // Show lines by default

      togglePoints: () => set((state) => ({ showPoints: !state.showPoints })),
      toggleLines: () => set((state) => ({ showLines: !state.showLines })),

      setShowPoints: (show) => set({ showPoints: show }),
      setShowLines: (show) => set({ showLines: show }),
    }),
    {
      name: "map-layers", // Unique name for localStorage
    },
  ),
);
