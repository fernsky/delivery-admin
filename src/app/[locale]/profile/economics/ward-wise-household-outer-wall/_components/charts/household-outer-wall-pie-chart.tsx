"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface HouseholdOuterWallPieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  WALL_TYPE_NAMES: Record<string, string>;
  WALL_TYPE_COLORS: Record<string, string>;
}

export default function HouseholdOuterWallPieChart({
  pieChartData,
  WALL_TYPE_NAMES,
  WALL_TYPE_COLORS,
}: HouseholdOuterWallPieChartProps) {
  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, payload: originalPayload } = payload[0];
      const percentage = originalPayload.percentage;
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">घरधुरी:</span>
            <span className="font-medium">
              {localizeNumber(value.toLocaleString(), "ne")}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm">प्रतिशत:</span>
            <span className="font-medium">
              {localizeNumber(percentage, "ne")}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={140}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => {
            // Find the original wall type key for color mapping
            const wallTypeKey =
              Object.keys(WALL_TYPE_NAMES).find(
                (key) => WALL_TYPE_NAMES[key] === entry.name,
              ) || "OTHER";

            return (
              <Cell
                key={`cell-${index}`}
                fill={
                  WALL_TYPE_COLORS[
                    wallTypeKey as keyof typeof WALL_TYPE_COLORS
                  ] || `#${Math.floor(Math.random() * 16777215).toString(16)}`
                }
              />
            );
          })}
        </Pie>
        <Tooltip content={CustomTooltip} />
        <Legend 
          formatter={(value) => {
            // Truncate long names in the legend for better display
            const maxLength = 25;
            return value.length > maxLength ? value.substring(0, maxLength) + '...' : value;
          }} 
          wrapperStyle={{ fontSize: '12px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
