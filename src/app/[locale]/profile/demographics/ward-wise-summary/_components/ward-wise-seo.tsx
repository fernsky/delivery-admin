import Script from "next/script";

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
      description: `Ward ${ward.wardNumber} of Khajura Rural Municipality has a population of ${ward.totalPopulation.toLocaleString()} people with ${ward.malePopulation.toLocaleString()} males and ${ward.femalePopulation.toLocaleString()} females across ${ward.totalHouseholds.toLocaleString()} households.`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Ward-wise Demographics of Khajura Rural Municipality (खजुरा गाउँपालिका)",
      description: `Ward-wise population distribution data across ${processedWardData.length} wards of Khajura Rural Municipality with a total population of ${municipalityStats.totalPopulation.toLocaleString()} people and ${municipalityStats.totalHouseholds.toLocaleString()} households.`,
      keywords: [
        "Khajura Rural Municipality",
        "खजुरा गाउँपालिका",
        "Ward demographics",
        "Ward-wise population",
        "Nepal census",
        "Population distribution",
        "Gender ratio",
        "Household data",
        "Population statistics",
      ],
      url: "https://khajura-rm.gov.np/profile/demographics/ward-wise-summary",
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
        url: "https://khajura-rm.gov.np",
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
