"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GenderPieChart from "./charts/gender-pie-chart";
import GenderBarChart from "./charts/gender-bar-chart";
import WardGenderPieCharts from "./charts/ward-gender-pie-charts";

// Define gender colors for consistency
const GENDER_COLORS = {
  MALE: "#36A2EB",
  FEMALE: "#FF6384",
  OTHER: "#FFCE56",
};

interface HouseheadGenderChartsProps {
  overallSummary: Array<{
    gender: string;
    genderName: string;
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
  genderData: Array<{
    id?: string;
    wardNumber: number;
    wardName?: string;
    gender: string;
    population: number;
    updatedAt?: Date;
    createdAt?: Date;
  }>;
  GENDER_NAMES: Record<string, string>;
}

export default function HouseheadGenderCharts({
  overallSummary,
  totalPopulation,
  pieChartData,
  wardWiseData,
  wardNumbers,
  genderData,
  GENDER_NAMES,
}: HouseheadGenderChartsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("pie");

  return (
    <>
      {/* Overall gender distribution */}
      <div className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">घरमूली लिङ्ग अनुसार वितरण</h3>
          <p className="text-sm text-muted-foreground">
            कुल घरपरिवार: {totalPopulation.toLocaleString()}
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
                  <GenderPieChart
                    pieChartData={pieChartData}
                    GENDER_NAMES={GENDER_NAMES}
                    GENDER_COLORS={GENDER_COLORS}
                  />
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    घरमूली लिङ्ग वितरण
                  </h4>
                  {overallSummary.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            GENDER_COLORS[
                              item.gender as keyof typeof GENDER_COLORS
                            ] || "#888",
                        }}
                      ></div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                          <span>{item.genderName}</span>
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
                                GENDER_COLORS[
                                  item.gender as keyof typeof GENDER_COLORS
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

          <TabsContent value="table" className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted sticky top-0">
                    <th className="border p-2 text-left">क्र.सं.</th>
                    <th className="border p-2 text-left">लिङ्ग</th>
                    <th className="border p-2 text-right">घरपरिवार</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{i + 1}</td>
                      <td className="border p-2">{item.genderName}</td>
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
          <h3 className="text-xl font-semibold">
            वडा अनुसार घरमूली लिङ्ग वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा र लिङ्ग अनुसार घरमूली वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <GenderBarChart
              wardWiseData={wardWiseData}
              GENDER_COLORS={GENDER_COLORS}
              GENDER_NAMES={GENDER_NAMES}
            />
          </div>
        </div>
      </div>

      {/* Detailed ward analysis */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            वडा अनुसार विस्तृत लिङ्गिक विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडाको विस्तृत घरमूली लिङ्ग संरचना
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
                    <th className="border p-2">पुरुष घरमूली</th>
                    <th className="border p-2 text-right">संख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                    <th className="border p-2">महिला घरमूली</th>
                    <th className="border p-2 text-right">संख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {wardNumbers.map((wardNumber, i) => {
                    const wardItems = genderData.filter(
                      (item) => item.wardNumber === wardNumber,
                    );
                    const wardTotal = wardItems.reduce(
                      (sum, item) => sum + (item.population || 0),
                      0,
                    );

                    // Find male and female data
                    const maleData = wardItems.find(
                      (item) => item.gender === "MALE",
                    );
                    const femaleData = wardItems.find(
                      (item) => item.gender === "FEMALE",
                    );

                    return (
                      <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                        <td className="border p-2">वडा {wardNumber}</td>
                        <td className="border p-2">{GENDER_NAMES["MALE"]}</td>
                        <td className="border p-2 text-right">
                          {maleData?.population?.toLocaleString() || "0"}
                        </td>
                        <td className="border p-2 text-right">
                          {wardTotal > 0 && maleData?.population
                            ? ((maleData.population / wardTotal) * 100).toFixed(
                                2,
                              ) + "%"
                            : "0%"}
                        </td>
                        <td className="border p-2">{GENDER_NAMES["FEMALE"]}</td>
                        <td className="border p-2 text-right">
                          {femaleData?.population?.toLocaleString() || "0"}
                        </td>
                        <td className="border p-2 text-right">
                          {wardTotal > 0 && femaleData?.population
                            ? (
                                (femaleData.population / wardTotal) *
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
            <WardGenderPieCharts
              wardNumbers={wardNumbers}
              genderData={genderData}
              GENDER_NAMES={GENDER_NAMES}
              GENDER_COLORS={GENDER_COLORS}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
