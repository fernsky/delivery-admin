"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface WardOccupationPieChartsProps {
  wardNumbers: number[];
  occupationData: Array<{
    id?: string;
    wardNumber: number;
    occupation: string;
    population: number;
  }>;
  OCCUPATION_NAMES: Record<string, string>;
  OCCUPATION_COLORS: Record<string, string>;
}

export default function WardOccupationPieCharts({
  wardNumbers,
  occupationData,
  OCCUPATION_NAMES,
  OCCUPATION_COLORS,
}: WardOccupationPieChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wardNumbers.map((wardNumber) => {
        const wardItems = occupationData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        // Sort by population and take top 5 occupations, group others
        const sortedItems = [...wardItems].sort(
          (a, b) => (b.population || 0) - (a.population || 0),
        );
        const topOccupations = sortedItems.slice(0, 5);
        const otherOccupations = sortedItems.slice(5);
        const otherTotal = otherOccupations.reduce(
          (sum, item) => sum + (item.population || 0),
          0,
        );

        // Calculate ward total for percentages
        const wardTotal = wardItems.reduce(
          (sum, item) => sum + (item.population || 0),
          0,
        );

        let wardData = topOccupations.map((item) => ({
          name: OCCUPATION_NAMES[item.occupation] || item.occupation,
          value: item.population || 0,
          occupation: item.occupation,
        }));

        if (otherTotal > 0) {
          wardData.push({
            name: "अन्य",
            value: otherTotal,
            occupation: "OTHER_EMPLOYMENT",
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
                  {wardData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        OCCUPATION_COLORS[
                          entry.occupation as keyof typeof OCCUPATION_COLORS
                        ] ||
                        `#${Math.floor(Math.random() * 16777215).toString(16)}`
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value.toLocaleString()} (${((Number(value) / wardTotal) * 100).toFixed(1)}%)`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}
