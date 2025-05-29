import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import OccupationCharts from "./_components/occupation-charts";
import OccupationAnalysisSection from "./_components/occupation-analysis-section";
import OccupationSEO from "./_components/occupation-seo";
import { api } from "@/trpc/server";
import { OccupationType } from "@/server/api/routers/profile/demographics/ward-wise-major-occupation.schema";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Define Nepali names for occupations
const OCCUPATION_NAMES: Record<string, string> = {
  GOVERNMENTAL_JOB: "सरकारी नोकरी / जागिर",
  NON_GOVERNMENTAL_JOB: "गैरसरकारी नोकरी / जागिर",
  LABOUR: "ज्याला/ मजदुरी",
  FOREIGN_EMPLOYMENT: "वैदेशिक रोजगारी",
  BUSINESS: "व्यापार",
  OTHER_EMPLOYMENT: "अन्य रोजगारी",
  STUDENT: "विद्यार्थी",
  HOUSEHOLDER: "गृहणी",
  OTHER_UNEMPLOYMENT: "अन्य बेरोजगार",
  INDUSTRY: "उद्योग, व्यापार, कृषि",
  ANIMAL_HUSBANDRY: "पशुपालन",
  OTHER_SELF_EMPLOYMENT: "अन्य स्वरोजगार",
};

