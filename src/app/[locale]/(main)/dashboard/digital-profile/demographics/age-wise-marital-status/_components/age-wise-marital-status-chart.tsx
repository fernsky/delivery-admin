"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getAgeGroupDisplayName,
  getMaritalStatusDisplayName,
} from "@/server/api/routers/profile/demographics/age-wise-marital-status.schema";

interface WardWiseMaritalStatusData {
  id: string;
  wardId: string;
  wardNumber?: number;
  wardName?: string | null;
  ageGroup: string;
  maritalStatus: string;
  population?: number | null;
  malePopulation?: number | null;
  femalePopulation?: number | null;
  otherPopulation?: number | null;
}

interface WardWiseMaritalStatusChartProps {
  data: WardWiseMaritalStatusData[];
}

export default function AgeWiseMaritalStatusChart({
  data,
}: WardWiseMaritalStatusChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>("population");
  const [selectedWard, setSelectedWard] = useState<string>("all");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("all");
  const [selectedView, setSelectedView] = useState<string>("maritalStatus");

  // Get unique wards
  const uniqueWards = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.wardId))).sort();
  }, [data]);

  // Get ward numbers for display
  const wardIdToNumber = useMemo(() => {
    return data.reduce(
      (acc, item) => {
        if (item.wardId && item.wardNumber) {
          acc[item.wardId] = item.wardNumber;
        }
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [data]);

  // Get unique age groups
  const uniqueAgeGroups = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.ageGroup))).sort();
  }, [data]);

  // Get unique marital statuses
  const uniqueMaritalStatuses = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.maritalStatus))).sort();
  }, [data]);

  // Filter by selected ward and age group
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return (
        (selectedWard === "all" || item.wardId === selectedWard) &&
        (selectedAgeGroup === "all" || item.ageGroup === selectedAgeGroup)
      );
    });
  }, [data, selectedWard, selectedAgeGroup]);

  // Prepare chart data based on the selected view
  const chartData = useMemo(() => {
    if (selectedView === "maritalStatus") {
      // Group by marital status
      const grouped = uniqueMaritalStatuses.map((status) => {
        const statusData = filteredData.filter(
          (item) => item.maritalStatus === status,
        );

        // Calculate total for this marital status
        let total = 0;
        let male = 0;
        let female = 0;
        let other = 0;

        statusData.forEach((item) => {
          total += item.population || 0;
          male += item.malePopulation || 0;
          female += item.femalePopulation || 0;
          other += item.otherPopulation || 0;
        });

        return {
          id: status,
          label: getMaritalStatusDisplayName(status as any),
          value:
            selectedMetric === "population"
              ? total
              : selectedMetric === "malePopulation"
                ? male
                : selectedMetric === "femalePopulation"
                  ? female
                  : other,
          color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
        };
      });

      return grouped.filter((item) => item.value > 0);
    } else {
      // Group by age group
      const grouped = uniqueAgeGroups.map((age) => {
        const ageData = filteredData.filter((item) => item.ageGroup === age);

        // Calculate total for this age group
        let total = 0;
        let male = 0;
        let female = 0;
        let other = 0;

        ageData.forEach((item) => {
          total += item.population || 0;
          male += item.malePopulation || 0;
          female += item.femalePopulation || 0;
          other += item.otherPopulation || 0;
        });

        return {
          id: age,
          label: getAgeGroupDisplayName(age as any),
          value:
            selectedMetric === "population"
              ? total
              : selectedMetric === "malePopulation"
                ? male
                : selectedMetric === "femalePopulation"
                  ? female
                  : other,
          color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
        };
      });

      return grouped.filter((item) => item.value > 0);
    }
  }, [
    filteredData,
    selectedView,
    selectedMetric,
    uniqueMaritalStatuses,
    uniqueAgeGroups,
  ]);

  // Prepare bar chart data
  const barChartData = useMemo(() => {
    if (selectedView === "maritalStatus") {
      if (selectedWard !== "all") {
        // For a single ward, show all marital statuses
        return uniqueMaritalStatuses
          .map((status, index) => {
            const statusData = filteredData.filter(
              (item) => item.maritalStatus === status,
            );

            const total = statusData.reduce(
              (sum, item) =>
                sum +
                ((item[selectedMetric as keyof typeof item] as number) || 0),
              0,
            );

            // Generate consistent colors based on index
            const hue = (index * 137.5) % 360;

            return {
              category: getMaritalStatusDisplayName(status as any),
              [selectedMetric]: total,
              color: `hsl(${hue}, 70%, 50%)`,
            };
          })
          .filter((item) => Number(item[selectedMetric]) > 0);
      } else {
        // For all wards, group by ward
        return uniqueWards
          .map((wardId, index) => {
            const wardData = filteredData.filter(
              (item) => item.wardId === wardId,
            );

            // Calculate ward total
            const total = wardData.reduce(
              (sum, item) =>
                sum +
                ((item[selectedMetric as keyof typeof item] as number) || 0),
              0,
            );

            // Generate consistent colors based on ward number
            const wardNumber = wardIdToNumber[wardId] || parseInt(wardId);
            const hue = (wardNumber * 30) % 360;

            return {
              category: `वडा ${wardNumber}`,
              [selectedMetric]: total,
              color: `hsl(${hue}, 70%, 50%)`,
            };
          })
          .filter((item) => Number(item[selectedMetric]) > 0);
      }
    } else {
      // Age group view
      if (selectedWard !== "all") {
        // For a single ward, show all age groups
        return uniqueAgeGroups
          .map((age, index) => {
            const ageData = filteredData.filter(
              (item) => item.ageGroup === age,
            );

            const total = ageData.reduce(
              (sum, item) =>
                sum +
                ((item[selectedMetric as keyof typeof item] as number) || 0),
              0,
            );

            // Generate consistent colors based on index
            const hue = (index * 137.5) % 360;

            return {
              category: getAgeGroupDisplayName(age as any),
              [selectedMetric]: total,
              color: `hsl(${hue}, 70%, 50%)`,
            };
          })
          .filter((item) => Number(item[selectedMetric]) > 0);
      } else {
        // For all wards, group by ward
        return uniqueWards
          .map((wardId, index) => {
            const wardData = filteredData.filter(
              (item) => item.wardId === wardId,
            );

            // Calculate ward total
            const total = wardData.reduce(
              (sum, item) =>
                sum +
                ((item[selectedMetric as keyof typeof item] as number) || 0),
              0,
            );

            // Generate consistent colors based on ward number
            const wardNumber = wardIdToNumber[wardId] || parseInt(wardId);
            const hue = (wardNumber * 30) % 360;

            return {
              category: `वडा ${wardNumber}`,
              [selectedMetric]: total,
              color: `hsl(${hue}, 70%, 50%)`,
            };
          })
          .filter((item) => Number(item[selectedMetric]) > 0);
      }
    }
  }, [
    filteredData,
    selectedView,
    selectedMetric,
    selectedWard,
    uniqueMaritalStatuses,
    uniqueAgeGroups,
    uniqueWards,
    wardIdToNumber,
  ]);

  // Define metrics options
  const metrics = [
    { value: "population", label: "जम्मा जनसंख्या" },
    { value: "malePopulation", label: "पुरुष जनसंख्या" },
    { value: "femalePopulation", label: "महिला जनसंख्या" },
    { value: "otherPopulation", label: "अन्य जनसंख्या" },
  ];

  // Get human-readable metric name
  const getMetricLabel = () => {
    return (
      metrics.find((m) => m.value === selectedMetric)?.label || selectedMetric
    );
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          कुनै डाटा उपलब्ध छैन। पहिले वडा वैवाहिक स्थिति जनसंख्या डाटा
          थप्नुहोस्।
        </p>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>वडा अनुसार वैवाहिक स्थिति जनसंख्या विश्लेषण</CardTitle>
        <CardDescription>
          वडा, उमेर समूह र वैवाहिक स्थिति अनुसार जनसंख्या डाटा हेर्नुहोस्
        </CardDescription>

        <div className="flex flex-wrap gap-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              मेट्रिक चयन गर्नुहोस्:
            </label>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="मेट्रिक चयन गर्नुहोस्" />
              </SelectTrigger>
              <SelectContent>
                {metrics.map((metric) => (
                  <SelectItem key={metric.value} value={metric.value}>
                    {metric.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              वडा चयन गर्नुहोस्:
            </label>
            <Select value={selectedWard} onValueChange={setSelectedWard}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="वडा चयन गर्नुहोस्" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सबै वडा</SelectItem>
                {uniqueWards.map((wardId) => (
                  <SelectItem key={wardId} value={wardId}>
                    वडा {wardIdToNumber[wardId] || wardId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              उमेर समूह चयन गर्नुहोस्:
            </label>
            <Select
              value={selectedAgeGroup}
              onValueChange={setSelectedAgeGroup}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="उमेर समूह चयन गर्नुहोस्" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सबै उमेर समूह</SelectItem>
                {uniqueAgeGroups.map((age) => (
                  <SelectItem key={age} value={age}>
                    {getAgeGroupDisplayName(age as any)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              दृश्य चयन गर्नुहोस्:
            </label>
            <Select value={selectedView} onValueChange={setSelectedView}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="दृश्य चयन गर्नुहोस्" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maritalStatus">
                  वैवाहिक स्थिति अनुसार
                </SelectItem>
                <SelectItem value="ageGroup">उमेर समूह अनुसार</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="bar" className="mt-2">
          <TabsList>
            <TabsTrigger value="bar">बार चार्ट</TabsTrigger>
            <TabsTrigger value="pie">पाई चार्ट</TabsTrigger>
          </TabsList>

          <TabsContent value="bar">
            <div className="h-96 border rounded-lg p-4 bg-white">
              <ResponsiveBar
                data={barChartData}
                keys={[selectedMetric]}
                indexBy="category"
                margin={{ top: 50, right: 130, bottom: 80, left: 60 }}
                padding={0.3}
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                colors={({ data }) => String(data.color)}
                borderColor={{
                  from: "color",
                  modifiers: [["darker", 1.6]],
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 45,
                  legend:
                    selectedView === "maritalStatus"
                      ? selectedWard !== "all"
                        ? "वैवाहिक स्थिति"
                        : "वडा"
                      : selectedWard !== "all"
                        ? "उमेर समूह"
                        : "वडा",
                  legendPosition: "middle",
                  legendOffset: 50,
                  truncateTickAt: 0,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: getMetricLabel(),
                  legendPosition: "middle",
                  legendOffset: -40,
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{
                  from: "color",
                  modifiers: [["darker", 1.6]],
                }}
                legends={[
                  {
                    dataFrom: "keys",
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: "left-to-right",
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemOpacity: 1,
                        },
                      },
                    ],
                  },
                ]}
              />
            </div>
          </TabsContent>

          <TabsContent value="pie">
            <div className="h-96 border rounded-lg p-4 bg-white">
              <ResponsivePie
                data={chartData}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{
                  from: "color",
                  modifiers: [["darker", 0.2]],
                }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: "color" }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                  from: "color",
                  modifiers: [["darker", 2]],
                }}
                defs={[
                  {
                    id: "dots",
                    type: "patternDots",
                    background: "inherit",
                    color: "rgba(255, 255, 255, 0.3)",
                    size: 4,
                    padding: 1,
                    stagger: true,
                  },
                  {
                    id: "lines",
                    type: "patternLines",
                    background: "inherit",
                    color: "rgba(255, 255, 255, 0.3)",
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10,
                  },
                ]}
                legends={[
                  {
                    anchor: "bottom",
                    direction: "row",
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: "#999",
                    itemDirection: "left-to-right",
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: "circle",
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemTextColor: "#000",
                        },
                      },
                    ],
                  },
                ]}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
