"use client";

import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { localizeNumber } from "@/lib/utils/localize-number";
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
} from "recharts";

// Create a custom formatter for Recharts tooltips that uses localizeNumber
const CustomTooltipFormatter = (value: number) => {
  return localizeNumber(value.toLocaleString(), "ne");
};

// Customize the label for pie chart to use Nepali numbers
const renderCustomizedPieLabel = ({
  ward,
  percentage,
}: {
  ward: string;
  percentage: string;
}) => {
  return `${ward}: ${localizeNumber(percentage, "ne")}%`;
};

interface PopulationDistributionChartsProps {
  selectedTab: string;
  wardPopulationData: Array<{
    ward: string;
    population: number;
    malePopulation: number;
    femalePopulation: number;
    otherPopulation: number;
    percentage: string;
    households: number;
  }>;
  municipalityStats: {
    totalPopulation: number;
    malePopulation: number;
    femalePopulation: number;
    otherPopulation: number;
    totalHouseholds: number;
  };
  municipalityAverages: {
    averageHouseholdSize: number;
    sexRatio: number;
  };
}

export default function PopulationDistributionCharts({
  selectedTab,
  wardPopulationData,
  municipalityStats,
  municipalityAverages,
}: PopulationDistributionChartsProps) {
  return (
    <>
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
              <YAxis tickFormatter={CustomTooltipFormatter}>
                <Label
                  value="जनसंख्या"
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: "middle" }}
                />
              </YAxis>
              <Tooltip
                formatter={CustomTooltipFormatter}
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
                label={renderCustomizedPieLabel}
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
              <Tooltip formatter={CustomTooltipFormatter} />
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
                <th className="border p-2 text-right">पुरुष</th>
                <th className="border p-2 text-right">महिला</th>
                <th className="border p-2 text-right">अन्य</th>
              </tr>
            </thead>
            <tbody>
              {wardPopulationData.map((item, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                  <td className="border p-2">{item.ward}</td>
                  <td className="border p-2 text-right">
                    {localizeNumber(item.population.toLocaleString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(item.percentage, "ne")}%
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(item.malePopulation.toLocaleString(), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(
                      item.femalePopulation.toLocaleString(),
                      "ne",
                    )}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(
                      item.otherPopulation.toLocaleString(),
                      "ne",
                    )}
                  </td>
                </tr>
              ))}
              <tr className="font-semibold bg-muted/70">
                <td className="border p-2">जम्मा</td>
                <td className="border p-2 text-right">
                  {localizeNumber(
                    municipalityStats.totalPopulation.toLocaleString(),
                    "ne",
                  )}
                </td>
                <td className="border p-2 text-right">
                  {localizeNumber("100.00", "ne")}%
                </td>
                <td className="border p-2 text-right">
                  {localizeNumber(
                    municipalityStats.malePopulation.toLocaleString(),
                    "ne",
                  )}
                </td>
                <td className="border p-2 text-right">
                  {localizeNumber(
                    municipalityStats.femalePopulation.toLocaleString(),
                    "ne",
                  )}
                </td>
                <td className="border p-2 text-right">
                  {localizeNumber(
                    municipalityStats.otherPopulation.toLocaleString(),
                    "ne",
                  )}
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
    </>
  );
}
