import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import IrrigationSourceCharts from "./_components/irrigation-source-charts";
import IrrigationSourceAnalysisSection from "./_components/irrigation-source-analysis-section";
import IrrigationSourceSEO from "./_components/irrigation-source-seo";
import { irrigationSourceOptions } from "@/server/api/routers/profile/economics/municipality-wide-irrigation-source.schema";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Define English names for irrigation sources (for SEO)
const IRRIGATION_SOURCE_TYPES_EN: Record<string, string> = {
  "LAKE_OR_RESERVOIR": "Lake or Reservoir",
  "IRRIGATION_CANAL": "Irrigation Canal",
  "RAINWATER_COLLECTION": "Rainwater Collection",
  "ELECTRIC_LIFT_IRRIGATION": "Electric Lift Irrigation",
  "CANAL": "Canal",
  "PUMPING_SET": "Pumping Set/Motor",
  "UNDERGROUND_IRRIGATION": "Underground Irrigation (Shallow/Deep Tubewell)",
  "OTHER": "Other Irrigation Sources",
  "TOTAL": "Total Irrigated Area"
};

// Define Nepali names for irrigation sources
const IRRIGATION_SOURCE_TYPES: Record<string, string> = irrigationSourceOptions.reduce(
  (acc, option) => ({
    ...acc,
    [option.value]: option.label,
  }),
  { "TOTAL": "कुल सिंचित क्षेत्र" }
);

