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

interface PulsePieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  PULSE_TYPES: Record<string, string>;
  PULSE_COLORS: Record<string, string>;
  dataType: string;
  unit: string;
  isRevenue?: boolean;
}

export default function PulsePieChart({
  pieChartData,
  PULSE_TYPES,
  PULSE_COLORS,
  dataType,
  unit,
  isRevenue = false,
}: PulsePieChartProps) {
  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, payload: originalPayload } = payload[0];
      const percentage = originalPayload.percentage;
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">
              {dataType} ({unit}):
            </span>
            <span className="font-medium">
              {isRevenue
                ? `रु. ${localizeNumber(value.toLocaleString(), "ne")}`
                : localizeNumber(value.toFixed(2), "ne")}
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
          labelLine={false}
          outerRadius={140}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => {
            // Find the original pulse type key for color mapping
            const pulseKey =
              Object.entries(PULSE_TYPES).find(
                ([key, value]) => value === entry.name,
              )?.[0] || "";

            return (
              <Cell
                key={`cell-${index}`}
                fill={
                  PULSE_COLORS[pulseKey as keyof typeof PULSE_COLORS] ||
                  `#${Math.floor(Math.random() * 16777215).toString(16)}`
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
            return value.length > maxLength
              ? value.substring(0, maxLength) + "..."
              : value;
          }}
          wrapperStyle={{ fontSize: "12px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
