"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// Define religion colors for consistency
const RELIGION_COLORS = {
  HINDU: "#FF5733",
  BUDDHIST: "#FFC300",
  KIRANT: "#36A2EB",
  CHRISTIAN: "#4BC0C0",
  ISLAM: "#9966FF",
  NATURE: "#3CB371",
  BON: "#FF6384",
  JAIN: "#FFCE56",
  BAHAI: "#C9CBCF",
  SIKH: "#FF9F40",
  OTHER: "#808080",
};

interface ReligionChartsProps {
  overallSummary: Array<{
    religion: string;
    religionName: string;
    population: number;
  }>;
  totalPopulation: number;
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  wardWiseData: Array<Record<string, any>>;
  wardNumbers: number[];
  religionData: Array<{
    id?: string;
    wardNumber: number;
    religionType: string;
    population: number;
    updatedAt?: Date;
    createdAt?: Date;
  }>;
  RELIGION_NAMES: Record<string, string>;
}

export default function ReligionCharts({
  overallSummary,
  totalPopulation,
  pieChartData,
  wardWiseData,
  wardNumbers,
  religionData,
  RELIGION_NAMES,
}: ReligionChartsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("pie");

  return (
    <>
      {/* Overall religion distribution */}
      <div className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">धर्म अनुसार जनसंख्या वितरण</h3>
          <p className="text-sm text-muted-foreground">
            कुल जनसंख्या: {totalPopulation.toLocaleString()} व्यक्ति
          </p>
        </div>

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <div className="border-b bg-muted/40">
            <div className="container">
              <TabsList className="h-10 bg-transparent">
                <TabsTrigger
                  value="pie"
                  className="data-[state=active]:bg-background"
                >
                  पाई चार्ट
                </TabsTrigger>
                <TabsTrigger
                  value="table"
                  className="data-[state=active]:bg-background"
                >
                  तालिका
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="pie" className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percentage }) =>
                          `${name}: ${percentage}%`
                        }
                        outerRadius={140}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => {
                          // Find the original religion key for color mapping
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
                                `#${Math.floor(Math.random() * 16777215).toString(16)}`
                              }
                            />
                          );
                        })}
                      </Pie>
                      <Tooltip
                        formatter={(value) => Number(value).toLocaleString()}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    प्रमुख धर्महरू
                  </h4>
                  {overallSummary.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            RELIGION_COLORS[
                              item.religion as keyof typeof RELIGION_COLORS
                            ] || "#888",
                        }}
                      ></div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                          <span>{item.religionName}</span>
                          <span className="font-medium">
                            {(
                              (item.population / totalPopulation) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(item.population / totalPopulation) * 100}%`,
                              backgroundColor:
                                RELIGION_COLORS[
                                  item.religion as keyof typeof RELIGION_COLORS
                                ] || "#888",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <p className="text-sm text-muted-foreground pt-4">
                    {overallSummary.length > 5
                      ? `${overallSummary.length - 5} अन्य धर्महरू पनि छन्।`
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="table" className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted sticky top-0">
                    <th className="border p-2 text-left">क्र.सं.</th>
                    <th className="border p-2 text-left">धर्म</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{i + 1}</td>
                      <td className="border p-2">{item.religionName}</td>
                      <td className="border p-2 text-right">
                        {item.population.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {((item.population / totalPopulation) * 100).toFixed(2)}
                        %
                      </td>
                    </tr>
                  ))}
                  <tr className="font-semibold bg-muted/70">
                    <td className="border p-2" colSpan={2}>
                      जम्मा
                    </td>
                    <td className="border p-2 text-right">
                      {totalPopulation.toLocaleString()}
                    </td>
                    <td className="border p-2 text-right">100.00%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Excel डाउनलोड
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Ward-wise distribution */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">वडा अनुसार धर्म वितरण</h3>
          <p className="text-sm text-muted-foreground">
            वडा र धर्म अनुसार जनसंख्या वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
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
                {/* Dynamically generate bars based on available religions in wardWiseData */}
                {Object.keys(
                  wardWiseData.reduce(
                    (acc, ward) => {
                      Object.keys(ward).forEach((key) => {
                        if (key !== "ward") acc[key] = true;
                      });
                      return acc;
                    },
                    {} as Record<string, boolean>,
                  ),
                ).map((religion) => {
                  // Find the religion key for color mapping
                  const religionKey =
                    Object.keys(RELIGION_NAMES).find(
                      (key) => RELIGION_NAMES[key] === religion,
                    ) || "OTHER";

                  return (
                    <Bar
                      key={religion}
                      dataKey={religion}
                      stackId="a"
                      fill={
                        RELIGION_COLORS[
                          religionKey as keyof typeof RELIGION_COLORS
                        ] ||
                        `#${Math.floor(Math.random() * 16777215).toString(16)}`
                      }
                    />
                  );
                })}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed ward analysis */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            वडा अनुसार विस्तृत धार्मिक विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडाको विस्तृत धार्मिक संरचना
          </p>
        </div>

        <Tabs defaultValue="table" className="w-full">
          <div className="border-b bg-muted/40">
            <div className="container">
              <TabsList className="h-10 bg-transparent">
                <TabsTrigger
                  value="table"
                  className="data-[state=active]:bg-background"
                >
                  तालिका
                </TabsTrigger>
                <TabsTrigger
                  value="chart"
                  className="data-[state=active]:bg-background"
                >
                  वडागत पाई चार्ट
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="table" className="p-6">
            <div className="overflow-auto max-h-[600px]">
              <table className="w-full border-collapse min-w-[800px]">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-muted">
                    <th className="border p-2">वडा नं.</th>
                    <th className="border p-2">प्रमुख धर्म</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">वडाको प्रतिशत</th>
                    <th className="border p-2">दोस्रो प्रमुख धर्म</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">वडाको प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {wardNumbers.map((wardNumber, i) => {
                    const wardItems = religionData.filter(
                      (item) => item.wardNumber === wardNumber,
                    );
                    const wardTotal = wardItems.reduce(
                      (sum, item) => sum + (item.population || 0),
                      0,
                    );

                    // Sort by population to find primary and secondary religions
                    const sortedItems = [...wardItems].sort(
                      (a, b) => (b.population || 0) - (a.population || 0),
                    );
                    const primaryReligion = sortedItems[0];
                    const secondaryReligion = sortedItems[1];

                    return (
                      <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                        <td className="border p-2">वडा {wardNumber}</td>
                        <td className="border p-2">
                          {primaryReligion
                            ? RELIGION_NAMES[primaryReligion.religionType] ||
                              primaryReligion.religionType
                            : "-"}
                        </td>
                        <td className="border p-2 text-right">
                          {primaryReligion?.population?.toLocaleString() || "0"}
                        </td>
                        <td className="border p-2 text-right">
                          {wardTotal > 0 && primaryReligion?.population
                            ? (
                                (primaryReligion.population / wardTotal) *
                                100
                              ).toFixed(2) + "%"
                            : "0%"}
                        </td>
                        <td className="border p-2">
                          {secondaryReligion
                            ? RELIGION_NAMES[secondaryReligion.religionType] ||
                              secondaryReligion.religionType
                            : "-"}
                        </td>
                        <td className="border p-2 text-right">
                          {secondaryReligion?.population?.toLocaleString() ||
                            "0"}
                        </td>
                        <td className="border p-2 text-right">
                          {wardTotal > 0 && secondaryReligion?.population
                            ? (
                                (secondaryReligion.population / wardTotal) *
                                100
                              ).toFixed(2) + "%"
                            : "0%"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Excel डाउनलोड
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="chart" className="p-6">
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
                                  `#${Math.floor(Math.random() * 16777215).toString(16)}`
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
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
