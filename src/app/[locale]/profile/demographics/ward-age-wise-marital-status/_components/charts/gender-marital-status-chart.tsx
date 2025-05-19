"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

// Define gender colors for consistency
const GENDER_COLORS = {
  male: "#36A2EB", // Blue
  female: "#FF6384", // Pink/Red
  other: "#FFCD56", // Yellow
};

interface GenderMaritalStatusChartProps {
  genderWiseData: Array<{
    status: string;
    statusName: string;
    male: number;
    female: number;
    other: number;
    total: number;
  }>;
}

export default function GenderMaritalStatusChart({
  genderWiseData,
}: GenderMaritalStatusChartProps) {
  const [chartType, setChartType] = useState<string>("horizontal");

  // Sort data by total population
  const sortedData = [...genderWiseData]
    .sort((a, b) => b.total - a.total);

  // Prepare gender distribution data for pie charts
  const maleDistribution = genderWiseData.map(item => ({
    name: item.statusName,
    value: item.male,
  }));
  
  const femaleDistribution = genderWiseData.map(item => ({
    name: item.statusName,
    value: item.female,
  }));
  
  const otherDistribution = genderWiseData.map(item => ({
    name: item.statusName,
    value: item.other,
  }));

  // Calculate totals for percentages
  const totalMale = genderWiseData.reduce((sum, item) => sum + item.male, 0);
  const totalFemale = genderWiseData.reduce((sum, item) => sum + item.female, 0);
  const totalOther = genderWiseData.reduce((sum, item) => sum + item.other, 0);

  return (
    <div className="space-y-4">
      <Tabs value={chartType} onValueChange={setChartType}>
        <TabsList className="grid grid-cols-3 w-[400px] mx-auto mb-4">
          <TabsTrigger value="horizontal">क्षैतिज बार</TabsTrigger>
          <TabsTrigger value="vertical">ठाडो बार</TabsTrigger>
          <TabsTrigger value="gender-dist">लैंगिक वितरण</TabsTrigger>
        </TabsList>

        <TabsContent value="horizontal" className="h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              margin={{ top: 20, right: 30, left: 30, bottom: 40 }}
              barSize={30}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="statusName" />
              <YAxis />
              <Tooltip formatter={(value) => Number(value).toLocaleString()} />
              <Legend />
              <Bar
                dataKey="male"
                name="पुरुष"
                fill={GENDER_COLORS.male}
              />
              <Bar
                dataKey="female"
                name="महिला"
                fill={GENDER_COLORS.female}
              />
              <Bar
                dataKey="other"
                name="अन्य"
                fill={GENDER_COLORS.other}
              />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="vertical" className="h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              margin={{ top: 20, right: 30, left: 120, bottom: 40 }}
              layout="vertical"
              barSize={25}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
              <XAxis type="number" />
              <YAxis 
                dataKey="statusName" 
                type="category" 
                width={100} 
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(value) => Number(value).toLocaleString()} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              <Bar
                dataKey="male"
                name="पुरुष"
                stackId="a"
                fill={GENDER_COLORS.male}
              />
              <Bar
                dataKey="female"
                name="महिला"
                stackId="a"
                fill={GENDER_COLORS.female}
              />
              <Bar
                dataKey="other"
                name="अन्य"
                stackId="a"
                fill={GENDER_COLORS.other}
              />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="gender-dist" className="h-[450px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-center font-medium mb-2">पुरुष</h4>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={maleDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, value }) => 
                        totalMale > 0 ? `${name}: ${((value / totalMale) * 100).toFixed(1)}%` : ""
                      }
                    >
                      {maleDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`hsl(210, ${80 - (index * 5)}%, ${40 + (index * 5)}%)`} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [
                        `${value.toLocaleString()} (${totalMale > 0 ? ((value / totalMale) * 100).toFixed(1) : 0}%)`,
                        "पुरुष"
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4 className="text-center font-medium mb-2">महिला</h4>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={femaleDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, value }) => 
                        totalFemale > 0 ? `${name}: ${((value / totalFemale) * 100).toFixed(1)}%` : ""
                      }
                    >
                      {femaleDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`hsl(350, ${80 - (index * 5)}%, ${40 + (index * 5)}%)`} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [
                        `${value.toLocaleString()} (${totalFemale > 0 ? ((value / totalFemale) * 100).toFixed(1) : 0}%)`,
                        "महिला"
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4 className="text-center font-medium mb-2">अन्य</h4>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={otherDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, value }) => 
                        totalOther > 0 ? `${name}: ${((value / totalOther) * 100).toFixed(1)}%` : ""
                      }
                    >
                      {otherDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`hsl(45, ${80 - (index * 5)}%, ${40 + (index * 5)}%)`} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [
                        `${value.toLocaleString()} (${totalOther > 0 ? ((value / totalOther) * 100).toFixed(1) : 0}%)`,
                        "अन्य"
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <p className="text-sm text-muted-foreground text-center">
        लिङ्ग अनुसार वैवाहिक स्थितिको वितरण चार्ट
      </p>
    </div>
  );
}
