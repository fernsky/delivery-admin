"use client";

import Link from "next/link";

interface LanguageAnalysisProps {
  overallSummary: Array<{
    language: string;
    languageName: string;
    population: number;
  }>;
  totalPopulation: number;
  LANGUAGE_NAMES: Record<string, string>;
}

export default function LanguageAnalysisSection({
  overallSummary,
  totalPopulation,
  LANGUAGE_NAMES,
}: LanguageAnalysisProps) {
  const LANGUAGE_COLORS = {
    NEPALI: "#FF5733",
    MAITHILI: "#FFC300",
    BHOJPURI: "#36A2EB",
    THARU: "#4BC0C0",
    TAMANG: "#9966FF",
    NEWARI: "#3CB371",
    MAGAR: "#FF6384",
    BAJJIKA: "#FFCE56",
    URDU: "#C9CBCF",
    HINDI: "#FF9F40",
    OTHER: "#808080",
  };

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
                  LANGUAGE_COLORS[
                    item.language as keyof typeof LANGUAGE_COLORS
                  ] || "#888",
                opacity: 0.2,
                zIndex: 0,
              }}
            />
            <div className="relative z-10">
              <h3 className="text-lg font-medium mb-2">{item.languageName}</h3>
              <p className="text-2xl font-bold">
                {((item.population / totalPopulation) * 100).toFixed(2)}%
              </p>
              <p className="text-sm text-muted-foreground">
                {item.population.toLocaleString()} वक्ता
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">थप जानकारी</h3>
        <p>
          पालिकाको भाषिक विविधता सम्बन्धी थप जानकारी वा विस्तृत तथ्याङ्कको लागि,
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
