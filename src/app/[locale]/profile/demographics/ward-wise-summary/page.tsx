import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import { api } from "@/trpc/server";
import Image from "next/image";
import WardWiseCharts from "./_components/ward-wise-charts";
import WardWiseDemographicsAnalysis from "./_components/ward-wise-demographics-analysis";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "वडागत जनसांख्यिकी सारांश | पालिका प्रोफाइल",
  description:
    "प्रत्येक वडाको जनसांख्यिकी विवरण, लिङ्ग अनुपात, घरधुरी र जनसंख्या वितरणको विश्लेषण।",
  keywords: [
    "वडागत जनसांख्यिकी",
    "जनसंख्या वितरण",
    "वडा विवरण",
    "लिङ्ग अनुपात",
    "घरधुरी",
    "जनसंख्या घनत्व",
    "स्थानीय तह",
  ],
  openGraph: {
    title: "वडागत जनसांख्यिकी सारांश | पालिका प्रोफाइल",
    description:
      "प्रत्येक वडाको जनसांख्यिकी विवरण, लिङ्ग अनुपात, घरधुरी र जनसंख्या वितरणको विश्लेषण।",
    type: "article",
    locale: "ne_NP",
  },
};

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "वडागत जनसंख्या वितरण",
    slug: "ward-population-distribution",
  },
  { level: 2, text: "वडागत लिङ्ग अनुपात", slug: "gender-ratio" },
  { level: 2, text: "वडागत घरधुरी र परिवार संख्या", slug: "household-size" },
  { level: 2, text: "वडागत विश्लेषण", slug: "ward-analysis" },
  { level: 2, text: "तथ्याङ्क स्रोत", slug: "data-source" },
];

// Define Nepali names for gender
const GENDER_NAMES: Record<string, string> = {
  MALE: "पुरुष",
  FEMALE: "महिला",
  OTHER: "अन्य",
};

