"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
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
  Label,
  Line,
  LineChart,
  ReferenceLine,
} from "recharts";

// Define colors for gender
const GENDER_COLORS = {
  MALE: "#36A2EB",
  FEMALE: "#FF6384",
  OTHER: "#FFCE56",
};

interface WardWiseChartsProps {
  wardPopulationData: Array<{
    ward: string;
    population: number;
    malePopulation: number;
    femalePopulation: number;
    otherPopulation: number;
    percentage: string;
    households: number;
    area: number;
    density: number;
  }>;
  wardSexRatioData: Array<{
    ward: string;
    sexRatio: number;
    population: number;
  }>;
  wardHouseholdData: Array<{
    ward: string;
    householdSize: number;
    households: number;
  }>;
  municipalityStats: {
    totalPopulation: number;
    malePopulation: number;
    femalePopulation: number;
    otherPopulation: number;
    totalHouseholds: number;
    totalArea: number;
  };
  municipalityAverages: {
    averageHouseholdSize: number;
    sexRatio: number;
    density: number;
  };
  GENDER_NAMES: Record<string, string>;
}

export default function WardWiseCharts({
  wardPopulationData,
  wardSexRatioData,
  wardHouseholdData,
  municipalityStats,
  municipalityAverages,
  GENDER_NAMES,
}: WardWiseChartsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("bar");
  const [householdTab, setHouseholdTab] = useState<string>("bar");
  const [genderTab, setGenderTab] = useState<string>("bar");
  const [densityTab, setDensityTab] = useState<string>("bar");

  return (
    <>
      {/* Ward-wise population distribution */}
      <div
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="ward-population-distribution"
      >
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">वडागत जनसंख्या वितरण</h3>
          <p className="text-sm text-muted-foreground">
            कुल जनसंख्या: {municipalityStats.totalPopulation.toLocaleString()}{" "}
            व्यक्ति
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
                  data={wardPopulationData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  barSize={30}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="ward"
                    scale="point"
                    padding={{ left: 10, right: 10 }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis>
                    <Label
                      value="जनसंख्या"
                      angle={-90}
                      position="insideLeft"
                      style={{ textAnchor: "middle" }}
                    />
                  </YAxis>
                  <Tooltip
                    formatter={(value) => Number(value).toLocaleString()}
                    labelFormatter={(value) => `${value}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="population"
                    name="जनसंख्या"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="pie" className="p-4">
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wardPopulationData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={180}
                    label={({ ward, percentage }) => `${ward}: ${percentage}%`}
                    fill="#8884d8"
                    dataKey="population"
                  >
                    {wardPopulationData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`hsl(${(index * 30) % 360}, 70%, 60%)`}
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
          </TabsContent>

          <TabsContent value="table" className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-2 text-left">वडा</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                    <th className="border p-2 text-right">घरधुरी</th>
                    <th className="border p-2 text-right">औसत परिवार संख्या</th>
                  </tr>
                </thead>
                <tbody>
                  {wardPopulationData.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{item.ward}</td>
                      <td className="border p-2 text-right">
                        {item.population.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {item.percentage}%
                      </td>
                      <td className="border p-2 text-right">
                        {item.households.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {item.households > 0
                          ? (item.population / item.households).toFixed(2)
                          : "0.00"}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-semibold bg-muted/70">
                    <td className="border p-2">जम्मा</td>
                    <td className="border p-2 text-right">
                      {municipalityStats.totalPopulation.toLocaleString()}
                    </td>
                    <td className="border p-2 text-right">100.00%</td>
                    <td className="border p-2 text-right">
                      {municipalityStats.totalHouseholds.toLocaleString()}
                    </td>
                    <td className="border p-2 text-right">
                      {municipalityAverages.averageHouseholdSize.toFixed(2)}
                    </td>
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

      {/* Gender distribution by ward */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="gender-ratio"
      >
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">वडागत लिङ्ग अनुपात</h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडाको पुरुष-महिला अनुपात (प्रति १०० पुरुषमा महिलाको संख्या)
          </p>
        </div>

        <Tabs value={genderTab} onValueChange={setGenderTab} className="w-full">
          <div className="border-b bg-muted/40">
            <div className="container">
              <TabsList className="h-10 bg-transparent">
                <TabsTrigger
                  value="bar"
                  className="data-[state=active]:bg-background"
                >
                  लैङ्गिक अनुपात
                </TabsTrigger>
                <TabsTrigger
                  value="stacked"
                  className="data-[state=active]:bg-background"
                >
                  लिङ्ग अनुसार वितरण
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
                  data={wardSexRatioData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  barSize={30}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="ward"
                    scale="point"
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis domain={[0, "auto"]} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="sexRatio"
                    name="लैङ्गिक अनुपात"
                    fill="#FF6384"
                  />
                  <ReferenceLine
                    y={municipalityAverages.sexRatio}
                    stroke="#FF6384"
                    strokeDasharray="3 3"
                    label={{
                      value: `पालिका औसत: ${municipalityAverages.sexRatio}`,
                      position: "insideBottomRight",
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="stacked" className="p-4">
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={wardPopulationData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  barSize={20}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="ward"
                    scale="point"
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => Number(value).toLocaleString()}
                    labelFormatter={(value) => `${value}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="malePopulation"
                    name={GENDER_NAMES.MALE}
                    stackId="a"
                    fill={GENDER_COLORS.MALE}
                  />
                  <Bar
                    dataKey="femalePopulation"
                    name={GENDER_NAMES.FEMALE}
                    stackId="a"
                    fill={GENDER_COLORS.FEMALE}
                  />
                  <Bar
                    dataKey="otherPopulation"
                    name={GENDER_NAMES.OTHER}
                    stackId="a"
                    fill={GENDER_COLORS.OTHER}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="table" className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-2 text-left">वडा</th>
                    <th className="border p-2 text-right">पुरुष</th>
                    <th className="border p-2 text-right">महिला</th>
                    <th className="border p-2 text-right">अन्य</th>
                    <th className="border p-2 text-right">लैङ्गिक अनुपात</th>
                  </tr>
                </thead>
                <tbody>
                  {wardPopulationData.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{item.ward}</td>
                      <td className="border p-2 text-right">
                        {item.malePopulation.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {item.femalePopulation.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {item.otherPopulation.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {item.malePopulation > 0
                          ? (
                              (item.femalePopulation / item.malePopulation) *
                              100
                            ).toFixed(2)
                          : "0.00"}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-semibold bg-muted/70">
                    <td className="border p-2">जम्मा</td>
                    <td className="border p-2 text-right">
                      {municipalityStats.malePopulation.toLocaleString()}
                    </td>
                    <td className="border p-2 text-right">
                      {municipalityStats.femalePopulation.toLocaleString()}
                    </td>
                    <td className="border p-2 text-right">
                      {municipalityStats.otherPopulation.toLocaleString()}
                    </td>
                    <td className="border p-2 text-right">
                      {municipalityAverages.sexRatio.toFixed(2)}
                    </td>
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

      {/* Household distribution by ward */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="household-size"
      >
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            वडागत घरधुरी र परिवार संख्या
          </h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडाको घरधुरी संख्या र औसत परिवार संख्या
          </p>
        </div>

        <Tabs
          value={householdTab}
          onValueChange={setHouseholdTab}
          className="w-full"
        >
          <div className="border-b bg-muted/40">
            <div className="container">
              <TabsList className="h-10 bg-transparent">
                <TabsTrigger
                  value="bar"
                  className="data-[state=active]:bg-background"
                >
                  घरधुरी संख्या
                </TabsTrigger>
                <TabsTrigger
                  value="household-size"
                  className="data-[state=active]:bg-background"
                >
                  औसत परिवार संख्या
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
                  data={wardHouseholdData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  barSize={30}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="ward"
                    scale="point"
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => Number(value).toLocaleString()}
                  />
                  <Legend />
                  <Bar
                    dataKey="households"
                    name="घरधुरी संख्या"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="household-size" className="p-4">
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={wardHouseholdData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="ward"
                    scale="point"
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="householdSize"
                    name="औसत परिवार संख्या"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <ReferenceLine
                    y={municipalityAverages.averageHouseholdSize}
                    stroke="#8884d8"
                    strokeDasharray="3 3"
                    label={{
                      value: `पालिका औसत: ${municipalityAverages.averageHouseholdSize.toFixed(2)}`,
                      position: "insideBottomRight",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="table" className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-2 text-left">वडा</th>
                    <th className="border p-2 text-right">घरधुरी संख्या</th>
                    <th className="border p-2 text-right">औसत परिवार संख्या</th>
                    <th className="border p-2 text-right">कुल जनसंख्या</th>
                  </tr>
                </thead>
                <tbody>
                  {wardHouseholdData.map((item, i) => {
                    const population =
                      wardPopulationData.find((w) => w.ward === item.ward)
                        ?.population || 0;

                    return (
                      <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                        <td className="border p-2">{item.ward}</td>
                        <td className="border p-2 text-right">
                          {item.households.toLocaleString()}
                        </td>
                        <td className="border p-2 text-right">
                          {item.householdSize.toFixed(2)}
                        </td>
                        <td className="border p-2 text-right">
                          {population.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="font-semibold bg-muted/70">
                    <td className="border p-2">जम्मा</td>
                    <td className="border p-2 text-right">
                      {municipalityStats.totalHouseholds.toLocaleString()}
                    </td>
                    <td className="border p-2 text-right">
                      {municipalityAverages.averageHouseholdSize.toFixed(2)}
                    </td>
                    <td className="border p-2 text-right">
                      {municipalityStats.totalPopulation.toLocaleString()}
                    </td>
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

      {/* Population density */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="population-density"
      >
        {/* <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">जनघनत्व</h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार प्रति वर्ग किलोमिटरमा बसोबास गर्ने जनसंख्या
          </p>
        </div> */}

        <Tabs
          value={densityTab}
          onValueChange={setDensityTab}
          className="w-full"
        >
          {/* <div className="border-b bg-muted/40">
            <div className="container">
              <TabsList className="h-10 bg-transparent">
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
          </div> */}

          {/* <TabsContent value="bar" className="p-4">
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={wardPopulationData.filter((ward) => ward.area > 0)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  barSize={30}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="ward"
                    scale="point"
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis>
                    <Label
                      value="जनघनत्व (प्रति वर्ग कि.मि.)"
                      angle={-90}
                      position="insideLeft"
                      style={{ textAnchor: "middle" }}
                    />
                  </YAxis>
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="density" name="जनघनत्व" fill="#FF9F40" />
                  <ReferenceLine
                    y={municipalityAverages.density}
                    stroke="#FF9F40"
                    strokeDasharray="3 3"
                    label={{
                      value: `पालिका औसत: ${municipalityAverages.density.toFixed(2)}`,
                      position: "insideBottomRight",
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent> */}

          <TabsContent value="table" className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-2 text-left">वडा</th>
                    <th className="border p-2 text-right">
                      क्षेत्रफल (वर्ग कि.मि.)
                    </th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">
                      जनघनत्व (प्रति वर्ग कि.मि.)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {wardPopulationData.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{item.ward}</td>
                      <td className="border p-2 text-right">
                        {item.area.toFixed(2)}
                      </td>
                      <td className="border p-2 text-right">
                        {item.population.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {item.area > 0
                          ? item.density.toLocaleString()
                          : "तथ्याङ्क उपलब्ध छैन"}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-semibold bg-muted/70">
                    <td className="border p-2">जम्मा</td>
                    <td className="border p-2 text-right">
                      {municipalityStats.totalArea.toFixed(2)}
                    </td>
                    <td className="border p-2 text-right">
                      {municipalityStats.totalPopulation.toLocaleString()}
                    </td>
                    <td className="border p-2 text-right">
                      {municipalityAverages.density.toFixed(2)}
                    </td>
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
    </>
  );
}
