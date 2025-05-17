import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import { api } from "@/trpc/server";
import Image from "next/image";
import MaritalStatusCharts from "./_components/marital-status-charts";
import MaritalStatusAnalysisSection from "./_components/marital-status-analysis-section";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "उमेर अनुसार वैवाहिक स्थिति | पालिका प्रोफाइल",
  description:
    "उमेर समूह अनुसार वैवाहिक स्थितिको वितरण, प्रवृत्ति र विश्लेषण। विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
  keywords: [
    "वैवाहिक स्थिति",
    "विवाहित",
    "अविवाहित",
    "बहुविवाह",
    "विधवा",
    "पारपाचुके",
    "उमेर अनुसार विवाह",
    "जनसांख्यिकी",
    "जीवन साथी",
  ],
  openGraph: {
    title: "उमेर अनुसार वैवाहिक स्थिति | पालिका प्रोफाइल",
    description:
      "उमेर समूह अनुसार वैवाहिक स्थितिको वितरण, प्रवृत्ति र विश्लेषण। विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
    type: "article",
    locale: "ne_NP",
  },
};

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "वैवाहिक स्थितिको समग्र वितरण",
    slug: "marital-status-distribution",
  },
  {
    level: 2,
    text: "उमेर अनुसार वैवाहिक स्थिति",
    slug: "age-wise-marital-status",
  },
  {
    level: 2,
    text: "लिङ्ग अनुसार वैवाहिक स्थिति",
    slug: "gender-wise-marital-status",
  },
  { level: 2, text: "वडा अनुसार विश्लेषण", slug: "ward-wise-analysis" },
  { level: 2, text: "सामाजिक सुचकांक", slug: "social-indicators" },
  { level: 2, text: "तथ्याङ्क स्रोत", slug: "data-source" },
];

// Define Nepali names for age groups
const AGE_GROUP_NAMES: Record<string, string> = {
  AGE_BELOW_15: "१५ वर्ष भन्दा कम",
  AGE_15_19: "१५-१९ वर्ष",
  AGE_20_24: "२०-२४ वर्ष",
  AGE_25_29: "२५-२९ वर्ष",
  AGE_30_34: "३०-३४ वर्ष",
  AGE_35_39: "३५-३९ वर्ष",
  AGE_40_44: "४०-४४ वर्ष",
  AGE_45_49: "४५-४९ वर्ष",
  AGE_50_54: "५०-५४ वर्ष",
  AGE_55_59: "५५-५९ वर्ष",
  AGE_60_64: "६०-६४ वर्ष",
  AGE_65_69: "६५-६९ वर्ष",
  AGE_70_74: "७०-७४ वर्ष",
  AGE_75_AND_ABOVE: "७५ वर्ष र माथि",
};

// Define Nepali names for marital status
const MARITAL_STATUS_NAMES: Record<string, string> = {
  SINGLE: "अविवाहित",
  MARRIED: "विवाहित",
  DIVORCED: "पारपाचुके",
  WIDOWED: "विधुर/विधवा",
  SEPARATED: "छुट्टिएको",
  NOT_STATED: "उल्लेख नभएको",
};

// Define age group categories
const AGE_CATEGORIES = {
  YOUNG: ["AGE_BELOW_15", "AGE_15_19"],
  YOUNG_ADULT: ["AGE_20_24", "AGE_25_29", "AGE_30_34"],
  MIDDLE_AGED: [
    "AGE_35_39",
    "AGE_40_44",
    "AGE_45_49",
    "AGE_50_54",
    "AGE_55_59",
  ],
  ELDERLY: ["AGE_60_64", "AGE_65_69", "AGE_70_74", "AGE_75_AND_ABOVE"],
};

