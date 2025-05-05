"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo } from "react";

interface AgeAnalysisProps {
  overallSummaryByAge: Array<{
    ageGroup: string;
    ageGroupName: string;
    total: number;
    male: number;
    female: number;
    other: number;
  }>;
  totalPopulation: number;
  wardWiseData: Array<Record<string, any>>;
  AGE_GROUP_NAMES: Record<string, string>;
  AGE_CATEGORIES: Record<string, string[]>;
}

export default function AgeAnalysisSection({
  overallSummaryByAge,
  totalPopulation,
  wardWiseData,
  AGE_GROUP_NAMES,
  AGE_CATEGORIES,
}: AgeAnalysisProps) {
  // Calculate demographic indicators
  const demographicIndicators = useMemo(() => {
    const childrenPopulation = overallSummaryByAge
      .filter((item) => AGE_CATEGORIES.CHILDREN.includes(item.ageGroup))
      .reduce((sum, item) => sum + item.total, 0);

    const youthPopulation = overallSummaryByAge
      .filter((item) => AGE_CATEGORIES.YOUTH.includes(item.ageGroup))
      .reduce((sum, item) => sum + item.total, 0);

    const adultPopulation = overallSummaryByAge
      .filter((item) => AGE_CATEGORIES.ADULT.includes(item.ageGroup))
      .reduce((sum, item) => sum + item.total, 0);

    const elderlyPopulation = overallSummaryByAge
      .filter((item) => AGE_CATEGORIES.ELDERLY.includes(item.ageGroup))
      .reduce((sum, item) => sum + item.total, 0);

    const workingAgePopulation = youthPopulation + adultPopulation;
    const dependentPopulation = childrenPopulation + elderlyPopulation;

    // Calculate dependency ratio
    let dependencyRatio = 0;
    if (workingAgePopulation > 0) {
      dependencyRatio = (dependentPopulation / workingAgePopulation) * 100;
    }

    // Calculate child dependency ratio
    let childDependencyRatio = 0;
    if (workingAgePopulation > 0) {
      childDependencyRatio = (childrenPopulation / workingAgePopulation) * 100;
    }

    // Calculate old-age dependency ratio
    let oldAgeDependencyRatio = 0;
    if (workingAgePopulation > 0) {
      oldAgeDependencyRatio = (elderlyPopulation / workingAgePopulation) * 100;
    }

    // Calculate median age (rough approximation)
    let cumulativePopulation = 0;
    let medianAgeGroup = "";
    const halfPopulation = totalPopulation / 2;

    for (const ageData of overallSummaryByAge) {
      cumulativePopulation += ageData.total;
      if (cumulativePopulation >= halfPopulation && !medianAgeGroup) {
        medianAgeGroup = ageData.ageGroup;
        break;
      }
    }

    // Estimate median age from age group (rough approximation)
    const medianAgeEstimate = getMedianAgeEstimate(medianAgeGroup);

    return {
      childrenPercentage: (childrenPopulation / totalPopulation) * 100,
      youthPercentage: (youthPopulation / totalPopulation) * 100,
      adultPercentage: (adultPopulation / totalPopulation) * 100,
      elderlyPercentage: (elderlyPopulation / totalPopulation) * 100,
      dependencyRatio,
      childDependencyRatio,
      oldAgeDependencyRatio,
      medianAge: medianAgeEstimate,
    };
  }, [overallSummaryByAge, totalPopulation, AGE_CATEGORIES]);

  // Helper function to estimate median age from age group
  const getMedianAgeEstimate = (ageGroup: string): number => {
    switch (ageGroup) {
      case "AGE_0_4":
        return 2.5;
      case "AGE_5_9":
        return 7.5;
      case "AGE_10_14":
        return 12.5;
      case "AGE_15_19":
        return 17.5;
      case "AGE_20_24":
        return 22.5;
      case "AGE_25_29":
        return 27.5;
      case "AGE_30_34":
        return 32.5;
      case "AGE_35_39":
        return 37.5;
      case "AGE_40_44":
        return 42.5;
      case "AGE_45_49":
        return 47.5;
      case "AGE_50_54":
        return 52.5;
      case "AGE_55_59":
        return 57.5;
      case "AGE_60_64":
        return 62.5;
      case "AGE_65_69":
        return 67.5;
      case "AGE_70_74":
        return 72.5;
      case "AGE_75_AND_ABOVE":
        return 80;
      default:
        return 30;
    }
  };

  return (
    <>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-muted/50">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="text-xs uppercase text-muted-foreground mb-1">
              बाल जनसंख्या (०-१४)
            </div>
            <div className="text-2xl font-bold text-primary">
              {demographicIndicators.childrenPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">कुल जनसंख्याको</div>
            <div className="w-full bg-muted h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${demographicIndicators.childrenPercentage}%`,
                }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="text-xs uppercase text-muted-foreground mb-1">
              युवा जनसंख्या (१५-२९)
            </div>
            <div className="text-2xl font-bold text-green-500">
              {demographicIndicators.youthPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">कुल जनसंख्याको</div>
            <div className="w-full bg-muted h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-green-500"
                style={{ width: `${demographicIndicators.youthPercentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="text-xs uppercase text-muted-foreground mb-1">
              वयस्क जनसंख्या (३०-५९)
            </div>
            <div className="text-2xl font-bold text-blue-500">
              {demographicIndicators.adultPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">कुल जनसंख्याको</div>
            <div className="w-full bg-muted h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${demographicIndicators.adultPercentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="text-xs uppercase text-muted-foreground mb-1">
              वृद्ध जनसंख्या (६० माथि)
            </div>
            <div className="text-2xl font-bold text-orange-500">
              {demographicIndicators.elderlyPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">कुल जनसंख्याको</div>
            <div className="w-full bg-muted h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-orange-500"
                style={{ width: `${demographicIndicators.elderlyPercentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">जनसांख्यिकीय सूचकहरू</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">जनसांख्यिक निर्भरता अनुपात</h4>
            <p className="text-3xl font-bold">
              {demographicIndicators.dependencyRatio.toFixed(1)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              प्रति १०० कार्यशील उमेरका व्यक्तिमा{" "}
              {demographicIndicators.dependencyRatio.toFixed(1)} जना आश्रित
              व्यक्ति
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">बाल निर्भरता अनुपात</h4>
            <p className="text-3xl font-bold">
              {demographicIndicators.childDependencyRatio.toFixed(1)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              प्रति १०० कार्यशील उमेरका व्यक्तिमा{" "}
              {demographicIndicators.childDependencyRatio.toFixed(1)} जना
              बालबालिका
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">वृद्ध निर्भरता अनुपात</h4>
            <p className="text-3xl font-bold">
              {demographicIndicators.oldAgeDependencyRatio.toFixed(1)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              प्रति १०० कार्यशील उमेरका व्यक्तिमा{" "}
              {demographicIndicators.oldAgeDependencyRatio.toFixed(1)} जना वृद्ध
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">अनुमानित मध्यम उमेर</h4>
            <p className="text-3xl font-bold">
              {Math.round(demographicIndicators.medianAge)} वर्ष
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              जनसंख्याको मध्यम उमेर
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">युवा जनसंख्या अनुपात</h4>
            <p className="text-3xl font-bold">
              {demographicIndicators.youthPercentage.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              जनसांख्यिकीय लाभांशको संकेत
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">कार्यशील उमेर जनसंख्या</h4>
            <p className="text-3xl font-bold">
              {(
                demographicIndicators.youthPercentage +
                demographicIndicators.adultPercentage
              ).toFixed(1)}
              %
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              कुल जनसंख्याको प्रतिशत (१५-५९ वर्ष)
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          जनसांख्यिकीय प्रवृत्ति र सुझाव
        </h3>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>पालिकाको जनसंख्या संरचनाले निम्न नीतिगत निर्देशन गर्दछ:</p>

          <ul>
            <li>
              <strong>
                बाल जनसंख्या (
                {demographicIndicators.childrenPercentage.toFixed(1)}%):
              </strong>{" "}
              शिक्षा, पोषण र बाल स्वास्थ्य सेवामा लगानी बढाउने
            </li>
            <li>
              <strong>
                युवा जनसंख्या (
                {demographicIndicators.youthPercentage.toFixed(1)}%):
              </strong>{" "}
              रोजगारी सिर्जना, सीप विकास र उद्यमशीलता प्रवर्द्धन
            </li>
            <li>
              <strong>
                वृद्ध जनसंख्या (
                {demographicIndicators.elderlyPercentage.toFixed(1)}%):
              </strong>{" "}
              सामाजिक सुरक्षा, स्वास्थ्य सेवा र जेष्ठ नागरिक हेरचाह कार्यक्रम
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">थप जानकारी</h3>
        <p>
          पालिकाको उमेर र लिङ्ग वितरण सम्बन्धी थप जानकारी वा विस्तृत तथ्याङ्कको
          लागि, कृपया{" "}
          <Link href="/contact" className="text-primary hover:underline">
            हामीलाई सम्पर्क
          </Link>{" "}
          गर्नुहोस् वा{" "}
          <Link
            href="/profile/demographics"
            className="text-primary hover:underline"
          >
            जनसांख्यिकी तथ्याङ्क
          </Link>{" "}
          खण्डमा हेर्नुहोस्।
        </p>
      </div>
    </>
  );
}
