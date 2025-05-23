import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardData {
  wardNumber: number;
  wardName: string;
  totalPopulation: number;
  malePopulation: number;
  femalePopulation: number;
  otherPopulation: number;
  totalHouseholds: number;
  averageHouseholdSize: number;
  sexRatio: number;
}

interface WardWiseSEOProps {
  processedWardData: WardData[];
  municipalityStats: {
    totalPopulation: number;
    malePopulation: number;
    femalePopulation: number;
    otherPopulation: number;
    totalHouseholds: number;
  };
  municipalityAverages: {
    averageHouseholdSize: number;
    sexRatio: number;
  };
}

export default function WardWiseSEO({
  processedWardData,
  municipalityStats,
  municipalityAverages,
}: WardWiseSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert ward stats to structured data format
    const wardObservations = processedWardData.map((ward) => ({
      "@type": "Observation",
      name: `Ward ${ward.wardNumber} demographics in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: [
        {
          "@type": "PropertyValue",
          name: "Total Population",
          unitText: "people",
          value: ward.totalPopulation,
        },
        {
          "@type": "PropertyValue",
          name: "Male Population",
          unitText: "people",
          value: ward.malePopulation,
        },
        {
          "@type": "PropertyValue",
          name: "Female Population",
          unitText: "people",
          value: ward.femalePopulation,
        },
        {
          "@type": "PropertyValue",
          name: "Total Households",
          unitText: "households",
          value: ward.totalHouseholds,
        },
        {
          "@type": "PropertyValue",
          name: "Average Household Size",
          value: ward.averageHouseholdSize,
        },
        {
          "@type": "PropertyValue",
          name: "Sex Ratio",
          value: ward.sexRatio,
        },
      ],
      description: `वडा ${localizeNumber(
        ward.wardNumber,
        "ne",
      )} (Ward ${ward.wardNumber}) of Khajura Rural Municipality has a population of ${localizeNumber(
        ward.totalPopulation.toLocaleString(),
        "ne",
      )} people with ${localizeNumber(
        ward.malePopulation.toLocaleString(),
        "ne",
      )} males and ${localizeNumber(
        ward.femalePopulation.toLocaleString(),
        "ne",
      )} females across ${localizeNumber(
        ward.totalHouseholds.toLocaleString(),
        "ne",
      )} households.`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Ward-wise Demographics of Khajura Rural Municipality (खजुरा गाउँपालिका)",
      description: `Ward-wise population distribution data across ${localizeNumber(
        processedWardData.length,
        "ne",
      )} wards of Khajura Rural Municipality with a total population of ${localizeNumber(
        municipalityStats.totalPopulation.toLocaleString(),
        "ne",
      )} people and ${localizeNumber(
        municipalityStats.totalHouseholds.toLocaleString(),
        "ne",
      )} households.`,
      keywords: [
        "Khajura Rural Municipality",
        "खजुरा गाउँपालिका",
        "Ward demographics",
        "Khajura ward-wise population",
        "Nepal census",
        "Khajura population distribution",
        "Khajura gender ratio",
        "Khajura household data",
        "Banke district population",
      ],
      url: "https://khajuramun.digprofile.com/profile/demographics/ward-wise-summary",
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
        url: "https://khajuramun.digprofile.com",
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
          name: "Total Population",
          unitText: "people",
          value: municipalityStats.totalPopulation,
        },
        {
          "@type": "PropertyValue",
          name: "Total Households",
          unitText: "households",
          value: municipalityStats.totalHouseholds,
        },
        {
          "@type": "PropertyValue",
          name: "Average Household Size",
          value: municipalityAverages.averageHouseholdSize,
        },
        {
          "@type": "PropertyValue",
          name: "Sex Ratio",
          value: municipalityAverages.sexRatio,
        },
      ],
      observation: wardObservations,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="ward-demographics-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
