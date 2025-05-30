import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import IrrigatedAreaCharts from "./_components/irrigated-area-charts";
import IrrigatedAreaAnalysisSection from "./_components/irrigated-area-analysis-section";
import IrrigatedAreaSEO from "./_components/irrigated-area-seo";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Define colors for area types
const AREA_COLORS: Record<string, string> = {
  IRRIGATED: "#2ecc71", // Green for irrigated
  UNIRRIGATED: "#e67e22", // Orange for unirrigated
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const irrigatedAreaData =
      await api.profile.economics.wardWiseIrrigatedArea.getAll.query();
    const municipalityName = "खजुरा गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalIrrigatedArea = irrigatedAreaData.reduce(
      (sum, item) => sum + parseFloat(item.irrigatedAreaHectares.toString()),
      0,
    );

    const totalUnirrigatedArea = irrigatedAreaData.reduce(
      (sum, item) => sum + parseFloat(item.unirrigatedAreaHectares.toString()),
      0,
    );

    const totalArea = totalIrrigatedArea + totalUnirrigatedArea;
    const irrigationCoverage =
      totalArea > 0 ? (totalIrrigatedArea / totalArea) * 100 : 0;

    // Find ward with highest irrigation coverage
    let highestCoverageWard: number | null = null;
    let highestCoveragePercentage = 0;

    irrigatedAreaData.forEach((item) => {
      const irrigated = parseFloat(item.irrigatedAreaHectares.toString());
      const unirrigated = parseFloat(item.unirrigatedAreaHectares.toString());
      const wardTotal = irrigated + unirrigated;
      const coverage = wardTotal > 0 ? (irrigated / wardTotal) * 100 : 0;

      if (coverage > highestCoveragePercentage) {
        highestCoveragePercentage = coverage;
        highestCoverageWard = item.wardNumber;
      }
    });

    // Create rich keywords with actual data
    const keywordsNP = [
      "खजुरा गाउँपालिका सिंचित क्षेत्र",
      "वडा अनुसार सिंचाई",
      "खजुरा सिंचाई कभरेज",
      "कृषि सिंचाई वितरण",
      "सिंचित असिंचित क्षेत्र",
      `खजुरा सिंचित क्षेत्र ${localizeNumber(totalIrrigatedArea.toFixed(1), "ne")} हेक्टर`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality irrigated area",
      "Ward-wise irrigation coverage",
      "Khajura irrigation statistics",
      "Agricultural irrigation distribution",
      "Irrigated unirrigated area",
      `Khajura irrigated area ${totalIrrigatedArea.toFixed(1)} hectares`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `खजुरा गाउँपालिकाको वडा अनुसार सिंचित क्षेत्रको विस्तृत विश्लेषण। कुल ${localizeNumber(totalArea.toFixed(1), "ne")} हेक्टर कृषि क्षेत्रमध्ये ${localizeNumber(totalIrrigatedArea.toFixed(1), "ne")} हेक्टर (${localizeNumber(irrigationCoverage.toFixed(1), "ne")}%) सिंचित छ। वडा नं. ${localizeNumber(highestCoverageWard !== null ? String(highestCoverageWard) : "", "ne")} मा सर्वाधिक ${localizeNumber(highestCoveragePercentage.toFixed(1), "ne")}% सिंचाई कभरेज रहेको छ।`;

    const descriptionEN = `Comprehensive analysis of ward-wise irrigated area in Khajura Rural Municipality. Out of total ${totalArea.toFixed(1)} hectares of agricultural area, ${totalIrrigatedArea.toFixed(1)} hectares (${irrigationCoverage.toFixed(1)}%) is irrigated. Ward No. ${highestCoverageWard} has the highest irrigation coverage of ${highestCoveragePercentage.toFixed(1)}%.`;

    return {
      title: `वडा अनुसार सिंचित क्षेत्र | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/ward-wise-irrigated-area",
        languages: {
          en: "/en/profile/economics/ward-wise-irrigated-area",
          ne: "/ne/profile/economics/ward-wise-irrigated-area",
        },
      },
      openGraph: {
        title: `वडा अनुसार सिंचित क्षेत्र | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `वडा अनुसार सिंचित क्षेत्र | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "वडा अनुसार सिंचित क्षेत्र | खजुरा गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "खजुरा गाउँपालिकाको वडा अनुसार सिंचित र असिंचित कृषि क्षेत्रको विस्तृत विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "पालिकाको सिंचाई अवस्था",
    slug: "municipality-irrigation-status",
  },
  {
    level: 2,
    text: "वडा अनुसार सिंचाई कभरेज",
    slug: "ward-wise-irrigation-coverage",
  },
  { level: 2, text: "सिंचाई प्रभावकारिता", slug: "irrigation-effectiveness" },
  {
    level: 2,
    text: "सिंचाई पूर्वाधार विकास",
    slug: "irrigation-infrastructure-development",
  },
  {
    level: 2,
    text: "निष्कर्ष र सिफारिसहरू",
    slug: "conclusions-and-recommendations",
  },
];

export default async function WardWiseIrrigatedAreaPage() {
  // Fetch all irrigated area data using tRPC
  const irrigatedAreaData =
    await api.profile.economics.wardWiseIrrigatedArea.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.wardWiseIrrigatedArea.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  const totalIrrigatedArea = irrigatedAreaData.reduce(
    (sum, item) => sum + parseFloat(String(item.irrigatedAreaHectares || 0)),
    0,
  );

  const totalUnirrigatedArea = irrigatedAreaData.reduce(
    (sum, item) => sum + parseFloat(String(item.unirrigatedAreaHectares || 0)),
    0,
  );

  const totalArea = totalIrrigatedArea + totalUnirrigatedArea;
  const irrigationCoveragePercentage =
    totalArea > 0 ? (totalIrrigatedArea / totalArea) * 100 : 0;

  // Create data for pie chart
  const pieChartData = [
    {
      name: "सिंचित क्षेत्र",
      value: totalIrrigatedArea,
      percentage: irrigationCoveragePercentage.toFixed(2),
      type: "IRRIGATED",
    },
    {
      name: "असिंचित क्षेत्र",
      value: totalUnirrigatedArea,
      percentage: (100 - irrigationCoveragePercentage).toFixed(2),
      type: "UNIRRIGATED",
    },
  ];

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(irrigatedAreaData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers
    .map((wardNumber) => {
      const wardItem = irrigatedAreaData.find(
        (item) => item.wardNumber === wardNumber,
      );

      if (!wardItem) return null;

      const irrigated = parseFloat(String(wardItem.irrigatedAreaHectares || 0));
      const unirrigated = parseFloat(
        String(wardItem.unirrigatedAreaHectares || 0),
      );

      return {
        ward: `वडा ${wardNumber}`,
        "सिंचित क्षेत्र": irrigated,
        "असिंचित क्षेत्र": unirrigated,
      };
    })
    .filter(Boolean);

  // Calculate ward-wise irrigation analysis
  const wardWiseAnalysis = wardNumbers
    .map((wardNumber) => {
      const wardItem = irrigatedAreaData.find(
        (item) => item.wardNumber === wardNumber,
      );

      if (!wardItem) return null;

      const irrigatedArea = parseFloat(
        String(wardItem.irrigatedAreaHectares || 0),
      );
      const unirrigatedArea = parseFloat(
        String(wardItem.unirrigatedAreaHectares || 0),
      );
      const totalWardArea = irrigatedArea + unirrigatedArea;
      const irrigationCoverage =
        totalWardArea > 0 ? (irrigatedArea / totalWardArea) * 100 : 0;

      // Calculate irrigation efficiency score (0-100)
      // Higher score means better irrigation coverage
      const efficiencyScore = Math.round(irrigationCoverage);

      // Categorize irrigation status
      const getIrrigationStatus = (coverage: number) => {
        if (coverage >= 80) return "excellent";
        if (coverage >= 60) return "good";
        if (coverage >= 40) return "moderate";
        if (coverage >= 20) return "poor";
        return "very_poor";
      };

      return {
        wardNumber,
        irrigatedArea,
        unirrigatedArea,
        totalWardArea,
        irrigationCoverage,
        efficiencyScore,
        irrigationStatus: getIrrigationStatus(irrigationCoverage),
      };
    })
    .filter(Boolean)
    .sort(
      (a, b) => (b?.irrigationCoverage || 0) - (a?.irrigationCoverage || 0),
    ); // Sort by coverage with null safety

  // Find best and worst performing wards
  const bestPerformingWard = wardWiseAnalysis[0];
  const worstPerformingWard = wardWiseAnalysis[wardWiseAnalysis.length - 1];

  // Calculate overall irrigation efficiency score
  const overallEfficiencyScore = Math.round(irrigationCoveragePercentage);

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <IrrigatedAreaSEO
        totalIrrigatedArea={totalIrrigatedArea}
        //@ts-ignore
        totalUnirrigatedArea={totalUnirrigatedArea}
        totalArea={totalArea}
        irrigationCoveragePercentage={irrigationCoveragePercentage}
        wardWiseAnalysis={wardWiseAnalysis}
        overallEfficiencyScore={overallEfficiencyScore}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/irrigated-area.svg"
              width={1200}
              height={400}
              alt="वडा अनुसार सिंचित क्षेत्र - खजुरा गाउँपालिका (Ward-wise Irrigated Area - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              खजुरा गाउँपालिकामा वडा अनुसार सिंचित क्षेत्र
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              सिंचाई कृषि उत्पादनको मेरुदण्ड हो र खाद्य सुरक्षाको आधार पनि।
              नेपालको कृषि प्रधान अर्थतन्त्रमा सिंचाई सुविधाको पहुँच र वितरणले
              कृषकहरूको जीवनयात्रालाई प्रत्यक्ष प्रभाव पार्छ। खजुरा गाउँपालिकामा
              पनि सिंचाई सुविधाको उपलब्धता र वितरणले स्थानीय कृषि उत्पादन र
              किसानहरूको आर्थिक अवस्थामा महत्त्वपूर्ण भूमिका खेलेको छ।
            </p>
            <p>
              खजुरा गाउँपालिकाको सिंचाई सम्बन्धी तथ्याङ्क अनुसार, कुल{" "}
              {localizeNumber(totalArea.toFixed(1), "ne")}
              हेक्टर कृषि क्षेत्रमध्ये{" "}
              {localizeNumber(totalIrrigatedArea.toFixed(1), "ne")} हेक्टर
              अर्थात्
              {localizeNumber(irrigationCoveragePercentage.toFixed(1), "ne")}%
              क्षेत्रमा सिंचाई सुविधा उपलब्ध छ। यसमध्ये वडा नं.{" "}
              {localizeNumber(
                bestPerformingWard?.wardNumber.toString() || "",
                "ne",
              )}{" "}
              मा सबैभन्दा बढी
              {localizeNumber(
                bestPerformingWard?.irrigationCoverage.toFixed(1) || "0",
                "ne",
              )}
              % सिंचाई कभरेज रहेको छ।
            </p>

            <h2
              id="municipality-irrigation-status"
              className="scroll-m-20 border-b pb-2"
            >
              पालिकाको समग्र सिंचाई अवस्था
            </h2>
            <p>
              खजुरा गाउँपालिकाको सिंचाई अवस्थाको समग्र मूल्याङ्कन गर्दा
              निम्नलिखित तथ्यहरू देखिन्छन्:
            </p>

            <ul>
              <li>
                <strong>कुल कृषि क्षेत्र:</strong>{" "}
                {localizeNumber(totalArea.toFixed(1), "ne")} हेक्टर
              </li>
              <li>
                <strong>सिंचित क्षेत्र:</strong>{" "}
                {localizeNumber(totalIrrigatedArea.toFixed(1), "ne")} हेक्टर (
                {localizeNumber(irrigationCoveragePercentage.toFixed(1), "ne")}
                %)
              </li>
              <li>
                <strong>असिंचित क्षेत्र:</strong>{" "}
                {localizeNumber(totalUnirrigatedArea.toFixed(1), "ne")} हेक्टर (
                {localizeNumber(
                  (100 - irrigationCoveragePercentage).toFixed(1),
                  "ne",
                )}
                %)
              </li>
              <li>
                <strong>सिंचाई प्रभावकारिता स्कोर:</strong>{" "}
                {localizeNumber(overallEfficiencyScore.toString(), "ne")}%
              </li>
            </ul>

            <p>
              सिंचाई कभरेजको विश्लेषण गर्दा, खजुरा गाउँपालिकामा सिंचाई पहुँच{" "}
              {irrigationCoveragePercentage >= 60
                ? "राम्रो"
                : irrigationCoveragePercentage >= 40
                  ? "सन्तोषजनक"
                  : "सुधार आवश्यक"}
              स्तरमा रहेको छ। तथापि, वडागत भिन्नताले सिंचाई पूर्वाधारको समान
              वितरणमा चुनौती देखाउँछ।
            </p>
          </div>

          {/* Client component for charts */}
          <IrrigatedAreaCharts
            totalIrrigatedArea={totalIrrigatedArea}
            totalUnirrigatedArea={totalUnirrigatedArea}
            totalArea={totalArea}
            irrigationCoveragePercentage={irrigationCoveragePercentage}
            pieChartData={pieChartData}
            //@ts-ignore
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            irrigatedAreaData={irrigatedAreaData}
            //@ts-ignore
            wardWiseAnalysis={wardWiseAnalysis}
            AREA_COLORS={AREA_COLORS}
            overallEfficiencyScore={overallEfficiencyScore}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="irrigation-infrastructure-development"
              className="scroll-m-20 border-b pb-2"
            >
              सिंचाई पूर्वाधार विकास
            </h2>
            <p>
              खजुरा गाउँपालिकामा सिंचाई पूर्वाधारको वर्तमान अवस्थाले कृषि
              उत्पादनमा महत्त्वपूर्ण भूमिका खेलेको छ। कुल{" "}
              {localizeNumber(totalArea.toFixed(1), "ne")} हेक्टर कृषि योग्य
              भूमिमध्ये {localizeNumber(totalIrrigatedArea.toFixed(1), "ne")}
              हेक्टर क्षेत्रमा सिंचाई पहुँच पुगेको छ, जसले{" "}
              {localizeNumber(irrigationCoveragePercentage.toFixed(1), "ne")}%
              कभरेज दर दर्शाउँछ।
            </p>

            <p>
              तथापि, वडागत असन्तुलनले सिंचाई पूर्वाधारको समान वितरणमा चुनौती खडा
              गरेको छ। विशेषगरी वडा नं.
              {localizeNumber(
                worstPerformingWard?.wardNumber.toString() || "",
                "ne",
              )}{" "}
              मा मात्र{" "}
              {localizeNumber(
                worstPerformingWard?.irrigationCoverage.toFixed(1) || "0",
                "ne",
              )}
              % सिंचाई कभरेज रहेकोले यस क्षेत्रमा सिंचाई पूर्वाधारको विस्तारमा
              प्राथमिकता दिनुपर्ने देखिन्छ।
            </p>

            <IrrigatedAreaAnalysisSection
              totalIrrigatedArea={totalIrrigatedArea}
              totalUnirrigatedArea={totalUnirrigatedArea}
              totalArea={totalArea}
              irrigationCoveragePercentage={irrigationCoveragePercentage}
              //@ts-ignore
              wardWiseAnalysis={wardWiseAnalysis}
              AREA_COLORS={AREA_COLORS}
              overallEfficiencyScore={overallEfficiencyScore}
              bestPerformingWard={bestPerformingWard}
              worstPerformingWard={worstPerformingWard}
            />

            <h2
              id="conclusions-and-recommendations"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              निष्कर्ष र सिफारिसहरू
            </h2>

            <p>
              खजुरा गाउँपालिकाको सिंचाई अवस्थाको विश्लेषणबाट निम्न निष्कर्ष र
              सिफारिसहरू गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>सिंचाई विस्तार:</strong> हाल पालिकामा{" "}
                  {localizeNumber(
                    (100 - irrigationCoveragePercentage).toFixed(1),
                    "ne",
                  )}
                  % कृषि क्षेत्र असिंचित रहेकोले सिंचाई पूर्वाधारको विस्तारमा
                  विशेष जोड दिनुपर्ने। विशेषगरी वडा नं.
                  {localizeNumber(
                    worstPerformingWard?.wardNumber.toString() || "",
                    "ne",
                  )}{" "}
                  जस्ता कम कभरेज भएका क्षेत्रहरूमा प्राथमिकता दिनुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>वडागत सन्तुलन:</strong> सिंचाई सुविधाको वडागत
                  असन्तुलनलाई सम्बोधन गर्न समान वितरणको नीति अवलम्बन गर्नुपर्ने।
                  उच्च कभरेज भएका वडाहरूको अनुभव र प्रविधि अन्य वडाहरूमा
                  हस्तान्तरण गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>प्रविधि सुधार:</strong> परम्परागत सिंचाई प्रणालीमा
                  आधुनिक प्रविधिको समावेश गरी पानीको दक्ष उपयोग सुनिश्चित
                  गर्नुपर्ने। ड्रिप इरिगेसन र स्प्रिंकलर सिस्टम जस्ता जल बचत
                  प्रविधिहरूको प्रवर्द्धन गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>सामुदायिक सहभागिता:</strong> सिंचाई उपभोक्ता
                  समितिहरूको क्षमता अभिवृद्धि गरी सिंचाई पूर्वाधारको संचालन र
                  मर्मतसम्भारमा स्थानीय सहभागिता बढाउनुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>जलवायु अनुकूलन:</strong> जलवायु परिवर्तनको प्रभावलाई
                  मध्यनजर गर्दै सिंचाई पूर्वाधारको जलवायु अनुकूल विकास
                  गर्नुपर्ने। वर्षाको पानी संकलन र भण्डारणमा विशेष जोड
                  दिनुपर्ने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              खजुरा गाउँपालिकामा सिंचाई सुविधाको वर्तमान अवस्थाले सिंचाई
              पूर्वाधारमा व्यापक सुधार गर्नुपर्ने आवश्यकता देखाउँछ। समान पहुँच,
              दक्ष प्रविधि र दिगो व्यवस्थापनमा जोड दिई कार्यान्वयन गर्न आवश्यक
              देखिन्छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
