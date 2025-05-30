"use client";

import { localizeNumber } from "@/lib/utils/localize-number";

interface IrrigationDiversityChartProps {
  diversityIndex: number;
}

export default function IrrigationDiversityChart({ diversityIndex }: IrrigationDiversityChartProps) {
  // Convert diversity index to percentage for display
  const diversityPercentage = diversityIndex * 100;

  // Determine color based on diversity index
  const getColor = (index: number) => {
    if (index >= 0.8) return "#2ecc71"; // Green for high diversity
    if (index >= 0.6) return "#27ae60"; // Darker green for good diversity
    if (index >= 0.4) return "#f39c12"; // Orange for medium diversity
    if (index >= 0.2) return "#e67e22"; // Dark orange for poor diversity
    return "#e74c3c"; // Red for very poor diversity
  };

  // Get diversity level label
  const getDiversityLevel = (index: number) => {
    if (index >= 0.8) return "अति उच्च";
    if (index >= 0.6) return "उच्च";
    if (index >= 0.4) return "मध्यम";
    if (index >= 0.2) return "न्यून";
    return "अति न्यून";
  };

  const color = getColor(diversityIndex);
  const diversityLevel = getDiversityLevel(diversityIndex);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md h-8 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-in-out"
          style={{
            width: `${diversityPercentage}%`,
            backgroundColor: color,
          }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-sm font-medium z-10">
          {localizeNumber(diversityPercentage.toFixed(1), "ne")}% - {diversityLevel} विविधता
        </div>
      </div>
      
      <div className="w-full max-w-md mt-4 flex justify-between text-xs text-muted-foreground">
        <span>अति न्यून विविधता</span>
        <span>अति उच्च विविधता</span>
      </div>
      
      <div className="mt-6 text-sm">
        <p className="text-center">
          सिंचाई विविधता सूचकाङ्क {localizeNumber(diversityPercentage.toFixed(1), "ne")}% ({diversityLevel} विविधता)
        </p>
      </div>
    </div>
  );
}
