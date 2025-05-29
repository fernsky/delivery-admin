import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface BirthCertificateSEOProps {
  birthCertificateData: Array<{
    id?: string;
    wardNumber: number;
    birthCertificateHoldersBelow5years: number;
  }>;
  totalCertificateHolders: number;
  wardNumbers: number[];
}

export default function BirthCertificateSEO({
  birthCertificateData,
  totalCertificateHolders,
  wardNumbers,
}: BirthCertificateSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert birth certificate stats to structured data format
    const wardObservations = birthCertificateData.map((item) => ({
      "@type": "Observation",
      name: `Birth Certificate Holders Under 5 Years in Ward ${item.wardNumber} of Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: "Birth Certificate Holders Under 5 Years",
        unitText: "children",
      },
      measuredValue: item.birthCertificateHoldersBelow5years,
      description: `${item.birthCertificateHoldersBelow5years.toLocaleString()} children under 5 years in Ward ${item.wardNumber} of Khajura Rural Municipality hold birth certificates`,
    }));

    // Find ward with highest birth certificate registration
    const highestWard = [...birthCertificateData].sort(
      (a, b) => b.birthCertificateHoldersBelow5years - a.birthCertificateHoldersBelow5years
    )[0] || { wardNumber: 0, birthCertificateHoldersBelow5years: 0 };
    
    const highestWardPercentage = totalCertificateHolders > 0 
      ? ((highestWard.birthCertificateHoldersBelow5years / totalCertificateHolders) * 100).toFixed(2)
      : "0";

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Birth Certificate Holders Under 5 Years in Khajura Rural Municipality (खजुरा गाउँपालिका)",
      description: `Birth certificate data for children under 5 years across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalCertificateHolders.toLocaleString()} children having birth certificates. Ward ${highestWard.wardNumber} has the highest number with ${highestWard.birthCertificateHoldersBelow5years.toLocaleString()} birth certificates (${highestWardPercentage}%).`,
      keywords: [
        "Khajura Rural Municipality",
        "खजुरा गाउँपालिका",
        "Birth certificates",
        "Children under five",
        "Ward-wise birth registration data",
        "Nepal vital statistics",
        "Birth registration statistics",
      ],
      url: "https://digital.khajuramun.gov.np/profile/demographics/ward-wise-birth-certificate-population",
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
        ...wardNumbers.map((wardNumber) => {
          const wardData = birthCertificateData.find((item) => item.wardNumber === wardNumber);
          return {
            "@type": "PropertyValue",
            name: `Ward ${wardNumber} Birth Certificate Holders`,
            unitText: "children",
            value: wardData?.birthCertificateHoldersBelow5years || 0,
          };
        }),
        {
          "@type": "PropertyValue",
          name: "Total Birth Certificate Holders Under 5 Years",
          unitText: "children",
          value: totalCertificateHolders,
        }
      ],
      observation: wardObservations,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="birth-certificate-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
