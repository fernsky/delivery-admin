"use client";

import { useMemo } from "react";
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

interface PopulationPyramidChartProps {
  pyramidData: Array<{
    ageGroup: string;
    ageGroupName: string;
    male: number;
    female: number;
  }>;
  GENDER_COLORS: Record<string, string>;
}

export default function PopulationPyramidChart({
  pyramidData,
  GENDER_COLORS,
}: PopulationPyramidChartProps) {
  // Format pyramid data for display
  const { data, maxValue } = useMemo(() => {
    const maxValue = Math.max(
      ...pyramidData.flatMap((d) => [Math.abs(d.male), d.female]),
    );
    return { data: pyramidData, maxValue };
  }, [pyramidData]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
        layout="vertical"
        barGap={0}
        barSize={20}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          type="number"
          domain={[-maxValue, maxValue]}
          tickFormatter={(value) => Math.abs(value).toString()}
        />
        <YAxis
          type="category"
          dataKey="ageGroupName"
          width={80}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          formatter={(value) => Math.abs(Number(value)).toLocaleString()}
          labelFormatter={(value) => `उमेर समूह: ${value}`}
        />
        <Legend />
        <Bar
          dataKey="male"
          name="पुरुष"
          fill={GENDER_COLORS.MALE}
          stackId="stack"
        />
        <Bar
          dataKey="female"
          name="महिला"
          fill={GENDER_COLORS.FEMALE}
          stackId="stack"
        />
        <text
          x="25%"
          y={15}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-current text-sm font-medium"
        >
          पुरुष
        </text>
        <text
          x="75%"
          y={15}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-current text-sm font-medium"
        >
          महिला
        </text>
      </BarChart>
    </ResponsiveContainer>
  );
}
