import Script from "next/script";

interface GenderSEOProps {
  overallSummary: Array<{
    gender: string;
    genderName: string;
    population: number;
  }>;
  totalPopulation: number;
  GENDER_NAMES: Record<string, string>;
  wardNumbers: number[];
}

export default function GenderSEO({
  overallSummary,
  totalPopulation,
  GENDER_NAMES,
  wardNumbers,
}: GenderSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Define English names for genders
    const GENDER_NAMES_EN: Record<string, string> = {
      MALE: "Male",
      FEMALE: "Female",
      OTHER: "Other",
    };

    // Convert gender stats to structured data format
    const genderStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${GENDER_NAMES_EN[item.gender] || item.gender} househeads in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${GENDER_NAMES_EN[item.gender] || item.gender} househeads`,
        unitText: "households",
      },
      measuredValue: item.population,
      description: `${item.population.toLocaleString()} households in Khajura Rural Municipality have ${GENDER_NAMES_EN[item.gender] || item.gender} househeads (${((item.population / totalPopulation) * 100).toFixed(2)}% of total households)`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Househead Gender Demographics of Khajura Rural Municipality (खजुरा गाउँपालिका)",
      description: `Househead gender distribution data across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalPopulation.toLocaleString()} households.`,
      keywords: [
        "Khajura Rural Municipality",
        "खजुरा गाउँपालिका",
        "Househead gender demographics",
        "Gender statistics",
        "Ward-wise househead data",
        "Nepal census",
        "Female househeads",
        "Male househeads",
        "Gender equality",
        "Household leadership",
        "महिला घरमूली",
        "पुरुष घरमूली",
        "घरमूली लिङ्ग वितरण",
      ],
      url: "https://khajura-rm.gov.np/profile/demographics/ward-wise-househead-gender",
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
      variableMeasured: overallSummary.map((item) => ({
        "@type": "PropertyValue",
        name: `${GENDER_NAMES_EN[item.gender] || item.gender} househeads`,
        unitText: "households",
        value: item.population,
      })),
      observation: genderStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="gender-demographics-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
