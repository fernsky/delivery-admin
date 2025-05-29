"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface BirthCertificateBarChartProps {
  barChartData: Array<{
    ward: string;
    value: number;
    percentage: string;
  }>;
  CHART_COLORS: {
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
  };
}

export default function BirthCertificateBarChart({
  barChartData,
  CHART_COLORS,
}: BirthCertificateBarChartProps) {
  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const { value, percentage } = payload[0].payload;
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{localizeNumber(label, "ne")}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">संख्या:</span>
            <span className="font-medium">
              {localizeNumber(value.toLocaleString(), "ne")}
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
      <BarChart
        data={barChartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        barSize={40}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="ward"
          scale="point"
          padding={{ left: 10, right: 10 }}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
        />
        <YAxis 
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")} 
          label={{ 
            value: 'संख्या',
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle' }
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Bar
          dataKey="value"
          name="जन्मदर्ता प्रमाणपत्र धारक"
          fill={CHART_COLORS.primary}
        >
          {barChartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CHART_COLORS.primary}
              fillOpacity={0.5 + (entry.value / Math.max(...barChartData.map(item => item.value))) * 0.5}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
