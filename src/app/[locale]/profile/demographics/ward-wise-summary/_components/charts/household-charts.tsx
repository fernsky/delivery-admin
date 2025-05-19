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
  Line,
  LineChart,
  ReferenceLine,
} from "recharts";

interface HouseholdChartsProps {
  householdTab: string;
  wardHouseholdData: Array<{
    ward: string;
    householdSize: number;
    households: number;
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
}

export default function HouseholdCharts({
  householdTab,
  wardHouseholdData,
  wardPopulationData,
  municipalityStats,
  municipalityAverages,
}: HouseholdChartsProps) {
  return (
    <>
      <TabsContent value="bar" className="p-4">
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={wardHouseholdData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              barSize={30}
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
                labelFormatter={(value) => `${value} - घरधुरी संख्या`}
              />
              <Legend />
              <Bar
                dataKey="households"
                name="घरधुरी संख्या"
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
                aria-label="Bar chart showing household count across wards"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="household-size" className="p-4">
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={wardHouseholdData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="ward"
                scale="point"
                padding={{ left: 10, right: 10 }}
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => Number(value).toFixed(2)}
                labelFormatter={(value) => `${value} - औसत परिवार संख्या`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="householdSize"
                name="औसत परिवार संख्या"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <ReferenceLine
                y={municipalityAverages.averageHouseholdSize}
                stroke="#8884d8"
                strokeDasharray="3 3"
                label={{
                  value: `पालिका औसत: ${municipalityAverages.averageHouseholdSize.toFixed(2)}`,
                  position: "insideBottomRight",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="table" className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" aria-label="Ward-wise household data table">
            <thead>
              <tr className="bg-muted">
                <th className="border p-2 text-left">वडा</th>
                <th className="border p-2 text-right">घरधुरी संख्या</th>
                <th className="border p-2 text-right">औसत परिवार संख्या</th>
                <th className="border p-2 text-right">कुल जनसंख्या</th>
              </tr>
            </thead>
            <tbody>
              {wardHouseholdData.map((item, i) => {
                const population =
                  wardPopulationData.find((w) => w.ward === item.ward)
                    ?.population || 0;

                return (
                  <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                    <td className="border p-2">{item.ward}</td>
                    <td className="border p-2 text-right">
                      {item.households.toLocaleString()}
                    </td>
                    <td className="border p-2 text-right">
                      {item.householdSize.toFixed(2)}
                    </td>
                    <td className="border p-2 text-right">
                      {population.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              <tr className="font-semibold bg-muted/70">
                <td className="border p-2">जम्मा</td>
                <td className="border p-2 text-right">
                  {municipalityStats.totalHouseholds.toLocaleString()}
                </td>
                <td className="border p-2 text-right">
                  {municipalityAverages.averageHouseholdSize.toFixed(2)}
                </td>
                <td className="border p-2 text-right">
                  {municipalityStats.totalPopulation.toLocaleString()}
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
