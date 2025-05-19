"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CastePieChart from "./charts/caste-pie-chart";
import CasteBarChart from "./charts/caste-bar-chart";
import WardCastePieCharts from "./charts/ward-caste-pie-charts";

// Define caste colors for consistency
const CASTE_COLORS = {
  BRAHMIN_HILL: "#FF5733",
  CHHETRI: "#FFC300",
  THAKURI: "#36A2EB",
  SANYASI_DASNAMI: "#4BC0C0",
  BRAHMIN_TARAI: "#9966FF",
  RAJPUT: "#3CB371",
  KAYASTHA: "#FF6384",
  BANIYA: "#FFCE56",
  NEWAR: "#C9CBCF",
  GURUNG: "#FF9F40",
  MAGAR: "#8A2BE2",
  TAMANG: "#20B2AA",
  RAI: "#B22222",
  LIMBU: "#228B22",
  SHERPA: "#4682B4",
  THAKALI: "#D2691E",
  THARU: "#800080",
  MAJHI: "#FF4500",
  DALIT_HILL: "#2F4F4F",
  DALIT_TARAI: "#8B4513",
  MUSLIM: "#708090",
  MADHESI: "#A0522D",
  YADAV: "#6B8E23",
  TELI: "#483D8B",
  KOIRI: "#CD5C5C",
  KURMI: "#9ACD32",
  MARWADI: "#00CED1",
  BANGALI: "#FF1493",
  OTHER: "#808080",
};

interface CasteChartsProps {
  overallSummary: Array<{
    casteType: string;
    casteTypeDisplay: string;
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
  casteData: Array<{
    id: string;
    wardNumber: number;
    casteType: string;
    casteTypeDisplay: string;
    population: number;
  }>;
  CASTE_NAMES: Record<string, string>;
}

export default function CasteCharts({
  overallSummary,
  totalPopulation,
  pieChartData,
  wardWiseData,
  wardNumbers,
  casteData,
  CASTE_NAMES,
}: CasteChartsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("pie");

  return (
    <>
      {/* Overall caste distribution */}
      <div className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">जाति अनुसार जनसंख्या वितरण</h3>
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
                  <CastePieChart
                    pieChartData={pieChartData}
                    CASTE_NAMES={CASTE_NAMES}
                    CASTE_COLORS={CASTE_COLORS}
                  />
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    प्रमुख जातिहरू
                  </h4>
                  {overallSummary.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            CASTE_COLORS[
                              item.casteType as keyof typeof CASTE_COLORS
                            ] || "#888",
                        }}
                      ></div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                          <span>{item.casteTypeDisplay}</span>
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
                                CASTE_COLORS[
                                  item.casteType as keyof typeof CASTE_COLORS
                                ] || "#888",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <p className="text-sm text-muted-foreground pt-4">
                    {overallSummary.length > 5
                      ? `${overallSummary.length - 5} अन्य जातिहरू पनि छन्।`
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
                    <th className="border p-2 text-left">जातजाति</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{i + 1}</td>
                      <td className="border p-2">{item.casteTypeDisplay}</td>
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
          <h3 className="text-xl font-semibold">वडा अनुसार जाति वितरण</h3>
          <p className="text-sm text-muted-foreground">
            वडा र जातजातिहरू अनुसार जनसंख्या वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <CasteBarChart
              wardWiseData={wardWiseData}
              CASTE_COLORS={CASTE_COLORS}
              CASTE_NAMES={CASTE_NAMES}
            />
          </div>
        </div>
      </div>

      {/* Detailed ward analysis */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            वडा अनुसार विस्तृत जातिगत विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडाको विस्तृत जातिगत संरचना
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
                    <th className="border p-2">प्रमुख जाति</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">वडाको प्रतिशत</th>
                    <th className="border p-2">दोस्रो प्रमुख जाति</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">वडाको प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {wardNumbers.map((wardNumber, i) => {
                    const wardItems = casteData.filter(
                      (item) => item.wardNumber === wardNumber,
                    );
                    const wardTotal = wardItems.reduce(
                      (sum, item) => sum + (item.population || 0),
                      0,
                    );

                    // Sort by population to find primary and secondary castes
                    const sortedItems = [...wardItems].sort(
                      (a, b) => (b.population || 0) - (a.population || 0),
                    );
                    const primaryCaste = sortedItems[0];
                    const secondaryCaste = sortedItems[1];

                    return (
                      <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                        <td className="border p-2">वडा {wardNumber}</td>
                        <td className="border p-2">
                          {primaryCaste ? primaryCaste.casteTypeDisplay : "-"}
                        </td>
                        <td className="border p-2 text-right">
                          {primaryCaste?.population?.toLocaleString() || "0"}
                        </td>
                        <td className="border p-2 text-right">
                          {wardTotal > 0 && primaryCaste?.population
                            ? (
                                (primaryCaste.population / wardTotal) *
                                100
                              ).toFixed(2) + "%"
                            : "0%"}
                        </td>
                        <td className="border p-2">
                          {secondaryCaste
                            ? secondaryCaste.casteTypeDisplay
                            : "-"}
                        </td>
                        <td className="border p-2 text-right">
                          {secondaryCaste?.population?.toLocaleString() || "0"}
                        </td>
                        <td className="border p-2 text-right">
                          {wardTotal > 0 && secondaryCaste?.population
                            ? (
                                (secondaryCaste.population / wardTotal) *
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
            <WardCastePieCharts
              wardNumbers={wardNumbers}
              casteData={casteData}
              CASTE_NAMES={CASTE_NAMES}
              CASTE_COLORS={CASTE_COLORS}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
