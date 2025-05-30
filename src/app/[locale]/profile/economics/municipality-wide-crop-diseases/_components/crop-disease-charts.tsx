"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { localizeNumber } from "@/lib/utils/localize-number";
import { Card, CardContent } from "@/components/ui/card";
import CropDiseaseBarChart from "./charts/crop-disease-bar-chart";
import CropDiseasePieChart from "./charts/crop-disease-pie-chart";
import DiseasePestComparisonChart from "./charts/disease-pest-comparison-chart";
import { useState } from "react";

interface CropDiseaseChartsProps {
  cropSummary: Array<{
    crop: string;
    cropName: string;
    pestsCount: number;
    diseasesCount: number;
    totalIssues: number;
    majorPests: string[];
    majorDiseases: string[];
  }>;
  totalCrops: number;
  totalPests: number;
  totalDiseases: number;
  totalIssues: number;
  CROP_TYPES: Record<string, string>;
  CROP_COLORS: Record<string, string>;
  mostAffectedCrop: any;
  avgIssuesPerCrop: number;
}

export default function CropDiseaseCharts({
  cropSummary,
  totalCrops,
  totalPests,
  totalDiseases,
  totalIssues,
  CROP_TYPES,
  CROP_COLORS,
  mostAffectedCrop,
  avgIssuesPerCrop,
}: CropDiseaseChartsProps) {
  const [activeTab, setActiveTab] = useState("crop-issues-distribution");

  // Format data for pie charts
  const diseasesPieData = cropSummary.map((item) => ({
    name: item.cropName,
    value: item.diseasesCount,
    percentage: ((item.diseasesCount / totalDiseases) * 100).toFixed(2),
  }));

  const pestsPieData = cropSummary.map((item) => ({
    name: item.cropName,
    value: item.pestsCount,
    percentage: ((item.pestsCount / totalPests) * 100).toFixed(2),
  }));

  // Format data for comparison chart
  const comparisonData = cropSummary.map((item) => ({
    name: item.cropName,
    diseases: item.diseasesCount,
    pests: item.pestsCount,
    total: item.totalIssues,
  }));

  return (
    <div className="mt-12">
      <h2 id="disease-pest-analysis" className="text-2xl font-semibold mb-6">
        रोग र कीट विश्लेषण
      </h2>

      <div className="bg-card rounded-lg p-4 shadow-sm border">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-4">
            <TabsTrigger value="crop-issues-distribution">
              रोग/कीट वितरण
            </TabsTrigger>
            <TabsTrigger value="diseases-vs-pests">रोग बनाम कीट</TabsTrigger>
            <TabsTrigger value="severity-analysis">
              गम्भीरता विश्लेषण
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="crop-issues-distribution"
            className="mt-4 border rounded-lg p-4"
          >
            <h3 className="text-lg font-medium mb-4">
              बाली अनुसार रोग र कीटको वितरण
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="text-center mb-4 font-medium">
                    रोगहरूको वितरण
                  </h4>
                  <div className="h-[350px]">
                    <CropDiseasePieChart
                      pieChartData={diseasesPieData}
                      CROP_TYPES={CROP_TYPES}
                      CROP_COLORS={CROP_COLORS}
                      dataType="रोग"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h4 className="text-center mb-4 font-medium">
                    कीटपतंगहरूको वितरण
                  </h4>
                  <div className="h-[350px]">
                    <CropDiseasePieChart
                      pieChartData={pestsPieData}
                      CROP_TYPES={CROP_TYPES}
                      CROP_COLORS={CROP_COLORS}
                      dataType="कीट"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-muted/50 p-4 rounded-md border">
                <h4 className="font-medium mb-2">प्रमुख तथ्यहरू</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-blue-500">•</span>
                    <span>
                      कुल बालीहरू:{" "}
                      <strong>
                        {localizeNumber(totalCrops.toString(), "ne")}
                      </strong>
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">•</span>
                    <span>
                      कुल रोगहरू:{" "}
                      <strong>
                        {localizeNumber(totalDiseases.toString(), "ne")}
                      </strong>
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500">•</span>
                    <span>
                      कुल कीटहरू:{" "}
                      <strong>
                        {localizeNumber(totalPests.toString(), "ne")}
                      </strong>
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-500">•</span>
                    <span>
                      सबैभन्दा प्रभावित:{" "}
                      <strong>{mostAffectedCrop?.cropName || ""}</strong>
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded-md border">
                <h4 className="font-medium mb-2">गम्भीरता स्तर</h4>
                <div className="space-y-3">
                  {cropSummary.slice(0, 3).map((crop, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{crop.cropName}</span>
                        <span>
                          {localizeNumber(crop.totalIssues.toString(), "ne")}
                        </span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(crop.totalIssues / Math.max(...cropSummary.map((c) => c.totalIssues))) * 100}%`,
                            backgroundColor:
                              CROP_COLORS[crop.crop] || "#3498DB",
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-md border">
                <h4 className="font-medium mb-2">औसत विश्लेषण</h4>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {localizeNumber(avgIssuesPerCrop.toFixed(1), "ne")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    औसत समस्या प्रति बाली
                  </p>
                </div>
                <div className="mt-3 text-sm">
                  <p>
                    प्रत्येक बालीमा औसतमा{" "}
                    {localizeNumber(avgIssuesPerCrop.toFixed(1), "ne")}
                    प्रकारका रोग र कीटका समस्याहरू रहेका छन्।
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="diseases-vs-pests"
            className="mt-4 border rounded-lg p-4"
          >
            <h3 className="text-lg font-medium mb-4">
              रोग र कीटपतंगको तुलनात्मक विश्लेषण
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="h-[400px]">
                    <DiseasePestComparisonChart data={comparisonData} />
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-muted/50 p-4 rounded-md border">
                  <h4 className="font-medium mb-2">रोग बनाम कीट अनुपात</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>रोगहरू</span>
                        <span>
                          {localizeNumber(
                            ((totalDiseases / totalIssues) * 100).toFixed(1),
                            "ne",
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{
                            width: `${(totalDiseases / totalIssues) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>कीटपतंगहरू</span>
                        <span>
                          {localizeNumber(
                            ((totalPests / totalIssues) * 100).toFixed(1),
                            "ne",
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{
                            width: `${(totalPests / totalIssues) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-md border">
                  <h4 className="font-medium mb-2">सबैभन्दा प्रभावित बाली</h4>
                  {mostAffectedCrop && (
                    <div className="text-center">
                      <p className="text-xl font-bold">
                        {mostAffectedCrop.cropName}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {localizeNumber(
                          mostAffectedCrop.diseasesCount.toString(),
                          "ne",
                        )}{" "}
                        रोग +{" "}
                        {localizeNumber(
                          mostAffectedCrop.pestsCount.toString(),
                          "ne",
                        )}{" "}
                        कीट ={" "}
                        {localizeNumber(
                          mostAffectedCrop.totalIssues.toString(),
                          "ne",
                        )}{" "}
                        कुल समस्या
                      </p>
                      <div className="mt-3">
                        <p className="text-xs">प्रमुख रोगहरू:</p>
                        <p className="text-sm">
                          {mostAffectedCrop.majorDiseases
                            .slice(0, 3)
                            .join(", ")}
                        </p>
                        <p className="text-xs mt-2">प्रमुख कीटहरू:</p>
                        <p className="text-sm">
                          {mostAffectedCrop.majorPests.slice(0, 3).join(", ")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="severity-analysis"
            className="mt-4 border rounded-lg p-4"
          >
            <h3 className="text-lg font-medium mb-4">गम्भीरता विश्लेषण</h3>
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="h-[400px]">
                    <CropDiseaseBarChart
                      data={comparisonData}
                      CROP_COLORS={CROP_COLORS}
                      cropSummary={cropSummary}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="bg-muted/50 p-4 rounded-md border">
                <h4 className="font-medium mb-2">गम्भीरता वर्गीकरण</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-red-50 rounded border">
                    <h5 className="font-medium text-red-700">उच्च जोखिम</h5>
                    <p className="text-2xl font-bold text-red-600">
                      {localizeNumber(
                        cropSummary
                          .filter((c) => c.totalIssues >= 8)
                          .length.toString(),
                        "ne",
                      )}
                    </p>
                    <p className="text-sm text-red-600">८+ समस्या</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded border">
                    <h5 className="font-medium text-yellow-700">मध्यम जोखिम</h5>
                    <p className="text-2xl font-bold text-yellow-600">
                      {localizeNumber(
                        cropSummary
                          .filter(
                            (c) => c.totalIssues >= 4 && c.totalIssues < 8,
                          )
                          .length.toString(),
                        "ne",
                      )}
                    </p>
                    <p className="text-sm text-yellow-600">४-७ समस्या</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded border">
                    <h5 className="font-medium text-green-700">कम जोखिम</h5>
                    <p className="text-2xl font-bold text-green-600">
                      {localizeNumber(
                        cropSummary
                          .filter((c) => c.totalIssues < 4)
                          .length.toString(),
                        "ne",
                      )}
                    </p>
                    <p className="text-sm text-green-600">४ भन्दा कम</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
