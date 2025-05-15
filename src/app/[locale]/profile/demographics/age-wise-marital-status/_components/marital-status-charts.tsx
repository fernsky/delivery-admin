"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

// Define colors for marital status and gender
const MARITAL_STATUS_COLORS = {
  UNMARRIED: "#36A2EB", // Blue
  ONE_MARRIAGE: "#4BC0C0", // Teal
  MULTI_MARRIAGE: "#FF9F40", // Orange
  REMARRIAGE: "#9966FF", // Purple
  WIDOWED: "#FF6384", // Pink/Red
  DIVORCED: "#FFCD56", // Yellow
  SEPARATED: "#C9CBCF", // Grey
  NOT_STATED: "#808080", // Dark Grey
};

const GENDER_COLORS = {
  male: "#36A2EB", // Blue
  female: "#FF6384", // Pink/Red
  other: "#FFCD56", // Yellow
};

interface MaritalStatusChartsProps {
  overallByMaritalStatus: Array<{
    status: string;
    statusName: string;
    population: number;
  }>;
  ageWiseMaritalData: Array<Record<string, any>>;
  genderWiseData: Array<{
    status: string;
    statusName: string;
    male: number;
    female: number;
    other: number;
    total: number;
  }>;
  wardWiseData: Array<Record<string, any>>;
  totalPopulation: number;
  MARITAL_STATUS_NAMES: Record<string, string>;
  AGE_GROUP_NAMES: Record<string, string>;
}

