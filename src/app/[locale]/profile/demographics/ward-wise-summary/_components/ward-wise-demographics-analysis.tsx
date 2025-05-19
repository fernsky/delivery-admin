"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";

interface WardData {
  wardNumber: number;
  wardName: string;
  totalPopulation: number;
  malePopulation: number;
  femalePopulation: number;
  otherPopulation: number;
  totalHouseholds: number;
  averageHouseholdSize: number;
  sexRatio: number;
}

interface WardWiseDemographicsAnalysisProps {
  wardData: WardData[];
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

export default function WardWiseDemographicsAnalysis({
  wardData,
  municipalityStats,
  municipalityAverages,
}: WardWiseDemographicsAnalysisProps) {
  // Sort ward data for analysis
  const sortedByPopulation = [...wardData].sort(
    (a, b) => b.totalPopulation - a.totalPopulation,
  );

  const sortedBySexRatio = [...wardData].sort(
    (a, b) => b.sexRatio - a.sexRatio,
  );

  const sortedByHouseholdSize = [...wardData].sort(
    (a, b) => b.averageHouseholdSize - a.averageHouseholdSize,
  );

  const sortedByHouseholds = [...wardData].sort(
    (a, b) => b.totalHouseholds - a.totalHouseholds,
  );

  // Find wards with highest and lowest values
  const highestPopulationWard = sortedByPopulation[0];
  const lowestPopulationWard =
    sortedByPopulation[sortedByPopulation.length - 1];

  const highestSexRatioWard = sortedBySexRatio[0];
  const lowestSexRatioWard = sortedBySexRatio[sortedBySexRatio.length - 1];

  const highestHouseholdSizeWard = sortedByHouseholdSize[0];
  const lowestHouseholdSizeWard =
    sortedByHouseholdSize[sortedByHouseholdSize.length - 1];

  const highestHouseholdsWard = sortedByHouseholds[0];
  const lowestHouseholdsWard =
    sortedByHouseholds[sortedByHouseholds.length - 1];

  // Calculate variance in distribution
  const populationVariance = calculateVariance(
    wardData.map((ward) => ward.totalPopulation),
  );
  const populationRange =
    highestPopulationWard.totalPopulation -
    lowestPopulationWard.totalPopulation;
  const populationStandardDeviation = Math.sqrt(populationVariance);
  const populationCoefficientOfVariation =
    (populationStandardDeviation /
      (municipalityStats.totalPopulation / wardData.length)) *
    100;

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    // Add data to document.body for SEO (will be crawled but not visible to users)
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / खजुरा गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-population",
        municipalityStats.totalPopulation.toString(),
      );
      document.body.setAttribute(
        "data-total-households",
        municipalityStats.totalHouseholds.toString(),
      );
      document.body.setAttribute(
        "data-ward-count",
        wardData.length.toString(),
      );

      // Add highest population ward data
      if (highestPopulationWard) {
        document.body.setAttribute(
          "data-highest-population-ward",
          highestPopulationWard.wardNumber.toString(),
        );
        document.body.setAttribute(
          "data-highest-population-value",
          highestPopulationWard.totalPopulation.toString(),
        );
      }
      
      // Add sex ratio data
      document.body.setAttribute(
        "data-sex-ratio",
        municipalityAverages.sexRatio.toString(),
      );
      
