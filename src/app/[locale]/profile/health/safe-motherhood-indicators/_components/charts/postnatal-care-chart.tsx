"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface PostnatalCareChartProps {
  postnatalData: any[];
  indicatorLabels: Record<string, string>;
}

export default function PostnatalCareChart({
  postnatalData,
  indicatorLabels,
}: PostnatalCareChartProps) {
  // Prepare data for chart
  const chartData = postnatalData
    .filter(item => item.value !== null && item.value !== undefined)
    .map(item => {
      // Extract shorter label for better display
      const shortLabel = item.indicator
        .replace('POSTPARTUM_', '')
        .replace('WOMEN_', '')
        .replace(/_/g, ' ')
        .split(' ')
        .slice(0, 3)
        .join(' ');
        
      return {
        name: shortLabel,
        fullName: indicatorLabels[item.indicator] || item.indicator,
        value: parseFloat(item.value) || 0,
        indicator: item.indicator,
      };
    });

  // Get color based on value
  function getBarColor(value: number): string {
    if (value >= 90) return "#0ea5e9"; // Sky
    if (value >= 80) return "#0284c7"; // Sky dark
    if (value >= 70) return "#0369a1"; // Sky darker
    return "#ef4444"; // Red
  }

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="text-sm font-medium mb-1">{data.indicator}</p>
          <p className="text-xs mb-2">{data.fullName}</p>
          <div className="flex justify-between gap-4">
            <span>कभरेज:</span>
            <span className="font-medium">
              {localizeNumber(data.value.toFixed(1), "ne")}%
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
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12, angle: -45, textAnchor: 'end' }} 
          height={80}
        />
        <YAxis
          tickFormatter={(value) => `${localizeNumber(value.toString(), "ne")}%`}
          domain={[0, 100]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="value" 
          name="सुत्केरी स्वास्थ्य सेवा"
          isAnimationActive={true} 
          animationDuration={800}
          maxBarSize={60}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
