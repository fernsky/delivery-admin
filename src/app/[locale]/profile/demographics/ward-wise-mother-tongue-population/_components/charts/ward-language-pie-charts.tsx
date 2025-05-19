"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface WardLanguagePieChartsProps {
  wardIds: number[];
  languageData: Array<{
    id?: string;
    wardNumber: number;
    languageType: string;
    population: number;
    updatedAt?: Date;
    createdAt?: Date;
  }>;
  LANGUAGE_NAMES: Record<string, string>;
  LANGUAGE_COLORS: Record<string, string>;
}

export default function WardLanguagePieCharts({
  wardIds,
  languageData,
  LANGUAGE_NAMES,
  LANGUAGE_COLORS,
}: WardLanguagePieChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wardIds.map((wardNumber) => {
        const wardItems = languageData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        // Sort by population and take top 5 languages, group others
        const sortedItems = [...wardItems].sort(
          (a, b) => (b.population || 0) - (a.population || 0),
        );
        const topLanguages = sortedItems.slice(0, 5);
        const otherLanguages = sortedItems.slice(5);
        const otherTotal = otherLanguages.reduce(
          (sum, item) => sum + (item.population || 0),
          0,
        );

        let wardData = topLanguages.map((item) => ({
          name: LANGUAGE_NAMES[item.languageType] || item.languageType,
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
                    const languageKey =
                      Object.keys(LANGUAGE_NAMES).find(
                        (key) => LANGUAGE_NAMES[key] === entry.name,
                      ) || "OTHER";

                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          LANGUAGE_COLORS[
                            languageKey as keyof typeof LANGUAGE_COLORS
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
