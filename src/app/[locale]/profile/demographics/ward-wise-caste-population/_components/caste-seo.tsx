import Script from "next/script";

interface CasteSEOProps {
  overallSummary: Array<{
    casteType: string;
    casteTypeDisplay: string;
    population: number;
  }>;
  totalPopulation: number;
  CASTE_NAMES: Record<string, string>;
  wardNumbers: number[];
}

export default function CasteSEO({
  overallSummary,
  totalPopulation,
  CASTE_NAMES,
  wardNumbers,
}: CasteSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Define English names for castes
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

    // Convert caste stats to structured data format
    const casteStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${CASTE_NAMES_EN[item.casteType] || item.casteType} population in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${CASTE_NAMES_EN[item.casteType] || item.casteType} population`,
        unitText: "people",
      },
      measuredValue: item.population,
      description: `${item.population.toLocaleString()} people in Khajura Rural Municipality belong to ${CASTE_NAMES_EN[item.casteType] || item.casteType} caste (${((item.population / totalPopulation) * 100).toFixed(2)}% of total population)`,
    }));

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Caste Demographics of Khajura Rural Municipality (खजुरा गाउँपालिका)",
      description: `Caste distribution data across ${wardNumbers.length} wards of Khajura Rural Municipality with a total population of ${totalPopulation.toLocaleString()} people.`,
      keywords: [
        "Khajura Rural Municipality",
        "खजुरा गाउँपालिका",
        "Caste demographics",
        "Ethnicity statistics",
        "Ward-wise caste data",
        "Nepal census",
        ...Object.values(CASTE_NAMES_EN).map((name) => `${name} population`),
        ...Object.values(CASTE_NAMES).map((name) => `${name} जनसंख्या`),
      ],
      url: "https://khajuramun.digprofile.com/profile/demographics/ward-wise-caste-population",
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
      variableMeasured: overallSummary.map((item) => ({
        "@type": "PropertyValue",
        name: `${CASTE_NAMES_EN[item.casteType] || item.casteType} population`,
        unitText: "people",
        value: item.population,
      })),
      observation: casteStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="caste-demographics-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