      // Add household size data
      document.body.setAttribute(
        "data-average-household-size",
        municipalityAverages.averageHouseholdSize.toString(),
      );
    }
  }, [wardData, municipalityStats, municipalityAverages, highestPopulationWard]);
  
  return (
    <>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-muted/50">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="text-xs uppercase text-muted-foreground mb-1">
              वडा संख्या
              <span className="sr-only">Ward Count</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              {wardData.length}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              पालिकामा रहेका वडाहरूको कुल संख्या
              <span className="sr-only">Total number of wards in the municipality</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="text-xs uppercase text-muted-foreground mb-1">
              औसत जनसंख्या
              <span className="sr-only">Average Population</span>
            </div>
            <div className="text-2xl font-bold text-green-500">
              {Math.round(
                municipalityStats.totalPopulation / wardData.length,
              ).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              प्रति वडाको औसत जनसंख्या
              <span className="sr-only">Average population per ward</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="text-xs uppercase text-muted-foreground mb-1">
              औसत घरधुरी
              <span className="sr-only">Average Households</span>
            </div>
            <div className="text-2xl font-bold text-blue-500">
              {Math.round(
                municipalityStats.totalHouseholds / wardData.length,
              ).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              प्रति वडामा रहेको औसत घरधुरी संख्या
              <span className="sr-only">Average number of households per ward</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="text-xs uppercase text-muted-foreground mb-1">
              वितरण विविधता
              <span className="sr-only">Distribution Diversity</span>
            </div>
            <div className="text-2xl font-bold text-orange-500">
              {populationCoefficientOfVariation.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              वडागत जनसंख्या वितरणको विविधता सूचक
              <span className="sr-only">Ward population distribution diversity index</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          वडागत अधिकतम र न्यूनतम सूचकहरू
          <span className="sr-only">Ward-wise Maximum and Minimum Indicators</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded border" data-analysis-type="population-distribution">
            <h4 className="font-medium mb-2">जनसंख्या अनुपात</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>सबैभन्दा बढी जनसंख्या:</span>
                <span className="font-medium">
                  {highestPopulationWard.wardName} (
                  {highestPopulationWard.totalPopulation.toLocaleString()} जना)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>सबैभन्दा कम जनसंख्या:</span>
                <span className="font-medium">
                  {lowestPopulationWard.wardName} (
                  {lowestPopulationWard.totalPopulation.toLocaleString()} जना)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>जनसंख्याको दायरा:</span>
                <span className="font-medium">
                  {populationRange.toLocaleString()} जना
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded border" data-analysis-type="gender-ratio">
            <h4 className="font-medium mb-2">लैङ्गिक अनुपात</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>उच्चतम लैङ्गिक अनुपात:</span>
                <span className="font-medium">
                  {highestSexRatioWard.wardName} (
                  {highestSexRatioWard.sexRatio.toFixed(1)})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>न्यूनतम लैङ्गिक अनुपात:</span>
                <span className="font-medium">
                  {lowestSexRatioWard.wardName} (
                  {lowestSexRatioWard.sexRatio.toFixed(1)})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>पालिकाको औसत:</span>
                <span className="font-medium">
                  {municipalityAverages.sexRatio.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded border" data-analysis-type="household-count">
            <h4 className="font-medium mb-2">घरधुरी संख्या</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>सबैभन्दा बढी घरधुरी:</span>
                <span className="font-medium">
                  {highestHouseholdsWard.wardName} (
                  {highestHouseholdsWard.totalHouseholds.toLocaleString()})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>सबैभन्दा कम घरधुरी:</span>
                <span className="font-medium">
                  {lowestHouseholdsWard.wardName} (
                  {lowestHouseholdsWard.totalHouseholds.toLocaleString()})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>औसत घरधुरी प्रति वडा:</span>
                <span className="font-medium">
                  {Math.round(
                    municipalityStats.totalHouseholds / wardData.length,
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded border" data-analysis-type="family-size">
            <h4 className="font-medium mb-2">परिवार संख्या</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>सबैभन्दा बढी परिवार संख्या:</span>
                <span className="font-medium">
                  {highestHouseholdSizeWard.wardName} (
                  {highestHouseholdSizeWard.averageHouseholdSize.toFixed(2)})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>सबैभन्दा कम परिवार संख्या:</span>
                <span className="font-medium">
                  {lowestHouseholdSizeWard.wardName} (
                  {lowestHouseholdSizeWard.averageHouseholdSize.toFixed(2)})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>पालिकाको औसत:</span>
                <span className="font-medium">
                  {municipalityAverages.averageHouseholdSize.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          वडागत विश्लेषण
          <span className="sr-only">Ward-wise Analysis</span>
        </h3>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            पालिकाको वडागत जनसंख्या वितरण विश्लेषणबाट निम्न निष्कर्षहरू निकाल्न
            सकिन्छ:
          </p>

          <ul itemScope itemType="https://schema.org/ItemList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <meta itemProp="position" content="1" />
              <div itemProp="item">
                <strong>जनसंख्या वितरण:</strong> पालिकाभित्र वडाहरू बीच जनसंख्याको
                विविधता सूचक {populationCoefficientOfVariation.toFixed(1)}% रहेको
                छ, जुन{" "}
                {populationCoefficientOfVariation > 30
                  ? "उच्च"
                  : populationCoefficientOfVariation > 15
                    ? "मध्यम"
                    : "कम"}{" "}
                स्तरको असमानता देखाउँछ。
              </div>
            </li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <meta itemProp="position" content="2" />
              <div itemProp="item">
                <strong>लैङ्गिक अनुपात:</strong> पालिकाका विभिन्न वडाहरूमा लैङ्गिक
                अनुपात {lowestSexRatioWard.sexRatio.toFixed(1)} देखि{" "}
                {highestSexRatioWard.sexRatio.toFixed(1)} सम्म रहेको छ। यस
                अनुपातमा वडागत भिन्नता रहेको छ。
              </div>
            </li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <meta itemProp="position" content="3" />
              <div itemProp="item">
                <strong>घरधुरी:</strong> {highestHouseholdsWard.wardName} मा
                सबैभन्दा बढी घरधुरी (
                {highestHouseholdsWard.totalHouseholds.toLocaleString()}) छन्,
                जबकि {lowestHouseholdsWard.wardName} मा सबैभन्दा कम घरधुरी (
                {lowestHouseholdsWard.totalHouseholds.toLocaleString()}) रहेका
                छन्。
              </div>
            </li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <meta itemProp="position" content="4" />
              <div itemProp="item">
                <strong>परिवार संख्या:</strong> औसत परिवार संख्यामा पनि वडा अनुसार
                भिन्नता देखिन्छ, जुन{" "}
                {lowestHouseholdSizeWard.averageHouseholdSize.toFixed(2)} देखि{" "}
                {highestHouseholdSizeWard.averageHouseholdSize.toFixed(2)} सम्म
                रहेको छ。
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          नीतिगत सुझाव
          <span className="sr-only">Policy Recommendations</span>
        </h3>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            वडागत विश्लेषणका आधारमा निम्न नीतिगत सुझावहरू प्रस्तुत गरिएका छन्:
          </p>

          <ul>
            <li>
              <strong>समतामूलक विकास:</strong> {highestPopulationWard.wardName}{" "}
              र {lowestPopulationWard.wardName} बीचको जनसंख्या असमानतालाई
              सम्बोधन गर्न विकास योजना र बजेट विनियोजनमा समतामूलक दृष्टिकोण
              अपनाउने。
            </li>
            <li>
              <strong>लैङ्गिक समानता:</strong> न्यून लैङ्गिक अनुपात भएका
              वडाहरूमा लैङ्गिक समानता सम्बन्धी विशेष कार्यक्रमहरू सञ्चालन गर्ने。
            </li>
            <li>
              <strong>घरधुरी सर्वेक्षण:</strong> उच्च परिवार संख्या भएका
              वडाहरूमा परिवार नियोजन र सचेतना कार्यक्रम सञ्चालन गर्ने。
            </li>
            <li>
              <strong>वडागत योजना:</strong> प्रत्येक वडाको विशिष्ट जनसांख्यिकी
              विशेषतालाई ध्यानमा राखेर वडागत विकास योजना तर्जुमा गर्ने。
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          थप जानकारी
          <span className="sr-only">Additional Information</span>
        </h3>
        <p>
          वडागत जनसांख्यिकी विवरण सम्बन्धी थप जानकारी वा विस्तृत तथ्याङ्कको
          लागि, कृपया{" "}
          <Link href="/contact" className="text-primary hover:underline">
            हामीलाई सम्पर्क
          </Link>{" "}
          गर्नुहोस् वा{" "}
          <Link
            href="/profile/demographics/summary"
            className="text-primary hover:underline"
          >
            जनसांख्यिकी सारांश
          </Link>{" "}
          खण्डमा हेर्नुहोस्。
        </p>
      </div>
    </>
  );
}

// Helper function to calculate variance
function calculateVariance(data: number[]): number {
  const n = data.length;
  if (n === 0) return 0;

  const mean = data.reduce((sum, value) => sum + value, 0) / n;
  const squaredDiffs = data.map((value) => Math.pow(value - mean, 2));
  const variance = squaredDiffs.reduce((sum, value) => sum + value, 0) / n;

  return variance;
}
