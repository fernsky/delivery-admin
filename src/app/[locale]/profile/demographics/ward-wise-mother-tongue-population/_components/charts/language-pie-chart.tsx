"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface LanguagePieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  LANGUAGE_NAMES: Record<string, string>;
  LANGUAGE_COLORS: Record<string, string>;
}

export default function LanguagePieChart({
  pieChartData,
  LANGUAGE_NAMES,
  LANGUAGE_COLORS,
}: LanguagePieChartProps) {
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
            // Find the original language key for color mapping
            const languageKey =
              Object.keys(LANGUAGE_NAMES).find(
                (key) => LANGUAGE_NAMES[key] === entry.name,
              ) || "OTHER";

            return (
              <Cell
                key={`cell-${index}`}
                fill={
                  LANGUAGE_COLORS[
                    languageKey as keyof typeof LANGUAGE_COLORS
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
