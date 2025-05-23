"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardCastePieChartsProps {
  wardNumbers: number[];
  casteData: Array<{
    id?: string;
    wardNumber: number;
    casteType: string;
    casteTypeDisplay?: string;
    population: number;
    updatedAt?: Date;
    createdAt?: Date;
  }>;
  CASTE_NAMES: Record<string, string>;
  CASTE_COLORS: Record<string, string>;
}

export default function WardCastePieCharts({
  wardNumbers,
  casteData,
  CASTE_NAMES,
  CASTE_COLORS,
}: WardCastePieChartsProps) {
  // Custom tooltip component with Nepali numbers
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex items-center justify-between gap-4 mt-1">
            <span>जनसंख्या:</span>
            <span className="font-medium">
              {localizeNumber(value.toLocaleString(), "ne")}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom label with Nepali numbers
  const renderCustomizedLabel = ({ name, percent }: any) => {
    return `${name}: ${localizeNumber((percent * 100).toFixed(1), "ne")}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wardNumbers.map((wardNumber) => {
        const wardItems = casteData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        // Sort by population and take top 5 castes, group others
        const sortedItems = [...wardItems].sort(
          (a, b) => (b.population || 0) - (a.population || 0),
        );
        const topCastes = sortedItems.slice(0, 5);
        const otherCastes = sortedItems.slice(5);
        const otherTotal = otherCastes.reduce(
          (sum, item) => sum + (item.population || 0),
          0,
        );

        let wardData = topCastes.map((item) => ({
          name: item.casteTypeDisplay || CASTE_NAMES[item.casteType] || item.casteType,
          value: item.population || 0,
        }));

        if (otherTotal > 0) {
          wardData.push({
            name: "अन्य",
            value: otherTotal,
          });
        }

        return (
          <div key={wardNumber} className="h-[300px]">
            <h3 className="text-lg font-medium mb-2 text-center">
              वडा {localizeNumber(wardNumber.toString(), "ne")}
            </h3>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={wardData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel}
                >
                  {wardData.map((entry, index) => {
                    const casteKey =
                      Object.keys(CASTE_NAMES).find(
                        (key) => CASTE_NAMES[key] === entry.name,
                      ) || "OTHER";

                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          CASTE_COLORS[
                            casteKey as keyof typeof CASTE_COLORS
                          ] ||
                          `#${Math.floor(Math.random() * 16777215).toString(
                            16,
                          )}`
                        }
                      />
                    );
                  })}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}
