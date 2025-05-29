"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface OccupationPieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  OCCUPATION_NAMES: Record<string, string>;
  OCCUPATION_COLORS: Record<string, string>;
}

export default function OccupationPieChart({
  pieChartData,
  OCCUPATION_NAMES,
  OCCUPATION_COLORS,
}: OccupationPieChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({ name, percentage }) => `${name}: ${percentage}%`}
          outerRadius={140}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => {
            // Find the original occupation key for color mapping
            const occupationKey =
              Object.keys(OCCUPATION_NAMES).find(
                (key) => OCCUPATION_NAMES[key] === entry.name,
              ) || "OTHER_EMPLOYMENT";

            return (
              <Cell
                key={`cell-${index}`}
                fill={
                  OCCUPATION_COLORS[
                    occupationKey as keyof typeof OCCUPATION_COLORS
                  ] || `#${Math.floor(Math.random() * 16777215).toString(16)}`
                }
              />
            );
          })}
        </Pie>
        <Tooltip formatter={(value) => Number(value).toLocaleString()} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
