"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface WardReligionPieChartsProps {
  wardNumbers: number[];
  religionData: Array<{
    id?: string;
    wardNumber: number;
    religionType: string;
    population: number;
    updatedAt?: string;
    createdAt?: string;
  }>;
  RELIGION_NAMES: Record<string, string>;
  RELIGION_COLORS: Record<string, string>;
}

export default function WardReligionPieCharts({
  wardNumbers,
  religionData,
  RELIGION_NAMES,
  RELIGION_COLORS,
}: WardReligionPieChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wardNumbers.map((wardNumber) => {
        const wardItems = religionData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        // Sort by population and take top 5 religions, group others
        const sortedItems = [...wardItems].sort(
          (a, b) => (b.population || 0) - (a.population || 0),
        );
        const topReligions = sortedItems.slice(0, 5);
        const otherReligions = sortedItems.slice(5);
        const otherTotal = otherReligions.reduce(
          (sum, item) => sum + (item.population || 0),
          0,
        );

        let wardData = topReligions.map((item) => ({
          name: RELIGION_NAMES[item.religionType] || item.religionType,
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
              वडा {wardNumber}
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
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {wardData.map((entry, index) => {
                    const religionKey =
                      Object.keys(RELIGION_NAMES).find(
                        (key) => RELIGION_NAMES[key] === entry.name,
                      ) || "OTHER";

                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          RELIGION_COLORS[
                            religionKey as keyof typeof RELIGION_COLORS
                          ] ||
                          `#${Math.floor(Math.random() * 16777215).toString(
                            16,
                          )}`
                        }
                      />
                    );
                  })}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}
