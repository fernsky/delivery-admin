import { localizeNumber } from "@/lib/utils/localize-number";
import { Card, CardContent } from "@/components/ui/card";
import AnimalProductPieChart from "./charts/animal-product-pie-chart";
import AnimalProductBarChart from "./charts/animal-product-bar-chart";
import ProductionSalesDistributionChart from "./charts/production-sales-distribution-chart";
import CommercializationChart from "../../municipality-wide-oil-seeds/_components/charts/commercialization-chart";
import { useState } from "react";

interface AnimalProductChartsProps {
  overallSummary: Array<{
    type: string;
    typeName: string;
    production: number;
    sales: number;
    revenue: number;
    measurementUnit?: string;
  }>;
  totalProduction: number;
  totalSales: number;
  totalRevenue: number;
  productionPieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
    measurementUnit?: string;
  }>;
  revenuePieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  ANIMAL_PRODUCT_TYPES: Record<string, string>;
  ANIMAL_PRODUCT_COLORS: Record<string, string>;
  animalProductAnalysis: {
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

export default function AnimalProductCharts({
  overallSummary,
  totalProduction,
  totalSales,
  totalRevenue,
  productionPieChartData,
  revenuePieChartData,
  ANIMAL_PRODUCT_TYPES,
  ANIMAL_PRODUCT_COLORS,
  animalProductAnalysis,
  soldPercentage,
  selfConsumptionPercentage,
  commercializationScore,
}: AnimalProductChartsProps) {
  // Format data for production-sales comparison chart
  const productionSalesData = overallSummary
    .filter((item) => item.production > 0)
    .map((item) => ({
      name: item.typeName,
      production: item.production,
      sales: item.sales,
      selfConsumption: item.production - item.sales,
      percentageSold: (item.sales / item.production) * 100,
      measurementUnit: item.measurementUnit,
    }))
    .sort((a, b) => b.production - a.production);

  // Example time series data for historical comparison
  const historicalData = [
    {
      name: "२०७८",
      milk: 2100,
      meat: 600,
      eggs: 28000,
      milk_products: 40,
      other: 10,
    },
    {
      name: "२०७९",
      milk: 2500,
      meat: 650,
      eggs: 32000,
      milk_products: 45,
      other: 12,
    },
    {
      name: "२०८०",
      milk: 3110,
      meat: 724,
      eggs: 37082,
      milk_products: 54,
      other: 15,
    },
  ];

  return (
    <div className="mt-12 space-y-16">
      {/* Production Distribution Section */}
      <section id="production-distribution">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            उत्पादन वितरण विश्लेषण
          </h2>
          <p className="text-muted-foreground">
            पशुपन्छीजन्य वस्तुको प्रकार अनुसार उत्पादन वितरण र मुख्य तथ्यहरू
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 text-center">
                उत्पादन वितरण चार्ट
              </h3>
              <div className="h-[350px]">
                <AnimalProductPieChart
                  pieChartData={productionPieChartData}
                  ANIMAL_PRODUCT_TYPES={ANIMAL_PRODUCT_TYPES}
                  ANIMAL_PRODUCT_COLORS={ANIMAL_PRODUCT_COLORS}
                  dataType="उत्पादन"
                  unit=""
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardContent className="pt-6">
                <h4 className="text-lg font-semibold mb-4">प्रमुख तथ्यहरू</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-600 text-xl">📊</span>
                    <div>
                      <span className="font-medium">
                        कुल पशुपन्छीजन्य वस्तु उत्पादन
                      </span>
                      <div className="text-xl font-bold text-blue-600">
                        {localizeNumber(totalProduction.toFixed(2), "ne")}
                      </div>
                    </div>
                  </li>
                  {overallSummary.length > 0 && (
                    <li className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                      <span className="text-amber-600 text-xl">🥇</span>
                      <div>
                        <span className="font-medium">
                          सबैभन्दा धेरै उत्पादन
                        </span>
                        <div className="text-lg font-bold text-amber-600">
                          {overallSummary[0].typeName} (
                          {localizeNumber(
                            (
                              (overallSummary[0].production / totalProduction) *
                              100
                            ).toFixed(2),
                            "ne",
                          )}
                          %)
                        </div>
                      </div>
                    </li>
                  )}
                  <li className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <span className="text-green-600 text-xl">💰</span>
                    <div>
                      <span className="font-medium">बिक्रीमा पठाइएको</span>
                      <div className="text-lg font-bold text-green-600">
                        {localizeNumber(soldPercentage, "ne")}% (
                        {localizeNumber(totalSales.toFixed(2), "ne")})
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <span className="text-red-600 text-xl">🏠</span>
                    <div>
                      <span className="font-medium">घरायसी उपभोग</span>
                      <div className="text-lg font-bold text-red-600">
                        {localizeNumber(selfConsumptionPercentage, "ne")}% (
                        {localizeNumber(
                          (totalProduction - totalSales).toFixed(2),
                          "ne",
                        )}
                        )
                      </div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="pt-6">
                <h4 className="text-lg font-semibold mb-4">
                  व्यावसायीकरण स्कोर
                </h4>
                <CommercializationChart
                  commercializationScore={commercializationScore}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sales and Revenue Section */}
      <section id="sales-revenue">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            बिक्री र आम्दानी विश्लेषण
          </h2>
          <p className="text-muted-foreground">
            पशुपन्छीजन्य वस्तुको प्रकार अनुसार बिक्री र आम्दानी वितरण
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 text-center">
                आम्दानी वितरण चार्ट
              </h3>
              <div className="h-[350px]">
                <AnimalProductPieChart
                  pieChartData={revenuePieChartData}
                  ANIMAL_PRODUCT_TYPES={ANIMAL_PRODUCT_TYPES}
                  ANIMAL_PRODUCT_COLORS={ANIMAL_PRODUCT_COLORS}
                  dataType="आम्दानी"
                  unit="रु."
                  isRevenue={true}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardContent className="pt-6">
                <h4 className="text-lg font-semibold mb-4">आम्दानी तथ्यहरू</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-600 text-xl">💵</span>
                    <div>
                      <span className="font-medium">कुल बिक्री</span>
                      <div className="text-xl font-bold text-blue-600">
                        {localizeNumber(totalSales.toFixed(2), "ne")}
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <span className="text-green-600 text-xl">💰</span>
                    <div>
                      <span className="font-medium">कुल आम्दानी</span>
                      <div className="text-xl font-bold text-green-600">
                        रु.{" "}
                        {localizeNumber(totalRevenue.toLocaleString(), "ne")}
                      </div>
                    </div>
                  </li>
                  {overallSummary.length > 0 && (
                    <li className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                      <span className="text-purple-600 text-xl">🏆</span>
                      <div>
                        <span className="font-medium">बढी आम्दानी दिने</span>
                        <div className="text-lg font-bold text-purple-600">
                          {
                            overallSummary.sort(
                              (a, b) => b.revenue - a.revenue,
                            )[0].typeName
                          }
                        </div>
                        <div className="text-sm text-purple-500">
                          रु.{" "}
                          {localizeNumber(
                            overallSummary
                              .sort((a, b) => b.revenue - a.revenue)[0]
                              .revenue.toLocaleString(),
                            "ne",
                          )}
                        </div>
                      </div>
                    </li>
                  )}
                  <li className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                    <span className="text-amber-600 text-xl">📈</span>
                    <div>
                      <span className="font-medium">औसत मूल्य प्रति इकाई</span>
                      <div className="text-lg font-bold text-amber-600">
                        रु.{" "}
                        {localizeNumber(
                          animalProductAnalysis.averagePricePerKg.toFixed(2),
                          "ne",
                        )}
                      </div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="pt-6">
                <h4 className="text-lg font-semibold mb-4">आम्दानी अनुपात</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2">
                        <th className="text-left py-2">
                          पशुपन्छीजन्य वस्तु प्रकार
                        </th>
                        <th className="text-right py-2">बिक्री</th>
                        <th className="text-right py-2">आम्दानी (रु.)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overallSummary
                        .filter((item) => item.sales > 0)
                        .sort((a, b) => b.revenue - a.revenue)
                        .map((item, index) => (
                          <tr key={index} className="border-t hover:bg-gray-50">
                            <td className="py-3 font-medium">
                              {item.typeName}
                            </td>
                            <td className="text-right py-3">
                              {localizeNumber(item.sales.toFixed(2), "ne")}
                            </td>
                            <td className="text-right py-3 font-semibold">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Production vs Sales Comparison */}
      <section id="production-sales-comparison">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            उत्पादन र बिक्री तुलनात्मक विश्लेषण
          </h2>
          <p className="text-muted-foreground">
            प्रत्येक पशुपन्छीजन्य वस्तुको उत्पादन र बिक्री अनुपातको तुलनात्मक
            अध्ययन
          </p>
        </div>

        <Card className="shadow-lg mb-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4 text-center">
              उत्पादन बनाम बिक्री वितरण
            </h3>
            <div className="h-[400px]">
              <ProductionSalesDistributionChart
                productionSalesData={productionSalesData}
                totalProduction={totalProduction}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <h4 className="text-lg font-semibold mb-4">अर्थ ब्याख्या</h4>
              <div className="prose prose-sm">
                <p>
                  माथिको चार्टमा हरेक पशुपन्छीजन्य वस्तुको उत्पादन र बिक्री
                  अनुपात देखाइएको छ। हरियो भाग आन्तरिक उपभोग र निलो भाग बिक्री
                  परिमाण हो।
                </p>
                <p className="mt-2">
                  सबैभन्दा बढी बिक्री अनुपात{" "}
                  <span className="font-bold text-primary">
                    {productionSalesData.length > 0
                      ? productionSalesData.sort(
                          (a, b) => b.percentageSold - a.percentageSold,
                        )[0].name
                      : ""}
                  </span>
                  को रहेको छ।
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <h4 className="text-lg font-semibold mb-4">
                पशुपन्छीजन्य वस्तु बिक्री दर
              </h4>
              <div className="space-y-4">
                {productionSalesData
                  .sort((a, b) => b.percentageSold - a.percentageSold)
                  .map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.name}</span>
                        <span className="font-bold text-primary">
                          {localizeNumber(item.percentageSold.toFixed(2), "ne")}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(item.percentageSold, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Historical Trend */}
      <section id="historical-trend">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            ऐतिहासिक प्रवृत्ति विश्लेषण
          </h2>
          <p className="text-muted-foreground">
            पशुपन्छीजन्य वस्तुको उत्पादनमा भएको ऐतिहासिक परिवर्तन र विकास
          </p>
        </div>

        <Card className="shadow-lg mb-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4 text-center">
              वार्षिक उत्पादन प्रवृत्ति (२०७८-२०८०)
            </h3>
            <div className="h-[400px]">
              <AnimalProductBarChart data={historicalData} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <h4 className="text-lg font-semibold mb-4">प्रवृत्ति विश्लेषण</h4>
            <div className="prose prose-sm">
              <p>
                पछिल्ला वर्षहरूमा दुध उत्पादनमा क्रमिक वृद्धि भएको देखिन्छ। २०७८
                मा {localizeNumber("2100", "ne")} लिटर उत्पादन भएकोमा २०८० मा
                बढेर {localizeNumber("3110", "ne")} लिटर पुगेको छ।
              </p>
              <p className="mt-2">
                त्यसैगरी, अण्डा र मासु उत्पादनमा पनि निरन्तर वृद्धि भएको
                देखिन्छ। यो तथ्याङ्कले खजुरा गाउँपालिकामा पशुपन्छी पालन
                क्षेत्रको सकारात्मक विकास भइरहेको संकेत गर्दछ।
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Economic Impact Section */}
      <section id="economic-impact">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            आर्थिक प्रभाव
          </h2>
          <p className="text-muted-foreground">
            पशुपन्छीजन्य वस्तु उत्पादनको स्थानीय अर्थतन्त्रमा पारेको प्रभाव
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl mb-2">💎</div>
                <h3 className="text-sm text-muted-foreground mb-1">
                  कुल उत्पादन मूल्य
                </h3>
                <p className="text-3xl font-bold text-primary">
                  रु.{" "}
                  {localizeNumber(
                    (
                      (totalProduction *
                        1000 *
                        animalProductAnalysis.averagePricePerKg) /
                      1000
                    ).toFixed(2),
                    "ne",
                  )}{" "}
                  <span className="text-base font-normal">हजार</span>
                </p>
              </div>
              <div className="mt-4 border-t pt-4">
                <p className="text-sm text-center">
                  कुल उत्पादनको अनुमानित बजार मूल्य, औसत मूल्य प्रति इकाई रु.{" "}
                  {localizeNumber(
                    animalProductAnalysis.averagePricePerKg.toFixed(2),
                    "ne",
                  )}{" "}
                  को आधारमा
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl mb-2">💰</div>
                <h3 className="text-sm text-muted-foreground mb-1">
                  वास्तविक आम्दानी
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  रु. {localizeNumber((totalRevenue / 1000).toFixed(2), "ne")}{" "}
                  <span className="text-base font-normal">हजार</span>
                </p>
              </div>
              <div className="mt-4 border-t pt-4">
                <p className="text-sm text-center">
                  बिक्री भएको पशुपन्छीजन्य वस्तुबाट प्राप्त वास्तविक आम्दानी,
                  जुन कुल उत्पादनको{" "}
                  {localizeNumber(
                    (
                      (totalRevenue /
                        (totalProduction *
                          1000 *
                          animalProductAnalysis.averagePricePerKg)) *
                      100
                    ).toFixed(2),
                    "ne",
                  )}
                  % हो
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl mb-2">🏛️</div>
                <h3 className="text-sm text-muted-foreground mb-1">
                  पशुपन्छीजन्य वस्तु आर्थिक योगदान
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {localizeNumber(
                    Math.min(
                      Math.round((totalSales / totalProduction) * 100),
                      100,
                    ).toString(),
                    "ne",
                  )}
                  <span className="text-base font-normal">%</span>
                </p>
              </div>
              <div className="mt-4 border-t pt-4">
                <p className="text-sm text-center">
                  पशुपन्छीजन्य वस्तुको कृषि क्षेत्रमा अनुमानित योगदान, पालिकाको
                  कृषि क्षेत्रको कुल उत्पादनको आधारमा
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
