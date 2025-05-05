import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import { api } from "@/trpc/server";
import Image from "next/image";
import CasteCharts from "./_components/caste-charts";
import CasteAnalysisSection from "./_components/caste-analysis-section";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "जाति अनुसार जनसंख्या | पालिका प्रोफाइल",
  description:
    "वडा अनुसार जातिगत जनसंख्या वितरण, प्रवृत्ति र विश्लेषण। विभिन्न जातिहरूको विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
  keywords: [
    "जाति",
    "जनसंख्या",
    "जनगणना",
    "ब्राह्मण",
    "क्षेत्री",
    "दलित",
    "जनजाति",
    "मधेशी",
    "मुस्लिम",
    "थारू",
    "वडा",
    "वितरण",
    "तथ्याङ्क",
  ],
  openGraph: {
    title: "जाति अनुसार जनसंख्या | पालिका प्रोफाइल",
    description:
      "वडा अनुसार जातिगत जनसंख्या वितरण, प्रवृत्ति र विश्लेषण। विभिन्न जातिहरूको विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
    type: "article",
    locale: "ne_NP",
  },
};

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "जाति अनुसार जनसंख्या", slug: "caste-distribution" },
  { level: 2, text: "वडा अनुसार जातिगत विविधता", slug: "ward-wise-caste" },
  { level: 2, text: "प्रमुख जातिहरूको विश्लेषण", slug: "major-castes" },
  { level: 2, text: "तथ्याङ्क स्रोत", slug: "data-source" },
];

// Define Nepali names for castes (getting from procedure's CasteTypes)
const CASTE_NAMES = {
  BRAHMIN_HILL: "पहाडी ब्राह्मण",
  CHHETRI: "क्षेत्री",
  THAKURI: "ठकुरी",
  SANYASI_DASNAMI: "संन्यासी/दशनामी",
  BRAHMIN_TARAI: "मधेशी ब्राह्मण",
  RAJPUT: "राजपुत",
  KAYASTHA: "कायस्थ",
  BANIYA: "बनिया",
  NEWAR: "नेवार",
  GURUNG: "गुरुङ",
  MAGAR: "मगर",
  TAMANG: "तामाङ",
  RAI: "राई",
  LIMBU: "लिम्बु",
  SHERPA: "शेर्पा",
  THAKALI: "थकाली",
  THARU: "थारू",
  MAJHI: "माझी",
  DALIT_HILL: "पहाडी दलित",
  DALIT_TARAI: "मधेशी दलित",
  MUSLIM: "मुस्लिम",
  MADHESI: "मधेशी जाति",
  YADAV: "यादव",
  TELI: "तेली",
  KOIRI: "कोइरी",
  KURMI: "कुर्मी",
  MARWADI: "मारवाडी",
  BANGALI: "बंगाली",
  OTHER: "अन्य",
};

