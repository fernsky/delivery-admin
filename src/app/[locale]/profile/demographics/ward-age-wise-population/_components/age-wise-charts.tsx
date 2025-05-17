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
  Line,
  LineChart,
  AreaChart,
  Area,
} from "recharts";

// Define colors for age groups and gender
const GENDER_COLORS = {
  MALE: "#36A2EB",
  FEMALE: "#FF6384",
  OTHER: "#FFCE56",
};

const AGE_CATEGORY_COLORS = {
  "बाल (०-१४)": "#4BC0C0",
  "युवा (१५-२९)": "#FF9F40",
  "वयस्क (३०-५९)": "#9966FF",
  "वृद्ध (६० माथि)": "#FF6384",
};

interface AgeWiseChartsProps {
  overallSummaryByAge: Array<{
    ageGroup: string;
    ageGroupName: string;
    total: number;
    male: number;
    female: number;
    other: number;
  }>;
  overallSummaryByGender: Array<{
    gender: string;
    genderName: string;
    population: number;
  }>;
  totalPopulation: number;
  pyramidData: Array<{
    ageGroup: string;
    ageGroupName: string;
    male: number;
    female: number;
  }>;
  wardWiseData: Array<Record<string, any>>;
  wardNumbers: number[];
  ageData: Array<{
    id: string;
    wardNumber: number;
    ageGroup: string;
    gender: string;
    population: number;
  }>;
  AGE_GROUP_NAMES: Record<string, string>;
  GENDER_NAMES: Record<string, string>;
}

