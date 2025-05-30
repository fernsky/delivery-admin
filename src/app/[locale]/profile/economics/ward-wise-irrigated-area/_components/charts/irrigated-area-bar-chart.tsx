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

interface IrrigatedAreaBarChartProps {
  wardWiseData: Array<Record<string, any>>;
  LAND_OWNERSHIP_COLORS?: Record<string, string>;
  AREA_COLORS: Record<string, string>;
}

export default function IrrigatedAreaBarChart({
  wardWiseData,
  AREA_COLORS,
}: IrrigatedAreaBarChartProps) {
  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{localizeNumber(label, "ne")}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span>{entry.name}: </span>
                <span className="font-medium">
                  {localizeNumber(entry.value?.toLocaleString() || "0", "ne")} हेक्टर
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={wardWiseData}
        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        barSize={40}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="ward"
          scale="point"
          padding={{ left: 10, right: 10 }}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")} 
          label={{ 
            value: 'क्षेत्रफल (हेक्टर)', 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle' }
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend
          wrapperStyle={{ paddingTop: 20 }}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
        
        <Bar
          dataKey="सिंचित क्षेत्र"
          name="सिंचित क्षेत्र"
          fill={AREA_COLORS["IRRIGATED"] || "#2ecc71"}
        />
        <Bar
          dataKey="असिंचित क्षेत्र"
          name="असिंचित क्षेत्र"
          fill={AREA_COLORS["UNIRRIGATED"] || "#e67e22"}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