export default async function AgeWiseMaritalStatusPage() {
  // Fetch all age-wise marital status data from tRPC route
  const maritalData =
    await api.profile.demographics.wardAgeWiseMaritalStatus.getAll.query();

  // Fetch summary statistics if available
  let summaryData;
  try {
    summaryData =
      await api.profile.demographics.wardAgeWiseMaritalStatus.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
    summaryData = null;
  }

  // Process data for overall summary by marital status
  const overallByMaritalStatus = Object.entries(
    maritalData.reduce((acc: Record<string, number>, item) => {
      const key = item.maritalStatus;
      if (!acc[key]) acc[key] = 0;
      acc[key] += item.population;
      return acc;
    }, {}),
  ).map(([status, population]) => ({
    status,
    statusName:
      MARITAL_STATUS_NAMES[status as keyof typeof MARITAL_STATUS_NAMES] ||
      status,
    population: population as number,
  }));

  // Calculate total population
  const totalPopulation = overallByMaritalStatus.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  // Process data for age-wise marital status
  const ageWiseMaritalData = Object.keys(AGE_GROUP_NAMES)
    .map((ageGroup) => {
      const ageGroupData = maritalData.filter(
        (item) => item.ageGroup === ageGroup,
      );
      const result: Record<string, any> = {
        ageGroup,
        ageGroupName: AGE_GROUP_NAMES[ageGroup],
      };

      // Add counts for each marital status
      Object.keys(MARITAL_STATUS_NAMES).forEach((status) => {
        const statusData = ageGroupData.find(
          (item) => item.maritalStatus === status,
        );
        result[status] = statusData ? statusData.population : 0;
      });

      // Calculate total for this age group
      result.total = ageGroupData.reduce(
        (sum, item) => sum + item.population,
        0,
      );

      return result;
    })
    .filter((item) => item.total > 0);

  // Get unique ward IDs
  const wardIds = Array.from(
    new Set(maritalData.map((item) => item.wardNumber)),
  );

  // Process data for ward-wise analysis
  const wardWiseData = wardIds.map((wardId) => {
    const wardItems = maritalData.filter((item) => item.wardNumber === wardId);

    // Calculate counts for each marital status in this ward
    const counts: Record<string, number> = {};
    Object.keys(MARITAL_STATUS_NAMES).forEach((status) => {
      counts[status] = wardItems
        .filter((item) => item.maritalStatus === status)
        .reduce((sum, item) => sum + item.population, 0);
    });

    return {
      wardId,
      wardNumber: `वडा ${wardId}`,
      ...counts,
      total: wardItems.reduce((sum, item) => sum + item.population, 0),
    };
  });

  // Calculate gender-wise marital status
  const genderWiseData = Object.keys(MARITAL_STATUS_NAMES)
    .map((status) => {
      const statusData = maritalData.filter(
        (item) => item.maritalStatus === status,
      );
      const maleCount = statusData.reduce(
        (sum, item) => sum + (item.malePopulation || 0),
        0,
      );
      const femaleCount = statusData.reduce(
        (sum, item) => sum + (item.femalePopulation || 0),
        0,
      );
      const otherCount = statusData.reduce(
        (sum, item) => sum + (item.otherPopulation || 0),
        0,
      );

      return {
        status,
        statusName:
          MARITAL_STATUS_NAMES[status as keyof typeof MARITAL_STATUS_NAMES] ||
          status,
        male: maleCount,
        female: femaleCount,
        other: otherCount,
        total: maleCount + femaleCount + otherCount,
      };
    })
    .filter((item) => item.total > 0);

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/marital-status.svg" // You'll need this image
              width={1200}
              height={400}
              alt="उमेर अनुसार वैवाहिक स्थिति"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा पालिकाको जनसंख्याको उमेर अनुसारको वैवाहिक स्थिति
              सम्बन्धी विस्तृत तथ्याङ्क प्रस्तुत गरिएको छ। वैवाहिक स्थिति एक
              महत्त्वपूर्ण सामाजिक सूचक हो जसले सामाजिक संरचना, परिवारको आकार,
              प्रजनन दर र जनसंख्या वृद्धि जस्ता पक्षहरूलाई प्रभावित गर्दछ।
            </p>
            <p>
              विभिन्न उमेर समूहका व्यक्तिहरूको वैवाहिक स्थितिको जानकारीले
              सामाजिक सुरक्षा, स्वास्थ्य, शिक्षा र अन्य कल्याणकारी कार्यक्रमहरू
              निर्धारण गर्न महत्वपूर्ण आधार प्रदान गर्दछ। विशेष गरी महिला, एकल
              महिला तथा पुरुषहरूको स्थिति र आवश्यकताहरू पहिचान गर्न यस
              तथ्याङ्कले सहयोग गर्दछ।
            </p>

            <h2
              id="marital-status-distribution"
              className="scroll-m-20 border-b pb-2"
            >
              वैवाहिक स्थितिको समग्र वितरण
            </h2>
            <p>
              पालिकामा विभिन्न वैवाहिक स्थिति भएका व्यक्तिहरूको वितरण
              निम्नानुसार छ:
            </p>
          </div>

          {/* Client component for charts */}
          <MaritalStatusCharts
            overallByMaritalStatus={overallByMaritalStatus}
            ageWiseMaritalData={ageWiseMaritalData}
            genderWiseData={genderWiseData}
            wardWiseData={wardWiseData}
            totalPopulation={totalPopulation}
            MARITAL_STATUS_NAMES={MARITAL_STATUS_NAMES}
            AGE_GROUP_NAMES={AGE_GROUP_NAMES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="social-indicators" className="scroll-m-20 border-b pb-2">
              सामाजिक सुचकांक र विश्लेषण
            </h2>
            <p>
              वैवाहिक स्थितिको तथ्याङ्कबाट हामीले निम्न सामाजिक सूचकांकहरू
              विश्लेषण गर्न सक्छौं:
            </p>

            {/* Client component for marital status analysis section */}
            <MaritalStatusAnalysisSection
              overallByMaritalStatus={overallByMaritalStatus}
              ageWiseMaritalData={ageWiseMaritalData}
              genderWiseData={genderWiseData}
              wardWiseData={wardWiseData}
              totalPopulation={totalPopulation}
              MARITAL_STATUS_NAMES={MARITAL_STATUS_NAMES}
              AGE_GROUP_NAMES={AGE_GROUP_NAMES}
              AGE_CATEGORIES={AGE_CATEGORIES}
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
              <li>सामाजिक सुरक्षा कार्यक्रमहरू लक्षित गर्न</li>
              <li>एकल महिला तथा पुरुषहरूका लागि विशेष कार्यक्रम बनाउन</li>
              <li>बाल विवाह न्यूनीकरण रणनीति बनाउन</li>
              <li>
                परिवार नियोजन तथा प्रजनन स्वास्थ्य कार्यक्रमहरू निर्धारण गर्न
              </li>
              <li>वृद्ध एकल व्यक्तिहरूको हेरचाह र सहयोगको योजना बनाउन</li>
            </ul>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
