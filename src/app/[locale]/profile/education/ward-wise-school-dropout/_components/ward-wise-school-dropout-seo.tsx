import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseSchoolDropoutSEOProps {
  wardWiseSchoolDropoutData: any[];
  totalDropouts: number;
  dropoutGroupTotals: Record<string, number>;
  dropoutGroupPercentages: Record<string, number>;
  highestEmploymentDropoutWard: {
    wardNumber: number;
    percentage: number;
  };
  lowestEmploymentDropoutWard: {
    wardNumber: number;
    percentage: number;
  };
  DROPOUT_CAUSE_GROUPS: Record<string, {
    name: string;
    nameEn: string;
    color: string;
    causes: string[];
  }>;
  wardNumbers: number[];
}

export default function WardWiseSchoolDropoutSEO({
  wardWiseSchoolDropoutData,
  totalDropouts,
  dropoutGroupTotals,
  dropoutGroupPercentages,
  highestEmploymentDropoutWard,
  lowestEmploymentDropoutWard,
  DROPOUT_CAUSE_GROUPS,
  wardNumbers,
}: WardWiseSchoolDropoutSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert ward-wise school dropout to structured data format
    const dropoutStats = wardNumbers.map((wardNumber) => {
      const wardData = wardWiseSchoolDropoutData.filter((item) => item.wardNumber === wardNumber);
      
      if (!wardData?.length) return null;
      
      const totalWardDropouts = wardData.reduce((sum, item) => sum + item.population, 0);
      
      // Calculate employment-related dropout percentage for this ward
      const employmentCauses = DROPOUT_CAUSE_GROUPS.EMPLOYMENT.causes;
      const employmentDropouts = wardData
        .filter((item) => employmentCauses.includes(item.cause))
        .reduce((sum, item) => sum + item.population, 0);
      
      const employmentDropoutPercent = totalWardDropouts > 0 
        ? ((employmentDropouts / totalWardDropouts) * 100).toFixed(2)
        : "0";
        
      return {
        "@type": "Observation",
        name: `School Dropout Statistics in Ward ${wardNumber} of Khajura Rural Municipality`,
        observationDate: new Date().toISOString().split("T")[0],
        measuredProperty: {
          "@type": "PropertyValue",
          name: "Employment-related dropout rate",
          unitText: "percentage",
        },
        measuredValue: parseFloat(employmentDropoutPercent),
        description: `In Ward ${wardNumber} of Khajura Rural Municipality, ${employmentDropouts.toLocaleString()} students (${employmentDropoutPercent}%) have dropped out of school due to employment-related reasons out of a total of ${totalWardDropouts.toLocaleString()} dropouts.`,
      };
    }).filter(Boolean);

    // Calculate school retention index (0-100) - inverse of dropout severity
    const retentionIndex = 100 - (
      (dropoutGroupPercentages.EMPLOYMENT * 0.6) + 
      (dropoutGroupPercentages.EDUCATION * 0.2) + 
      (dropoutGroupPercentages.SOCIAL * 0.4) + 
      (dropoutGroupPercentages.OTHER * 0.2)
    ) / 2;

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "School Dropout Causes in Khajura Rural Municipality (खजुरा गाउँपालिका)",
      description: `Analysis of school dropout causes across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalDropouts.toLocaleString()} dropouts. ${dropoutGroupTotals.EMPLOYMENT.toLocaleString()} students (${dropoutGroupPercentages.EMPLOYMENT.toFixed(2)}%) have left school due to employment-related reasons. The highest employment-related dropout rate is in Ward ${highestEmploymentDropoutWard?.wardNumber || ""} with ${highestEmploymentDropoutWard?.percentage.toFixed(2) || ""}%.`,
      keywords: [
        "Khajura Rural Municipality",
        "खजुरा गाउँपालिका",
        "School dropout",
        "Employment-related dropouts",
        "Ward-wise school dropout",
        "Rural education challenges",
        "Nepal education",
        "Dropout causes",
        "Education retention",
        "School retention",
        "Dropout status",
        "Dropout distribution",
        "Education index",
      ],
      url: "https://digital.khajuramun.gov.np/profile/education/ward-wise-school-dropout",
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
          name: "Employment-related dropouts",
          unitText: "people",
          value: dropoutGroupTotals.EMPLOYMENT,
        },
        {
          "@type": "PropertyValue",
          name: "Education-related dropouts",
          unitText: "people",
          value: dropoutGroupTotals.EDUCATION,
        },
        {
          "@type": "PropertyValue",
          name: "Social-related dropouts",
          unitText: "people",
          value: dropoutGroupTotals.SOCIAL,
        },
        {
          "@type": "PropertyValue",
          name: "Other dropouts",
          unitText: "people",
          value: dropoutGroupTotals.OTHER,
        },
        {
          "@type": "PropertyValue",
          name: "Employment-Related Dropout Rate",
          unitText: "percentage",
          value: parseFloat(dropoutGroupPercentages.EMPLOYMENT.toFixed(2)),
        },
        {
          "@type": "PropertyValue",
          name: "School Retention Index",
          unitText: "index",
          value: retentionIndex.toFixed(2),
        }
      ],
      observation: dropoutStats,
      about: [
        {
          "@type": "Thing",
          name: "Education",
          description: "School dropout causes and analysis"
        },
        {
          "@type": "Thing",
          name: "School Dropout",
          description: "Reasons for students leaving school before completion"
        }
      ],
      isBasedOn: {
        "@type": "GovernmentService",
        name: "Municipality Education Survey",
        provider: {
          "@type": "GovernmentOrganization",
          name: "Khajura Rural Municipality",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Khajura",
            addressRegion: "Banke",
            addressCountry: "Nepal",
          },
        },
      },
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="school-dropout-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
