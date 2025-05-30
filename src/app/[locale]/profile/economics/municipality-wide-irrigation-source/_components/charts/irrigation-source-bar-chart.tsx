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
  Cell,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface IrrigationSourceBarChartProps {
  barChartData: Array<{
    irrigationSource: string;
    coverage: number;
    percentage: number;
  }>;
  IRRIGATION_SOURCE_COLORS: Record<string, string>;
  IRRIGATION_SOURCE_TYPES: Record<string, string>;
}

export default function IrrigationSourceBarChart({
  barChartData,
  IRRIGATION_SOURCE_COLORS,
  IRRIGATION_SOURCE_TYPES,
}: IrrigationSourceBarChartProps) {
  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 mt-2">
            <div className="flex justify-between gap-4">
              <span className="text-sm">कभरेज:</span>
              <span className="font-medium">
                {localizeNumber(data.coverage.toLocaleString(), "ne")} हेक्टर
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm">प्रतिशत:</span>
              <span className="font-medium">
                {localizeNumber(data.percentage.toFixed(2), "ne")}%
              </span>
            </div>
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
        margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
        barSize={60}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="irrigationSource"
          scale="point"
          padding={{ left: 10, right: 10 }}
          tick={{ fontSize: 11 }}
          angle={-45}
          textAnchor="end"
          height={100}
          interval={0}
        />
        <YAxis 
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")} 
          label={{ 
            value: 'कभरेज (हेक्टर)', 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle' }
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend
          formatter={(value) => value}
          wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
        
        <Bar
          dataKey="coverage"
          name="कभरेज (हेक्टर)"
        >
          {barChartData.map((entry, index) => {
            // Find the original source key for color mapping
            const sourceKey = Object.entries(IRRIGATION_SOURCE_TYPES).find(
              ([key, value]) => value === entry.irrigationSource
            )?.[0] || "";
            
            return (
              <Cell
                key={`cell-${index}`}
                fill={
                  IRRIGATION_SOURCE_COLORS[sourceKey as keyof typeof IRRIGATION_SOURCE_COLORS] ||
                  `#${Math.floor(Math.random() * 16777215).toString(16)}`
                }
              />
            );
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
