"use client";

import { localizeNumber } from "@/lib/utils/localize-number";

interface IrrigationCoverageChartProps {
  coveragePercentage: number;
}

export default function IrrigationCoverageChart({ coveragePercentage }: IrrigationCoverageChartProps) {
  // Determine color based on coverage percentage
  const getColor = (coverage: number) => {
    if (coverage >= 80) return "#2ecc71"; // Green for high coverage
    if (coverage >= 60) return "#27ae60"; // Darker green for good coverage
    if (coverage >= 40) return "#f39c12"; // Orange for medium coverage
    if (coverage >= 20) return "#e67e22"; // Dark orange for poor coverage
    return "#e74c3c"; // Red for very poor coverage
  };

  // Get coverage level label
  const getCoverageLevel = (coverage: number) => {
    if (coverage >= 80) return "अति राम्रो";
    if (coverage >= 60) return "राम्रो";
    if (coverage >= 40) return "मध्यम";
    if (coverage >= 20) return "कम";
    return "अति कम";
  };

  const color = getColor(coveragePercentage);
  const coverageLevel = getCoverageLevel(coveragePercentage);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md h-8 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-in-out"
          style={{
            width: `${coveragePercentage}%`,
            backgroundColor: color,
          }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-sm font-medium z-10">
          {localizeNumber(coveragePercentage.toFixed(1), "ne")}% - {coverageLevel} सिंचाई कभरेज
        </div>
      </div>
      
      <div className="w-full max-w-md mt-4 flex justify-between text-xs text-muted-foreground">
        <span>अति कम कभरेज</span>
        <span>अति राम्रो कभरेज</span>
      </div>
      
      <div className="mt-6 text-sm">
        <p className="text-center">
          खजुरा गाउँपालिकाको सिंचाई कभरेज {localizeNumber(coveragePercentage.toFixed(1), "ne")}% ({coverageLevel} स्तर)
        </p>
      </div>
    </div>
  );
}
