"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface AgeDistributionBarChartProps {
  overallSummaryByAge: Array<{
    ageGroup: string;
    ageGroupName: string;
    total: number;
    male: number;
    female: number;
    other: number;
  }>;
  GENDER_NAMES: Record<string, string>;
  GENDER_COLORS: Record<string, string>;
}

export default function AgeDistributionBarChart({
  overallSummaryByAge,
  GENDER_NAMES,
  GENDER_COLORS,
}: AgeDistributionBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={overallSummaryByAge}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 80, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis type="number" />
        <YAxis
          dataKey="ageGroupName"
          type="category"
          tick={{ fontSize: 12 }}
          width={70}
        />
        <Tooltip
          formatter={(value) => Number(value).toLocaleString()}
          labelFormatter={(value) => `उमेर समूह: ${value}`}
        />
        <Legend />
        <Bar
          dataKey="male"
          name={GENDER_NAMES["MALE"]}
          fill={GENDER_COLORS["MALE"]}
          stackId="a"
        />
        <Bar
          dataKey="female"
          name={GENDER_NAMES["FEMALE"]}
          fill={GENDER_COLORS["FEMALE"]}
          stackId="a"
        />
        <Bar
          dataKey="other"
          name={GENDER_NAMES["OTHER"]}
          fill={GENDER_COLORS["OTHER"]}
          stackId="a"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
