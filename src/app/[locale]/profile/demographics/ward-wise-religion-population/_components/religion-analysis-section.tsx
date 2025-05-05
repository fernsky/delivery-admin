"use client";

import Link from "next/link";

interface ReligionAnalysisProps {
  overallSummary: Array<{
    religion: string;
    religionName: string;
    population: number;
  }>;
  totalPopulation: number;
  RELIGION_NAMES: Record<string, string>;
}

export default function ReligionAnalysisSection({
  overallSummary,
  totalPopulation,
  RELIGION_NAMES,
}: ReligionAnalysisProps) {
  const RELIGION_COLORS = {
    HINDU: "#FF5733",
    BUDDHIST: "#FFC300",
    KIRANT: "#36A2EB",
    CHRISTIAN: "#4BC0C0",
    ISLAM: "#9966FF",
    NATURE: "#3CB371",
    BON: "#FF6384",
    JAIN: "#FFCE56",
    BAHAI: "#C9CBCF",
    SIKH: "#FF9F40",
    OTHER: "#808080",
  };

  // Calculate top two religions ratio if both exist
  const topReligion = overallSummary[0];
  const secondReligion = overallSummary[1];

  const topTwoReligionRatio =
    topReligion && secondReligion && secondReligion.population > 0
      ? (topReligion.population / secondReligion.population).toFixed(2)
      : "N/A";

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
                  RELIGION_COLORS[
                    item.religion as keyof typeof RELIGION_COLORS
                  ] || "#888",
                opacity: 0.2,
                zIndex: 0,
              }}
            />
            <div className="relative z-10">
              <h3 className="text-lg font-medium mb-2">{item.religionName}</h3>
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
        <h3 className="text-xl font-medium mb-4">धार्मिक विविधता विश्लेषण</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">प्रमुख धर्म</h4>
            <p className="text-3xl font-bold">
              {topReligion ? topReligion.religionName : "-"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {topReligion
                ? `कुल जनसंख्याको ${((topReligion.population / totalPopulation) * 100).toFixed(2)}% व्यक्ति`
                : ""}
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">प्रमुख-दोस्रो धर्म अनुपात</h4>
            <p className="text-3xl font-bold">{topTwoReligionRatio}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {topReligion && secondReligion
                ? `हरेक ${topTwoReligionRatio} ${topReligion.religionName} अवलम्बनकर्ताका लागि 1 ${secondReligion.religionName} अवलम्बनकर्ता`
                : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">थप जानकारी</h3>
        <p>
          पालिकाको धार्मिक वितरण सम्बन्धी थप जानकारी वा विस्तृत तथ्याङ्कको लागि,
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
