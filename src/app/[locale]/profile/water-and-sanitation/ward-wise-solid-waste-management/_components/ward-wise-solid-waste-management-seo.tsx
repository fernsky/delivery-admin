import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseSolidWasteManagementSEOProps {
  wardWiseSolidWasteManagementData: any[];
  totalHouseholds: number;
  wasteManagementGroupTotals: Record<string, number>;
  wasteManagementGroupPercentages: Record<string, number>;
  highestFormalCollectionWard: {
    wardNumber: number;
    percentage: number;
  };
  lowestFormalCollectionWard: {
    wardNumber: number;
    percentage: number;
  };
  WASTE_MANAGEMENT_GROUPS: Record<string, {
    name: string;
    nameEn: string;
    color: string;
    sources: string[];
  }>;
  wardNumbers: number[];
}

export default function WardWiseSolidWasteManagementSEO({
  wardWiseSolidWasteManagementData,
  totalHouseholds,
  wasteManagementGroupTotals,
  wasteManagementGroupPercentages,
  highestFormalCollectionWard,
  lowestFormalCollectionWard,
  WASTE_MANAGEMENT_GROUPS,
  wardNumbers,
}: WardWiseSolidWasteManagementSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert ward-wise solid waste management to structured data format
    const wasteManagementStats = wardNumbers.map((wardNumber) => {
      const wardData = wardWiseSolidWasteManagementData.filter((item) => item.wardNumber === wardNumber);
      
      if (!wardData?.length) return null;
      
      const totalWardHouseholds = wardData.reduce((sum, item) => sum + item.households, 0);
      
      // Calculate formal collection percentage for this ward
      const formalSources = WASTE_MANAGEMENT_GROUPS.FORMAL_COLLECTION.sources;
      const formalCollectionHouseholds = wardData
        .filter((item) => formalSources.includes(item.solidWasteManagement))
        .reduce((sum, item) => sum + item.households, 0);
      
      const formalCollectionPercent = totalWardHouseholds > 0 
        ? ((formalCollectionHouseholds / totalWardHouseholds) * 100).toFixed(2)
        : "0";
        
      return {
        "@type": "Observation",
        name: `Solid Waste Management Statistics in Ward ${wardNumber} of Khajura Rural Municipality`,
        observationDate: new Date().toISOString().split("T")[0],
        measuredProperty: {
          "@type": "PropertyValue",
          name: "Formal waste collection rate",
          unitText: "percentage",
        },
        measuredValue: parseFloat(formalCollectionPercent),
        description: `In Ward ${wardNumber} of Khajura Rural Municipality, ${formalCollectionHouseholds.toLocaleString()} households (${formalCollectionPercent}%) use formal waste collection methods out of a total of ${totalWardHouseholds.toLocaleString()} households.`,
      };
    }).filter(Boolean);

    // Calculate environmental impact score (0-100) based on waste management types
    const environmentalImpactScore = 
      (wasteManagementGroupPercentages.FORMAL_COLLECTION * 1.0) + 
      (wasteManagementGroupPercentages.SELF_MANAGED * 0.7) + 
      (wasteManagementGroupPercentages.IMPROPER_DISPOSAL * 0.1) + 
      (wasteManagementGroupPercentages.OTHER_METHODS * 0.5);

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Solid Waste Management in Khajura Rural Municipality (खजुरा गाउँपालिका)",
      description: `Analysis of solid waste management methods across ${wardNumbers.length} wards of Khajura Rural Municipality with a total of ${totalHouseholds.toLocaleString()} households. ${wasteManagementGroupTotals.FORMAL_COLLECTION.toLocaleString()} households (${wasteManagementGroupPercentages.FORMAL_COLLECTION.toFixed(2)}%) use formal waste collection methods. The highest formal collection rate is in Ward ${highestFormalCollectionWard?.wardNumber || ""} with ${highestFormalCollectionWard?.percentage.toFixed(2) || ""}%.`,
      keywords: [
        "Khajura Rural Municipality",
        "खजुरा गाउँपालिका",
        "Solid waste management",
        "Formal waste collection",
        "Ward-wise waste management",
        "Rural waste management",
        "Nepal waste management",
        "Waste disposal methods",
        "Sustainable waste management",
        "Environmental impact assessment",
        "Household waste practices",
        "Waste collection services",
      ],
      url: "https://digital.khajuramun.gov.np/profile/water-and-sanitation/ward-wise-solid-waste-management",
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
          name: "Formal collection households",
          unitText: "households",
          value: wasteManagementGroupTotals.FORMAL_COLLECTION,
        },
        {
          "@type": "PropertyValue",
          name: "Self-managed waste households",
          unitText: "households",
          value: wasteManagementGroupTotals.SELF_MANAGED,
        },
        {
          "@type": "PropertyValue",
          name: "Improper disposal households",
          unitText: "households",
          value: wasteManagementGroupTotals.IMPROPER_DISPOSAL,
        },
        {
          "@type": "PropertyValue",
          name: "Other methods households",
          unitText: "households",
          value: wasteManagementGroupTotals.OTHER_METHODS,
        },
        {
          "@type": "PropertyValue",
          name: "Formal Collection Rate",
          unitText: "percentage",
          value: parseFloat(wasteManagementGroupPercentages.FORMAL_COLLECTION.toFixed(2)),
        },
        {
          "@type": "PropertyValue",
          name: "Environmental Impact Score",
          unitText: "index",
          value: environmentalImpactScore.toFixed(2),
        }
      ],
      observation: wasteManagementStats,
      about: [
        {
          "@type": "Thing",
          name: "Water and Sanitation",
          description: "Solid waste management methods and practices"
        },
        {
          "@type": "Thing",
          name: "Waste Management",
          description: "Analysis of household waste disposal methods"
        }
      ],
      isBasedOn: {
        "@type": "GovernmentService",
        name: "Municipality Waste Management Survey",
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
        id="solid-waste-management-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
