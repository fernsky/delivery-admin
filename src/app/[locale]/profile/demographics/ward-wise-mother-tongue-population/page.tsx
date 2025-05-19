import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import { api } from "@/trpc/server";
import Image from "next/image";
import MotherTongueCharts from "./_components/mother-tongue-charts";
import LanguageAnalysisSection from "./_components/language-analysis-section";
import LanguageSEO from "./_components/language-seo";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const languageData = await api.profile.demographics.wardWiseMotherTonguePopulation.getAll.query();
    const municipalityName = "खजुरा गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalPopulation = languageData.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );
    // Group by language type and calculate totals
    const languageCounts: Record<string, number> = {};
    languageData.forEach((item) => {
      if (!languageCounts[item.languageType])
        languageCounts[item.languageType] = 0;
      languageCounts[item.languageType] += item.population || 0;
    });

    // Define language names in both languages
    const LANGUAGE_NAMES_NP: Record<string, string> = {
      NEPALI: "नेपाली",
      MAITHILI: "मैथिली",
      BHOJPURI: "भोजपुरी",
      THARU: "थारू",
      TAMANG: "तामाङ",
      NEWARI: "नेवारी",
      MAGAR: "मगर",
      BAJJIKA: "बज्जिका",
      URDU: "उर्दू",
      HINDI: "हिन्दी",
      LIMBU: "लिम्बू",
      RAI: "राई",
      GURUNG: "गुरुङ",
      SHERPA: "शेर्पा",
      DOTELI: "डोटेली",
      AWADI: "अवधी",
      OTHER: "अन्य",
    };

    const LANGUAGE_NAMES_EN: Record<string, string> = {
      NEPALI: "Nepali",
      MAITHILI: "Maithili",
      BHOJPURI: "Bhojpuri",
      THARU: "Tharu",
      TAMANG: "Tamang",
      NEWARI: "Newari",
      MAGAR: "Magar",
      BAJJIKA: "Bajjika",
      URDU: "Urdu",
      HINDI: "Hindi",
      LIMBU: "Limbu",
      RAI: "Rai",
      GURUNG: "Gurung",
      SHERPA: "Sherpa",
      DOTELI: "Doteli",
      AWADI: "Awadhi",
      OTHER: "Other",
    };

    // Get top 3 languages for keywords
    const topLanguages = Object.entries(languageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);

    // Create rich keywords with actual data
    const keywordsNP = [
      "खजुरा गाउँपालिका मातृभाषा जनसंख्या",
      "खजुरा भाषिक विविधता",
      `खजुरा ${LANGUAGE_NAMES_NP[topLanguages[0]]} भाषी जनसंख्या`,
      ...topLanguages.map((l) => `${LANGUAGE_NAMES_NP[l]} भाषी खजुरा`),
      "वडा अनुसार भाषिक जनसंख्या",
      "भाषिक विविधता तथ्याङ्क",
      "मातृभाषा जनगणना खजुरा",
      `खजुरा कुल जनसंख्या ${totalPopulation}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality mother tongue population",
      "Khajura linguistic diversity",
      `${LANGUAGE_NAMES_EN[topLanguages[0]]} speakers in Khajura`,
      ...topLanguages.map(
        (l) => `${LANGUAGE_NAMES_EN[l]} language population in Khajura`,
      ),
      "Ward-wise language demographics",
      "Linguistic diversity statistics",
      "Mother tongue census Khajura",
      `Khajura total population ${totalPopulation}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `खजुरा गाउँपालिकाको वडा अनुसार मातृभाषाको जनसंख्या वितरण, प्रवृत्ति र विश्लेषण। कुल जनसंख्या ${totalPopulation} मध्ये ${LANGUAGE_NAMES_NP[topLanguages[0]]} (${languageCounts[topLanguages[0]]}) सबैभन्दा धेरै बोलिने भाषा हो, त्यसपछि ${LANGUAGE_NAMES_NP[topLanguages[1]]} (${languageCounts[topLanguages[1]]}) र ${LANGUAGE_NAMES_NP[topLanguages[2]]} (${languageCounts[topLanguages[2]]})। विभिन्न भाषाभाषीहरूको विस्तृत तथ्याङ्क र विजुअलाइजेसन।`;

    const descriptionEN = `Ward-wise mother tongue distribution, trends and analysis for Khajura Rural Municipality. Out of a total population of ${totalPopulation}, ${LANGUAGE_NAMES_EN[topLanguages[0]]} (${languageCounts[topLanguages[0]]}) is the most widely spoken language, followed by ${LANGUAGE_NAMES_EN[topLanguages[1]]} (${languageCounts[topLanguages[1]]}) and ${LANGUAGE_NAMES_EN[topLanguages[2]]} (${languageCounts[topLanguages[2]]})। Detailed statistics and visualizations of various linguistic communities.`;

    return {
      title: `मातृभाषा अनुसार जनसंख्या | ${municipalityName} पालिका प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/demographics/ward-wise-mother-tongue-population",
        languages: {
          en: "/en/profile/demographics/ward-wise-mother-tongue-population",
          ne: "/ne/profile/demographics/ward-wise-mother-tongue-population",
        },
      },
      openGraph: {
        title: `मातृभाषा अनुसार जनसंख्या | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `मातृभाषा अनुसार जनसंख्या | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "मातृभाषा अनुसार जनसंख्या | पालिका प्रोफाइल",
      description:
        "वडा अनुसार मातृभाषाको जनसंख्या वितरण, प्रवृत्ति र विश्लेषण। विभिन्न भाषाभाषीहरूको विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "मातृभाषा अनुसार जनसंख्या", slug: "language-distribution" },
  { level: 2, text: "वडा अनुसार भाषिक विविधता", slug: "ward-wise-language" },
  { level: 2, text: "प्रमुख मातृभाषाहरूको विश्लेषण", slug: "major-languages" },
  { level: 2, text: "तथ्याङ्क स्रोत", slug: "data-source" },
];

// Define Nepali names for languages
const LANGUAGE_NAMES: Record<string, string> = {
  NEPALI: "नेपाली",
  MAITHILI: "मैथिली",
  BHOJPURI: "भोजपुरी",
  THARU: "थारू",
  TAMANG: "तामाङ",
  NEWARI: "नेवारी",
  MAGAR: "मगर",
  BAJJIKA: "बज्जिका",
  URDU: "उर्दू",
  HINDI: "हिन्दी",
  LIMBU: "लिम्बू",
  RAI: "राई",
  GURUNG: "गुरुङ",
  SHERPA: "शेर्पा",
  DOTELI: "डोटेली",
  AWADI: "अवधी",
  OTHER: "अन्य",
};

export default async function WardWiseMotherTonguePopulationPage() {
  // Fetch all mother tongue population data from your tRPC route
  const languageData =
    await api.profile.demographics.wardWiseMotherTonguePopulation.getAll.query();

  // Fetch summary statistics if available
  let summaryData;
  try {
    summaryData =
      await api.profile.demographics.wardWiseMotherTonguePopulation.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
    summaryData = null;
  }

  // Process data for overall summary
  const overallSummary = Object.entries(
    languageData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.languageType]) acc[item.languageType] = 0;
      acc[item.languageType] += item.population || 0;
      return acc;
    }, {}),
  )
    .map(([language, population]) => ({
      language,
      languageName: LANGUAGE_NAMES[language] || language,
      population,
    }))
    .sort((a, b) => b.population - a.population);

  // Calculate total population for percentages
  const totalPopulation = overallSummary.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  // Take top 10 languages for pie chart, group others
  const topLanguages = overallSummary.slice(0, 10);
  const otherLanguages = overallSummary.slice(10);

  const otherTotalPopulation = otherLanguages.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  let pieChartData = topLanguages.map((item) => ({
    name: item.languageName,
    value: item.population,
    percentage: ((item.population / totalPopulation) * 100).toFixed(2),
  }));

  // Add "Other" category if there are more than 10 languages
  if (otherLanguages.length > 0) {
    pieChartData.push({
      name: "अन्य",
      value: otherTotalPopulation,
      percentage: ((otherTotalPopulation / totalPopulation) * 100).toFixed(2),
    });
  }

  // Get unique ward numbers
  const wardIds = Array.from(
    new Set(languageData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for ward-wise visualization (top 5 languages per ward + others)
  const wardWiseData = wardIds.map((wardNumber) => {
    const wardData = languageData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    // Sort ward data by population
    wardData.sort((a, b) => (b.population || 0) - (a.population || 0));

    // Take top 5 languages for this ward
    const topWardLanguages = wardData.slice(0, 5);
    const otherWardLanguages = wardData.slice(5);
    const otherWardTotal = otherWardLanguages.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );

    const result: Record<string, any> = { ward: `वडा ${wardNumber}` };

    // Add top languages
    topWardLanguages.forEach((item) => {
      result[LANGUAGE_NAMES[item.languageType] || item.languageType] =
        item.population;
    });

    // Add "Other" category if needed
    if (otherWardLanguages.length > 0) {
      result["अन्य"] = otherWardTotal;
    }

    return result;
  });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <LanguageSEO
        overallSummary={overallSummary}
        totalPopulation={totalPopulation}
        LANGUAGE_NAMES={LANGUAGE_NAMES}
        wardIds={wardIds}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/language-diversity.svg"
              width={1200}
              height={400}
              alt="भाषिक विविधता - खजुरा गाउँपालिका (Linguistic Diversity - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              खजुरा गाउँपालिकामा मातृभाषा अनुसार जनसंख्या
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा खजुरा गाउँपालिकाको विभिन्न वडाहरूमा बोलिने मातृभाषाहरू र तिनका
              वक्ताहरूको जनसंख्या सम्बन्धी विस्तृत तथ्याङ्क प्रस्तुत गरिएको छ।
              यो तथ्याङ्कले भाषिक विविधता, सांस्कृतिक पहिचान र स्थानीय समुदायको
              भाषिक स्वरूपलाई प्रतिबिम्बित गर्दछ।
            </p>
            <p>
              नेपाल विभिन्न भाषाभाषी समुदायहरूको देश हो, र यस पालिकामा पनि विविध
              भाषिक समुदायहरूको बसोबास रहेको छ। कुल जनसंख्या{" "}
              {totalPopulation.toLocaleString()} मध्ये{" "}
              {overallSummary[0]?.languageName || ""} भाषा बोल्ने व्यक्तिहरू{" "}
              {(
                ((overallSummary[0]?.population || 0) / totalPopulation) *
                100
              ).toFixed(1)}
              % रहेका छन्। यस तथ्याङ्कले भाषिक नीति, शिक्षा प्रणाली र सार्वजनिक सेवामा 
              भाषा सम्बन्धी निर्णय लिन मद्दत गर्दछ।
            </p>

            <h2
              id="language-distribution"
              className="scroll-m-20 border-b pb-2"
            >
              मातृभाषा अनुसार जनसंख्या
            </h2>
            <p>
              खजुरा गाउँपालिकामा विभिन्न मातृभाषाहरू बोल्ने व्यक्तिहरूको कुल जनसंख्या
              निम्नानुसार छ:
            </p>
          </div>

          {/* Client component for charts */}
          <MotherTongueCharts
            overallSummary={overallSummary}
            totalPopulation={totalPopulation}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardIds={wardIds}
            languageData={languageData}
            LANGUAGE_NAMES={LANGUAGE_NAMES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="major-languages" className="scroll-m-20 border-b pb-2">
              प्रमुख मातृभाषाहरूको विश्लेषण
            </h2>
            <p>
              खजुरा गाउँपालिकामा निम्न मातृभाषाहरू प्रमुख रूपमा बोलिन्छन्। यी भाषाहरूमध्ये{" "}
              {LANGUAGE_NAMES[overallSummary[0]?.language] || "नेपाली"}
              सबैभन्दा धेरै व्यक्तिहरूले बोल्ने भाषा हो, जसलाई कुल जनसंख्याको{" "}
              {(
                ((overallSummary[0]?.population || 0) / totalPopulation) *
                100
              ).toFixed(2)}
              % ले मातृभाषाको रूपमा प्रयोग गर्दछन्।
            </p>

            {/* Client component for language analysis section */}
            <LanguageAnalysisSection
              overallSummary={overallSummary}
              totalPopulation={totalPopulation}
              LANGUAGE_NAMES={LANGUAGE_NAMES}
            />

            <h2 id="data-source" className="scroll-m-20 border-b pb-2">
              तथ्याङ्क स्रोत
            </h2>
            <p>
              माथि प्रस्तुत गरिएका तथ्याङ्कहरू नेपालको राष्ट्रिय जनगणना र
              खजुरा गाउँपालिकाको आफ्नै सर्वेक्षणबाट संकलन गरिएको हो। यी तथ्याङ्कहरूको
              महत्व निम्न अनुसार छ:
            </p>

            <ul>
              <li>भाषिक विविधतालाई संरक्षण गर्न र प्रवर्द्धन गर्न</li>
              <li>बहुभाषिक शिक्षा नीतिको विकासमा सहयोग गर्न</li>
              <li>सरकारी सेवा तथा सूचनाहरू विभिन्न भाषामा उपलब्ध गराउन</li>
              <li>
                स्थानीय भाषा र संस्कृतिको संरक्षण गर्ने कार्यक्रमहरूको लागि
              </li>
            </ul>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
