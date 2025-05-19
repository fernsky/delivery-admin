"use client";

import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

interface GenderRatioChartsProps {
  genderTab: string;
  wardSexRatioData: Array<{
    ward: string;
    sexRatio: number;
    population: number;
  }>;
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
  GENDER_COLORS: Record<string, string>;
  GENDER_NAMES: Record<string, string>;
}

export default function GenderRatioCharts({
  genderTab,
  wardSexRatioData,
  wardPopulationData,
  municipalityStats,
  municipalityAverages,
  GENDER_COLORS,
  GENDER_NAMES,
}: GenderRatioChartsProps) {
  return (
    <>
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
              <Tooltip 
                formatter={(value) => `${Number(value).toFixed(1)}`}
                labelFormatter={(value) => `${value} - लैङ्गिक अनुपात`}
              />
              <Legend />
              <Bar
                dataKey="sexRatio"
                name="लैङ्गिक अनुपात"
                fill="#FF6384"
                radius={[4, 4, 0, 0]}
                aria-label="Bar chart showing gender ratio across wards"
              />
              <ReferenceLine
                y={municipalityAverages.sexRatio}
                stroke="#FF6384"
                strokeDasharray="3 3"
                label={{
                  value: `पालिका औसत: ${municipalityAverages.sexRatio.toFixed(1)}`,
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
          <table className="w-full border-collapse" aria-label="Ward-wise gender ratio data table">
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
    </>
  );
}
