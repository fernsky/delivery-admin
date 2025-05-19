"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface GenderDistributionPieChartProps {
  overallSummaryByGender: Array<{
    gender: string;
    genderName: string;
    population: number;
  }>;
  totalPopulation: number;
  GENDER_COLORS: Record<string, string>;
}

export default function GenderDistributionPieChart({
  overallSummaryByGender,
  totalPopulation,
  GENDER_COLORS,
}: GenderDistributionPieChartProps) {
  const pieData = overallSummaryByGender.map((item) => ({
    name: item.genderName,
    value: item.population,
    percentage: ((item.population / totalPopulation) * 100).toFixed(2),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({ name, percentage }) =>
            `${name}: ${percentage}%`
          }
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {overallSummaryByGender.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                GENDER_COLORS[
                  entry.gender as keyof typeof GENDER_COLORS
                ] || "#888"
              }
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => Number(value).toLocaleString()}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
