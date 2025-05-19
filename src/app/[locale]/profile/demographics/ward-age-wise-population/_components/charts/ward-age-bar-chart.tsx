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
} from "recharts";

interface WardAgeBarChartProps {
  wardWiseData: Array<Record<string, any>>;
  AGE_CATEGORY_COLORS: Record<string, string>;
}

export default function WardAgeBarChart({
  wardWiseData,
  AGE_CATEGORY_COLORS,
}: WardAgeBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={wardWiseData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        barSize={20}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="ward"
          scale="point"
          padding={{ left: 10, right: 10 }}
          tick={{ fontSize: 12 }}
        />
        <YAxis />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background p-3 border shadow-sm rounded-md">
                  <p className="font-medium">
                    {payload[0].payload.ward}
                  </p>
                  <div className="space-y-1 mt-2">
                    {payload.map((entry, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="w-2 h-2"
                          style={{ backgroundColor: entry.color }}
                        ></div>
                        <span>{entry.name}: </span>
                        <span className="font-medium">
                          {entry.value?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend
          wrapperStyle={{ paddingTop: 20 }}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
        {/* Dynamically generate bars for age categories */}
        {Object.keys(AGE_CATEGORY_COLORS).map((category) => (
          <Bar
            key={category}
            dataKey={category}
            name={category}
            fill={
              AGE_CATEGORY_COLORS[
                category as keyof typeof AGE_CATEGORY_COLORS
              ]
            }
            stackId="a"
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
