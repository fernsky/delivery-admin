"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface AgeCategoryPieChartProps {
  totalPopulation: number;
  calculateAgeDistributionPercentage: (ages: string[], total: number) => number;
  AGE_CATEGORY_COLORS: Record<string, string>;
}

export default function AgeCategoryPieChart({
  totalPopulation,
  calculateAgeDistributionPercentage,
  AGE_CATEGORY_COLORS,
}: AgeCategoryPieChartProps) {
  const pieData = [
    {
      name: "बाल (०-१४)",
      value: calculateAgeDistributionPercentage(
        ["AGE_0_4", "AGE_5_9", "AGE_10_14"],
        totalPopulation,
      ),
    },
    {
      name: "युवा (१५-२९)",
      value: calculateAgeDistributionPercentage(
        ["AGE_15_19", "AGE_20_24", "AGE_25_29"],
        totalPopulation,
      ),
    },
    {
      name: "वयस्क (३०-५९)",
      value: calculateAgeDistributionPercentage(
        [
          "AGE_30_34",
          "AGE_35_39",
          "AGE_40_44",
          "AGE_45_49",
          "AGE_50_54",
          "AGE_55_59",
        ],
        totalPopulation,
      ),
    },
    {
      name: "वृद्ध (६० माथि)",
      value: calculateAgeDistributionPercentage(
        [
          "AGE_60_64",
          "AGE_65_69",
          "AGE_70_74",
          "AGE_75_AND_ABOVE",
        ],
        totalPopulation,
      ),
    },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(1)}%`
          }
          fill="#8884d8"
          dataKey="value"
        >
          {Object.entries(AGE_CATEGORY_COLORS).map(
            ([name, color], index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={color} 
              />
            ),
          )}
        </Pie>
        <Tooltip
          formatter={(value) => `${Number(value).toFixed(2)}%`}
        />
        <Legend
          layout="vertical"
          verticalAlign="bottom"
          align="center"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
