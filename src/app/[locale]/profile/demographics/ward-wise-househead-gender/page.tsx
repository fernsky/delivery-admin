import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import { api } from "@/trpc/server";
import Image from "next/image";
import HouseheadGenderCharts from "./_components/househead-gender-charts";
import GenderAnalysisSection from "./_components/gender-analysis-section";
import GenderSEO from "./_components/gender-seo";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "घरमूली लिङ्ग अनुसार जनसंख्या | पालिका प्रोफाइल",
  description:
    "वडा अनुसार घरमूलीको लिङ्ग वितरण, प्रवृत्ति र विश्लेषण। विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
  keywords: [
    "घरमूली",
    "लिङ्ग",
    "जनसंख्या",
    "महिला",
    "पुरुष",
    "वडा",
    "वितरण",
    "तथ्याङ्क",
    "जनगणना",
  ],
  openGraph: {
    title: "घरमूली लिङ्ग अनुसार जनसंख्या | पालिका प्रोफाइल",
    description:
      "वडा अनुसार घरमूलीको लिङ्ग वितरण, प्रवृत्ति र विश्लेषण। विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
    type: "article",
    locale: "ne_NP",
  },
};

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "घरमूली लिङ्ग अनुसार जनसंख्या",
    slug: "gender-distribution",
  },
  { level: 2, text: "वडा अनुसार घरमूली लिङ्ग वितरण", slug: "ward-wise-gender" },
  { level: 2, text: "लिङ्गिक अनुपात विश्लेषण", slug: "gender-ratio" },
  { level: 2, text: "तथ्याङ्क स्रोत", slug: "data-source" },
];

// Define Nepali names for genders
const GENDER_NAMES: Record<string, string> = {
  MALE: "पुरुष",
  FEMALE: "महिला",
  OTHER: "अन्य",
};

export default async function WardWiseHouseheadGenderPage() {
  // Fetch all househead gender data from tRPC route
  const genderData =
    await api.profile.demographics.wardWiseHouseHeadGender.getAll.query();

  // Fetch summary statistics if available
  let summaryData;
  try {
    summaryData =
      await api.profile.demographics.wardWiseHouseHeadGender.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
    summaryData = null;
  }

  // Process data for overall summary
  const overallSummary = Object.entries(
    genderData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.gender]) acc[item.gender] = 0;
      acc[item.gender] += item.population || 0;
      return acc;
    }, {}),
  )
    .map(([gender, population]) => ({
      gender,
      genderName: GENDER_NAMES[gender] || gender,
      population,
    }))
    .sort((a, b) => b.population - a.population);

  // Calculate total population for percentages
  const totalPopulation = overallSummary.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  // Prepare data for pie chart
  const pieChartData = overallSummary.map((item) => ({
    name: item.genderName,
    value: item.population,
    percentage: ((item.population / totalPopulation) * 100).toFixed(2),
  }));

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(genderData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b);

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = genderData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    const result: Record<string, any> = { ward: `वडा ${wardNumber}` };

    // Add gender data
    wardData.forEach((item) => {
      result[GENDER_NAMES[item.gender] || item.gender] = item.population;
    });

    return result;
  });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <GenderSEO
        overallSummary={overallSummary}
        totalPopulation={totalPopulation}
        GENDER_NAMES={GENDER_NAMES}
        wardNumbers={wardNumbers}
      />
      
      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/househead-gender.svg"
              width={1200}
              height={400}
              alt="घरमूली लिङ्ग वितरण"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा पालिकाको विभिन्न वडाहरूमा घरमूलीको लिङ्ग अनुसार जनसंख्या
              सम्बन्धी विस्तृत तथ्याङ्क प्रस्तुत गरिएको छ। घरमूली भनेको
              घरपरिवारको प्रमुख व्यक्ति हो, जसले घरायसी निर्णयहरूमा प्रमुख
              भूमिका निर्वाह गर्दछ।
            </p>
            <p>
              यो तथ्याङ्कले लैङ्गिक समानता, सामाजिक संरचना र परिवारको नेतृत्वमा
              महिला सहभागिताको अवस्था बुझ्न मद्दत गर्दछ। यसले स्थानीय सरकारलाई
              लैङ्गिक समानता सम्बन्धी नीति तथा कार्यक्रमहरू तर्जुमा गर्न
              महत्त्वपूर्ण आधार प्रदान गर्दछ।
            </p>

            <h2 id="gender-distribution" className="scroll-m-20 border-b pb-2">
              घरमूली लिङ्ग अनुसार जनसंख्या
            </h2>
            <p>पालिकामा विभिन्न लिङ्गका घरमूलीहरूको वितरण निम्नानुसार छ:</p>
          </div>

          {/* Client component for charts */}
          <HouseheadGenderCharts
            overallSummary={overallSummary}
            totalPopulation={totalPopulation}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            //@ts-ignore
            genderData={genderData}
            GENDER_NAMES={GENDER_NAMES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="gender-ratio" className="scroll-m-20 border-b pb-2">
              लिङ्गिक अनुपात विश्लेषण
            </h2>
            <p>
              पालिकामा घरमूलीको रूपमा{" "}
              {GENDER_NAMES[overallSummary[0]?.gender] || "पुरुष"} सबैभन्दा बढी
              रहेको देखिन्छ, जसमा कुल घरपरिवारको{" "}
              {(
                ((overallSummary[0]?.population || 0) / totalPopulation) *
                100
              ).toFixed(2)}
              % घरहरूमा {GENDER_NAMES[overallSummary[0]?.gender] || "पुरुष"}{" "}
              घरमूली छन्।
            </p>

            {/* Client component for gender analysis section */}
            <GenderAnalysisSection
              overallSummary={overallSummary}
              totalPopulation={totalPopulation}
              GENDER_NAMES={GENDER_NAMES}
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
              <li>लैङ्गिक समानता प्रवर्द्धन गर्न</li>
              <li>महिला सशक्तीकरण कार्यक्रमहरू विकास गर्न</li>
              <li>लैङ्गिक उत्तरदायी बजेट तथा कार्यक्रम तर्जुमा गर्न</li>
              <li>समाजमा लिङ्ग आधारित भूमिकाको परिवर्तन पहिचान गर्न</li>
            </ul>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
