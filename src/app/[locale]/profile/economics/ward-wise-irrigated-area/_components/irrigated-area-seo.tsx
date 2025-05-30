import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface IrrigatedAreaSEOProps {
  totalArea: number;
  totalIrrigatedArea: number;
  irrigationCoverage: number;
  wardNumbers: number[];
}

export default function IrrigatedAreaSEO({
  totalArea,
  totalIrrigatedArea,
  irrigationCoverage,
  wardNumbers,
}: IrrigatedAreaSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Create observations for structured data
    const observations = [
      {
        "@type": "Observation",
        name: "Irrigated Area in Khajura Rural Municipality",
        observationDate: new Date().toISOString().split("T")[0],
        measuredProperty: {
          "@type": "PropertyValue",
          name: "Irrigated Area",
          unitText: "hectares",
        },
        measuredValue: totalIrrigatedArea,
        description: `${totalIrrigatedArea.toLocaleString()} hectares in Khajura Rural Municipality is irrigated land (${irrigationCoverage.toFixed(2)}% of total agricultural land)`,
      },
      {
        "@type": "Observation",
        name: "Unirrigated Area in Khajura Rural Municipality",
        observationDate: new Date().toISOString().split("T")[0],
        measuredProperty: {
          "@type": "PropertyValue",
          name: "Unirrigated Area",
          unitText: "hectares",
        },
        measuredValue: totalArea - totalIrrigatedArea,
        description: `${(totalArea - totalIrrigatedArea).toLocaleString()} hectares in Khajura Rural Municipality is unirrigated land (${(100 - irrigationCoverage).toFixed(2)}% of total agricultural land)`,
      }
    ];

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Irrigated and Unirrigated Areas in Khajura Rural Municipality (खजुरा गाउँपालिका)",
      description: `Irrigation statistics across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalArea.toLocaleString()} hectares of agricultural land. ${irrigationCoverage.toFixed(2)}% of the land is irrigated (${totalIrrigatedArea.toLocaleString()} hectares) while ${(100 - irrigationCoverage).toFixed(2)}% (${(totalArea - totalIrrigatedArea).toLocaleString()} hectares) remains unirrigated.`,
      keywords: [
        "Khajura Rural Municipality",
        "खजुरा गाउँपालिका",
        "Irrigated area",
        "Unirrigated area",
        "Agricultural land",
        "Irrigation statistics",
        "Ward-wise irrigation",
        "Nepal irrigation data",
        "Agriculture development",
        "Irrigation coverage",
        "सिंचित क्षेत्र",
        "असिंचित क्षेत्र",
        "कृषि भूमि",
        "सिंचाई तथ्याङ्क",
      ],
      url: "https://digital.khajuramun.gov.np/profile/economics/ward-wise-irrigated-area",
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
        {
          "@type": "PropertyValue",
          name: "Total Agricultural Area",
          unitText: "hectares",
          value: totalArea,
        },
        {
          "@type": "PropertyValue",
          name: "Irrigated Area",
          unitText: "hectares",
          value: totalIrrigatedArea,
        },
        {
          "@type": "PropertyValue",
          name: "Unirrigated Area",
          unitText: "hectares",
          value: totalArea - totalIrrigatedArea,
        },
        {
          "@type": "PropertyValue",
          name: "Irrigation Coverage",
          unitText: "percentage",
          value: irrigationCoverage,
        }
      ],
      observation: observations,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="irrigated-area-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
