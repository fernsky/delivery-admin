import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface IrrigationSourceSEOProps {
  overallSummary: Array<{
    source: string;
    sourceName: string;
    coverage: number;
    percentage: number;
  }>;
  totalIrrigatedArea: number;
  IRRIGATION_SOURCE_TYPES: Record<string, string>;
  IRRIGATION_SOURCE_TYPES_EN: Record<string, string>;
  sustainabilityScore: number;
  diversityIndex: number;
}

export default function IrrigationSourceSEO({
  overallSummary,
  totalIrrigatedArea,
  IRRIGATION_SOURCE_TYPES,
  IRRIGATION_SOURCE_TYPES_EN,
  sustainabilityScore,
  diversityIndex,
}: IrrigationSourceSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert irrigation source stats to structured data format
    const irrigationSourceStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${IRRIGATION_SOURCE_TYPES_EN[item.source] || item.source} in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${IRRIGATION_SOURCE_TYPES_EN[item.source] || item.source} Coverage`,
        unitText: "hectares",
      },
      measuredValue: item.coverage,
      description: `${item.coverage.toFixed(2)} hectares of agricultural land in Khajura Rural Municipality is irrigated using ${IRRIGATION_SOURCE_TYPES_EN[item.source] || item.source} (${item.percentage.toFixed(2)}% of total irrigated area)`,
    }));

    // Find most used irrigation source
    const mostUsedSource = overallSummary.length > 0 ? overallSummary[0] : null;
    const mostUsedSourceEN = mostUsedSource ? (IRRIGATION_SOURCE_TYPES_EN[mostUsedSource.source] || mostUsedSource.source) : "";
    const mostUsedSourcePercentage = mostUsedSource ? mostUsedSource.percentage.toFixed(2) : "0";

    // Find least used irrigation source
    const leastUsedSource = overallSummary.length > 0 ? overallSummary[overallSummary.length - 1] : null;
    const leastUsedSourceEN = leastUsedSource ? (IRRIGATION_SOURCE_TYPES_EN[leastUsedSource.source] || leastUsedSource.source) : "";

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Irrigation Sources in Khajura Rural Municipality (खजुरा गाउँपालिका)",
      description: `Municipality-wide irrigation source distribution across Khajura Rural Municipality with total irrigated area of ${totalIrrigatedArea.toFixed(2)} hectares. The most used irrigation source is ${mostUsedSourceEN} covering ${mostUsedSource?.coverage.toFixed(2)} hectares (${mostUsedSourcePercentage}%). Irrigation sustainability score is ${sustainabilityScore}% with diversity index of ${(diversityIndex * 100).toFixed(2)}%.`,
      keywords: [
        "Khajura Rural Municipality",
        "खजुरा गाउँपालिका",
        "Irrigation sources",
        "Agricultural irrigation",
        "Irrigation systems Nepal",
        "Lake reservoir irrigation",
        "Canal irrigation",
        "Underground irrigation",
        "Electric lift irrigation",
        "Rainwater collection",
        "Pumping set irrigation",
        ...Object.values(IRRIGATION_SOURCE_TYPES_EN).map(
          (name) => `${name} irrigation statistics`,
        ),
        ...Object.values(IRRIGATION_SOURCE_TYPES).map((name) => `${name} सिंचाई तथ्याङ्क`),
      ],
      url: "https://digital.khajuramun.gov.np/profile/economics/municipality-wide-irrigation-source",
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
        url: "https://digital.khajuramun.gov.np",
      },
      temporalCoverage: "2021/2023",
      spatialCoverage: {
        "@type": "Place",
        name: "Khajura Rural Municipality, Banke, Nepal",
        geo: {
          "@type": "GeoCoordinates",
          latitude: "28.1356",
          longitude: "81.6314",
        },
      },
      variableMeasured: [
        ...overallSummary.map((item) => ({
          "@type": "PropertyValue",
          name: `${IRRIGATION_SOURCE_TYPES_EN[item.source] || item.source} Coverage`,
          unitText: "hectares",
          value: item.coverage,
        })),
        {
          "@type": "PropertyValue",
          name: "Total Irrigated Area",
          unitText: "hectares", 
          value: totalIrrigatedArea,
        },
        {
          "@type": "PropertyValue",
          name: "Irrigation Sustainability Score",
          unitText: "percentage",
          value: sustainabilityScore,
        },
        {
          "@type": "PropertyValue",
          name: "Irrigation Diversity Index",
          unitText: "index",
          value: diversityIndex,
        }
      ],
      observation: irrigationSourceStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="irrigation-source-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
