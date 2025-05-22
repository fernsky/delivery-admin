"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface WardSkillsPieChartsProps {
  wardNumbers: number[];
  skillsData: Array<{
    id?: string;
    wardNumber: number;
    skill: string;
    population: number;
  }>;
  skillLabels: Record<string, string>;
  SKILL_COLORS: Record<string, string>;
}

export default function WardSkillsPieCharts({
  wardNumbers,
  skillsData,
  skillLabels,
  SKILL_COLORS,
}: WardSkillsPieChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wardNumbers.map((wardNumber) => {
        const wardItems = skillsData.filter(
          (item) => item.wardNumber === wardNumber,
        );

        // Sort by population and take top 5 skills, group others
        const sortedItems = [...wardItems].sort(
          (a, b) => (b.population || 0) - (a.population || 0),
        );
        const topSkills = sortedItems.slice(0, 5);
        const otherSkills = sortedItems.slice(5);
        const otherTotal = otherSkills.reduce(
          (sum, item) => sum + (item.population || 0),
          0,
        );

        // Calculate ward total for percentages
        const wardTotal = wardItems.reduce(
          (sum, item) => sum + (item.population || 0),
          0,
        );

        let wardData = topSkills.map((item) => ({
          name: skillLabels[item.skill] || item.skill,
          value: item.population || 0,
          skill: item.skill,
        }));

        if (otherTotal > 0) {
          wardData.push({
            name: "अन्य",
            value: otherTotal,
            skill: "OTHER",
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
                        SKILL_COLORS[
                          entry.skill as keyof typeof SKILL_COLORS
                        ] ||
                        `#${Math.floor(Math.random() * 16777215).toString(16)}`
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name) => [
                    `${value.toLocaleString()} (${((value / wardTotal) * 100).toFixed(1)}%)`,
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
