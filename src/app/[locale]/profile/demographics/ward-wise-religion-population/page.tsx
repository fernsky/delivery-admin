import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import { api } from "@/trpc/server";
import Image from "next/image";
import ReligionCharts from "./_components/religion-charts";
import ReligionAnalysisSection from "./_components/religion-analysis-section";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "धर्म अनुसार जनसंख्या | पालिका प्रोफाइल",
  description:
    "वडा अनुसार धार्मिक जनसंख्या वितरण, प्रवृत्ति र विश्लेषण। विभिन्न धर्मावलम्बीहरूको विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
  keywords: [
    "धर्म",
    "जनसंख्या",
    "हिन्दू",
    "बौद्ध",
    "किरात",
    "क्रिश्चियन",
    "इस्लाम",
    "धार्मिक विविधता",
    "तथ्याङ्क",
    "जनगणना",
  ],
  openGraph: {
    title: "धर्म अनुसार जनसंख्या | पालिका प्रोफाइल",
    description:
      "वडा अनुसार धार्मिक जनसंख्या वितरण, प्रवृत्ति र विश्लेषण। विभिन्न धर्मावलम्बीहरूको विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
    type: "article",
    locale: "ne_NP",
  },
};

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "धर्म अनुसार जनसंख्या", slug: "religion-distribution" },
  { level: 2, text: "वडा अनुसार धार्मिक विविधता", slug: "ward-wise-religion" },
  { level: 2, text: "प्रमुख धर्महरूको विश्लेषण", slug: "major-religions" },
  { level: 2, text: "तथ्याङ्क स्रोत", slug: "data-source" },
];

// Define Nepali names for religions
const RELIGION_NAMES: Record<string, string> = {
  HINDU: "हिन्दू",
  BUDDHIST: "बौद्ध",
  KIRANT: "किराँत",
  CHRISTIAN: "क्रिश्चियन",
  ISLAM: "इस्लाम",
  NATURE: "प्रकृति",
  BON: "बोन",
  JAIN: "जैन",
  BAHAI: "बहाई",
  SIKH: "सिख",
  OTHER: "अन्य",
};

export default async function WardWiseReligionPopulationPage() {
  // Fetch all religion population data from your tRPC route
  const religionData =
    await api.profile.demographics.wardWiseReligionPopulation.getAll.query();

  // Fetch summary statistics if available
  let summaryData;
  try {
    summaryData =
      await api.profile.demographics.wardWiseReligionPopulation.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
    summaryData = null;
  }

  // Process data for overall summary
  const overallSummary = Object.entries(
    religionData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.religionType]) acc[item.religionType] = 0;
      acc[item.religionType] += item.population || 0;
      return acc;
    }, {}),
  )
    .map(([religion, population]) => ({
      religion,
      religionName: RELIGION_NAMES[religion] || religion,
      population,
    }))
    .sort((a, b) => b.population - a.population);

  // Calculate total population for percentages
  const totalPopulation = overallSummary.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  // Take top 10 religions for pie chart, group others
  const topReligions = overallSummary.slice(0, 10);
  const otherReligions = overallSummary.slice(10);

  const otherTotalPopulation = otherReligions.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  let pieChartData = topReligions.map((item) => ({
    name: item.religionName,
    value: item.population,
    percentage: ((item.population / totalPopulation) * 100).toFixed(2),
  }));

  // Add "Other" category if there are more than 10 religions
  if (otherReligions.length > 0) {
    pieChartData.push({
      name: "अन्य",
      value: otherTotalPopulation,
      percentage: ((otherTotalPopulation / totalPopulation) * 100).toFixed(2),
    });
  }

  // Get unique ward IDs
  const wardIds = Array.from(
    new Set(religionData.map((item) => item.wardId)),
  ).sort();

  // Process data for ward-wise visualization (top 5 religions per ward + others)
  const wardWiseData = wardIds.map((wardId) => {
    const wardData = religionData.filter((item) => item.wardId === wardId);

    // Sort ward data by population
    wardData.sort((a, b) => (b.population || 0) - (a.population || 0));

    // Take top 5 religions for this ward
    const topWardReligions = wardData.slice(0, 5);
    const otherWardReligions = wardData.slice(5);
    const otherWardTotal = otherWardReligions.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );

    const result: Record<string, any> = { ward: `वडा ${wardId}` };

    // Add top religions
    topWardReligions.forEach((item) => {
      result[RELIGION_NAMES[item.religionType] || item.religionType] =
        item.population;
    });

    // Add "Other" category if needed
    if (otherWardReligions.length > 0) {
      result["अन्य"] = otherWardTotal;
    }

    return result;
  });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/religion-diversity.svg"
              width={1200}
              height={400}
              alt="धार्मिक विविधता"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा पालिकाको विभिन्न वडाहरूमा अवलम्बन गरिने धर्महरू र
              धर्मावलम्बीहरूको जनसंख्या सम्बन्धी विस्तृत तथ्याङ्क प्रस्तुत
              गरिएको छ। यो तथ्याङ्कले धार्मिक विविधता, सांस्कृतिक पहिचान र
              स्थानीय समुदायको धार्मिक स्वरूपलाई प्रतिबिम्बित गर्दछ।
            </p>
            <p>
              नेपाल विभिन्न धर्मावलम्बी समुदायहरूको सद्भाव र सहिष्णुताको देश हो,
              र यस पालिकामा पनि विविध धार्मिक समुदायहरूको बसोबास रहेको छ। यस
              तथ्याङ्कले धार्मिक नीति, सांस्कृतिक संरक्षण र सामाजिक समानतामा
              सहयोग पुर्‍याउँछ।
            </p>

            <h2
              id="religion-distribution"
              className="scroll-m-20 border-b pb-2"
            >
              धर्म अनुसार जनसंख्या
            </h2>
            <p>पालिकामा विभिन्न धर्मावलम्बीहरूको कुल जनसंख्या निम्नानुसार छ:</p>
          </div>

          {/* Client component for charts */}
          <ReligionCharts
            overallSummary={overallSummary}
            totalPopulation={totalPopulation}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardIds={wardIds}
            religionData={religionData}
            RELIGION_NAMES={RELIGION_NAMES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="major-religions" className="scroll-m-20 border-b pb-2">
              प्रमुख धर्महरूको विश्लेषण
            </h2>
            <p>
              पालिकामा निम्न धर्महरू प्रमुख रूपमा अवलम्बन गरिन्छन्। यी
              धर्महरूमध्ये{" "}
              {RELIGION_NAMES[overallSummary[0]?.religion] || "हिन्दू"}
              सबैभन्दा धेरै व्यक्तिहरूले मान्ने धर्म हो, जसलाई कुल जनसंख्याको{" "}
              {(
                ((overallSummary[0]?.population || 0) / totalPopulation) *
                100
              ).toFixed(2)}
              % ले अवलम्बन गर्दछन्।
            </p>

            {/* Client component for religion analysis section */}
            <ReligionAnalysisSection
              overallSummary={overallSummary}
              totalPopulation={totalPopulation}
              RELIGION_NAMES={RELIGION_NAMES}
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
              <li>धार्मिक विविधता र सहिष्णुतालाई प्रवर्द्धन गर्न</li>
              <li>
                विभिन्न धार्मिक समुदायहरूको आवश्यकता अनुसार योजना निर्माण गर्न
              </li>
              <li>सांस्कृतिक तथा धार्मिक सम्पदाको संरक्षण गर्न</li>
              <li>सामाजिक सद्भाव र समानता कायम राख्न</li>
            </ul>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
