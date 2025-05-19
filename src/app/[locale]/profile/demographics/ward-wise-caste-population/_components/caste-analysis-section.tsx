"use client";

import Link from "next/link";
import { useEffect } from "react";

interface CasteAnalysisProps {
  overallSummary: Array<{
    casteType: string;
    casteTypeDisplay: string;
    population: number;
  }>;
  totalPopulation: number;
  CASTE_NAMES: Record<string, string>;
}

export default function CasteAnalysisSection({
  overallSummary,
  totalPopulation,
  CASTE_NAMES,
}: CasteAnalysisProps) {
  // Define colors for visualization
  const CASTE_COLORS = {
    BRAHMIN_HILL: "#FF5733",
    CHHETRI: "#FFC300",
    THAKURI: "#36A2EB",
    SANYASI_DASNAMI: "#4BC0C0",
    BRAHMIN_TARAI: "#9966FF",
    RAJPUT: "#3CB371",
    KAYASTHA: "#FF6384",
    BANIYA: "#FFCE56",
    NEWAR: "#C9CBCF",
    GURUNG: "#FF9F40",
    MAGAR: "#8A2BE2",
    TAMANG: "#20B2AA",
    RAI: "#B22222",
    LIMBU: "#228B22",
    SHERPA: "#4682B4",
    THAKALI: "#D2691E",
    THARU: "#800080",
    MAJHI: "#FF4500",
    DALIT_HILL: "#2F4F4F",
    DALIT_TARAI: "#8B4513",
    MUSLIM: "#708090",
    MADHESI: "#A0522D",
    YADAV: "#6B8E23",
    TELI: "#483D8B",
    KOIRI: "#CD5C5C",
    KURMI: "#9ACD32",
    MARWADI: "#00CED1",
    BANGALI: "#FF1493",
    OTHER: "#808080",
  };

  // Calculate top two castes ratio if both exist
  const topCaste = overallSummary[0];
  const secondCaste = overallSummary[1];

  const topTwoCasteRatio =
    topCaste && secondCaste && secondCaste.population > 0
      ? (topCaste.population / secondCaste.population).toFixed(2)
      : "N/A";

  // Group by broader categories
  const groupedCategories = {
    "पहाडे जाति": ["BRAHMIN_HILL", "CHHETRI", "THAKURI", "SANYASI_DASNAMI"],
    "मधेसी जाति": [
      "BRAHMIN_TARAI",
      "RAJPUT",
      "KAYASTHA",
      "BANIYA",
      "MADHESI",
      "YADAV",
      "TELI",
      "KOIRI",
      "KURMI",
    ],
    "आदिवासी जनजाति": [
      "NEWAR",
      "GURUNG",
      "MAGAR",
      "TAMANG",
      "RAI",
      "LIMBU",
      "SHERPA",
      "THAKALI",
      "THARU",
      "MAJHI",
    ],
    दलित: ["DALIT_HILL", "DALIT_TARAI"],
    अन्य: ["MUSLIM", "MARWADI", "BANGALI", "OTHER"],
  };

  // Calculate populations by broader category
  const broadCategoryData = Object.entries(groupedCategories)
    .map(([category, casteList]) => {
      const totalInCategory = overallSummary
        .filter((item) => casteList.includes(item.casteType))
        .reduce((sum, item) => sum + item.population, 0);

      const percentage =
        totalPopulation > 0 ? (totalInCategory / totalPopulation) * 100 : 0;

      return {
        category,
        population: totalInCategory,
        percentage: percentage.toFixed(2),
      };
    })
    .sort((a, b) => b.population - a.population);

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    // Create English translations for key data
    const CASTE_NAMES_EN: Record<string, string> = {
      BRAHMIN_HILL: "Hill Brahmin",
      CHHETRI: "Chhetri",
      THAKURI: "Thakuri",
      SANYASI_DASNAMI: "Sanyasi/Dasnami",
      BRAHMIN_TARAI: "Madhesi Brahmin",
      RAJPUT: "Rajput",
      KAYASTHA: "Kayastha",
      BANIYA: "Baniya",
      NEWAR: "Newar",
      GURUNG: "Gurung",
      MAGAR: "Magar",
      TAMANG: "Tamang",
      RAI: "Rai",
      LIMBU: "Limbu",
      SHERPA: "Sherpa",
      THAKALI: "Thakali",
      THARU: "Tharu",
      MAJHI: "Majhi",
      DALIT_HILL: "Hill Dalit",
      DALIT_TARAI: "Madhesi Dalit",
      MUSLIM: "Muslim",
      MADHESI: "Madhesi",
      YADAV: "Yadav",
      TELI: "Teli",
      KOIRI: "Koiri",
      KURMI: "Kurmi",
      MARWADI: "Marwadi",
      BANGALI: "Bengali",
      OTHER: "Other",
    };

    // Add data to document.body for SEO (will be crawled but not visible to users)
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / खजुरा गाउँपालिका"
      );
      document.body.setAttribute(
        "data-total-population",
        totalPopulation.toString()
      );

      // Add main caste data
      if (topCaste) {
        const casteNameEN =
          CASTE_NAMES_EN[topCaste.casteType] || topCaste.casteType;
        document.body.setAttribute(
          "data-main-caste",
          `${casteNameEN} / ${topCaste.casteTypeDisplay}`
        );
        document.body.setAttribute(
          "data-main-caste-population",
          topCaste.population.toString()
        );
        document.body.setAttribute(
          "data-main-caste-percentage",
          ((topCaste.population / totalPopulation) * 100).toFixed(2)
        );
      }

      // Add second caste data
      if (secondCaste) {
        const casteNameEN =
          CASTE_NAMES_EN[secondCaste.casteType] || secondCaste.casteType;
        document.body.setAttribute(
          "data-second-caste",
          `${casteNameEN} / ${secondCaste.casteTypeDisplay}`
        );
        document.body.setAttribute(
          "data-second-caste-population",
          secondCaste.population.toString()
        );
        document.body.setAttribute(
          "data-second-caste-percentage",
          ((secondCaste.population / totalPopulation) * 100).toFixed(2)
        );
      }

      // Add broader category data
      document.body.setAttribute(
        "data-caste-categories",
        Object.keys(groupedCategories).join(", ")
      );
    }
  }, [overallSummary, totalPopulation, groupedCategories]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {overallSummary.slice(0, 6).map((item, index) => {
          // Define English caste name for SEO
          const casteEN =
            item.casteType === "BRAHMIN_HILL"
              ? "Hill Brahmin"
              : item.casteType === "CHHETRI"
              ? "Chhetri"
              : item.casteType === "THAKURI"
              ? "Thakuri"
              : item.casteType === "THARU"
              ? "Tharu"
              : item.casteType === "MAGAR"
              ? "Magar"
              : item.casteType === "NEWAR"
              ? "Newar"
              : "Other";

          // Calculate percentage
          const percentage = ((item.population / totalPopulation) * 100).toFixed(2);

          return (
            <div
              key={index}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
              // Add data attributes for SEO crawlers
              data-caste={`${casteEN} / ${item.casteTypeDisplay}`}
              data-population={item.population}
              data-percentage={percentage}
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${
                    Math.min(
                      (item.population / overallSummary[0].population) * 100,
                      100
                    )
                  }%`,
                  backgroundColor:
                    CASTE_COLORS[item.casteType as keyof typeof CASTE_COLORS] ||
                    "#888",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {item.casteTypeDisplay}
                  {/* Hidden span for SEO with English name */}
                  <span className="sr-only">{casteEN}</span>
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
          जातिगत विविधता विश्लेषण
          <span className="sr-only">
            Caste Diversity Analysis of Khajura
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="main-caste"
            data-caste-name={topCaste?.casteType}
            data-caste-percentage={
              topCaste
                ? ((topCaste.population / totalPopulation) * 100).toFixed(2)
                : "0"
            }
          >
            <h4 className="font-medium mb-2">
              प्रमुख जाति
              <span className="sr-only">
                Main Caste in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {topCaste ? topCaste.casteTypeDisplay : "-"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {topCaste
                ? `कुल जनसंख्याको ${((topCaste.population / totalPopulation) * 100).toFixed(2)}% व्यक्ति`
                : ""}
              <span className="sr-only">
                {topCaste
                  ? `${((topCaste.population / totalPopulation) * 100).toFixed(2)}% of total population in Khajura Rural Municipality`
                  : ""}
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="caste-ratio"
            data-ratio={topTwoCasteRatio}
            data-primary-caste={topCaste?.casteType}
            data-secondary-caste={secondCaste?.casteType}
          >
            <h4 className="font-medium mb-2">
              प्रमुख-दोस्रो जाति अनुपात
              <span className="sr-only">
                Primary to Secondary Caste Ratio in Khajura
              </span>
            </h4>
            <p className="text-3xl font-bold">{topTwoCasteRatio}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {topCaste && secondCaste
                ? `हरेक ${topTwoCasteRatio} ${topCaste.casteTypeDisplay} का लागि 1 ${secondCaste.casteTypeDisplay}`
                : ""}
              <span className="sr-only">
                {topCaste && secondCaste
                  ? `For every ${topTwoCasteRatio} ${topCaste.casteType.toLowerCase()} persons, there is 1 ${secondCaste.casteType.toLowerCase()} person in Khajura Rural Municipality`
                  : ""}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-card p-4 rounded-lg border">
        <h3 className="text-xl font-medium mb-4">
          प्रमुख जातिगत समूह
          <span className="sr-only">Main Caste Groups</span>
        </h3>
        <div className="space-y-4">
          {broadCategoryData.map((category, index) => (
            <div
              key={index}
              data-category-name={category.category}
              data-category-population={category.population}
              data-category-percentage={category.percentage}
            >
              <div className="flex justify-between">
                <span className="font-medium">{category.category}</span>
                <span>{category.percentage}%</span>
              </div>
              <div className="w-full bg-muted h-3 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${category.percentage}%`,
                    backgroundColor: `hsl(${index * 60}, 70%, 60%)`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {category.population.toLocaleString()} व्यक्ति
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          थप जानकारी
          <span className="sr-only">
            Additional Information about Caste Demographics in Khajura
          </span>
        </h3>
        <p>
          पालिकाको जातिगत वितरण सम्बन्धी थप जानकारी वा विस्तृत तथ्याङ्कको लागि,
          कृपया{" "}
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
