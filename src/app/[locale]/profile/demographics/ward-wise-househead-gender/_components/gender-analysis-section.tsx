"use client";

import Link from "next/link";
import { useEffect } from "react";

interface GenderAnalysisProps {
  overallSummary: Array<{
    gender: string;
    genderName: string;
    population: number;
  }>;
  totalPopulation: number;
  GENDER_NAMES: Record<string, string>;
}

export default function GenderAnalysisSection({
  overallSummary,
  totalPopulation,
  GENDER_NAMES,
}: GenderAnalysisProps) {
  const GENDER_COLORS = {
    MALE: "#36A2EB",
    FEMALE: "#FF6384",
    OTHER: "#FFCE56",
  };

  // Calculate male to female ratio if both exist
  const maleData = overallSummary.find((item) => item.gender === "MALE");
  const femaleData = overallSummary.find((item) => item.gender === "FEMALE");

  const maleToFemaleRatio =
    maleData && femaleData && femaleData.population > 0
      ? (maleData.population / femaleData.population).toFixed(2)
      : "N/A";

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    // Create English translations for key data
    const GENDER_NAMES_EN: Record<string, string> = {
      MALE: "Male",
      FEMALE: "Female",
      OTHER: "Other",
    };

    // Add data to document.body for SEO (will be crawled but not visible to users)
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / खजुरा गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-households",
        totalPopulation.toString(),
      );

      // Add male househead data
      if (maleData) {
        const genderNameEN = GENDER_NAMES_EN[maleData.gender] || maleData.gender;
        document.body.setAttribute(
          "data-male-househead",
          `${genderNameEN} / ${maleData.genderName}`,
        );
        document.body.setAttribute(
          "data-male-househead-count",
          maleData.population.toString(),
        );
        document.body.setAttribute(
          "data-male-househead-percentage",
          ((maleData.population / totalPopulation) * 100).toFixed(2),
        );
      }

      // Add female househead data
      if (femaleData) {
        const genderNameEN = GENDER_NAMES_EN[femaleData.gender] || femaleData.gender;
        document.body.setAttribute(
          "data-female-househead",
          `${genderNameEN} / ${femaleData.genderName}`,
        );
        document.body.setAttribute(
          "data-female-househead-count",
          femaleData.population.toString(),
        );
        document.body.setAttribute(
          "data-female-househead-percentage",
          ((femaleData.population / totalPopulation) * 100).toFixed(2),
        );
      }

      // Add gender ratio data
      document.body.setAttribute("data-gender-ratio", maleToFemaleRatio);
    }
  }, [overallSummary, totalPopulation, maleData, femaleData, maleToFemaleRatio]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {overallSummary.map((item, index) => {
          // Define English gender name for SEO
          const genderEN =
            item.gender === "MALE"
              ? "Male"
              : item.gender === "FEMALE"
                ? "Female"
                : "Other";

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
              data-gender={`${genderEN} / ${item.genderName}`}
              data-population={item.population}
              data-percentage={percentage}
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${Math.min((item.population / overallSummary[0].population) * 100, 100)}%`,
                  backgroundColor:
                    GENDER_COLORS[item.gender as keyof typeof GENDER_COLORS] ||
                    "#888",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {item.genderName}
                  {/* Hidden span for SEO with English name */}
                  <span className="sr-only">{genderEN}</span>
                </h3>
                <p className="text-2xl font-bold">{percentage}%</p>
                <p className="text-sm text-muted-foreground">
                  {item.population.toLocaleString()} घरपरिवार
                  <span className="sr-only">
                    ({item.population.toLocaleString()} households)
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          लिङ्गिक अनुपात विश्लेषण
          <span className="sr-only">
            Gender Ratio Analysis of Khajura
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="gender-ratio"
            data-ratio={maleToFemaleRatio}
          >
            <h4 className="font-medium mb-2">
              पुरुष-महिला घरमूली अनुपात
              <span className="sr-only">
                Male to Female Househead Ratio in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">{maleToFemaleRatio}</p>
            <p className="text-sm text-muted-foreground mt-2">
              हरेक {maleToFemaleRatio} पुरुष घरमूलीका लागि 1 महिला घरमूली
              <span className="sr-only">
                For every {maleToFemaleRatio} male househeads, there is 1 female househead in Khajura Rural Municipality
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="female-percentage"
            data-percentage={
              femaleData
                ? ((femaleData.population / totalPopulation) * 100).toFixed(2)
                : "0"
            }
          >
            <h4 className="font-medium mb-2">
              महिला घरमूली प्रतिशत
              <span className="sr-only">
                Female Househead Percentage in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {femaleData
                ? ((femaleData.population / totalPopulation) * 100).toFixed(2) +
                  "%"
                : "0%"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              कुल घरपरिवारको प्रतिशतमा महिला घरमूली
              <span className="sr-only">
                Percentage of female househeads in total households of Khajura Rural Municipality
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          थप जानकारी
          <span className="sr-only">
            Additional Information about Househead Gender Demographics in Khajura
          </span>
        </h3>
        <p>
          पालिकाको घरमूली लिङ्ग वितरण सम्बन्धी थप जानकारी वा विस्तृत तथ्याङ्कको
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
