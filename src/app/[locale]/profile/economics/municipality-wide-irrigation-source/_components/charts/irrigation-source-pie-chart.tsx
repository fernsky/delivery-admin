"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface IrrigationSourcePieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
    type: string;
  }>;
  IRRIGATION_SOURCE_COLORS: Record<string, string>;
}

export default function IrrigationSourcePieChart({
  pieChartData,
  IRRIGATION_SOURCE_COLORS,
}: IrrigationSourcePieChartProps) {
  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, payload: originalPayload } = payload[0];
      const percentage = originalPayload.percentage;
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">कभरेज:</span>
            <span className="font-medium">
              {localizeNumber(value.toLocaleString(), "ne")} हेक्टर
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
      <PieChart>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={140}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                IRRIGATION_SOURCE_COLORS[entry.type] || 
                `#${Math.floor(Math.random() * 16777215).toString(16)}`
              }
            />
          ))}
        </Pie>
        <Tooltip content={CustomTooltip} />
        <Legend 
          formatter={(value) => {
            // Truncate long names in the legend for better display
            const maxLength = 25;
            return value.length > maxLength ? value.substring(0, maxLength) + '...' : value;
          }}
          wrapperStyle={{ fontSize: '12px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
