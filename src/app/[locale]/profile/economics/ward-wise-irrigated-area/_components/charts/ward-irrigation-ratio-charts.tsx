"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardIrrigationRatioChartsProps {
  wardNumbers: number[];
  irrigatedAreaData: Array<{
    id?: string;
    wardNumber: number;
    irrigatedAreaHectares: string | number;
    unirrigatedAreaHectares: string | number;
  }>;
  AREA_COLORS: Record<string, string>;
}

export default function WardIrrigationRatioCharts({
  wardNumbers,
  irrigatedAreaData,
  AREA_COLORS,
}: WardIrrigationRatioChartsProps) {
  // Custom tooltip component with Nepali numbers
  const CustomTooltip = ({ active, payload, totalArea }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      const percentage = ((value / totalArea) * 100).toFixed(1);

      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex items-center justify-between gap-4 mt-1">
            <span>क्षेत्रफल:</span>
            <span className="font-medium">
              {localizeNumber(value.toLocaleString(), "ne")} हेक्टर ({localizeNumber(percentage, "ne")}%)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wardNumbers.map((wardNumber) => {
        const wardItem = irrigatedAreaData.find(
          (item) => item.wardNumber === wardNumber,
        );
        
        if (!wardItem) return null;

        const irrigatedArea = parseFloat(wardItem.irrigatedAreaHectares.toString());
        const unirrigatedArea = parseFloat(wardItem.unirrigatedAreaHectares.toString());
        const totalWardArea = irrigatedArea + unirrigatedArea;
        
        const irrigationCoveragePercentage = totalWardArea > 0
          ? (irrigatedArea / totalWardArea) * 100
          : 0;

        const wardData = [
          {
            name: "सिंचित क्षेत्र",
            value: irrigatedArea,
            type: "IRRIGATED",
          },
          {
            name: "असिंचित क्षेत्र",
            value: unirrigatedArea,
            type: "UNIRRIGATED",
          },
        ];

        return (
          <div key={wardNumber} className="h-auto border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2 text-center">
              वडा {localizeNumber(wardNumber.toString(), "ne")}
            </h3>
            <p className="text-xs text-center text-muted-foreground mb-2">
              कुल क्षेत्रफल: {localizeNumber(totalWardArea.toLocaleString(), "ne")} हेक्टर
            </p>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wardData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {wardData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          AREA_COLORS[entry.type] ||
                          `#${Math.floor(Math.random() * 16777215).toString(16)}`
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip totalArea={totalWardArea} />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend section with percentage bars */}
            <div className="mt-4">
              <div className="grid grid-cols-1 gap-2">
                {wardData.map((item, i) => {
                  const percentage = (item.value / totalWardArea) * 100;

                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: AREA_COLORS[item.type] || "#888"
                        }}
                      ></div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center text-xs">
                          <span className="truncate">{item.name}</span>
                          <span className="font-medium">
                            {localizeNumber(percentage.toFixed(1), "ne")}%
                          </span>
                        </div>
                        <div className="w-full bg-muted h-1.5 rounded-full mt-0.5 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: AREA_COLORS[item.type] || "#888"
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
