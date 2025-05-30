"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { localizeNumber } from "@/lib/utils/localize-number";
import { Card, CardContent } from "@/components/ui/card";
import FruitPieChart from "./charts/fruit-pie-chart";
import FruitBarChart from "./charts/fruit-bar-chart";
import ProductionSalesDistributionChart from "./charts/production-sales-distribution-chart";
import CommercializationChart from "../../municipality-wide-oil-seeds/_components/charts/commercialization-chart";
import { useState } from "react";

interface FruitChartsProps {
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
  FRUIT_TYPES: Record<string, string>;
  FRUIT_COLORS: Record<string, string>;
  fruitAnalysis: {
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

export default function FruitCharts({
  overallSummary,
  totalProduction,
  totalSales,
  totalRevenue,
  productionPieChartData,
  revenuePieChartData,
  FRUIT_TYPES,
  FRUIT_COLORS,
  fruitAnalysis,
  soldPercentage,
  selfConsumptionPercentage,
  commercializationScore,
}: FruitChartsProps) {
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
      mango: 35.4,
      jackfruit: 0.95,
      litchi: 1.05,
      other: 0.75,
    },
    {
      name: "२०७९",
      mango: 38.1,
      jackfruit: 1.15,
      litchi: 1.18,
      other: 0.85,
    },
    {
      name: "२०८०",
      mango: 40.3,
      jackfruit: 1.39,
      litchi: 1.25,
      other: 0.9,
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
              फलफूल बालीको प्रकार अनुसार उत्पादन वितरण
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="h-[350px]">
                    <FruitPieChart
                      pieChartData={productionPieChartData}
                      FRUIT_TYPES={FRUIT_TYPES}
                      FRUIT_COLORS={FRUIT_COLORS}
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
                        कुल फलफूल बाली उत्पादन:{" "}
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
              फलफूल बालीको प्रकार अनुसार बिक्री र आम्दानी
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="h-[350px]">
                    <FruitPieChart
                      pieChartData={revenuePieChartData}
                      FRUIT_TYPES={FRUIT_TYPES}
                      FRUIT_COLORS={FRUIT_COLORS}
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
                          बढी आम्दानी दिने फलफूल:{" "}
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
                            fruitAnalysis.averagePricePerKg.toFixed(2),
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
                        <th className="text-left">फलफूल प्रकार</th>
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
                    माथिको चार्टमा हरेक फलफूल बालीको उत्पादन र बिक्री अनुपात
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
                  <h4 className="font-medium mb-2">फलफूल बिक्री दर</h4>
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
              फलफूल बालीको ऐतिहासिक प्रवृत्ति
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="h-[400px]">
                    <FruitBarChart data={historicalData} />
                  </div>
                </CardContent>
              </Card>

              <div className="bg-muted/50 p-4 rounded-md border">
                <h4 className="font-medium mb-2">
                  प्रवृत्ति विश्लेषण (२०७८-२०८०)
                </h4>
                <p className="text-sm">
                  पछिल्ला वर्षहरूमा आँप उत्पादनमा क्रमिक वृद्धि भएको देखिन्छ।
                  २०७८ मा {localizeNumber("35.4", "ne")} मेट्रिक टन उत्पादन
                  भएकोमा २०८० मा बढेर {localizeNumber("40.3", "ne")} मेट्रिक टन
                  पुगेको छ। त्यसैगरी, रुखकटहर र लिची उत्पादनमा पनि निरन्तर
                  वृद्धि भएको देखिन्छ।
                </p>
                <p className="text-sm mt-2">
                  यो तथ्याङ्कले खजुरा गाउँपालिकामा फलफूल बालीको क्षेत्रमा
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
                        fruitAnalysis.averagePricePerKg) /
                      1000000
                    ).toFixed(2),
                    "ne",
                  )}{" "}
                  <span className="text-base font-normal">मिलियन</span>
                </p>
              </div>

              <div className="mt-4 border-t pt-4">
                <p className="text-sm">
                  कुल उत्पादनको अनुमानित बजार मूल्य, औसत मूल्य प्रति किलो रु.{" "}
                  {localizeNumber(
                    fruitAnalysis.averagePricePerKg.toFixed(2),
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
                  रु.{" "}
                  {localizeNumber((totalRevenue / 1000000).toFixed(2), "ne")}{" "}
                  <span className="text-base font-normal">मिलियन</span>
                </p>
              </div>

              <div className="mt-4 border-t pt-4">
                <p className="text-sm">
                  बिक्री भएको फलफूल बालीबाट प्राप्त वास्तविक आम्दानी, जुन कुल
                  उत्पादनको{" "}
                  {localizeNumber(
                    (
                      (totalRevenue /
                        (totalProduction *
                          1000 *
                          fruitAnalysis.averagePricePerKg)) *
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
                  फलफूल पोषणमा योगदान
                </h3>
                <p className="text-3xl font-bold">
                  {localizeNumber(
                    Math.min(
                      Math.round((totalProduction / 60) * 100),
                      100,
                    ).toString(),
                    "ne",
                  )}
                  <span className="text-base font-normal">%</span>
                </p>
              </div>

              <div className="mt-4 border-t pt-4">
                <p className="text-sm">
                  अनुमानित फलफूल आत्मनिर्भरता स्तर, पालिकाको अनुमानित वार्षिक
                  आवश्यकता (लगभग ६० मे.ट.) को आधारमा
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
