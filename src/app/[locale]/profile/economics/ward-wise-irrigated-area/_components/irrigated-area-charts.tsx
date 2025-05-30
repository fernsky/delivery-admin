

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { localizeNumber } from "@/lib/utils/localize-number";
import IrrigatedAreaPieChart from "./charts/irrigated-area-pie-chart";
import IrrigatedAreaBarChart from "./charts/irrigated-area-bar-chart";
import WardIrrigationRatioCharts from "./charts/ward-irrigation-ratio-charts";
import IrrigationCoverageChart from "./charts/irrigation-coverage-chart";

interface IrrigatedAreaChartsProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
    type: string;
  }>;
  wardWiseData: Array<Record<string, any>>;
  wardNumbers: number[];
  irrigatedAreaData: Array<{
    id?: string;
    wardNumber: number;
    irrigatedAreaHectares: string | number;
    unirrigatedAreaHectares: string | number;
  }>;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    irrigatedArea: number;
    unirrigatedArea: number;
    totalWardArea: number;
    irrigationCoveragePercentage: number;
    irrigationCoverageScore: number;
  }>;
  AREA_COLORS: Record<string, string>;
  totalArea: number;
  totalIrrigatedArea: number;
  totalUnirrigatedArea: number;
  irrigationCoverage: number;
}

export default function IrrigatedAreaCharts({
  pieChartData,
  wardWiseData,
  wardNumbers,
  irrigatedAreaData,
  wardWiseAnalysis,
  AREA_COLORS,
  totalArea,
  totalIrrigatedArea,
  totalUnirrigatedArea,
  irrigationCoverage,
}: IrrigatedAreaChartsProps) {
  return (
    <>
      {/* Overall irrigation distribution - with pre-rendered table and client-side chart */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Irrigated and Unirrigated Areas in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Irrigation coverage in Khajura with a total of ${totalArea} hectares of agricultural land`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            सिंचित र असिंचित क्षेत्र वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल कृषि भूमि: {localizeNumber(totalArea.toLocaleString(), "ne")} हेक्टर
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[400px]">
              <IrrigatedAreaPieChart
                pieChartData={pieChartData}
                AREA_COLORS={AREA_COLORS}
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
                    <th className="border p-2 text-left">क्षेत्रको प्रकार</th>
                    <th className="border p-2 text-right">क्षेत्रफल (हेक्टर)</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {pieChartData.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{localizeNumber(i + 1, "ne")}</td>
                      <td className="border p-2">{item.name}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.value.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.percentage, "ne")}%
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
                      {localizeNumber(totalArea.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber("100.00", "ne")}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="mt-8">
              <h4 className="text-lg font-medium mb-4 text-center">सिंचाई कभरेज स्कोर</h4>
              <div className="p-4">
                <IrrigationCoverageChart coveragePercentage={irrigationCoverage} />
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                नोट: सिंचाई कभरेज स्कोर कुल कृषि क्षेत्रफलको तुलनामा सिंचित क्षेत्रको प्रतिशतमा आधारित छ।
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 p-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            सिंचित र असिंचित क्षेत्र विवरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pieChartData.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      AREA_COLORS[
                        item.type as keyof typeof AREA_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-sm truncate">{item.name}</span>
                    <span className="font-medium">
                      {localizeNumber(item.percentage, "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${parseFloat(item.percentage)}%`,
                        backgroundColor:
                          AREA_COLORS[
                            item.type as keyof typeof AREA_COLORS
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

      {/* Ward-wise distribution - pre-rendered table with client-side chart */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="ward-wise-irrigated-area"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Irrigated Areas in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Irrigation distribution across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार सिंचित क्षेत्रको वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार सिंचित र असिंचित क्षेत्रको वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <IrrigatedAreaBarChart
              wardWiseData={wardWiseData}
              AREA_COLORS={AREA_COLORS}
            />
          </div>
        </div>
      </div>

      {/* Ward-wise analysis - with pre-rendered HTML table for SEO */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="irrigation-sources-and-coverage"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Irrigation Coverage Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Irrigation coverage patterns by ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत सिंचाई क्षेत्र विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार सिंचित र असिंचित क्षेत्रको विस्तृत विश्लेषण
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">कुल क्षेत्रफल (हेक्टर)</th>
                  <th className="border p-2 text-right">सिंचित क्षेत्र (हेक्टर)</th>
                  <th className="border p-2 text-right">असिंचित क्षेत्र (हेक्टर)</th>
                  <th className="border p-2 text-right">सिंचाई कभरेज (%)</th>
                </tr>
              </thead>
              <tbody>
                {wardWiseAnalysis.map((item, i) => {
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">वडा {localizeNumber(item.wardNumber, "ne")}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.totalWardArea.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.irrigatedArea.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.unirrigatedArea.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        <span className={item.irrigationCoveragePercentage >= 50 ? "text-green-600" : "text-amber-600"}>
                          {localizeNumber(item.irrigationCoveragePercentage.toFixed(2), "ne")}%
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
                    {localizeNumber(totalArea.toLocaleString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(totalIrrigatedArea.toLocaleString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(totalUnirrigatedArea.toLocaleString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    <span className={irrigationCoverage >= 50 ? "text-green-600" : "text-amber-600"}>
                      {localizeNumber(irrigationCoverage.toFixed(2), "ne")}%
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Ward irrigation ratio charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत सिंचित र असिंचित क्षेत्र अनुपात</h4>
          <WardIrrigationRatioCharts
            wardNumbers={wardNumbers}
            irrigatedAreaData={irrigatedAreaData}
            AREA_COLORS={AREA_COLORS}
          />
        </div>
      </div>
    </>
  );
}
