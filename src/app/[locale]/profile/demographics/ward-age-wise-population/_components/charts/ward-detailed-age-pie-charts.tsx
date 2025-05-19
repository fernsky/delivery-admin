"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface WardDetailedAgePieChartsProps {
  wardNumbers: number[];
  ageData: Array<{
    id: string;
    wardNumber: number;
    ageGroup: string;
    gender: string;
    population: number;
  }>;
  AGE_CATEGORY_COLORS: Record<string, string>;
}

export default function WardDetailedAgePieCharts({
  wardNumbers,
  ageData,
  AGE_CATEGORY_COLORS,
}: WardDetailedAgePieChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wardNumbers.map((wardNumber) => {
        const wardItems = ageData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        // Group by broader age categories
        const childrenCount = wardItems
          .filter((item) =>
            ["AGE_0_4", "AGE_5_9", "AGE_10_14"].includes(item.ageGroup),
          )
          .reduce((sum, item) => sum + item.population, 0);

        const youthCount = wardItems
          .filter((item) =>
            ["AGE_15_19", "AGE_20_24", "AGE_25_29"].includes(
              item.ageGroup,
            ),
          )
          .reduce((sum, item) => sum + item.population, 0);

        const adultCount = wardItems
          .filter((item) =>
            [
              "AGE_30_34",
              "AGE_35_39",
              "AGE_40_44",
              "AGE_45_49",
              "AGE_50_54",
              "AGE_55_59",
            ].includes(item.ageGroup),
          )
          .reduce((sum, item) => sum + item.population, 0);

        const elderlyCount = wardItems
          .filter((item) =>
            [
              "AGE_60_64",
              "AGE_65_69",
              "AGE_70_74",
              "AGE_75_AND_ABOVE",
            ].includes(item.ageGroup),
          )
          .reduce((sum, item) => sum + item.population, 0);

        const wardData = [
          { name: "बाल (०-१४)", value: childrenCount },
          { name: "युवा (१५-२९)", value: youthCount },
          { name: "वयस्क (३०-५९)", value: adultCount },
          { name: "वृद्ध (६० माथि)", value: elderlyCount },
        ];

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
                        AGE_CATEGORY_COLORS[
                          entry.name as keyof typeof AGE_CATEGORY_COLORS
                        ] || "#888"
                      }
                    />
                  ))}
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
