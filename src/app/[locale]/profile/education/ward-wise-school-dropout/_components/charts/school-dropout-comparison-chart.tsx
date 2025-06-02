"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface SchoolDropoutComparisonChartProps {
  wardWiseEmploymentDropout: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  highestEmploymentDropoutWard: {
    wardNumber: number;
    percentage: number;
  };
  lowestEmploymentDropoutWard: {
    wardNumber: number;
    percentage: number;
  };
  DROPOUT_CAUSE_GROUPS: Record<string, {
    name: string;
    nameEn: string;
    color: string;
    causes: string[];
  }>;
}

export default function SchoolDropoutComparisonChart({
  wardWiseEmploymentDropout,
  highestEmploymentDropoutWard,
  lowestEmploymentDropoutWard,
  DROPOUT_CAUSE_GROUPS,
}: SchoolDropoutComparisonChartProps) {
  // Format data for the chart - compare employment-related dropout rates
  const chartData = wardWiseEmploymentDropout.map((ward) => ({
    name: `वडा ${ward.wardNumber}`,
    "Employment": ward.percentage,
  })).sort((a, b) => 
    b["Employment"] - a["Employment"]
  );

  // Calculate average employment-related dropout rate
  const avgEmploymentDropoutRate =
    wardWiseEmploymentDropout.reduce((sum, ward) => sum + ward.percentage, 0) / wardWiseEmploymentDropout.length;

  // Custom tooltip for displaying percentages with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => {
              let displayName = entry.name;
              if (entry.name === "Employment") {
                displayName = "रोजगारी सम्बन्धी";
              }
              
              return (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span>{displayName}: </span>
                  <span className="font-medium">
                    {localizeNumber(entry.value.toFixed(2), "ne")}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        barGap={0}
        barCategoryGap="15%"
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis
          tickFormatter={(value) => `${localizeNumber(value, "ne")}%`}
          domain={[0, Math.max(Math.ceil(highestEmploymentDropoutWard?.percentage || 30), 30)]}
          label={{
            value: "प्रतिशत",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend 
          formatter={(value) => {
            if (value === "Employment") {
              return "रोजगारी सम्बन्धी कारण";
            }
            return value;
          }}
        />
        <Bar
          dataKey="Employment"
          fill={DROPOUT_CAUSE_GROUPS.EMPLOYMENT.color}
          radius={[4, 4, 0, 0]}
        />
        <ReferenceLine
          y={avgEmploymentDropoutRate}
          stroke={DROPOUT_CAUSE_GROUPS.EMPLOYMENT.color}
          strokeDasharray="3 3"
          label={{
            value: `औसत: ${localizeNumber(avgEmploymentDropoutRate.toFixed(2), "ne")}%`,
            position: "insideBottomRight",
            style: { fill: DROPOUT_CAUSE_GROUPS.EMPLOYMENT.color, fontSize: 12 },
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