export default function MaritalStatusCharts({
  overallByMaritalStatus,
  ageWiseMaritalData,
  genderWiseData,
  wardWiseData,
  totalPopulation,
  MARITAL_STATUS_NAMES,
  AGE_GROUP_NAMES,
}: MaritalStatusChartsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("pie");

  // Prepare data for stacked bar chart of age-wise marital status
  const stackedBarData = ageWiseMaritalData.map((item) => {
    const result: Record<string, any> = {
      ageGroup: item.ageGroupName,
    };

    Object.keys(MARITAL_STATUS_NAMES).forEach((status) => {
      if (item[status]) {
        result[
          MARITAL_STATUS_NAMES[status as keyof typeof MARITAL_STATUS_NAMES]
        ] = item[status];
      }
    });

    return result;
  });

  return (
    <>
      {/* Overall marital status distribution */}
      <div className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            वैवाहिक स्थिति अनुसार जनसंख्या वितरण
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
                  value="pie"
                  className="data-[state=active]:bg-background"
                >
                  पाई चार्ट
                </TabsTrigger>
                <TabsTrigger
                  value="bar"
                  className="data-[state=active]:bg-background"
                >
                  बार चार्ट
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
                        data={overallByMaritalStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(1)}%`
                        }
                        outerRadius={140}
                        fill="#8884d8"
                        dataKey="population"
                        nameKey="statusName"
                      >
                        {overallByMaritalStatus.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              MARITAL_STATUS_COLORS[
                                entry.status as keyof typeof MARITAL_STATUS_COLORS
                              ] ||
                              `#${Math.floor(Math.random() * 16777215).toString(16)}`
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

              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    प्रमुख वैवाहिक स्थिति
                  </h4>
                  {overallByMaritalStatus
                    .sort((a, b) => b.population - a.population)
                    .slice(0, 5)
                    .map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor:
                              MARITAL_STATUS_COLORS[
                                item.status as keyof typeof MARITAL_STATUS_COLORS
                              ] || "#888",
                          }}
                        ></div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-center">
                            <span>{item.statusName}</span>
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
                                  MARITAL_STATUS_COLORS[
                                    item.status as keyof typeof MARITAL_STATUS_COLORS
                                  ] || "#888",
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bar" className="p-4">
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={overallByMaritalStatus.sort(
                    (a, b) => b.population - a.population,
                  )}
                  margin={{ top: 20, right: 30, left: 30, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="statusName"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => Number(value).toLocaleString()}
                  />
                  <Bar dataKey="population" fill="#8884d8" name="जनसंख्या">
                    {overallByMaritalStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          MARITAL_STATUS_COLORS[
                            entry.status as keyof typeof MARITAL_STATUS_COLORS
                          ] || "#888"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="table" className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted sticky top-0">
                    <th className="border p-2 text-left">क्र.सं.</th>
                    <th className="border p-2 text-left">वैवाहिक स्थिति</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallByMaritalStatus
                    .sort((a, b) => b.population - a.population)
                    .map((item, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                        <td className="border p-2">{i + 1}</td>
                        <td className="border p-2">{item.statusName}</td>
                        <td className="border p-2 text-right">
                          {item.population.toLocaleString()}
                        </td>
                        <td className="border p-2 text-right">
                          {((item.population / totalPopulation) * 100).toFixed(
                            2,
                          )}
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

      {/* Age-wise marital status section */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="age-wise-marital-status"
      >
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">उमेर अनुसार वैवाहिक स्थिति</h3>
          <p className="text-sm text-muted-foreground">
            उमेर समूह अनुसार विभिन्न वैवाहिक स्थिति
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stackedBarData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                barSize={30}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="ageGroup" />
                <YAxis />
                <Tooltip />
                <Legend
                  wrapperStyle={{ paddingTop: 20 }}
                  layout="horizontal"
                  verticalAlign="bottom"
                />
                {Object.entries(MARITAL_STATUS_NAMES).map(([status, name]) => (
                  <Bar
                    key={status}
                    dataKey={name}
                    stackId="a"
                    fill={
                      MARITAL_STATUS_COLORS[
                        status as keyof typeof MARITAL_STATUS_COLORS
                      ] || "#888"
                    }
                    name={name}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Percentage distribution chart */}
          <div className="mt-8 h-[500px]">
            <h4 className="text-lg font-medium mb-4">प्रतिशत वितरण</h4>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stackedBarData.map((item) => {
                  const result: Record<string, any> = {
                    ageGroup: item.ageGroup,
                  };
                  let total = 0;

                  // Calculate total for this age group
                  Object.entries(MARITAL_STATUS_NAMES).forEach(
                    ([status, name]) => {
                      total += item[name] || 0;
                    },
                  );

                  // Calculate percentages
                  Object.entries(MARITAL_STATUS_NAMES).forEach(
                    ([status, name]) => {
                      if (total > 0 && item[name]) {
                        result[name] = (item[name] / total) * 100;
                      } else {
                        result[name] = 0;
                      }
                    },
                  );

                  return result;
                })}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="ageGroup" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip
                  formatter={(value) => `${Number(value).toFixed(1)}%`}
                />
                <Legend />
                {Object.entries(MARITAL_STATUS_NAMES).map(([status, name]) => (
                  <Area
                    key={status}
                    type="monotone"
                    dataKey={name}
                    stackId="1"
                    stroke={
                      MARITAL_STATUS_COLORS[
                        status as keyof typeof MARITAL_STATUS_COLORS
                      ] || "#888"
                    }
                    fill={
                      MARITAL_STATUS_COLORS[
                        status as keyof typeof MARITAL_STATUS_COLORS
                      ] || "#888"
                    }
                    name={name}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gender-wise marital status */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="gender-wise-marital-status"
      >
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">लिङ्ग अनुसार वैवाहिक स्थिति</h3>
          <p className="text-sm text-muted-foreground">
            पुरुष, महिला र अन्य वर्गको वैवाहिक स्थिति तुलना
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={genderWiseData.sort((a, b) => b.total - a.total)}
                margin={{ top: 20, right: 30, left: 30, bottom: 60 }}
                barSize={40}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" />
                <YAxis
                  dataKey="statusName"
                  type="category"
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => Number(value).toLocaleString()}
                />
                <Legend />
                <Bar
                  dataKey="male"
                  name="पुरुष"
                  stackId="a"
                  fill={GENDER_COLORS.male}
                />
                <Bar
                  dataKey="female"
                  name="महिला"
                  stackId="a"
                  fill={GENDER_COLORS.female}
                />
                <Bar
                  dataKey="other"
                  name="अन्य"
                  stackId="a"
                  fill={GENDER_COLORS.other}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 overflow-x-auto">
            <h4 className="text-lg font-medium mb-4">
              लिङ्ग अनुसार वैवाहिक स्थिति तालिका
            </h4>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">वैवाहिक स्थिति</th>
                  <th className="border p-2 text-right">पुरुष</th>
                  <th className="border p-2 text-right">महिला</th>
                  <th className="border p-2 text-right">अन्य</th>
                  <th className="border p-2 text-right">जम्मा</th>
                </tr>
              </thead>
              <tbody>
                {genderWiseData
                  .sort((a, b) => b.total - a.total)
                  .map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{item.statusName}</td>
                      <td className="border p-2 text-right">
                        {item.male.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {item.female.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {item.other.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right font-medium">
                        {item.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                <tr className="font-semibold bg-muted/70">
                  <td className="border p-2">जम्मा</td>
                  <td className="border p-2 text-right">
                    {genderWiseData
                      .reduce((sum, item) => sum + item.male, 0)
                      .toLocaleString()}
                  </td>
                  <td className="border p-2 text-right">
                    {genderWiseData
                      .reduce((sum, item) => sum + item.female, 0)
                      .toLocaleString()}
                  </td>
                  <td className="border p-2 text-right">
                    {genderWiseData
                      .reduce((sum, item) => sum + item.other, 0)
                      .toLocaleString()}
                  </td>
                  <td className="border p-2 text-right">
                    {genderWiseData
                      .reduce((sum, item) => sum + item.total, 0)
                      .toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Ward-wise analysis */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="ward-wise-analysis"
      >
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            वडा अनुसार वैवाहिक स्थिति वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न वडाहरूमा वैवाहिक स्थितिको तुलना
          </p>
        </div>

        <div className="p-6">
          <Tabs defaultValue="chart">
            <TabsList className="mb-4">
              <TabsTrigger value="chart">चार्ट</TabsTrigger>
              <TabsTrigger value="table">तालिका</TabsTrigger>
            </TabsList>

            <TabsContent value="chart">
              <div className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={wardWiseData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    barSize={20}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="wardNumber" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => Number(value).toLocaleString()}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background p-3 border shadow-sm rounded-md">
                              <p className="font-medium">{label}</p>
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
                                      {Number(entry.value).toLocaleString()}
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
                    <Legend />
                    {Object.entries(MARITAL_STATUS_NAMES).map(
                      ([status, name]) => (
                        <Bar
                          key={status}
                          dataKey={status}
                          name={name}
                          stackId="a"
                          fill={
                            MARITAL_STATUS_COLORS[
                              status as keyof typeof MARITAL_STATUS_COLORS
                            ] || "#888"
                          }
                        />
                      ),
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="table">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2">वडा</th>
                      {Object.entries(MARITAL_STATUS_NAMES).map(
                        ([status, name]) => (
                          <th key={status} className="border p-2 text-right">
                            {name}
                          </th>
                        ),
                      )}
                      <th className="border p-2 text-right">जम्मा</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wardWiseData.map((item, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                        <td className="border p-2">{item.wardNumber}</td>
                        {Object.entries(MARITAL_STATUS_NAMES).map(
                          ([status, name]) => (
                            <td key={status} className="border p-2 text-right">
                              {(item[status] || 0).toLocaleString()}
                            </td>
                          ),
                        )}
                        <td className="border p-2 text-right font-medium">
                          {item.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
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
      </div>
    </>
  );
}