// Define colors for irrigation sources
const IRRIGATION_SOURCE_COLORS: Record<string, string> = {
  "LAKE_OR_RESERVOIR": "#3498db", // Blue
  "IRRIGATION_CANAL": "#2ecc71", // Green
  "RAINWATER_COLLECTION": "#9b59b6", // Purple
  "ELECTRIC_LIFT_IRRIGATION": "#e74c3c", // Red
  "CANAL": "#f39c12", // Orange
  "PUMPING_SET": "#1abc9c", // Teal
  "UNDERGROUND_IRRIGATION": "#34495e", // Dark Blue
  "OTHER": "#95a5a6", // Gray
  "TOTAL": "#2c3e50", // Dark Gray
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const irrigationSourceData = await api.profile.economics.municipalityWideIrrigationSource.getAll.query();
    const municipalityName = "खजुरा गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalIrrigatedArea = irrigationSourceData.find(item => item.irrigationSource === "TOTAL")?.coverageInHectares || 0;
    
    // Get non-total irrigation sources and sort by coverage
    const irrigationSources = irrigationSourceData
      .filter(item => item.irrigationSource !== "TOTAL")
      .sort((a, b) => b.coverageInHectares - a.coverageInHectares);

    // Find the most used irrigation source
    const mostUsedSource = irrigationSources.length > 0 ? irrigationSources[0] : null;
    const mostUsedSourcePercentage = mostUsedSource ? mostUsedSource.percentage.toFixed(2) : "0";

    // Create rich keywords with actual data
    const keywordsNP = [
      "खजुरा गाउँपालिका सिंचाई स्रोत",
      "खजुरा सिंचाई प्रणाली",
      "पोखरी रिजरभ्वायर सिंचाई",
      "सिंचाई कुलो",
      "आकाशे पानी सङ्कलन",
      "विद्युतिय लिफ्ट सिंचाई",
      "पम्पिङ सेट सिंचाई",
      "भूमिगत सिंचाई",
      `खजुरा सिंचित क्षेत्र ${localizeNumber(totalIrrigatedArea.toString(), "ne")} हेक्टर`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality irrigation sources",
      "Khajura irrigation systems",
      "Lake reservoir irrigation Khajura",
      "Irrigation canal systems",
      "Rainwater collection irrigation",
      "Electric lift irrigation",
      "Pumping set irrigation",
      "Underground irrigation tubewell",
      `Khajura irrigated area ${totalIrrigatedArea} hectares`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `खजुरा गाउँपालिकाको सिंचाई स्रोतको विस्तृत विश्लेषण। कुल ${localizeNumber(totalIrrigatedArea.toString(), "ne")} हेक्टर सिंचित क्षेत्रमा सबैभन्दा बढी ${IRRIGATION_SOURCE_TYPES[mostUsedSource?.irrigationSource || ""] || ""} (${localizeNumber(mostUsedSourcePercentage, "ne")}%) प्रयोग भएको छ। विभिन्न सिंचाई स्रोतहरूको तुलनात्मक विश्लेषण र वितरण।`;

    const descriptionEN = `Comprehensive analysis of irrigation sources in Khajura Rural Municipality. Out of total ${totalIrrigatedArea} hectares of irrigated area, ${IRRIGATION_SOURCE_TYPES_EN[mostUsedSource?.irrigationSource || ""] || ""} is the most used source (${mostUsedSourcePercentage}%). Comparative analysis and distribution of various irrigation sources.`;

    return {
      title: `सिंचाई स्रोत अनुसार कृषि क्षेत्र | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/municipality-wide-irrigation-source",
        languages: {
          en: "/en/profile/economics/municipality-wide-irrigation-source",
          ne: "/ne/profile/economics/municipality-wide-irrigation-source",
        },
      },
      openGraph: {
        title: `सिंचाई स्रोत अनुसार कृषि क्षेत्र | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `सिंचाई स्रोत अनुसार कृषि क्षेत्र | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "सिंचाई स्रोत अनुसार कृषि क्षेत्र | खजुरा गाउँपालिका डिजिटल प्रोफाइल",
      description: "खजुरा गाउँपालिकामा विभिन्न सिंचाई स्रोतहरूको विस्तृत विश्लेषण र वितरण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "सिंचाई स्रोतका प्रकारहरू", slug: "irrigation-source-types" },
  { level: 2, text: "सिंचाई स्रोत वितरण", slug: "irrigation-source-distribution" },
  { level: 2, text: "सिंचाई प्रभावकारिता", slug: "irrigation-effectiveness" },
  { level: 2, text: "सिंचाई पूर्वाधार विकास", slug: "irrigation-infrastructure-development" },
  { level: 2, text: "निष्कर्ष र सिफारिसहरू", slug: "conclusions-and-recommendations" },
];

export default async function MunicipalityWideIrrigationSourcePage() {
  // Fetch all irrigation source data using tRPC
  const irrigationSourceData = await api.profile.economics.municipalityWideIrrigationSource.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData = await api.profile.economics.municipalityWideIrrigationSource.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary (exclude TOTAL entry)
  const filteredData = irrigationSourceData.filter(item => item.irrigationSource !== "TOTAL");
  const totalIrrigatedArea = irrigationSourceData.find(item => item.irrigationSource === "TOTAL")?.coverageInHectares || 
    filteredData.reduce((sum, item) => sum + item.coverageInHectares, 0);

  const overallSummary = filteredData
    .map((item) => ({
      source: item.irrigationSource,
      sourceName: IRRIGATION_SOURCE_TYPES[item.irrigationSource] || item.irrigationSource,
      coverage: item.coverageInHectares,
      percentage: item.percentage,
    }))
    .sort((a, b) => b.coverage - a.coverage); // Sort by coverage descending

  // Create data for pie chart
  const pieChartData = overallSummary.map((item) => ({
    name: item.sourceName,
    value: item.coverage,
    percentage: item.percentage.toFixed(2),
    type: item.source,
  }));

  // Create data for bar chart
  const barChartData = overallSummary.map((item) => ({
    irrigationSource: item.sourceName,
    coverage: item.coverage,
    percentage: item.percentage,
  }));

  // Calculate irrigation efficiency and diversity metrics
  const totalSources = overallSummary.length;
  const primarySourceCoverage = overallSummary[0]?.coverage || 0;
  const secondarySourceCoverage = overallSummary[1]?.coverage || 0;
  
  // Calculate irrigation diversity index (Simpson's Diversity Index)
  const diversityIndex = totalIrrigatedArea > 0 ? 
    1 - overallSummary.reduce((sum, item) => {
      const proportion = item.coverage / totalIrrigatedArea;
      return sum + (proportion * proportion);
    }, 0) : 0;

  // Calculate dependency ratio (how much depends on primary source)
  const dependencyRatio = totalIrrigatedArea > 0 ? 
    (primarySourceCoverage / totalIrrigatedArea) * 100 : 0;

  // Find most and least used irrigation sources
  const mostUsedSource = overallSummary[0] || null;
  const leastUsedSource = overallSummary[overallSummary.length - 1] || null;

  // Calculate sustainable irrigation score (0-100)
  // Higher score means more diverse and sustainable irrigation
  const sustainabilityScore = Math.round(
    (diversityIndex * 40) + // Diversity component (40%)
    ((100 - dependencyRatio) * 0.3) + // Low dependency component (30%)
    (totalSources * 5) + // Source variety component (30% max for 6 sources)
    10 // Base score
  );

  // Calculate irrigation source analysis
  const irrigationAnalysis = overallSummary.map((item) => {
    // Categorize irrigation sources by sustainability
    const getSustainabilityCategory = (source: string) => {
      switch (source) {
        case "RAINWATER_COLLECTION":
        case "LAKE_OR_RESERVOIR":
          return "sustainable";
        case "UNDERGROUND_IRRIGATION":
        case "ELECTRIC_LIFT_IRRIGATION":
        case "PUMPING_SET":
          return "moderately_sustainable";
        case "IRRIGATION_CANAL":
        case "CANAL":
          return "traditional";
        default:
          return "other";
      }
    };

    const reliability = (source: any) => {
      switch (source) {
        case "UNDERGROUND_IRRIGATION":
        case "ELECTRIC_LIFT_IRRIGATION":
          return "high";
        case "IRRIGATION_CANAL":
        case "CANAL":
        case "PUMPING_SET":
          return "medium";
        case "RAINWATER_COLLECTION":
        case "LAKE_OR_RESERVOIR":
          return "seasonal";
        default:
          return "unknown";
      }
    };

    return {
      ...item,
      sustainabilityCategory: getSustainabilityCategory(item.source),
      reliability: reliability(item.source),
      efficiencyScore: item.coverage > 0 ? Math.min(100, (item.coverage / totalIrrigatedArea) * 200) : 0,
    };
  });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <IrrigationSourceSEO
        overallSummary={overallSummary}
        totalIrrigatedArea={totalIrrigatedArea}
        IRRIGATION_SOURCE_TYPES={IRRIGATION_SOURCE_TYPES}
        IRRIGATION_SOURCE_TYPES_EN={IRRIGATION_SOURCE_TYPES_EN}
        sustainabilityScore={sustainabilityScore}
        diversityIndex={diversityIndex}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/irrigation-sources.svg"
              width={1200}
              height={400}
              alt="सिंचाई स्रोत अनुसार कृषि क्षेत्र - खजुरा गाउँपालिका (Irrigation Sources by Agricultural Area - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              खजुरा गाउँपालिकामा सिंचाई स्रोत अनुसार कृषि क्षेत्र
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              सिंचाई कृषि उत्पादनको मेरुदण्ड हो र खाद्य सुरक्षाको आधार पनि। नेपालमा विभिन्न प्रकारका सिंचाई स्रोतहरू प्रयोग गरिन्छ, जसमा परम्परागत कुलो नहरदेखि आधुनिक विद्युतीय पम्प र भूमिगत सिंचाई प्रणालीसम्म समावेश छ। खजुरा गाउँपालिकामा पनि यी विविध सिंचाई स्रोतहरूको प्रयोग गरी कृषि विकासमा योगदान पुर्याइरहेको छ।
            </p>
            <p>
              खजुरा गाउँपालिकाको सिंचाई स्रोत सम्बन्धी तथ्याङ्क अनुसार, कुल {localizeNumber(totalIrrigatedArea.toFixed(1), "ne")} 
              हेक्टर क्षेत्रमा सिंचाई सुविधा उपलब्ध छ। यसमध्ये सबैभन्दा बढी {mostUsedSource?.sourceName || ""} 
              मार्फत {localizeNumber(mostUsedSource?.coverage.toFixed(1) || "0", "ne")} हेक्टर अर्थात् 
              {localizeNumber(mostUsedSource?.percentage.toFixed(1) || "0", "ne")}% क्षेत्रमा सिंचाई गरिन्छ।
            </p>

            <h2
              id="irrigation-source-types"
              className="scroll-m-20 border-b pb-2"
            >
              सिंचाई स्रोतका प्रमुख प्रकारहरू
            </h2>
            <p>
              खजुरा गाउँपालिकामा प्रयोग हुने सिंचाई स्रोतहरू र तिनको कभरेज क्षेत्र निम्नानुसार रहेको छ:
            </p>
            
            <ul>
              {overallSummary.map((item, index) => (
                <li key={index}>
                  <strong>{item.sourceName}</strong>: कुल {localizeNumber(item.percentage.toFixed(1), "ne")}% 
                  ({localizeNumber(item.coverage.toFixed(1), "ne")} हेक्टर)
                </li>
              ))}
            </ul>

            <p>
              सिंचाई विविधताको विश्लेषण गर्दा, खजुरा गाउँपालिकामा सिंचाई विविधता सूचकाङ्क {localizeNumber((diversityIndex * 100).toFixed(1), "ne")}% 
              रहेको छ, जसले सिंचाई स्रोतमा उचित विविधता रहेको देखाउँछ। तथापि, {mostUsedSource?.sourceName || ""} मा {localizeNumber(dependencyRatio.toFixed(1), "ne")}% 
              निर्भरता रहेको छ, जसले सिंचाई जोखिम व्यवस्थापनमा सुधारको आवश्यकता देखाउँछ।
            </p>

            <p>
              दिगोपनको दृष्टिकोणबाट, पालिकाको सिंचाई दिगोपना स्कोर {localizeNumber(sustainabilityScore.toString(), "ne")}% 
              रहेको छ, जसलाई थप सुधार गर्न आवश्यक छ।
            </p>
          </div>

          {/* Client component for charts */}
          <IrrigationSourceCharts
            overallSummary={overallSummary}
            totalIrrigatedArea={totalIrrigatedArea}
            pieChartData={pieChartData}
            barChartData={barChartData}
            irrigationAnalysis={irrigationAnalysis}
            IRRIGATION_SOURCE_TYPES={IRRIGATION_SOURCE_TYPES}
            IRRIGATION_SOURCE_COLORS={IRRIGATION_SOURCE_COLORS}
            sustainabilityScore={sustainabilityScore}
            diversityIndex={diversityIndex}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="irrigation-infrastructure-development" className="scroll-m-20 border-b pb-2">
              सिंचाई पूर्वाधार विकास
            </h2>
            <p>
              खजुरा गाउँपालिकामा सिंचाई पूर्वाधारको वर्तमान अवस्थाले कृषि उत्पादनमा महत्त्वपूर्ण भूमिका खेलेको छ। 
              कुल {localizeNumber(totalIrrigatedArea.toFixed(1), "ne")} हेक्टर सिंचित क्षेत्रमा {totalSources} प्रकारका 
              सिंचाई स्रोतहरूको प्रयोग गरिएको छ, जसले सिंचाई प्रणालीमा उचित विविधता ल्याएको छ।
            </p>
            
            <p>
              तथापि, प्राथमिक सिंचाई स्रोत ({mostUsedSource?.sourceName || ""}) मा {localizeNumber(dependencyRatio.toFixed(1), "ne")}% 
              निर्भरता रहेकोले सिंचाई जोखिम व्यवस्थापन र वैकल्पिक स्रोतहरूको विकासमा प्राथमिकता दिनुपर्ने देखिन्छ।
            </p>

            <IrrigationSourceAnalysisSection
              overallSummary={overallSummary}
              totalIrrigatedArea={totalIrrigatedArea}
              irrigationAnalysis={irrigationAnalysis}
              IRRIGATION_SOURCE_TYPES={IRRIGATION_SOURCE_TYPES}
              IRRIGATION_SOURCE_TYPES_EN={IRRIGATION_SOURCE_TYPES_EN}
              IRRIGATION_SOURCE_COLORS={IRRIGATION_SOURCE_COLORS}
              sustainabilityScore={sustainabilityScore}
              diversityIndex={diversityIndex}
              mostUsedSource={mostUsedSource}
              leastUsedSource={leastUsedSource}
              dependencyRatio={dependencyRatio}
            />

            <h2 id="conclusions-and-recommendations" className="scroll-m-20 border-b pb-2 mt-12">
              निष्कर्ष र सिफारिसहरू
            </h2>
            
            <p>
              खजुरा गाउँपालिकाको सिंचाई स्रोत अवस्थाको विश्लेषणबाट निम्न निष्कर्ष र सिफारिसहरू गर्न सकिन्छ:
            </p>
            
            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>सिंचाई विविधीकरण:</strong> हाल {mostUsedSource?.sourceName || ""} मा {localizeNumber(dependencyRatio.toFixed(1), "ne")}% 
                  निर्भरता रहेकोले अन्य सिंचाई स्रोतहरूको विकास र विविधीकरण गर्नुपर्ने। विशेषगरी वर्षाको पानी सङ्कलन र 
                  पोखरी/रिजरभ्वायर जस्ता दिगो स्रोतहरूमा लगानी बढाउनुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>प्रविधि सुधार:</strong> परम्परागत सिंचाई प्रणालीमा आधुनिक प्रविधिको समावेश गरी सिंचाई दक्षता बढाउनुपर्ने। 
                  ड्रिप इरिगेसन र स्प्रिंकलर सिस्टम जस्ता जल बचत प्रविधिहरूको प्रवर्द्धन गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>जल स्रोत संरक्षण:</strong> भूमिगत पानीको दिगो उपयोग सुनिश्चित गर्न भूजल पुनर्भरण कार्यक्रम सञ्चालन गर्नुपर्ने। 
                  विशेषगरी ट्युबवेल र पम्पिङ सेटको प्रयोगमा नियमन ल्याउनुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>सामुदायिक सहभागिता:</strong> सिंचाई उपभोक्ता समितिहरूको क्षमता अभिवृद्धि गरी सिंचाई पूर्वाधारको 
                  संचालन र मर्मतसम्भारमा स्थानीय सहभागिता बढाउनुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>जलवायु अनुकूलन:</strong> जलवायु परिवर्तनको प्रभावलाई मध्यनजर गर्दै सिंचाई पूर्वाधारको जलवायु 
                  अनुकूल विकास गर्नुपर्ने। वर्षाको पानी संकलन र भण्डारणमा विशेष जोड दिनुपर्ने।
                </div>
              </div>
            </div>
            
            <p className="mt-6">
              खजुरा गाउँपालिकामा सिंचाई स्रोतको वर्तमान अवस्थाले सिंचाई प्रणालीमा विविधीकरण र दक्षता सुधार गर्नुपर्ने 
              आवश्यकता देखाउँछ। सिंचाई दिगोपना, जल संरक्षण र आधुनिक प्रविधिको प्रयोगमा जोड दिई कार्यान्वयन गर्न आवश्यक देखिन्छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