export default async function WardWiseCastePopulationPage() {
  // Fetch all caste population data from your tRPC route
  const casteData =
    await api.profile.demographics.wardWiseCastePopulation.getAll.query();

  // Fetch summary statistics if available
  let summaryData;
  try {
    summaryData =
      await api.profile.demographics.wardWiseCastePopulation.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
    summaryData = null;
  }

  // Process data for overall summary
  const overallSummary = Object.entries(
    casteData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.casteType]) acc[item.casteType] = 0;
      acc[item.casteType] += item.population || 0;
      return acc;
    }, {}),
  )
    .map(([caste, population]) => ({
      caste,
      casteName: CASTE_NAMES[caste as keyof typeof CASTE_NAMES] || caste,
      population,
    }))
    .sort((a, b) => b.population - a.population);

  // Calculate total population for percentages
  const totalPopulation = overallSummary.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  // Take top 10 castes for pie chart, group others
  const topCastes = overallSummary.slice(0, 10);
  const otherCastes = overallSummary.slice(10);

  const otherTotalPopulation = otherCastes.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  let pieChartData = topCastes.map((item) => ({
    name: item.casteName,
    value: item.population,
    percentage: ((item.population / totalPopulation) * 100).toFixed(2),
  }));

  // Add "Other" category if there are more than 10 castes
  if (otherCastes.length > 0) {
    pieChartData.push({
      name: "अन्य",
      value: otherTotalPopulation,
      percentage: ((otherTotalPopulation / totalPopulation) * 100).toFixed(2),
    });
  }

  // Get unique ward IDs
  const wardIds = Array.from(
    new Set(casteData.map((item) => item.wardNumber.toString())),
  ).sort((a, b) => parseInt(a) - parseInt(b));

  // Process data for ward-wise visualization (top 5 castes per ward + others)
  const wardWiseData = wardIds.map((wardId) => {
    const wardData = casteData.filter(
      (item) => item.wardNumber.toString() === wardId,
    );

    // Sort ward data by population
    wardData.sort((a, b) => (b.population || 0) - (a.population || 0));

    // Take top 5 castes for this ward
    const topWardCastes = wardData.slice(0, 5);
    const otherWardCastes = wardData.slice(5);
    const otherWardTotal = otherWardCastes.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );

    const result: Record<string, any> = { ward: `वडा ${wardId}` };

    // Add top castes
    topWardCastes.forEach((item) => {
      result[
        CASTE_NAMES[item.casteType as keyof typeof CASTE_NAMES] ||
          item.casteTypeDisplay ||
          item.casteType
      ] = item.population;
    });

    // Add "Other" category if needed
    if (otherWardCastes.length > 0) {
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
              src="/images/caste-diversity.svg"
              width={1200}
              height={400}
              alt="जातिगत विविधता"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा पालिकाको विभिन्न वडाहरूमा बसोबास गर्ने विभिन्न जातिहरूको
              जनसंख्या सम्बन्धी विस्तृत तथ्याङ्क प्रस्तुत गरिएको छ। यो
              तथ्याङ्कले जातिगत विविधता, सामाजिक संरचना र स्थानीय समुदायको
              जातिगत स्वरूपलाई प्रतिबिम्बित गर्दछ।
            </p>
            <p>
              नेपाल विभिन्न जातजाति र समुदायहरूको सद्भाव र सहिष्णुताको देश हो, र
              यस पालिकामा पनि विभिन्न जातजातिहरूको बसोबास रहेको छ। यस तथ्याङ्कले
              सामाजिक समावेशिता, विविधता व्यवस्थापन र विकासका योजनाहरूमा सहयोग
              पुर्‍याउँछ।
            </p>

            <h2 id="caste-distribution" className="scroll-m-20 border-b pb-2">
              जाति अनुसार जनसंख्या
            </h2>
            <p>पालिकामा विभिन्न जातिहरूको कुल जनसंख्या वितरण निम्नानुसार छ:</p>
          </div>

          {/* Client component for charts */}
          <CasteCharts
            overallSummary={overallSummary}
            totalPopulation={totalPopulation}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardIds={wardIds}
            casteData={casteData}
            CASTE_NAMES={CASTE_NAMES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="major-castes" className="scroll-m-20 border-b pb-2">
              प्रमुख जातिहरूको विश्लेषण
            </h2>
            <p>
              पालिकामा निम्न जातिहरू प्रमुख रूपमा बसोबास गर्छन्। यी जातिहरूमध्ये{" "}
              {CASTE_NAMES[
                overallSummary[0]?.caste as keyof typeof CASTE_NAMES
              ] ||
                overallSummary[0]?.caste ||
                ""}
              सबैभन्दा धेरै व्यक्तिहरू भएको जाति हो, जसमा कुल जनसंख्याको{" "}
              {(
                ((overallSummary[0]?.population || 0) / totalPopulation) *
                100
              ).toFixed(2)}
              % जनसंख्या रहेको छ।
            </p>

            {/* Client component for caste analysis section */}
            <CasteAnalysisSection
              overallSummary={overallSummary}
              totalPopulation={totalPopulation}
              CASTE_NAMES={CASTE_NAMES}
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
              <li>सामाजिक समावेशिता र विविधता व्यवस्थापनमा सहयोग गर्न</li>
              <li>जातिगत आधारमा लक्षित कार्यक्रम र नीतिहरू निर्माण गर्न</li>
              <li>सीमान्तकृत तथा पिछडिएका वर्गहरूको पहिचान र सशक्तिकरण गर्न</li>
              <li>स्थानीय भाषा, संस्कृति र परम्पराको संरक्षण गर्न</li>
              <li>सामाजिक सद्भाव र समानता कायम राख्न</li>
            </ul>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
