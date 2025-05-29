"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface BirthCertificateComparisonProps {
  wardWiseAnalysis: Array<{
    wardNumber: number;
    birthCertificateHolders: number;
    percentage: string;
  }>;
  CHART_COLORS: {
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
  };
  highestWard: {
    wardNumber: number;
    birthCertificateHolders: number;
    percentage: string;
  };
  lowestWard: {
    wardNumber: number;
    birthCertificateHolders: number;
    percentage: string;
  };
}

export default function BirthCertificateComparison({
  wardWiseAnalysis,
  CHART_COLORS,
  highestWard,
  lowestWard,
}: BirthCertificateComparisonProps) {
  // Calculate average birth certificates per ward
  const totalCertificates = wardWiseAnalysis.reduce(
    (sum, ward) => sum + ward.birthCertificateHolders, 0
  );
  const averageCertificates = totalCertificates / wardWiseAnalysis.length;

  // Prepare data for comparison chart
  const comparisonData = wardWiseAnalysis.sort((a, b) => a.wardNumber - b.wardNumber).map(ward => ({
    ward: `वडा ${ward.wardNumber}`,
    count: ward.birthCertificateHolders,
    percentage: parseFloat(ward.percentage),
    average: averageCertificates,
  }));

  // Custom tooltip for better presentation
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const { count, percentage, average } = payload[0].payload;
      const aboveOrBelow = count >= average 
        ? "औसत भन्दा माथि" 
        : "औसत भन्दा तल";
      const difference = Math.abs(count - average).toFixed(2);
      
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{localizeNumber(label, "ne")}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">जन्मदर्ता संख्या:</span>
            <span className="font-medium">
              {localizeNumber(count.toLocaleString(), "ne")}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm">प्रतिशत:</span>
            <span className="font-medium">
              {localizeNumber(percentage.toFixed(2), "ne")}%
            </span>
          </div>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">{localizeNumber(aboveOrBelow, "ne")}:</span>
            <span className="font-medium">
              {localizeNumber(difference, "ne")}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={comparisonData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
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
          yAxisId="left"
          orientation="left"
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
          label={{ 
            value: 'संख्या',
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle' }
          }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={(value) => localizeNumber(value.toString() + '%', "ne")}
          label={{ 
            value: 'प्रतिशत',
            angle: 90,
            position: 'insideRight',
            style: { textAnchor: 'middle' }
          }}
        />
        <Tooltip content={CustomTooltip} />
        
        {/* Average reference line */}
        <ReferenceLine 
          y={averageCertificates} 
          yAxisId="left"
          stroke={CHART_COLORS.accent}
          strokeDasharray="3 3"
          label={{ 
            value: `औसत: ${localizeNumber(averageCertificates.toFixed(1), "ne")}`,
            position: 'insideBottomLeft',
            fill: CHART_COLORS.accent,
            fontSize: 12
          }}
        />
        
        {/* Bar chart for actual values */}
        <Bar
          dataKey="count"
          name="जन्मदर्ता संख्या"
          fill={CHART_COLORS.primary}
          yAxisId="left"
        >
          {comparisonData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.count > averageCertificates ? CHART_COLORS.primary : CHART_COLORS.secondary}
            />
          ))}
        </Bar>
        
        {/* Line for percentage */}
        <Line
          type="monotone"
          dataKey="percentage"
          stroke={CHART_COLORS.accent}
          strokeWidth={2}
          yAxisId="right"
          name="प्रतिशत"
          dot={{ r: 4, fill: CHART_COLORS.accent }}
          activeDot={{ r: 6 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
