import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import IrrigationSourcePieChart from "./charts/irrigation-source-pie-chart";
import IrrigationSourceBarChart from "./charts/irrigation-source-bar-chart";
import IrrigationSustainabilityChart from "./charts/irrigation-sustainability-chart";
import IrrigationDiversityChart from "./charts/irrigation-diversity-chart";
import { localizeNumber } from "@/lib/utils/localize-number";

interface IrrigationSourceChartsProps {
  overallSummary: Array<{
    source: string;
    sourceName: string;
    coverage: number;
    percentage: number;
  }>;
  totalIrrigatedArea: number;
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
    type: string;
  }>;
  barChartData: Array<{
    irrigationSource: string;
    coverage: number;
    percentage: number;
  }>;
  irrigationAnalysis: Array<{
    source: string;
    sourceName: string;
    coverage: number;
    percentage: number;
    sustainabilityCategory: string;
    reliability: string;
    efficiencyScore: number;
  }>;
  IRRIGATION_SOURCE_TYPES: Record<string, string>;
  IRRIGATION_SOURCE_COLORS: Record<string, string>;
  sustainabilityScore: number;
  diversityIndex: number;
}

export default function IrrigationSourceCharts({
  overallSummary,
  totalIrrigatedArea,
  pieChartData,
  barChartData,
  irrigationAnalysis,
  IRRIGATION_SOURCE_TYPES,
  IRRIGATION_SOURCE_COLORS,
  sustainabilityScore,
  diversityIndex,
}: IrrigationSourceChartsProps) {
  return (
    <>
      {/* Overall irrigation source distribution - with pre-rendered table and client-side chart */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Irrigation Sources in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Irrigation source distribution in Khajura with total irrigated area of ${totalIrrigatedArea} hectares`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            सिंचाई स्रोतका प्रमुख प्रकारहरू
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल सिंचित क्षेत्र: {localizeNumber(totalIrrigatedArea.toFixed(1), "ne")} हेक्टर
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[600px]">
              <IrrigationSourcePieChart
                pieChartData={pieChartData}
                IRRIGATION_SOURCE_COLORS={IRRIGATION_SOURCE_COLORS}
              />
            </div>
          </div>

          {/* Server-side pre-rendered table for SEO */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">तालिका</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted sticky top-0">
                    <th className="border p-2 text-left">क्र.सं.</th>
                    <th className="border p-2 text-left">सिंचाई स्रोत</th>
                    <th className="border p-2 text-right">कभरेज (हेक्टर)</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{localizeNumber(i + 1, "ne")}</td>
                      <td className="border p-2">{item.sourceName}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.coverage.toFixed(1), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.percentage.toFixed(2), "ne")}%
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-semibold bg-muted/70">
                    <td className="border p-2" colSpan={2}>
                      जम्मा
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(totalIrrigatedArea.toFixed(1), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber("100.00", "ne")}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-lg font-medium mb-4 text-center">सिंचाई दिगोपना स्कोर</h4>
                <div className="p-4">
                  <IrrigationSustainabilityChart sustainabilityScore={sustainabilityScore} />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-4 text-center">सिंचाई विविधता सूचकाङ्क</h4>
                <div className="p-4">
                  <IrrigationDiversityChart diversityIndex={diversityIndex} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 p-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            सिंचाई स्रोत विवरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {overallSummary.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      IRRIGATION_SOURCE_COLORS[
                        item.source as keyof typeof IRRIGATION_SOURCE_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-sm truncate">{item.sourceName}</span>
                    <span className="font-medium">
                      {localizeNumber(item.percentage.toFixed(1), "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor:
                          IRRIGATION_SOURCE_COLORS[
                            item.source as keyof typeof IRRIGATION_SOURCE_COLORS
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

      {/* Bar chart visualization */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="irrigation-source-distribution"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Irrigation Source Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Coverage area distribution by irrigation source type"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            सिंचाई स्रोतको कभरेज वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            सिंचाई स्रोत अनुसार कभरेज क्षेत्र
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <IrrigationSourceBarChart
              barChartData={barChartData}
              IRRIGATION_SOURCE_COLORS={IRRIGATION_SOURCE_COLORS}
              IRRIGATION_SOURCE_TYPES={IRRIGATION_SOURCE_TYPES}
            />
          </div>
        </div>
      </div>

      {/* Irrigation analysis table */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="irrigation-effectiveness"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Irrigation Source Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Irrigation source effectiveness and sustainability analysis"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            सिंचाई स्रोत प्रभावकारिता विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            सिंचाई स्रोतको दिगोपना र भरपर्दोपन विश्लेषण
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">सिंचाई स्रोत</th>
                  <th className="border p-2 text-right">कभरेज (हेक्टर)</th>
                  <th className="border p-2 text-right">प्रतिशत</th>
                  <th className="border p-2">दिगोपना श्रेणी</th>
                  <th className="border p-2">भरपर्दोपन</th>
                  <th className="border p-2 text-right">प्रभावकारिता स्कोर</th>
                </tr>
              </thead>
              <tbody>
                {irrigationAnalysis.map((item, i) => {
                  const getSustainabilityLabel = (category: string) => {
                    switch (category) {
                      case "sustainable": return "दिगो";
                      case "moderately_sustainable": return "मध्यम दिगो";
                      case "traditional": return "परम्परागत";
                      default: return "अन्य";
                    }
                  };

                  const getReliabilityLabel = (reliability: string) => {
                    switch (reliability) {
                      case "high": return "उच्च";
                      case "medium": return "मध्यम";
                      case "seasonal": return "मौसमी";
                      default: return "अज्ञात";
                    }
                  };

                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">{item.sourceName}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.coverage.toFixed(1), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.percentage.toFixed(2), "ne")}%
                      </td>
                      <td className="border p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.sustainabilityCategory === "sustainable" ? "bg-green-100 text-green-800" :
                          item.sustainabilityCategory === "moderately_sustainable" ? "bg-yellow-100 text-yellow-800" :
                          item.sustainabilityCategory === "traditional" ? "bg-blue-100 text-blue-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {getSustainabilityLabel(item.sustainabilityCategory)}
                        </span>
                      </td>
                      <td className="border p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.reliability === "high" ? "bg-green-100 text-green-800" :
                          item.reliability === "medium" ? "bg-yellow-100 text-yellow-800" :
                          item.reliability === "seasonal" ? "bg-orange-100 text-orange-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {getReliabilityLabel(item.reliability)}
                        </span>
                      </td>
                      <td className="border p-2 text-right">
                        <span className={item.efficiencyScore >= 75 ? "text-green-600" : item.efficiencyScore >= 50 ? "text-amber-600" : "text-red-600"}>
                          {localizeNumber(item.efficiencyScore.toFixed(0), "ne")}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-semibold bg-muted/70">
                  <td className="border p-2">पालिका जम्मा</td>
                  <td className="border p-2 text-right">
                    {localizeNumber(totalIrrigatedArea.toFixed(1), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber("100.00", "ne")}%
                  </td>
                  <td className="border p-2">मिश्रित</td>
                  <td className="border p-2">विविध</td>
                  <td className="border p-2 text-right">
                    <span className={sustainabilityScore >= 75 ? "text-green-600" : sustainabilityScore >= 50 ? "text-amber-600" : "text-red-600"}>
                      {localizeNumber(sustainabilityScore.toString(), "ne")}%
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
