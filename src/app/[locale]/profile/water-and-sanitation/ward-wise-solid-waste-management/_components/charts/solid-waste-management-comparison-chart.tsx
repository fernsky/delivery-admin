"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface SolidWasteManagementComparisonChartProps {
  wardWiseFormalCollectionPercentage: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  highestFormalCollectionWard: {
    wardNumber: number;
    percentage: number;
  };
  lowestFormalCollectionWard: {
    wardNumber: number;
    percentage: number;
  };
  WASTE_MANAGEMENT_GROUPS: Record<string, {
    name: string;
    nameEn: string;
    color: string;
    sources: string[];
  }>;
}

export default function SolidWasteManagementComparisonChart({
  wardWiseFormalCollectionPercentage,
  highestFormalCollectionWard,
  lowestFormalCollectionWard,
  WASTE_MANAGEMENT_GROUPS,
}: SolidWasteManagementComparisonChartProps) {
  // Format data for the chart - compare formal waste collection rates
  const chartData = wardWiseFormalCollectionPercentage.map((ward) => ({
    name: `वडा ${ward.wardNumber}`,
    "Formal": ward.percentage,
  })).sort((a, b) => 
    b["Formal"] - a["Formal"]
  );

  // Calculate average formal collection rate
  const avgFormalCollectionRate =
    wardWiseFormalCollectionPercentage.reduce((sum, ward) => sum + ward.percentage, 0) / wardWiseFormalCollectionPercentage.length;

  // Custom tooltip for displaying percentages with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{localizeNumber(label, "ne")}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => {
              let displayName = entry.name;
              if (entry.name === "Formal") {
                displayName = "औपचारिक संकलन";
              }
              
              return (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span>{displayName}: </span>
                  <span className="font-medium">
                    {localizeNumber(entry.value.toFixed(2), "ne")}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        barGap={0}
        barCategoryGap="15%"
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${localizeNumber(value, "ne")}`}
        />
        <YAxis
          tickFormatter={(value) => `${localizeNumber(value, "ne")}%`}
          domain={[
            0,
            Math.max(
              Math.ceil(highestFormalCollectionWard?.percentage || 30),
              30,
            ),
          ]}
          label={{
            value: "प्रतिशत",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend
          formatter={(value) => {
            if (value === "Formal") {
              return "औपचारिक फोहोर संकलन दर";
            }
            return value;
          }}
        />
        <Bar
          dataKey="Formal"
          fill={WASTE_MANAGEMENT_GROUPS.FORMAL_COLLECTION.color}
          radius={[4, 4, 0, 0]}
        />
        <ReferenceLine
          y={avgFormalCollectionRate}
          stroke={WASTE_MANAGEMENT_GROUPS.FORMAL_COLLECTION.color}
          strokeDasharray="3 3"
          label={{
            value: `औसत: ${localizeNumber(avgFormalCollectionRate.toFixed(2), "ne")}%`,
            position: "insideBottomRight",
            style: {
              fill: WASTE_MANAGEMENT_GROUPS.FORMAL_COLLECTION.color,
              fontSize: 12,
            },
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
