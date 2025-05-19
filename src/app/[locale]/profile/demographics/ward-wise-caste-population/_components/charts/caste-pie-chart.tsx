"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface CastePieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  CASTE_NAMES: Record<string, string>;
  CASTE_COLORS: Record<string, string>;
}

export default function CastePieChart({
  pieChartData,
  CASTE_NAMES,
  CASTE_COLORS,
}: CastePieChartProps) {
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
            // Find the original caste key for color mapping
            const casteKey =
              Object.keys(CASTE_NAMES).find(
                (key) => CASTE_NAMES[key] === entry.name,
              ) || "OTHER";

            return (
              <Cell
                key={`cell-${index}`}
                fill={
                  CASTE_COLORS[
                    casteKey as keyof typeof CASTE_COLORS
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
