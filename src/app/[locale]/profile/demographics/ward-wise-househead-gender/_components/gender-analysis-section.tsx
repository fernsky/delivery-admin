"use client";

import Link from "next/link";

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

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {overallSummary.map((item, index) => (
          <div
            key={index}
            className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
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
              <h3 className="text-lg font-medium mb-2">{item.genderName}</h3>
              <p className="text-2xl font-bold">
                {((item.population / totalPopulation) * 100).toFixed(2)}%
              </p>
              <p className="text-sm text-muted-foreground">
                {item.population.toLocaleString()} घरपरिवार
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">लिङ्गिक अनुपात विश्लेषण</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">पुरुष-महिला घरमूली अनुपात</h4>
            <p className="text-3xl font-bold">{maleToFemaleRatio}</p>
            <p className="text-sm text-muted-foreground mt-2">
              हरेक {maleToFemaleRatio} पुरुष घरमूलीका लागि 1 महिला घरमूली
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">महिला घरमूली प्रतिशत</h4>
            <p className="text-3xl font-bold">
              {femaleData
                ? ((femaleData.population / totalPopulation) * 100).toFixed(2) +
                  "%"
                : "0%"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              कुल घरपरिवारको प्रतिशतमा महिला घरमूली
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">थप जानकारी</h3>
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