export default function AgeWiseCharts({
  overallSummaryByAge,
  overallSummaryByGender,
  totalPopulation,
  pyramidData,
  wardWiseData,
  wardNumbers,
  ageData,
  AGE_GROUP_NAMES,
  GENDER_NAMES,
}: AgeWiseChartsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("bar");

  // Format pyramid data for display
  const formatPyramidData = useMemo(() => {
    const maxValue = Math.max(
      ...pyramidData.flatMap((d) => [Math.abs(d.male), d.female]),
    );
    return { data: pyramidData, maxValue };
  }, [pyramidData]);

  // Calculate age distribution percentages
  const calculateAgeDistributionPercentage = (
    ages: string[],
    total: number,
  ) => {
    const ageGroups = overallSummaryByAge.filter((item) =>
      ages.includes(item.ageGroup),
    );

    const ageTotal = ageGroups.reduce((sum, item) => sum + item.total, 0);
    return (ageTotal / total) * 100;
  };

  return (
    <>
      {/* Overall age distribution */}
      <div className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            उमेर समूह अनुसार जनसंख्या वितरण
          </h3>
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
                  value="bar"
                  className="data-[state=active]:bg-background"
                >
                  बार चार्ट
                </TabsTrigger>
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

          <TabsContent value="bar" className="p-4">
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={overallSummaryByAge}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 80, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="ageGroupName"
                    type="category"
                    tick={{ fontSize: 12 }}
                    width={70}
                  />
                  <Tooltip
                    formatter={(value) => Number(value).toLocaleString()}
                    labelFormatter={(value) => `उमेर समूह: ${value}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="male"
                    name={GENDER_NAMES["MALE"]}
                    fill={GENDER_COLORS["MALE"]}
                    stackId="a"
                  />
                  <Bar
                    dataKey="female"
                    name={GENDER_NAMES["FEMALE"]}
                    fill={GENDER_COLORS["FEMALE"]}
                    stackId="a"
                  />
                  <Bar
                    dataKey="other"
                    name={GENDER_NAMES["OTHER"]}
                    fill={GENDER_COLORS["OTHER"]}
                    stackId="a"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="pie" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age Category Pie Chart */}
              <div className="border rounded-lg p-3">
                <h3 className="text-lg font-medium mb-2 text-center">
                  उमेरगत वर्गीकरण
                </h3>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "बाल (०-१४)",
                            value: calculateAgeDistributionPercentage(
                              ["AGE_0_4", "AGE_5_9", "AGE_10_14"],
                              totalPopulation,
                            ),
                          },
                          {
                            name: "युवा (१५-२९)",
                            value: calculateAgeDistributionPercentage(
                              ["AGE_15_19", "AGE_20_24", "AGE_25_29"],
                              totalPopulation,
                            ),
                          },
                          {
                            name: "वयस्क (३०-५९)",
                            value: calculateAgeDistributionPercentage(
                              [
                                "AGE_30_34",
                                "AGE_35_39",
                                "AGE_40_44",
                                "AGE_45_49",
                                "AGE_50_54",
                                "AGE_55_59",
                              ],
                              totalPopulation,
                            ),
                          },
                          {
                            name: "वृद्ध (६० माथि)",
                            value: calculateAgeDistributionPercentage(
                              [
                                "AGE_60_64",
                                "AGE_65_69",
                                "AGE_70_74",
                                "AGE_75_AND_ABOVE",
                              ],
                              totalPopulation,
                            ),
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(1)}%`
                        }
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {Object.entries(AGE_CATEGORY_COLORS).map(
                          ([name, color], index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ),
                        )}
                      </Pie>
                      <Tooltip
                        formatter={(value) => `${Number(value).toFixed(2)}%`}
                      />
                      <Legend
                        layout="vertical"
                        verticalAlign="bottom"
                        align="center"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gender Distribution Pie Chart */}
              <div className="border rounded-lg p-3">
                <h3 className="text-lg font-medium mb-2 text-center">
                  लिङ्ग अनुसार वितरण
                </h3>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={overallSummaryByGender.map((item) => ({
                          name: item.genderName,
                          value: item.population,
                          percentage: (
                            (item.population / totalPopulation) *
                            100
                          ).toFixed(2),
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percentage }) =>
                          `${name}: ${percentage}%`
                        }
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {overallSummaryByGender.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              GENDER_COLORS[
                                entry.gender as keyof typeof GENDER_COLORS
                              ] || "#888"
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => Number(value).toLocaleString()}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="table" className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted sticky top-0">
                    <th className="border p-2 text-left">उमेर समूह</th>
                    <th className="border p-2 text-right">पुरुष</th>
                    <th className="border p-2 text-right">महिला</th>
                    <th className="border p-2 text-right">अन्य</th>
                    <th className="border p-2 text-right">कुल</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummaryByAge.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{item.ageGroupName}</td>
                      <td className="border p-2 text-right">
                        {item.male.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {item.female.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {item.other.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {item.total.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {((item.total / totalPopulation) * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                  <tr className="font-semibold bg-muted/70">
                    <td className="border p-2">जम्मा</td>
                    <td className="border p-2 text-right">
                      {overallSummaryByAge
                        .reduce((sum, item) => sum + item.male, 0)
                        .toLocaleString()}
                    </td>
                    <td className="border p-2 text-right">
                      {overallSummaryByAge
                        .reduce((sum, item) => sum + item.female, 0)
                        .toLocaleString()}
                    </td>
                    <td className="border p-2 text-right">
                      {overallSummaryByAge
                        .reduce((sum, item) => sum + item.other, 0)
                        .toLocaleString()}
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

      {/* Population pyramid */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="demographic-pyramid"
      >
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">जनसांख्यिकीय पिरामिड</h3>
          <p className="text-sm text-muted-foreground">
            उमेर र लिङ्ग अनुसार जनसंख्या संरचना
          </p>
        </div>

        <div className="p-6">
          <div className="h-[600px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formatPyramidData.data}
                margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
                layout="vertical"
                barGap={0}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  type="number"
                  domain={[
                    -formatPyramidData.maxValue,
                    formatPyramidData.maxValue,
                  ]}
                  tickFormatter={(value) => Math.abs(value).toString()}
                />
                <YAxis
                  type="category"
                  dataKey="ageGroupName"
                  width={80}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) =>
                    Math.abs(Number(value)).toLocaleString()
                  }
                  labelFormatter={(value) => `उमेर समूह: ${value}`}
                />
                <Legend />
                <Bar
                  dataKey="male"
                  name="पुरुष"
                  fill={GENDER_COLORS.MALE}
                  stackId="stack"
                />
                <Bar
                  dataKey="female"
                  name="महिला"
                  fill={GENDER_COLORS.FEMALE}
                  stackId="stack"
                />
                <text
                  x="25%"
                  y={15}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-current text-sm font-medium"
                >
                  पुरुष
                </text>
                <text
                  x="75%"
                  y={15}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-current text-sm font-medium"
                >
                  महिला
                </text>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Ward-wise age distribution */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="ward-wise-age"
      >
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">वडा अनुसार उमेर समूह वितरण</h3>
          <p className="text-sm text-muted-foreground">
            वडा र उमेर समूह अनुसार जनसंख्या वितरण
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
          </div>
        </div>
      </div>

      {/* Detailed ward analysis */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">वडागत उमेर संरचना विश्लेषण</h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडाको विस्तृत उमेरगत संरचना
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
                  वडागत वितरण
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
                    <th className="border p-2">बाल (०-१४)</th>
                    <th className="border p-2 text-right">संख्या</th>
                    <th className="border p-2 text-right">वडाको %</th>
                    <th className="border p-2">युवा (१५-२९)</th>
                    <th className="border p-2 text-right">संख्या</th>
                    <th className="border p-2 text-right">वडाको %</th>
                  </tr>
                </thead>
                <tbody>
                  {wardNumbers.map((wardNumber, i) => {
                    const wardItems = ageData.filter(
                      (item) => item.wardNumber === wardNumber,
                    );
                    const wardTotal = wardItems.reduce(
                      (sum, item) => sum + item.population,
                      0,
                    );

                    // Calculate children population
                    const childPopulation = wardItems
                      .filter((item) =>
                        ["AGE_0_4", "AGE_5_9", "AGE_10_14"].includes(
                          item.ageGroup,
                        ),
                      )
                      .reduce((sum, item) => sum + item.population, 0);

                    // Calculate youth population
                    const youthPopulation = wardItems
                      .filter((item) =>
                        ["AGE_15_19", "AGE_20_24", "AGE_25_29"].includes(
                          item.ageGroup,
                        ),
                      )
                      .reduce((sum, item) => sum + item.population, 0);

                    return (
                      <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                        <td className="border p-2">वडा {wardNumber}</td>
                        <td className="border p-2">बाल जनसंख्या</td>
                        <td className="border p-2 text-right">
                          {childPopulation.toLocaleString()}
                        </td>
                        <td className="border p-2 text-right">
                          {wardTotal > 0
                            ? ((childPopulation / wardTotal) * 100).toFixed(2) +
                              "%"
                            : "0%"}
                        </td>
                        <td className="border p-2">युवा जनसंख्या</td>
                        <td className="border p-2 text-right">
                          {youthPopulation.toLocaleString()}
                        </td>
                        <td className="border p-2 text-right">
                          {wardTotal > 0
                            ? ((youthPopulation / wardTotal) * 100).toFixed(2) +
                              "%"
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
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
