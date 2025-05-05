"use client";

import Link from "next/link";

interface CasteAnalysisProps {
  overallSummary: Array<{
    caste: string;
    casteName: string;
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
        .filter((item) => casteList.includes(item.caste))
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

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {overallSummary.slice(0, 6).map((item, index) => (
          <div
            key={index}
            className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
          >
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                height: `${Math.min((item.population / overallSummary[0].population) * 100, 100)}%`,
                backgroundColor:
                  CASTE_COLORS[item.caste as keyof typeof CASTE_COLORS] ||
                  "#888",
                opacity: 0.2,
                zIndex: 0,
              }}
            />
            <div className="relative z-10">
              <h3 className="text-lg font-medium mb-2">{item.casteName}</h3>
              <p className="text-2xl font-bold">
                {((item.population / totalPopulation) * 100).toFixed(2)}%
              </p>
              <p className="text-sm text-muted-foreground">
                {item.population.toLocaleString()} व्यक्ति
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">जातिगत विविधता विश्लेषण</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">प्रमुख जाति</h4>
            <p className="text-3xl font-bold">
              {topCaste ? topCaste.casteName : "-"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {topCaste
                ? `कुल जनसंख्याको ${((topCaste.population / totalPopulation) * 100).toFixed(2)}% व्यक्ति`
                : ""}
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">प्रमुख-दोस्रो जाति अनुपात</h4>
            <p className="text-3xl font-bold">{topTwoCasteRatio}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {topCaste && secondCaste
                ? `हरेक ${topTwoCasteRatio} ${topCaste.casteName} का लागि 1 ${secondCaste.casteName}`
                : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-card p-4 rounded-lg border">
        <h3 className="text-xl font-medium mb-4">प्रमुख जातिगत समूह</h3>
        <div className="space-y-4">
          {broadCategoryData.map((category, index) => (
            <div key={index}>
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
        <h3 className="text-xl font-medium mb-2">थप जानकारी</h3>
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