// Define English names for occupations (for SEO)
const OCCUPATION_NAMES_EN: Record<string, string> = {
  GOVERNMENTAL_JOB: "Government Job",
  NON_GOVERNMENTAL_JOB: "Non-Government Job",
  LABOUR: "Daily Labor/Wage",
  FOREIGN_EMPLOYMENT: "Foreign Employment",
  BUSINESS: "Business",
  OTHER_EMPLOYMENT: "Other Employment",
  STUDENT: "Student",
  HOUSEHOLDER: "Housewife/Householder",
  OTHER_UNEMPLOYMENT: "Other Unemployed",
  INDUSTRY: "Industry, Trade, and Agriculture",
  ANIMAL_HUSBANDRY: "Animal Husbandry",
  OTHER_SELF_EMPLOYMENT: "Other Self-Employment",
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const occupationData =
      await api.profile.demographics.wardWiseMajorOccupation.getAll.query();
    const municipalityName = "खजुरा गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalPopulation = occupationData.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );

    // Group by occupation and calculate totals
    const occupationCounts: Record<string, number> = {};
    occupationData.forEach((item) => {
      if (!occupationCounts[item.occupation])
        occupationCounts[item.occupation] = 0;
      occupationCounts[item.occupation] += item.population || 0;
    });

    // Get top 3 occupations for keywords
    const topOccupations = Object.entries(occupationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);

    // Create rich keywords with actual data
    const keywordsNP = [
      "खजुरा गाउँपालिका मुख्य पेशा",
      "खजुरा पेशागत वितरण",
      `खजुरा ${OCCUPATION_NAMES[topOccupations[0] as OccupationType]} जनसंख्या`,
      ...topOccupations.map(
        (r) => `${OCCUPATION_NAMES[r as OccupationType]} पेशा खजुरा`,
      ),
      "वडा अनुसार पेशागत वितरण",
      "आर्थिक गतिविधि तथ्याङ्क",
      "पेशागत सर्वेक्षण खजुरा",
      `खजुरा कुल जनसंख्या ${totalPopulation}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality main occupations",
      "Khajura occupational distribution",
      `Khajura ${OCCUPATION_NAMES_EN[topOccupations[0] as OccupationType]} population`,
      ...topOccupations.map(
        (r) =>
          `${OCCUPATION_NAMES_EN[r as OccupationType]} occupation in Khajura`,
      ),
      "Ward-wise occupational distribution",
      "Economic activity statistics",
      "Occupational survey Khajura",
      `Khajura total population ${totalPopulation}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `खजुरा गाउँपालिकाको वडा अनुसार मुख्य पेशागत वितरण, प्रवृत्ति र विश्लेषण। कुल जनसंख्या ${totalPopulation} मध्ये ${OCCUPATION_NAMES[topOccupations[0] as OccupationType]} (${occupationCounts[topOccupations[0]]}) सबैभन्दा ठूलो समूह हो, त्यसपछि ${OCCUPATION_NAMES[topOccupations[1] as OccupationType]} (${occupationCounts[topOccupations[1]]}) र ${OCCUPATION_NAMES[topOccupations[2] as OccupationType]} (${occupationCounts[topOccupations[2]]})। विभिन्न पेशाहरूको विस्तृत तथ्याङ्क र विजुअलाइजेसन।`;

    const descriptionEN = `Ward-wise main occupation distribution, trends and analysis for Khajura Rural Municipality. Out of a total population of ${totalPopulation}, ${OCCUPATION_NAMES_EN[topOccupations[0] as OccupationType]} (${occupationCounts[topOccupations[0]]}) is the largest group, followed by ${OCCUPATION_NAMES_EN[topOccupations[1] as OccupationType]} (${occupationCounts[topOccupations[1]]}) and ${OCCUPATION_NAMES_EN[topOccupations[2] as OccupationType]} (${occupationCounts[topOccupations[2]]})। Detailed statistics and visualizations of various occupational categories.`;

    return {
      title: `मुख्य पेशागत वितरण | ${municipalityName} पालिका प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/ward-main-occupations",
        languages: {
          en: "/en/profile/economics/ward-main-occupations",
          ne: "/ne/profile/economics/ward-main-occupations",
        },
      },
      openGraph: {
        title: `मुख्य पेशागत वितरण | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `मुख्य पेशागत वितरण | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "मुख्य पेशागत वितरण | पालिका प्रोफाइल",
      description:
        "वडा अनुसार मुख्य पेशागत वितरण, प्रवृत्ति र विश्लेषण। विभिन्न पेशाहरूको विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "पेशा अनुसार जनसंख्या", slug: "occupation-distribution" },
  { level: 2, text: "वडा अनुसार पेशागत विविधता", slug: "ward-wise-occupation" },
  { level: 2, text: "प्रमुख पेशाहरूको विश्लेषण", slug: "major-occupations" },
  { level: 2, text: "तथ्याङ्क स्रोत", slug: "data-source" },
];

export default async function WardMainOccupationsPage() {
  // Fetch all occupation data using tRPC
  const occupationData =
    await api.profile.demographics.wardWiseMajorOccupation.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.demographics.wardWiseMajorOccupation.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  const overallSummary = Object.entries(
    occupationData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.occupation]) acc[item.occupation] = 0;
      acc[item.occupation] += item.population || 0;
      return acc;
    }, {}),
  )
    .map(([occupation, population]) => ({
      occupation,
      occupationName:
        OCCUPATION_NAMES[occupation as keyof typeof OCCUPATION_NAMES] ||
        occupation,
      population,
    }))
    .sort((a, b) => b.population - a.population);

  // Calculate total population for percentages
  const totalPopulation = overallSummary.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  // Take top 7 occupations for pie chart, group others
  const topOccupations = overallSummary.slice(0, 7);
  const otherOccupations = overallSummary.slice(7);

  const otherTotalPopulation = otherOccupations.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  let pieChartData = topOccupations.map((item) => ({
    name: item.occupationName,
    value: item.population,
    percentage: ((item.population / totalPopulation) * 100).toFixed(2),
  }));

  // Add "Other" category if there are more than 7 occupations
  if (otherOccupations.length > 0) {
    pieChartData.push({
      name: "अन्य",
      value: otherTotalPopulation,
      percentage: ((otherTotalPopulation / totalPopulation) * 100).toFixed(2),
    });
  }

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(occupationData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for ward-wise visualization (top 5 occupations per ward + others)
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = occupationData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    // Sort ward data by population
    wardData.sort((a, b) => (b.population || 0) - (a.population || 0));

    // Take top 5 occupations for this ward
    const topWardOccupations = wardData.slice(0, 5);
    const otherWardOccupations = wardData.slice(5);
    const otherWardTotal = otherWardOccupations.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );

    const result: Record<string, any> = { ward: `वडा ${wardNumber}` };

    // Add top occupations
    topWardOccupations.forEach((item) => {
      result[
        OCCUPATION_NAMES[item.occupation as keyof typeof OCCUPATION_NAMES] ||
          item.occupation
      ] = item.population;
    });

    // Add "Other" category if needed
    if (otherWardOccupations.length > 0) {
      result["अन्य"] = otherWardTotal;
    }

    return result;
  });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <OccupationSEO
        overallSummary={overallSummary}
        totalPopulation={totalPopulation}
        OCCUPATION_NAMES={OCCUPATION_NAMES}
        OCCUPATION_NAMES_EN={OCCUPATION_NAMES_EN}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/occupation-diversity.svg"
              width={1200}
              height={400}
              alt="मुख्य पेशागत वितरण - खजुरा गाउँपालिका (Main Occupational Distribution - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              खजुरा गाउँपालिकामा मुख्य पेशागत वितरण
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा खजुरा गाउँपालिकाको विभिन्न वडाहरूमा बसोबास गर्ने
              नागरिकहरूको मुख्य पेशा सम्बन्धी विस्तृत तथ्याङ्क प्रस्तुत गरिएको
              छ। यो तथ्याङ्कले आर्थिक गतिविधि, रोजगारीको अवस्था र श्रम बजारको
              संरचनालाई प्रतिबिम्बित गर्दछ।
            </p>
            <p>
              खजुरा गाउँपालिकामा विभिन्न प्रकारका पेशाहरूमा मानिसहरू संलग्न छन्।
              कुल जनसंख्या {totalPopulation.toLocaleString()} मध्ये{" "}
              {overallSummary[0]?.occupationName || ""} गर्ने व्यक्तिहरू{" "}
              {(
                ((overallSummary[0]?.population || 0) / totalPopulation) *
                100
              ).toFixed(1)}
              % रहेका छन्। यस तथ्याङ्कले रोजगारी सृजना, सीप विकास र आर्थिक
              योजनामा महत्वपूर्ण भूमिका खेल्दछ।
            </p>

            <h2
              id="occupation-distribution"
              className="scroll-m-20 border-b pb-2"
            >
              पेशा अनुसार जनसंख्या
            </h2>
            <p>
              खजुरा गाउँपालिकामा विभिन्न पेशामा संलग्न व्यक्तिहरूको संख्या
              निम्नानुसार छ:
            </p>
          </div>

          {/* Client component for charts */}
          <OccupationCharts
            overallSummary={overallSummary}
            totalPopulation={totalPopulation}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            occupationData={occupationData}
            OCCUPATION_NAMES={OCCUPATION_NAMES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="major-occupations" className="scroll-m-20 border-b pb-2">
              प्रमुख पेशाहरूको विश्लेषण
            </h2>
            <p>
              खजुरा गाउँपालिकामा निम्न पेशाहरू प्रमुख रूपमा देखिन्छन्। यी
              पेशाहरू मध्ये{" "}
              {OCCUPATION_NAMES[
                overallSummary[0]?.occupation as keyof typeof OCCUPATION_NAMES
              ] || "कृषि"}{" "}
              सबैभन्दा धेरै व्यक्तिहरूले अपनाएको पेशा हो, जसमा कुल जनसंख्याको{" "}
              {(
                ((overallSummary[0]?.population || 0) / totalPopulation) *
                100
              ).toFixed(2)}
              % संलग्न छन्।
            </p>

            {/* Client component for occupation analysis section */}
            <OccupationAnalysisSection
              overallSummary={overallSummary}
              totalPopulation={totalPopulation}
              OCCUPATION_NAMES={OCCUPATION_NAMES}
              OCCUPATION_NAMES_EN={OCCUPATION_NAMES_EN}
            />

            <h2 id="data-source" className="scroll-m-20 border-b pb-2">
              तथ्याङ्क स्रोत
            </h2>
            <p>
              माथि प्रस्तुत गरिएका तथ्याङ्कहरू नेपालको राष्ट्रिय जनगणना र खजुरा
              गाउँपालिकाको आफ्नै सर्वेक्षणबाट संकलन गरिएको हो। यी तथ्याङ्कहरूको
              महत्व निम्न अनुसार छ:
            </p>

            <ul>
              <li>स्थानीय रोजगारीको अवस्था र श्रम बजारको बुझाई</li>
              <li>व्यावसायिक तालिम र सीप विकास कार्यक्रम लक्षित गर्न</li>
              <li>स्थानीय आर्थिक विकासका अवसरहरू पहिचान गर्न</li>
              <li>रोजगारी सृजना र आय वृद्धिका रणनीतिहरू निर्माण गर्न</li>
            </ul>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
