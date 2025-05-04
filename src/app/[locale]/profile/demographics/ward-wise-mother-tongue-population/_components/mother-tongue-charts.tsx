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

// Define language colors for consistency
const LANGUAGE_COLORS = {
  NEPALI: "#FF5733",
  MAITHILI: "#FFC300",
  BHOJPURI: "#36A2EB",
  THARU: "#4BC0C0",
  TAMANG: "#9966FF",
  NEWARI: "#3CB371",
  MAGAR: "#FF6384",
  BAJJIKA: "#FFCE56",
  URDU: "#C9CBCF",
  HINDI: "#FF9F40",
  OTHER: "#808080",
};

interface MotherTongueChartsProps {
  overallSummary: Array<{
    language: string;
    languageName: string;
    population: number;
  }>;
  totalPopulation: number;
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  wardWiseData: Array<Record<string, any>>;
  wardIds: string[];
  languageData: any[];
  LANGUAGE_NAMES: Record<string, string>;
}

export default function MotherTongueCharts({
  overallSummary,
  totalPopulation,
  pieChartData,
  wardWiseData,
  wardIds,
  languageData,
  LANGUAGE_NAMES,
}: MotherTongueChartsProps) {
  return (
    <>
      {/* Overall language distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="h-[400px]">
          <CardHeader>
            <CardTitle>मातृभाषा अनुसार जनसंख्या</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => {
                      // Find the original language key for color mapping
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>मातृभाषा अनुसार जनसंख्या तालिका</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto h-[300px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted sticky top-0">
                    <th className="border p-2 text-left">मातृभाषा</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">{item.languageName}</td>
                      <td className="border p-2 text-right">
                        {item.population.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {((item.population / totalPopulation) * 100).toFixed(2)}
                        %
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold bg-muted sticky bottom-0">
                    <td className="border p-2">जम्मा</td>
                    <td className="border p-2 text-right">
                      {totalPopulation.toLocaleString()}
                    </td>
                    <td className="border p-2 text-right">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                डाउनलोड गर्नुहोस्
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="my-6">
        <CardHeader>
          <CardTitle>वडा अनुसार मातृभाषाको जनसंख्या</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] overflow-x-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={wardWiseData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                barSize={20}
              >
                <XAxis
                  dataKey="ward"
                  scale="point"
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis />
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: 20 }} />
                {/* Dynamically generate bars based on available languages in wardWiseData */}
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
                ).map((language) => {
                  // Find the language key for color mapping
                  const languageKey =
                    Object.keys(LANGUAGE_NAMES).find(
                      (key) => LANGUAGE_NAMES[key] === language,
                    ) || "OTHER";

                  return (
                    <Bar
                      key={language}
                      dataKey={language}
                      stackId="a"
                      fill={
                        LANGUAGE_COLORS[
                          languageKey as keyof typeof LANGUAGE_COLORS
                        ] ||
                        `#${Math.floor(Math.random() * 16777215).toString(16)}`
                      }
                    />
                  );
                })}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="table" className="mt-8">
        <TabsList>
          <TabsTrigger value="table">तालिका</TabsTrigger>
          <TabsTrigger value="chart">वडा अनुसार विश्लेषण</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>वडा अनुसार प्रमुख मातृभाषाहरूको विवरण</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto max-h-[600px]">
                <table className="w-full border-collapse min-w-[800px]">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-muted">
                      <th className="border p-2">वडा नं.</th>
                      <th className="border p-2">प्रमुख मातृभाषा</th>
                      <th className="border p-2 text-right">जनसंख्या</th>
                      <th className="border p-2 text-right">वडाको प्रतिशत</th>
                      <th className="border p-2">दोस्रो प्रमुख मातृभाषा</th>
                      <th className="border p-2 text-right">जनसंख्या</th>
                      <th className="border p-2 text-right">वडाको प्रतिशत</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wardIds.map((wardId, i) => {
                      const wardItems = languageData.filter(
                        (item) => item.wardId === wardId,
                      );
                      const wardTotal = wardItems.reduce(
                        (sum, item) => sum + (item.population || 0),
                        0,
                      );

                      // Sort by population to find primary and secondary languages
                      const sortedItems = [...wardItems].sort(
                        (a, b) => (b.population || 0) - (a.population || 0),
                      );
                      const primaryLang = sortedItems[0];
                      const secondaryLang = sortedItems[1];

                      return (
                        <tr
                          key={i}
                          className={i % 2 === 0 ? "bg-muted/50" : ""}
                        >
                          <td className="border p-2">वडा {wardId}</td>
                          <td className="border p-2">
                            {primaryLang
                              ? LANGUAGE_NAMES[primaryLang.languageType] ||
                                primaryLang.languageType
                              : "-"}
                          </td>
                          <td className="border p-2 text-right">
                            {primaryLang?.population?.toLocaleString() || "0"}
                          </td>
                          <td className="border p-2 text-right">
                            {wardTotal > 0 && primaryLang?.population
                              ? (
                                  (primaryLang.population / wardTotal) *
                                  100
                                ).toFixed(2) + "%"
                              : "0%"}
                          </td>
                          <td className="border p-2">
                            {secondaryLang
                              ? LANGUAGE_NAMES[secondaryLang.languageType] ||
                                secondaryLang.languageType
                              : "-"}
                          </td>
                          <td className="border p-2 text-right">
                            {secondaryLang?.population?.toLocaleString() || "0"}
                          </td>
                          <td className="border p-2 text-right">
                            {wardTotal > 0 && secondaryLang?.population
                              ? (
                                  (secondaryLang.population / wardTotal) *
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
                  डाउनलोड गर्नुहोस्
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>वडा अनुसार भाषिक संरचना</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wardIds.map((wardId) => {
                  const wardItems = languageData.filter(
                    (item) => item.wardId === wardId,
                  );

                  // Sort by population and take top 5 languages, group others
                  const sortedItems = [...wardItems].sort(
                    (a, b) => (b.population || 0) - (a.population || 0),
                  );
                  const topLangs = sortedItems.slice(0, 5);
                  const otherLangs = sortedItems.slice(5);
                  const otherTotal = otherLangs.reduce(
                    (sum, item) => sum + (item.population || 0),
                    0,
                  );

                  let wardData = topLangs.map((item) => ({
                    name:
                      LANGUAGE_NAMES[item.languageType] || item.languageType,
                    value: item.population || 0,
                  }));

                  if (otherTotal > 0) {
                    wardData.push({
                      name: "अन्य",
                      value: otherTotal,
                    });
                  }

                  return (
                    <div key={wardId} className="h-[300px]">
                      <h3 className="text-lg font-medium mb-2 text-center">
                        वडा {wardId}
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
