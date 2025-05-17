"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface ReligionPieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  RELIGION_NAMES: Record<string, string>;
  RELIGION_COLORS: Record<string, string>;
}

export default function ReligionPieChart({
  pieChartData,
  RELIGION_NAMES,
  RELIGION_COLORS,
}: ReligionPieChartProps) {
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
            // Find the original religion key for color mapping
            const religionKey =
              Object.keys(RELIGION_NAMES).find(
                (key) => RELIGION_NAMES[key] === entry.name,
              ) || "OTHER";

            return (
              <Cell
                key={`cell-${index}`}
                fill={
                  RELIGION_COLORS[
                    religionKey as keyof typeof RELIGION_COLORS
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
