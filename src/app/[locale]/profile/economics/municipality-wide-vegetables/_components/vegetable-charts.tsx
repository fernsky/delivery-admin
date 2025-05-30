"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { localizeNumber } from "@/lib/utils/localize-number";
import { Card, CardContent } from "@/components/ui/card";
import VegetablePieChart from "./charts/vegetable-pie-chart";
import VegetableBarChart from "./charts/vegetable-bar-chart";
import ProductionSalesDistributionChart from "./charts/production-sales-distribution-chart";
import CommercializationChart from "../../municipality-wide-oil-seeds/_components/charts/commercialization-chart";
import { useState } from "react";

interface VegetableChartsProps {
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
  VEGETABLE_TYPES: Record<string, string>;
  VEGETABLE_COLORS: Record<string, string>;
  vegetableAnalysis: {
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

export default function VegetableCharts({
  overallSummary,
  totalProduction,
  totalSales,
  totalRevenue,
  productionPieChartData,
  revenuePieChartData,
  VEGETABLE_TYPES,
  VEGETABLE_COLORS,
  vegetableAnalysis,
  soldPercentage,
  selfConsumptionPercentage,
  commercializationScore,
}: VegetableChartsProps) {
  // State for currently selected chart tab
  const [activeTab, setActiveTab] = useState("production-distribution");

  // Format data for production-sales comparison chart
  const productionSalesData = overallSummary
    .filter((item) => item.production > 0)
    .map((item) => ({
      name: item.typeName,
      production: item.production,
      sales: item.sales,
      selfConsumption: item.production - item.sales,
      percentageSold: (item.sales / item.production) * 100,
    }))
    .sort((a, b) => b.production - a.production);

  // Example time series data for historical comparison
  const historicalData = [
    {
      name: "२०७८",
      potato: 65.5,
      tomato: 38.2,
      cauliflower: 25.6,
      cabbage: 29.3,
      other: 18.7,
    },
    {
      name: "२०७९",
      potato: 71.2,
      tomato: 41.5,
      cauliflower: 28.1,
      cabbage: 32.6,
      other: 20.2,
    },
    {
      name: "२०८०",
      potato: 76.8,
      tomato: 44.7,
      cauliflower: 30.3,
      cabbage: 35.8,
      other: 21.5,
    },
  ];

  return (
    <div className="mt-12">
      <h2 id="production-and-sales" className="text-2xl font-semibold mb-6">
        उत्पादन र बिक्री विश्लेषण
      </h2>

      <div className="bg-card rounded-lg p-4 shadow-sm border">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-1 md:grid-cols-4 mb-4">
            <TabsTrigger value="production-distribution">
              उत्पादन वितरण
            </TabsTrigger>
            <TabsTrigger value="sales-revenue">बिक्री र आम्दानी</TabsTrigger>
            <TabsTrigger value="production-sales-comparison">
              उत्पादन-बिक्री तुलना
            </TabsTrigger>
            <TabsTrigger value="historical-trend">
              ऐतिहासिक प्रवृत्ति
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="production-distribution"
            className="mt-4 border rounded-lg p-4"
          >
            <h3 className="text-lg font-medium mb-4">
              तरकारीको प्रकार अनुसार उत्पादन वितरण
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="h-[350px]">
                    <VegetablePieChart
                      pieChartData={productionPieChartData}
                      VEGETABLE_TYPES={VEGETABLE_TYPES}
                      VEGETABLE_COLORS={VEGETABLE_COLORS}
                      dataType="उत्पादन"
                      unit="मे.ट."
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-md border">
                  <h4 className="font-medium mb-2">प्रमुख तथ्यहरू</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <span className="text-blue-500">•</span>
                      <span>
                        कुल तरकारी उत्पादन:{" "}
                        <strong>
                          {localizeNumber(totalProduction.toFixed(2), "ne")}{" "}
                          मेट्रिक टन
                        </strong>
                      </span>
                    </li>
                    {overallSummary.length > 0 && (
                      <li className="flex gap-2">
                        <span className="text-amber-500">•</span>
                        <span>
                          सबैभन्दा धेरै उत्पादन:{" "}
                          <strong>
                            {overallSummary[0].typeName} (
                            {localizeNumber(
                              (
                                (overallSummary[0].production /
                                  totalProduction) *
                                100
                              ).toFixed(2),
                              "ne",
                            )}
                            %)
                          </strong>
                        </span>
                      </li>
                    )}
                    <li className="flex gap-2">
                      <span className="text-green-500">•</span>
                      <span>
                        बिक्रीमा पठाइएको:{" "}
                        <strong>
                          {localizeNumber(soldPercentage, "ne")}% (
                          {localizeNumber(totalSales.toFixed(2), "ne")} मे.ट.)
                        </strong>
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-red-500">•</span>
                      <span>
                        घरायसी उपभोग:{" "}
                        <strong>
                          {localizeNumber(selfConsumptionPercentage, "ne")}% (
                          {localizeNumber(
                            (totalProduction - totalSales).toFixed(2),
                            "ne",
                          )}{" "}
                          मे.ट.)
                        </strong>
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-muted/50 p-4 rounded-md border">
                  <h4 className="font-medium mb-4">व्यावसायीकरण स्कोर</h4>
                  <CommercializationChart
                    commercializationScore={commercializationScore}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="sales-revenue"
            className="mt-4 border rounded-lg p-4"
          >
            <h3 className="text-lg font-medium mb-4">
              तरकारीको प्रकार अनुसार बिक्री र आम्दानी
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="h-[350px]">
                    <VegetablePieChart
                      pieChartData={revenuePieChartData}
                      VEGETABLE_TYPES={VEGETABLE_TYPES}
                      VEGETABLE_COLORS={VEGETABLE_COLORS}
                      dataType="आम्दानी"
                      unit="रु."
                      isRevenue={true}
                    />
                  </div>
                </CardContent>
              </Card>

              <div>
                <div className="bg-muted/50 p-4 rounded-md border">
                  <h4 className="font-medium mb-2">प्रमुख तथ्यहरू</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <span className="text-blue-500">•</span>
                      <span>
                        कुल बिक्री:{" "}
                        <strong>
                          {localizeNumber(totalSales.toFixed(2), "ne")} मेट्रिक
                          टन
                        </strong>
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-500">•</span>
                      <span>
                        कुल आम्दानी:{" "}
                        <strong>
                          रु.{" "}
                          {localizeNumber(totalRevenue.toLocaleString(), "ne")}
                        </strong>
                      </span>
                    </li>
                    {overallSummary.length > 0 && (
                      <li className="flex gap-2">
                        <span className="text-green-500">•</span>
                        <span>
                          बढी आम्दानी दिने तरकारी:{" "}
                          <strong>
                            {
                              overallSummary.sort(
                                (a, b) => b.revenue - a.revenue,
                              )[0].typeName
                            }{" "}
                            (रु.{" "}
                            {localizeNumber(
                              overallSummary
                                .sort((a, b) => b.revenue - a.revenue)[0]
                                .revenue.toLocaleString(),
                              "ne",
                            )}
                            )
                          </strong>
                        </span>
                      </li>
                    )}
                    <li className="flex gap-2">
                      <span className="text-purple-500">•</span>
                      <span>
                        औसत मूल्य प्रति किलो:{" "}
                        <strong>
                          रु.{" "}
                          {localizeNumber(
                            vegetableAnalysis.averagePricePerKg.toFixed(2),
                            "ne",
                          )}
                        </strong>
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-muted/50 p-4 rounded-md border mt-6">
                  <h4 className="font-medium mb-2">आम्दानी अनुपात</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left">तरकारी प्रकार</th>
                        <th className="text-right">बिक्री (मे.ट.)</th>
                        <th className="text-right">आम्दानी (रु.)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overallSummary
                        .filter((item) => item.sales > 0)
                        .sort((a, b) => b.revenue - a.revenue)
                        .map((item, index) => (
                          <tr key={index} className="border-t">
                            <td className="py-2">{item.typeName}</td>
                            <td className="text-right">
                              {localizeNumber(item.sales.toFixed(2), "ne")}
                            </td>
                            <td className="text-right">
                              {localizeNumber(
                                item.revenue.toLocaleString(),
                                "ne",
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="production-sales-comparison"
            className="mt-4 border rounded-lg p-4"
          >
            <h3 className="text-lg font-medium mb-4">
              उत्पादन र बिक्री तुलनात्मक विश्लेषण
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="h-[400px]">
                    <ProductionSalesDistributionChart
                      productionSalesData={productionSalesData}
                      totalProduction={totalProduction}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-muted/50 p-4 rounded-md border">
                  <h4 className="font-medium mb-2">अर्थ ब्याख्या</h4>
                  <p className="text-sm">
                    माथिको चार्टमा हरेक तरकारी बालीको उत्पादन र बिक्री अनुपात
                    देखाइएको छ। हरियो भाग आन्तरिक उपभोग र निलो भाग बिक्री परिमाण
                    हो। सबैभन्दा बढी बिक्री अनुपात{" "}
                    {productionSalesData.length > 0
                      ? productionSalesData.sort(
                          (a, b) => b.percentageSold - a.percentageSold,
                        )[0].name
                      : ""}
                    को रहेको छ।
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-md border">
                  <h4 className="font-medium mb-2">तरकारी बिक्री दर</h4>
                  <ul className="space-y-3 mt-4">
                    {productionSalesData
                      .sort((a, b) => b.percentageSold - a.percentageSold)
                      .map((item, index) => (
                        <li key={index}>
                          <div className="flex justify-between mb-1 text-sm">
                            <span>{item.name}</span>
                            <span>
                              {localizeNumber(
                                item.percentageSold.toFixed(2),
                                "ne",
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${item.percentageSold}%` }}
                            ></div>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="historical-trend"
            className="mt-4 border rounded-lg p-4"
          >
            <h3 className="text-lg font-medium mb-4">
              तरकारीको ऐतिहासिक प्रवृत्ति
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="h-[400px]">
                    <VegetableBarChart data={historicalData} />
                  </div>
                </CardContent>
              </Card>

              <div className="bg-muted/50 p-4 rounded-md border">
                <h4 className="font-medium mb-2">
                  प्रवृत्ति विश्लेषण (२०७८-२०८०)
                </h4>
                <p className="text-sm">
                  पछिल्ला वर्षहरूमा आलु उत्पादनमा क्रमिक वृद्धि भएको देखिन्छ।
                  २०७८ मा {localizeNumber("65.5", "ne")} मेट्रिक टन उत्पादन
                  भएकोमा २०८० मा बढेर {localizeNumber("76.8", "ne")} मेट्रिक टन
                  पुगेको छ। त्यसैगरी, गोलभेडा र काउली उत्पादनमा पनि निरन्तर
                  वृद्धि भएको देखिन्छ।
                </p>
                <p className="text-sm mt-2">
                  यो तथ्याङ्कले खजुरा गाउँपालिकामा तरकारी बालीको क्षेत्रमा
                  सकारात्मक विकास भइरहेको संकेत गर्दछ।
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-10" id="economic-impact">
        <h2 className="text-2xl font-semibold mb-6">आर्थिक प्रभाव</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-sm text-muted-foreground mb-1">
                  कुल उत्पादन मूल्य
                </h3>
                <p className="text-3xl font-bold">
                  रु.{" "}
                  {localizeNumber(
                    (
                      (totalProduction *
                        1000 *
                        vegetableAnalysis.averagePricePerKg) /
                      1000
                    ).toFixed(2),
                    "ne",
                  )}{" "}
                  <span className="text-base font-normal">हजार</span>
                </p>
              </div>

              <div className="mt-4 border-t pt-4">
                <p className="text-sm">
                  कुल उत्पादनको अनुमानित बजार मूल्य, औसत मूल्य प्रति किलो रु.{" "}
                  {localizeNumber(
                    vegetableAnalysis.averagePricePerKg.toFixed(2),
                    "ne",
                  )}{" "}
                  को आधारमा
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-sm text-muted-foreground mb-1">
                  वास्तविक आम्दानी
                </h3>
                <p className="text-3xl font-bold">
                  रु. {localizeNumber((totalRevenue / 1000).toFixed(2), "ne")}{" "}
                  <span className="text-base font-normal">हजार</span>
                </p>
              </div>

              <div className="mt-4 border-t pt-4">
                <p className="text-sm">
                  बिक्री भएको तरकारीबाट प्राप्त वास्तविक आम्दानी, जुन कुल
                  उत्पादनको{" "}
                  {localizeNumber(
                    (
                      (totalRevenue /
                        (totalProduction *
                          1000 *
                          vegetableAnalysis.averagePricePerKg)) *
                      100
                    ).toFixed(2),
                    "ne",
                  )}
                  % हो
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-sm text-muted-foreground mb-1">
                  तरकारी आर्थिक योगदान
                </h3>
                <p className="text-3xl font-bold">
                  {localizeNumber(
                    Math.min(
                      Math.round((totalProduction / 250) * 100),
                      100,
                    ).toString(),
                    "ne",
                  )}
                  <span className="text-base font-normal">%</span>
                </p>
              </div>

              <div className="mt-4 border-t pt-4">
                <p className="text-sm">
                  अनुमानित तरकारी आत्मनिर्भरता स्तर, पालिकाको अनुमानित वार्षिक
                  आवश्यकता (लगभग २५० मे.ट.) को आधारमा
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
