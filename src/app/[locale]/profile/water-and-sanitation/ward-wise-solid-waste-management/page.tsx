import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import WardWiseSolidWasteManagementCharts from "./_components/ward-wise-solid-waste-management-charts";
import WardWiseSolidWasteManagementAnalysisSection from "./_components/ward-wise-solid-waste-management-analysis-section";
import WardWiseSolidWasteManagementSEO from "./_components/ward-wise-solid-waste-management-seo";
import { solidWasteManagementOptions } from "@/server/api/routers/profile/water-and-sanitation/ward-wise-solid-waste-management.schema";

const WASTE_MANAGEMENT_GROUPS = {
  FORMAL_COLLECTION: {
    name: "औपचारिक संकलन",
    nameEn: "Formal Collection",
    color: "#4285F4", // Blue
    sources: [
      "HOME_COLLECTION",
      "WASTE_COLLECTING_PLACE"
    ]
  },
  SELF_MANAGED: {
    name: "स्व-व्यवस्थापन",
    nameEn: "Self-Managed",
    color: "#34A853", // Green
    sources: [
      "BURNING",
      "DIGGING",
      "COMPOST_MANURE"
    ]
  },
  IMPROPER_DISPOSAL: {
    name: "अनुचित निष्कासन",
    nameEn: "Improper Disposal",
    color: "#EA4335", // Red
    sources: [
      "RIVER",
      "ROAD_OR_PUBLIC_PLACE"
    ]
  },
  OTHER_METHODS: {
    name: "अन्य विधिहरू",
    nameEn: "Other Methods",
    color: "#FBBC05", // Yellow
    sources: [
      "OTHER"
    ]
  }
};

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  return [{ locale: "en" }];
}

// Optional: Add revalidation period
export const revalidate = 86400; // Revalidate once per day

