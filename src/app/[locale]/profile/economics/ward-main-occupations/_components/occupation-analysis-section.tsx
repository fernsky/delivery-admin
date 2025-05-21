"use client";

import Link from "next/link";
import { useEffect } from "react";

interface OccupationAnalysisSectionProps {
  overallSummary: Array<{
    occupation: string;
    occupationName: string;
    population: number;
  }>;
  totalPopulation: number;
  OCCUPATION_NAMES: Record<string, string>;
  OCCUPATION_NAMES_EN: Record<string, string>;
}

export default function OccupationAnalysisSection({
  overallSummary,
  totalPopulation,
  OCCUPATION_NAMES,
  OCCUPATION_NAMES_EN,
}: OccupationAnalysisSectionProps) {
  const OCCUPATION_COLORS = {
    GOVERNMENTAL_JOB: "#FF5733", // Red-orange
    NON_GOVERNMENTAL_JOB: "#FFC300", // Yellow
    LABOUR: "#36A2EB", // Blue
    FOREIGN_EMPLOYMENT: "#4BC0C0", // Cyan
    BUSINESS: "#9966FF", // Purple
    OTHER_EMPLOYMENT: "#3CB371", // Green
    STUDENT: "#FF6384", // Pink
    HOUSEHOLDER: "#FFCE56", // Light orange
    OTHER_UNEMPLOYMENT: "#607D8B", // Grey
    INDUSTRY: "#E91E63", // Magenta
    ANIMAL_HUSBANDRY: "#8BC34A", // Light green
    OTHER_SELF_EMPLOYMENT: "#FF9F40", // Orange
  };

  // Calculate employment categories
  const employedCategories = [
    "GOVERNMENTAL_JOB",
    "NON_GOVERNMENTAL_JOB",
    "LABOUR",
    "FOREIGN_EMPLOYMENT",
    "BUSINESS",
    "INDUSTRY",
    "ANIMAL_HUSBANDRY",
    "OTHER_SELF_EMPLOYMENT",
    "OTHER_EMPLOYMENT",
  ];

  const unemployedCategories = ["STUDENT", "HOUSEHOLDER", "OTHER_UNEMPLOYMENT"];

  const employedPopulation = overallSummary
    .filter((item) => employedCategories.includes(item.occupation))
    .reduce((sum, item) => sum + item.population, 0);

  const unemployedPopulation = overallSummary
    .filter((item) => unemployedCategories.includes(item.occupation))
    .reduce((sum, item) => sum + item.population, 0);

  const employmentRate = ((employedPopulation / totalPopulation) * 100).toFixed(
    2,
  );
  const unemploymentRate = (
    (unemployedPopulation / totalPopulation) *
    100
  ).toFixed(2);

  // Calculate top two occupations ratio if both exist
  const topOccupation = overallSummary[0];
  const secondOccupation = overallSummary[1];

  const topTwoOccupationRatio =
    topOccupation && secondOccupation && secondOccupation.population > 0
      ? (topOccupation.population / secondOccupation.population).toFixed(2)
      : "N/A";

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
        totalPopulation.toString(),
      );

      // Add main occupation data
      if (topOccupation) {
        const occupationNameEN =
          OCCUPATION_NAMES_EN[topOccupation.occupation] ||
          topOccupation.occupation;
        document.body.setAttribute(
          "data-main-occupation",
          `${occupationNameEN} / ${topOccupation.occupationName}`,
        );
        document.body.setAttribute(
          "data-main-occupation-population",
          topOccupation.population.toString(),
        );
        document.body.setAttribute(
          "data-main-occupation-percentage",
          ((topOccupation.population / totalPopulation) * 100).toFixed(2),
        );
      }

      // Add employment/unemployment data
      document.body.setAttribute("data-employment-rate", employmentRate);
      document.body.setAttribute("data-unemployment-rate", unemploymentRate);
      document.body.setAttribute(
        "data-employed-population",
        employedPopulation.toString(),
      );
      document.body.setAttribute(
        "data-unemployed-population",
        unemployedPopulation.toString(),
      );
    }
  }, [
    overallSummary,
    totalPopulation,
    topOccupation,
    employmentRate,
    unemploymentRate,
    employedPopulation,
    unemployedPopulation,
    OCCUPATION_NAMES_EN,
  ]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {overallSummary.slice(0, 6).map((item, index) => {
          // Calculate percentage
          const percentage = (
            (item.population / totalPopulation) *
            100
          ).toFixed(2);

          return (
            <div
              key={index}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
              // Add data attributes for SEO crawlers
              data-occupation={`${OCCUPATION_NAMES_EN[item.occupation] || item.occupation} / ${item.occupationName}`}
              data-population={item.population}
              data-percentage={percentage}
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${Math.min(
                    (item.population / overallSummary[0].population) * 100,
                    100,
                  )}%`,
                  backgroundColor:
                    OCCUPATION_COLORS[
                      item.occupation as keyof typeof OCCUPATION_COLORS
                    ] || "#888",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {item.occupationName}
                  {/* Hidden span for SEO with English name */}
                  <span className="sr-only">
                    {OCCUPATION_NAMES_EN[item.occupation] || item.occupation}
                  </span>
                </h3>
                <p className="text-2xl font-bold">{percentage}%</p>
                <p className="text-sm text-muted-foreground">
                  {item.population.toLocaleString()} व्यक्ति
                  <span className="sr-only">
                    ({item.population.toLocaleString()} people)
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          पेशागत विश्लेषण
          <span className="sr-only">Occupational Analysis of Khajura</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="employment-rate"
            data-percentage={employmentRate}
          >
            <h4 className="font-medium mb-2">
              रोजगारी दर
              <span className="sr-only">
                Employment Rate in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">{employmentRate}%</p>
            <p className="text-sm text-muted-foreground mt-2">
              {employedPopulation.toLocaleString()} व्यक्ति कुनै न कुनै पेशामा
              संलग्न
              <span className="sr-only">
                {employedPopulation.toLocaleString()} people are engaged in some
                form of employment
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="occupation-diversity"
            data-primary-occupation={topOccupation?.occupation}
            data-secondary-occupation={secondOccupation?.occupation}
            data-ratio={topTwoOccupationRatio}
          >
            <h4 className="font-medium mb-2">
              पेशागत विविधता
              <span className="sr-only">Occupational Diversity in Khajura</span>
            </h4>
            <p className="text-lg">
              {topOccupation && secondOccupation
                ? `हरेक ${topTwoOccupationRatio} ${topOccupation.occupationName} कर्मचारीका लागि 1 ${secondOccupation.occupationName}`
                : ""}
              <span className="sr-only">
                {topOccupation && secondOccupation
                  ? `For every ${topTwoOccupationRatio} ${OCCUPATION_NAMES_EN[topOccupation.occupation]} workers, there is 1 ${OCCUPATION_NAMES_EN[secondOccupation.occupation]} worker in Khajura Rural Municipality`
                  : ""}
              </span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {overallSummary.length} विभिन्न पेशाहरू अभिलेख गरिएको
            </p>
          </div>
        </div>

        <div className="mt-4 bg-card p-4 rounded border">
          <h4 className="font-medium mb-2">
            पेशा वर्गीकरण
            <span className="sr-only">Occupational Classification</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h5 className="text-sm font-medium">सरकारी/निजी क्षेत्र</h5>
              <p className="text-sm text-muted-foreground">
                {(overallSummary.find(
                  (item) => item.occupation === "GOVERNMENTAL_JOB",
                )?.population || 0) +
                  (overallSummary.find(
                    (item) => item.occupation === "NON_GOVERNMENTAL_JOB",
                  )?.population || 0)}{" "}
                (
                {(
                  (((overallSummary.find(
                    (item) => item.occupation === "GOVERNMENTAL_JOB",
                  )?.population || 0) +
                    (overallSummary.find(
                      (item) => item.occupation === "NON_GOVERNMENTAL_JOB",
                    )?.population || 0)) /
                    totalPopulation) *
                  100
                ).toFixed(1)}
                %)
              </p>
            </div>
            <div>
              <h5 className="text-sm font-medium">स्वरोजगार</h5>
              <p className="text-sm text-muted-foreground">
                {(overallSummary.find((item) => item.occupation === "BUSINESS")
                  ?.population || 0) +
                  (overallSummary.find((item) => item.occupation === "INDUSTRY")
                    ?.population || 0) +
                  (overallSummary.find(
                    (item) => item.occupation === "OTHER_SELF_EMPLOYMENT",
                  )?.population || 0)}{" "}
                (
                {(
                  (((overallSummary.find(
                    (item) => item.occupation === "BUSINESS",
                  )?.population || 0) +
                    (overallSummary.find(
                      (item) => item.occupation === "INDUSTRY",
                    )?.population || 0) +
                    (overallSummary.find(
                      (item) => item.occupation === "OTHER_SELF_EMPLOYMENT",
                    )?.population || 0)) /
                    totalPopulation) *
                  100
                ).toFixed(1)}
                %)
              </p>
            </div>
            <div>
              <h5 className="text-sm font-medium">कृषि तथा पशुपालन</h5>
              <p className="text-sm text-muted-foreground">
                {overallSummary.find(
                  (item) => item.occupation === "ANIMAL_HUSBANDRY",
                )?.population || 0}{" "}
                (
                {(
                  ((overallSummary.find(
                    (item) => item.occupation === "ANIMAL_HUSBANDRY",
                  )?.population || 0) /
                    totalPopulation) *
                  100
                ).toFixed(1)}
                %)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          थप जानकारी
          <span className="sr-only">
            Additional Information about Occupational Demographics in Khajura
          </span>
        </h3>
        <p>
          खजुरा गाउँपालिकाको पेशागत वितरण सम्बन्धी थप जानकारी वा विस्तृत
          तथ्याङ्कको लागि, कृपया{" "}
          <Link href="/contact" className="text-primary hover:underline">
            हामीलाई सम्पर्क
          </Link>{" "}
          गर्नुहोस् वा{" "}
          <Link
            href="/profile/economics"
            className="text-primary hover:underline"
          >
            आर्थिक तथ्याङ्क
          </Link>{" "}
          खण्डमा हेर्नुहोस्।
        </p>
      </div>
    </>
  );
}
