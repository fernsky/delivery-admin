"use client";

import { useState } from "react";
import PulsePieChart from "./charts/pulse-pie-chart";
import PulseBarChart from "./charts/pulse-bar-chart";
import ProductionSalesDistributionChart from "./charts/production-sales-distribution-chart";
import CommercializationChart from "./charts/commercialization-chart";
import { localizeNumber } from "@/lib/utils/localize-number";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PulseChartsProps {
  overallSummary: Array<{
    type: string;
    typeName: string;
    production: number;
    sales: number;
    revenue: number;
  }>;
  totalProduction: number;
  totalSales: number;
  totalRevenue: number;
  productionPieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  revenuePieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  PULSE_TYPES: Record<string, string>;
  PULSE_COLORS: Record<string, string>;
  pulseAnalysis: {
    totalProduction: number;
    totalSales: number;
    totalRevenue: number;
    productionSalesRatio: number;
    averagePricePerKg: number;
    commercializationScore: number;
  };
  soldPercentage: string;
  selfConsumptionPercentage: string;
  commercializationScore: number;
}

export default function PulseCharts({
  overallSummary,
  totalProduction,
  totalSales,
  totalRevenue,
  productionPieChartData,
  revenuePieChartData,
  PULSE_TYPES,
  PULSE_COLORS,
  pulseAnalysis,
  soldPercentage,
  selfConsumptionPercentage,
  commercializationScore,
}: PulseChartsProps) {
  // State for active tab
  const [activeTab, setActiveTab] = useState("production");

  // Generate yearly trend data for pulse production (mocked data)
  const yearlyTrendData = [
    {
      name: "२०७८",
      lentil:
        (overallSummary.find((item) => item.type === "LENTIL")?.production ??
          0) * 0.85,
      chickpea:
        (overallSummary.find((item) => item.type === "CHICKPEA")?.production ??
          0) * 0.85,
      pea:
        (overallSummary.find((item) => item.type === "PEA")?.production ?? 0) *
        0.85,
      other: overallSummary
        .filter((item) => !["LENTIL", "CHICKPEA", "PEA"].includes(item.type))
        .reduce((acc, item) => acc + item.production * 0.85, 0),
    },
    {
      name: "२०७९",

      lentil:
        (overallSummary.find((item) => item.type === "LENTIL")?.production ??
          0) * 0.92,
      chickpea:
        (overallSummary.find((item) => item.type === "CHICKPEA")?.production ??
          0) * 0.92,
      pea:
        (overallSummary.find((item) => item.type === "PEA")?.production ?? 0) *
        0.92,
      other: overallSummary
        .filter(
          (item: any) => !["LENTIL", "CHICKPEA", "PEA"].includes(item.type),
        )
        .reduce((acc: any, item: any) => acc + item.production * 0.92, 0),
    },
    {
      name: "२०८०",
      lentil:
        overallSummary.find((item) => item.type === "LENTIL")?.production || 0,
      chickpea:
        overallSummary.find((item) => item.type === "CHICKPEA")?.production ??
        0,
      pea: overallSummary.find((item) => item.type === "PEA")?.production ?? 0,
      other: overallSummary
        .filter(
          (item: any) => !["LENTIL", "CHICKPEA", "PEA"].includes(item.type),
        )
        .reduce((acc: any, item: any) => acc + item.production, 0),
    },
  ];

  // Generate production-sales distribution data
  const productionSalesData = overallSummary
    .filter((item) => item.production > 0)
    .slice(0, 6) // Only show top 6 for better visualization
    .map((item) => {
      const percentageSold =
        item.production > 0 ? (item.sales / item.production) * 100 : 0;

      return {
        name: item.typeName,
        production: item.production,
        sales: item.sales,
        selfConsumption: item.production - item.sales,
        percentageSold: percentageSold,
      };
    });

  return (
    <div className="space-y-8 mt-8" id="production-and-sales">
      <h2 className="text-2xl font-bold tracking-tight border-b pb-2 scroll-m-20">
        उत्पादन र बिक्री
      </h2>

      {/* Tabs for switching between chart views */}
      <Tabs
        defaultValue="production"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="production">उत्पादन वितरण</TabsTrigger>
          <TabsTrigger value="sales">बिक्री वितरण</TabsTrigger>
          <TabsTrigger value="revenue">आम्दानी वितरण</TabsTrigger>
        </TabsList>

        {/* Production Distribution Tab */}
        <TabsContent value="production" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">दालबाली उत्पादन वितरण</CardTitle>
                <CardDescription>
                  कुल उत्पादन {localizeNumber(totalProduction.toFixed(2), "ne")}{" "}
                  मे.टन
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[380px]">
                <PulsePieChart
                  pieChartData={productionPieChartData}
                  PULSE_TYPES={PULSE_TYPES}
                  PULSE_COLORS={PULSE_COLORS}
                  dataType="उत्पादन"
                  unit="मे.टन"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  वार्षिक उत्पादन प्रवृत्ति
                </CardTitle>
                <CardDescription>
                  प्रमुख दालबालीको वार्षिक उत्पादन
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[380px]">
                <PulseBarChart data={yearlyTrendData} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">उत्पादन र बिक्री वितरण</CardTitle>
              <CardDescription>
                प्रमुख ६ दालबालीको उत्पादन, बिक्री र आन्तरिक उपभोग अनुपात
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ProductionSalesDistributionChart
                productionSalesData={productionSalesData}
                totalProduction={totalProduction}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sales Distribution Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="h-[400px]">
              <CardHeader>
                <CardTitle className="text-lg">दालबाली बिक्री वितरण</CardTitle>
                <CardDescription>
                  कुल बिक्री {localizeNumber(totalSales.toFixed(2), "ne")} मे.टन
                  ({localizeNumber(soldPercentage, "ne")}% उत्पादनको)
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[320px]">
                {/* Modified production pie chart to show only sold amounts */}
                <PulsePieChart
                  pieChartData={overallSummary.map((item) => ({
                    name: item.typeName,
                    value: item.sales,
                    percentage:
                      totalSales > 0
                        ? ((item.sales / totalSales) * 100).toFixed(2)
                        : "0",
                  }))}
                  PULSE_TYPES={PULSE_TYPES}
                  PULSE_COLORS={PULSE_COLORS}
                  dataType="बिक्री"
                  unit="मे.टन"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">व्यावसायीकरण स्तर</CardTitle>
                <CardDescription>
                  दालबाली उत्पादनको व्यावसायीकरणको स्तर
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col justify-center h-[320px]">
                <CommercializationChart
                  commercializationScore={commercializationScore}
                />
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-md">
                    <p className="text-sm mb-1">बिक्रीमा गएको</p>
                    <p className="text-lg font-bold">
                      {localizeNumber(soldPercentage, "ne")}%
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-md">
                    <p className="text-sm mb-1">आन्तरिक उपभोग</p>
                    <p className="text-lg font-bold">
                      {localizeNumber(selfConsumptionPercentage, "ne")}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Distribution Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">आम्दानी वितरण</CardTitle>
              <CardDescription>
                कुल आम्दानी रु.{" "}
                {localizeNumber((totalRevenue / 1000000).toFixed(2), "ne")}{" "}
                मिलियन
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <PulsePieChart
                pieChartData={revenuePieChartData}
                PULSE_TYPES={PULSE_TYPES}
                PULSE_COLORS={PULSE_COLORS}
                dataType="आम्दानी"
                unit="रु."
                isRevenue={true}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-muted/50 rounded-lg p-4 text-center flex flex-col justify-center h-[200px]">
              <h4 className="text-lg font-medium mb-2">औसत बिक्री मूल्य</h4>
              <p className="text-3xl font-bold">
                रु.{" "}
                {localizeNumber(
                  pulseAnalysis.averagePricePerKg.toFixed(2),
                  "ne",
                )}
              </p>
              <p className="text-sm mt-2">प्रति किलो</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 text-center flex flex-col justify-center h-[200px]">
              <h4 className="text-lg font-medium mb-2">कुल आम्दानी</h4>
              <p className="text-3xl font-bold">
                रु. {localizeNumber((totalRevenue / 1000000).toFixed(2), "ne")}
              </p>
              <p className="text-sm mt-2">मिलियन रुपैयाँमा</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 text-center flex flex-col justify-center h-[200px]">
              <h4 className="text-lg font-medium mb-2">प्रति हेक्टर आम्दानी</h4>
              {/* Estimated income per hectare (assuming 1.5 tonnes per hectare on average) */}
              <p className="text-3xl font-bold">
                रु.{" "}
                {localizeNumber(
                  (totalRevenue / (totalProduction / 1.5) / 1000).toFixed(2),
                  "ne",
                )}
              </p>
              <p className="text-sm mt-2">हजार रुपैयाँमा</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12" id="economic-impact">
        <h2 className="text-2xl font-bold tracking-tight border-b pb-2 scroll-m-20">
          आर्थिक प्रभाव
        </h2>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-muted/50 rounded-lg p-4 text-center flex flex-col justify-center aspect-square">
            <div className="text-3xl font-bold mb-2 text-amber-500">
              {localizeNumber(totalProduction.toFixed(2), "ne")}
            </div>
            <div className="text-sm">मे.टन कुल उत्पादन</div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-center flex flex-col justify-center aspect-square">
            <div className="text-3xl font-bold mb-2 text-blue-500">
              {localizeNumber(totalSales.toFixed(2), "ne")}
            </div>
            <div className="text-sm">मे.टन कुल बिक्री</div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-center flex flex-col justify-center aspect-square">
            <div className="text-3xl font-bold mb-2 text-green-500">
              रु. {localizeNumber((totalRevenue / 1000000).toFixed(2), "ne")}
            </div>
            <div className="text-sm">मिलियन कुल आम्दानी</div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-center flex flex-col justify-center aspect-square">
            <div className="text-3xl font-bold mb-2 text-purple-500">
              {localizeNumber(commercializationScore.toString(), "ne")}%
            </div>
            <div className="text-sm">व्यावसायीकरण स्कोर</div>
          </div>
        </div>
      </div>
    </div>
  );
}