export default async function WardWiseSummaryPage() {
  // Fetch all ward-wise demographic data from tRPC route
  const wardData =
    await api.profile.demographics.wardWiseDemographicSummary.getAll.query();

  // Process ward data for display
  const processedWardData = wardData.map((ward) => {
    // Calculate total population from components if not directly provided
    const totalPopulation =
      ward.totalPopulation ||
      (ward.populationMale || 0) +
        (ward.populationFemale || 0) +
        (ward.populationOther || 0);

    // Calculate sex ratio if not provided
    const sexRatio = ward.sexRatio
      ? parseFloat(ward.sexRatio.toString())
      : ward.populationMale && ward.populationFemale && ward.populationMale > 0
        ? (ward.populationFemale / ward.populationMale) * 100
        : 0;

    // Calculate average household size if not provided
    const averageHouseholdSize = ward.averageHouseholdSize
      ? parseFloat(ward.averageHouseholdSize.toString())
      : ward.totalHouseholds && ward.totalHouseholds > 0
        ? totalPopulation / ward.totalHouseholds
        : 0;

    return {
      wardNumber: ward.wardNumber,
      wardName: ward.wardName || `वडा ${ward.wardNumber}`,
      totalPopulation,
      malePopulation: ward.populationMale || 0,
      femalePopulation: ward.populationFemale || 0,
      otherPopulation: ward.populationOther || 0,
      totalHouseholds: ward.totalHouseholds || 0,
      averageHouseholdSize: parseFloat(averageHouseholdSize.toFixed(2)),
      sexRatio: parseFloat(sexRatio.toFixed(2)),
      area: 0, // Will be populated if available
      density: 0, // Will be populated if available
    };
  });

  // Calculate municipality totals
  const municipalityStats = {
    totalPopulation: processedWardData.reduce(
      (sum, ward) => sum + ward.totalPopulation,
      0,
    ),
    malePopulation: processedWardData.reduce(
      (sum, ward) => sum + ward.malePopulation,
      0,
    ),
    femalePopulation: processedWardData.reduce(
      (sum, ward) => sum + ward.femalePopulation,
      0,
    ),
    otherPopulation: processedWardData.reduce(
      (sum, ward) => sum + ward.otherPopulation,
      0,
    ),
    totalHouseholds: processedWardData.reduce(
      (sum, ward) => sum + ward.totalHouseholds,
      0,
    ),
    totalArea: processedWardData.reduce(
      (sum, ward) => sum + (ward.area || 0),
      0,
    ),
  };

  // Calculate municipality averages
  const municipalityAverages = {
    averageHouseholdSize:
      municipalityStats.totalPopulation > 0 &&
      municipalityStats.totalHouseholds > 0
        ? parseFloat(
            (
              municipalityStats.totalPopulation /
              municipalityStats.totalHouseholds
            ).toFixed(2),
          )
        : 0,
    sexRatio:
      municipalityStats.malePopulation > 0
        ? parseFloat(
            (
              (municipalityStats.femalePopulation /
                municipalityStats.malePopulation) *
              100
            ).toFixed(2),
          )
        : 0,
    density:
      municipalityStats.totalArea > 0
        ? parseFloat(
            (
              municipalityStats.totalPopulation / municipalityStats.totalArea
            ).toFixed(2),
          )
        : 0,
  };

  // Format data for ward-wise sex ratio comparison
  const wardSexRatioData = processedWardData.map((ward) => ({
    ward: `वडा ${ward.wardNumber}`,
    sexRatio: ward.sexRatio,
    population: ward.totalPopulation,
  }));

  // Format data for ward-wise household size comparison
  const wardHouseholdData = processedWardData.map((ward) => ({
    ward: `वडा ${ward.wardNumber}`,
    householdSize: ward.averageHouseholdSize,
    households: ward.totalHouseholds,
  }));

  // Format data for ward-wise population distribution
  const wardPopulationData = processedWardData.map((ward) => ({
    ward: `वडा ${ward.wardNumber}`,
    population: ward.totalPopulation,
    malePopulation: ward.malePopulation,
    femalePopulation: ward.femalePopulation,
    otherPopulation: ward.otherPopulation,
    percentage: (
      (ward.totalPopulation / municipalityStats.totalPopulation) *
      100
    ).toFixed(2),
    households: ward.totalHouseholds,
    area: ward.area || 0,
    density: ward.density || 0,
  }));

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/ward-demographics.svg" // You'll need this image
              width={1200}
              height={400}
              alt="वडागत जनसांख्यिकी सारांश"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा पालिकाको प्रत्येक वडाको जनसांख्यिकी विवरण प्रस्तुत
              गरिएको छ। वडागत जनसंख्या वितरण, लिङ्ग अनुपात, घरधुरी विवरण र अन्य
              महत्त्वपूर्ण जनसांख्यिकी सूचकहरू यहाँ विश्लेषण गरिएको छ।
            </p>
            <p>
              वडागत विश्लेषणले पालिकाभित्र रहेका विविधता र असमानताहरू पहिचान
              गर्न मद्दत गर्दछ। यी तथ्याङ्कहरूले वडागत विकास योजना तर्जुमा,
              स्रोत साधन विनियोजन तथा अनुगमन मूल्याङ्कनमा महत्त्वपूर्ण भूमिका
              निर्वाह गर्दछन्।
            </p>

            <h2
              id="ward-population-distribution"
              className="scroll-m-20 border-b pb-2"
            >
              वडागत जनसंख्या वितरण
            </h2>
            <p>
              पालिकाको कुल जनसंख्या{" "}
              {municipalityStats.totalPopulation.toLocaleString()} रहेको छ,
              जसमध्ये {municipalityStats.malePopulation.toLocaleString()} पुरुष,{" "}
              {municipalityStats.femalePopulation.toLocaleString()} महिला र{" "}
              {municipalityStats.otherPopulation.toLocaleString()} अन्य लिङ्गका
              व्यक्तिहरू रहेका छन्। प्रत्येक वडाको जनसंख्या वितरण निम्नानुसार छ:
            </p>
          </div>

          {/* Client component for charts */}
          <WardWiseCharts
            wardPopulationData={wardPopulationData}
            wardSexRatioData={wardSexRatioData}
            wardHouseholdData={wardHouseholdData}
            municipalityStats={municipalityStats}
            municipalityAverages={municipalityAverages}
            GENDER_NAMES={GENDER_NAMES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="ward-analysis" className="scroll-m-20 border-b pb-2">
              वडागत विश्लेषण
            </h2>
            <p>
              प्रत्येक वडाको जनसांख्यिकीय संरचनाको विश्लेषणबाट निम्न सूचकहरू
              प्राप्त हुन्छन्:
            </p>

            {/* Client component for ward-wise analysis */}
            <WardWiseDemographicsAnalysis
              wardData={processedWardData}
              municipalityStats={municipalityStats}
              municipalityAverages={municipalityAverages}
            />

            <h2 id="data-source" className="scroll-m-20 border-b pb-2">
              तथ्याङ्क स्रोत
            </h2>
            <p>
              माथि प्रस्तुत गरिएका तथ्याङ्कहरू नेपालको राष्ट्रिय जनगणना र
              पालिकाको आफ्नै सर्वेक्षणबाट संकलन गरिएको हो। यी तथ्याङ्कहरूको
              महत्व निम्न अनुसार छ:
            </p>

            <ul>
              <li>वडागत विकास योजना तर्जुमा गर्न</li>
              <li>वडा स्तरीय सेवा प्रवाहको प्राथमिकता निर्धारण गर्न</li>
              <li>स्रोत साधनको न्यायोचित वितरण गर्न</li>
              <li>वडागत आवश्यकता पहिचान र सम्बोधन गर्न</li>
            </ul>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