// Generate metadata dynamically based on data
export async function generateMetadata(): Promise<Metadata> {
  try {
    const wardWiseSolidWasteManagementData =
      await api.profile.waterAndSanitation.wardWiseSolidWasteManagement.getAll.query();
    const municipalityName = "खजुरा गाउँपालिका"; // Khajura Rural Municipality

    // Group by ward number
    const wardGroups = wardWiseSolidWasteManagementData.reduce((acc: any, curr: any) => {
      acc[curr.wardNumber] = acc[curr.wardNumber] || [];
      acc[curr.wardNumber].push(curr);
      return acc;
    }, {});

    // Calculate ward totals and grand total
    let totalHouseholds = 0;
    let formalCollectionHouseholds = 0;

    Object.values(wardGroups).forEach((wardData: any) => {
      wardData.forEach((item: any) => {
        totalHouseholds += item.households;
        if (WASTE_MANAGEMENT_GROUPS.FORMAL_COLLECTION.sources.includes(item.solidWasteManagement)) {
          formalCollectionHouseholds += item.households;
        }
      });
    });

    // Calculate percentages for SEO description
    const formalCollectionPercentage = ((formalCollectionHouseholds / totalHouseholds) * 100).toFixed(2);

    // Create rich keywords
    const keywordsNP = [
      "खजुरा गाउँपालिका फोहोर व्यवस्थापन",
      "वडागत फोहोरमैला व्यवस्थापन",
      "औपचारिक फोहोर संकलन",
      `औपचारिक फोहोर संकलन ${formalCollectionPercentage}%`,
      "फोहोरमैला व्यवस्थापन विश्लेषण",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality solid waste management",
      "Ward-wise solid waste management",
      "Formal waste collection",
      `Formal waste collection ${formalCollectionPercentage}%`,
      "Solid waste management analysis",
    ];

    // Create description
    const descriptionNP = `खजुरा गाउँपालिकामा फोहोरमैला व्यवस्थापनको वडागत विश्लेषण। कुल ${localizeNumber(totalHouseholds.toLocaleString(), "ne")} घरधुरी मध्ये ${localizeNumber(formalCollectionPercentage, "ne")}% (${localizeNumber(formalCollectionHouseholds.toLocaleString(), "ne")}) घरधुरीले औपचारिक संकलन विधि प्रयोग गर्दछन्।`;

    const descriptionEN = `Ward-wise analysis of solid waste management in Khajura Rural Municipality. Out of a total of ${totalHouseholds.toLocaleString()} households, ${formalCollectionPercentage}% (${formalCollectionHouseholds.toLocaleString()}) households use formal waste collection methods.`;

    return {
      title: `फोहोरमैला व्यवस्थापन | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/water-and-sanitation/ward-wise-solid-waste-management",
        languages: {
          en: "/en/profile/water-and-sanitation/ward-wise-solid-waste-management",
          ne: "/ne/profile/water-and-sanitation/ward-wise-solid-waste-management",
        },
      },
      openGraph: {
        title: `फोहोरमैला व्यवस्थापनको अवस्था | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `फोहोरमैला व्यवस्थापनको अवस्था | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "फोहोरमैला व्यवस्थापन | खजुरा गाउँपालिका डिजिटल प्रोफाइल",
      description: "वडा अनुसार फोहोरमैला व्यवस्थापनको अवस्था र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "फोहोरमैला व्यवस्थापनको वितरण", slug: "distribution-of-solid-waste-management" },
  { level: 2, text: "वडा अनुसार फोहोरमैला व्यवस्थापन", slug: "ward-wise-solid-waste-management" },
  { level: 2, text: "फोहोरमैला व्यवस्थापनको विश्लेषण", slug: "solid-waste-management-analysis" },
  { level: 2, text: "फोहोरमैला व्यवस्थापन सुधारका रणनीतिहरू", slug: "solid-waste-improvement-strategies" },
];

export default async function WardWiseSolidWasteManagementPage() {
  // Fetch all ward-wise solid waste management data using tRPC
  const wardWiseSolidWasteManagementData =
    await api.profile.waterAndSanitation.wardWiseSolidWasteManagement.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.waterAndSanitation.wardWiseSolidWasteManagement.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Group by ward number
  const wardGroups = wardWiseSolidWasteManagementData.reduce((acc: any, curr: any) => {
    acc[curr.wardNumber] = acc[curr.wardNumber] || [];
    acc[curr.wardNumber].push(curr);
    return acc;
  }, {});

  // Create a mapping of waste management source to its human-readable name
  const sourceMap: Record<string, string> = {};
  solidWasteManagementOptions.forEach(option => {
    sourceMap[option.value] = option.label.split(" (")[0];
  });

  // Calculate totals by waste management group
  let totalHouseholds = 0;
  const wasteManagementGroupTotals: Record<string, number> = {
    FORMAL_COLLECTION: 0,
    SELF_MANAGED: 0,
    IMPROPER_DISPOSAL: 0,
    OTHER_METHODS: 0
  };

  // Count by individual waste management method
  const wasteManagementTotals: Record<string, number> = {};

  Object.values(wardGroups).forEach((wardData: any) => {
    wardData.forEach((item: any) => {
      // Add to total households
      totalHouseholds += item.households;
      
      // Initialize if not exists
      if (!wasteManagementTotals[item.solidWasteManagement]) {
        wasteManagementTotals[item.solidWasteManagement] = 0;
      }
      
      // Add to source totals
      wasteManagementTotals[item.solidWasteManagement] += item.households;
      
      // Add to group totals
      for (const groupKey of Object.keys(WASTE_MANAGEMENT_GROUPS)) {
        if (WASTE_MANAGEMENT_GROUPS[groupKey as keyof typeof WASTE_MANAGEMENT_GROUPS].sources.includes(item.solidWasteManagement)) {
          wasteManagementGroupTotals[groupKey] += item.households;
          break;
        }
      }
    });
  });

  // Calculate percentages
  const wasteManagementGroupPercentages: Record<string, number> = {};
  Object.keys(wasteManagementGroupTotals).forEach(group => {
    wasteManagementGroupPercentages[group] = parseFloat(((wasteManagementGroupTotals[group] / totalHouseholds) * 100).toFixed(2));
  });

  // Get unique ward numbers
  const wardNumbers = Object.keys(wardGroups).map(Number).sort((a, b) => a - b);

  // Process data for pie chart
  const pieChartData = Object.keys(WASTE_MANAGEMENT_GROUPS).map(groupKey => {
    const group = WASTE_MANAGEMENT_GROUPS[groupKey as keyof typeof WASTE_MANAGEMENT_GROUPS];
    return {
      name: group.name,
      nameEn: group.nameEn,
      value: wasteManagementGroupTotals[groupKey],
      percentage: wasteManagementGroupPercentages[groupKey].toFixed(2),
      color: group.color,
    };
  });

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = wardGroups[wardNumber];
    
    if (!wardData) return null;
    
    const totalWardHouseholds = wardData.reduce((sum: number, item: any) => sum + item.households, 0);
    
    // Calculate ward-level totals for each waste management group
    const wardWasteManagementGroups: Record<string, number> = {};
    Object.keys(WASTE_MANAGEMENT_GROUPS).forEach(groupKey => {
      const group = WASTE_MANAGEMENT_GROUPS[groupKey as keyof typeof WASTE_MANAGEMENT_GROUPS];
      const groupTotal = wardData
        .filter((item: any) => group.sources.includes(item.solidWasteManagement))
        .reduce((sum: number, item: any) => sum + item.households, 0);
      
      wardWasteManagementGroups[group.name] = groupTotal;
    });
    
    return {
      ward: `वडा ${wardNumber}`,
      wardNumber,
      ...wardWasteManagementGroups,
      total: totalWardHouseholds,
    };
  }).filter(Boolean);

  // Find the ward with highest formal collection percentage
  const wardFormalCollectionPercentages = wardWiseData.map((ward: any) => {
    const formalCollectionPercentage = (ward[WASTE_MANAGEMENT_GROUPS.FORMAL_COLLECTION.name] / ward.total) * 100;
    return {
      wardNumber: ward.wardNumber,
      percentage: formalCollectionPercentage
    };
  });
  
  const highestFormalCollectionWard = [...wardFormalCollectionPercentages].sort((a, b) => b.percentage - a.percentage)[0];
  const lowestFormalCollectionWard = [...wardFormalCollectionPercentages].sort((a, b) => a.percentage - b.percentage)[0];

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <WardWiseSolidWasteManagementSEO
        wardWiseSolidWasteManagementData={wardWiseSolidWasteManagementData}
        totalHouseholds={totalHouseholds}
        wasteManagementGroupTotals={wasteManagementGroupTotals}
        wasteManagementGroupPercentages={wasteManagementGroupPercentages}
        highestFormalCollectionWard={highestFormalCollectionWard}
        lowestFormalCollectionWard={lowestFormalCollectionWard}
        WASTE_MANAGEMENT_GROUPS={WASTE_MANAGEMENT_GROUPS}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/solid-waste-management.svg"
              width={1200}
              height={400}
              alt="फोहोरमैला व्यवस्थापन - खजुरा गाउँपालिका (Solid Waste Management - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              खजुरा गाउँपालिकामा फोहोरमैला व्यवस्थापनको अवस्था
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              फोहोरमैला व्यवस्थापनको अवस्था वातावरणीय स्वच्छता, सार्वजनिक स्वास्थ्य र समग्र जीवनस्तरको एक महत्वपूर्ण
              निर्धारक हो। यस खण्डमा खजुरा गाउँपालिकाको विभिन्न वडाहरूमा फोहोरमैला व्यवस्थापन विधिहरूको
              प्रयोग र वितरणको विश्लेषण प्रस्तुत गरिएको छ।
            </p>
            <p>
              खजुरा गाउँपालिकामा कुल {localizeNumber(totalHouseholds.toLocaleString(), "ne")} घरधुरीहरू मध्ये 
              {localizeNumber(wasteManagementGroupPercentages.FORMAL_COLLECTION.toFixed(2), "ne")}% ले औपचारिक संकलन, 
              {localizeNumber(wasteManagementGroupPercentages.SELF_MANAGED.toFixed(2), "ne")}% ले स्व-व्यवस्थापन, र 
              {localizeNumber(wasteManagementGroupPercentages.IMPROPER_DISPOSAL.toFixed(2), "ne")}% ले अनुचित निष्कासन विधि अपनाउँछन्।
            </p>

            <h2
              id="distribution-of-solid-waste-management"
              className="scroll-m-20 border-b pb-2"
            >
              फोहोरमैला व्यवस्थापनको वितरण
            </h2>
            <p>
              खजुरा गाउँपालिकामा फोहोरमैला व्यवस्थापनको वितरण निम्नानुसार रहेको छ:
            </p>
          </div>

        
          <WardWiseSolidWasteManagementCharts
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            totalHouseholds={totalHouseholds}
            wasteManagementTotals={wasteManagementTotals}
            sourceMap={sourceMap}
            wasteManagementGroupTotals={wasteManagementGroupTotals}
            wasteManagementGroupPercentages={wasteManagementGroupPercentages}
            wardWiseFormalCollectionPercentage={wardFormalCollectionPercentages}
            highestFormalCollectionWard={highestFormalCollectionWard}
            lowestFormalCollectionWard={lowestFormalCollectionWard}
            WASTE_MANAGEMENT_GROUPS={WASTE_MANAGEMENT_GROUPS}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="solid-waste-management-analysis" className="scroll-m-20 border-b pb-2">
              फोहोरमैला व्यवस्थापनको विश्लेषण
            </h2>
            <p>
              खजुरा गाउँपालिकामा फोहोरमैला व्यवस्थापनको विश्लेषण गर्दा, समग्रमा 
              {localizeNumber(wasteManagementGroupPercentages.FORMAL_COLLECTION.toFixed(2), "ne")}% घरधुरीले औपचारिक फोहोर संकलन विधि अपनाउँछन्।
              वडागत रूपमा हेर्दा वडा नं. {localizeNumber(highestFormalCollectionWard.wardNumber.toString(), "ne")} मा 
              सबैभन्दा बढी {localizeNumber(highestFormalCollectionWard.percentage.toFixed(2), "ne")}% 
              घरधुरीले औपचारिक फोहोर संकलन प्रणाली प्रयोग गर्दछन्।
            </p>

            <WardWiseSolidWasteManagementAnalysisSection
              totalHouseholds={totalHouseholds}
              wasteManagementGroupTotals={wasteManagementGroupTotals}
              wasteManagementGroupPercentages={wasteManagementGroupPercentages}
              wasteManagementTotals={wasteManagementTotals}
              sourceMap={sourceMap}
              wardWiseFormalCollectionPercentage={wardFormalCollectionPercentages}
              highestFormalCollectionWard={highestFormalCollectionWard}
              lowestFormalCollectionWard={lowestFormalCollectionWard}
              WASTE_MANAGEMENT_GROUPS={WASTE_MANAGEMENT_GROUPS}
            />

            <h2
              id="solid-waste-improvement-strategies"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              फोहोरमैला व्यवस्थापन सुधारका रणनीतिहरू
            </h2>

            <p>
              खजुरा गाउँपालिकामा फोहोरमैला व्यवस्थापनको तथ्याङ्क विश्लेषणबाट निम्न रणनीतिहरू 
              अवलम्बन गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>औपचारिक फोहोर संकलन विस्तार:</strong> वडा नं. {localizeNumber(lowestFormalCollectionWard.wardNumber.toString(), "ne")} जस्ता 
                  कम औपचारिक संकलन भएका वडाहरूमा घर-घरमा फोहोर संकलन सेवा विस्तार गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>कम्पोस्ट मल प्रवर्द्धन कार्यक्रम:</strong> घरायसी स्तरमा जैविक फोहोरबाट 
                  कम्पोस्ट मल बनाउने तालिम र प्रविधि प्रदान गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>अनुचित निष्कासन न्यूनीकरण अभियान:</strong> नदी, खोला र सार्वजनिक स्थलमा फोहोर फाल्ने प्रवृत्ति 
                  न्यूनीकरण गर्न जनचेतना कार्यक्रम सञ्चालन गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>वडास्तरीय फोहोर व्यवस्थापन समिति:</strong> हरेक वडामा फोहोर व्यवस्थापन समिति गठन गरी 
                  सामुदायिक स्तरमा फोहोर व्यवस्थापन प्रणाली बिकास गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>फोहोर छुट्याउने अभियान:</strong> घरधुरी स्तरमा फोहोर छुट्याउने अभ्यास (जैविक, अजैविक र पुनः प्रयोग योग्य) 
                  शुरू गर्न प्रोत्साहन र अभियान सञ्चालन गर्ने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              यसरी खजुरा गाउँपालिकामा फोहोरमैला व्यवस्थापनको विश्लेषणले पालिकामा 
              फोहोरमैला व्यवस्थापन नीति निर्माण र कार्यक्रम तर्जुमा गर्न महत्वपूर्ण भूमिका खेल्दछ। वडागत आवश्यकता 
              र विशेषताहरूलाई ध्यानमा राखी दिगो फोहोरमैला व्यवस्थापन प्रणाली स्थापना गर्न विशेष कार्यक्रमहरू 
              सञ्चालन गर्नुपर्ने देखिन्छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
