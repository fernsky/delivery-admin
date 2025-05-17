import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import { api } from "@/trpc/server";
import Image from "next/image";
import AgeWiseCharts from "./_components/age-wise-charts";
import AgeAnalysisSection from "./_components/age-analysis-section";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "उमेर अनुसार जनसंख्या | पालिका प्रोफाइल",
  description:
    "वडा अनुसार उमेर समूहको जनसंख्या वितरण, प्रवृत्ति र विश्लेषण। विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
  keywords: [
    "उमेर समूह",
    "जनसंख्या",
    "बाल",
    "युवा",
    "वृद्ध",
    "जनसांख्यिक लाभांश",
    "जनगणना",
    "उमेर वितरण",
    "जनसांख्यिकी",
  ],
  openGraph: {
    title: "उमेर अनुसार जनसंख्या | पालिका प्रोफाइल",
    description:
      "वडा अनुसार उमेर समूहको जनसंख्या वितरण, प्रवृत्ति र विश्लेषण। विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
    type: "article",
    locale: "ne_NP",
  },
};

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "उमेर समूह अनुसार जनसंख्या", slug: "age-distribution" },
  { level: 2, text: "जनसांख्यिकीय पिरामिड", slug: "demographic-pyramid" },
  { level: 2, text: "वडा अनुसार उमेर वितरण", slug: "ward-wise-age" },
  { level: 2, text: "जनसांख्यिकीय विश्लेषण", slug: "demographic-analysis" },
  { level: 2, text: "तथ्याङ्क स्रोत", slug: "data-source" },
];

// Define Nepali names for age groups
const AGE_GROUP_NAMES: Record<string, string> = {
  AGE_0_4: "०-४ वर्ष",
  AGE_5_9: "५-९ वर्ष",
  AGE_10_14: "१०-१४ वर्ष",
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

// Define Nepali names for gender
const GENDER_NAMES: Record<string, string> = {
  MALE: "पुरुष",
  FEMALE: "महिला",
  OTHER: "अन्य",
};

// Define age group categories
const AGE_CATEGORIES = {
  CHILDREN: ["AGE_0_4", "AGE_5_9", "AGE_10_14"],
  YOUTH: ["AGE_15_19", "AGE_20_24", "AGE_25_29"],
  ADULT: [
    "AGE_30_34",
    "AGE_35_39",
    "AGE_40_44",
    "AGE_45_49",
    "AGE_50_54",
    "AGE_55_59",
  ],
  ELDERLY: ["AGE_60_64", "AGE_65_69", "AGE_70_74", "AGE_75_AND_ABOVE"],
};

export default async function WardAgeWisePopulationPage() {
  // Fetch all age-wise population data from tRPC route
  const ageData =
    await api.profile.demographics.wardAgeWisePopulation.getAll.query();

  // Fetch summary statistics if available
  let summaryData;
  try {
    summaryData =
      await api.profile.demographics.wardAgeWisePopulation.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
    summaryData = null;
  }

  // Define type for age group summary
  type AgeGroupSummary = {
    ageGroup: string;
    ageGroupName: string;
    total: number;
    male: number;
    female: number;
    other: number;
  };

  // Process data for overall summary by age group
  const aggregatedByAgeGroup: Record<string, AgeGroupSummary> = {};

  // Populate age group summary
  ageData.forEach((item) => {
    const key = item.ageGroup;
    if (!aggregatedByAgeGroup[key]) {
      aggregatedByAgeGroup[key] = {
        ageGroup: key,
        ageGroupName: AGE_GROUP_NAMES[key] || key,
        total: 0,
        male: 0,
        female: 0,
        other: 0,
      };
    }

    aggregatedByAgeGroup[key].total += item.population;

    if (item.gender === "MALE")
      aggregatedByAgeGroup[key].male += item.population;
    else if (item.gender === "FEMALE")
      aggregatedByAgeGroup[key].female += item.population;
    else if (item.gender === "OTHER")
      aggregatedByAgeGroup[key].other += item.population;
  });

  // Convert to array and sort by age group order
  const ageGroupOrder = Object.keys(AGE_GROUP_NAMES);
  const overallSummaryByAge = Object.values(aggregatedByAgeGroup).sort(
    (a, b) =>
      ageGroupOrder.indexOf(a.ageGroup) - ageGroupOrder.indexOf(b.ageGroup),
  );

  // Process data for overall summary by gender
  const aggregatedByGender: Record<
    string,
    { gender: string; genderName: string; population: number }
  > = {};

  // Populate gender summary
  ageData.forEach((item) => {
    const key = item.gender;
    if (!aggregatedByGender[key]) {
      aggregatedByGender[key] = {
        gender: key,
        genderName: GENDER_NAMES[key] || key,
        population: 0,
      };
    }
    aggregatedByGender[key].population += item.population;
  });

  const overallSummaryByGender = Object.values(aggregatedByGender);
  const totalPopulation = overallSummaryByGender.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  // Process data for age pyramid
  const pyramidData = Object.keys(AGE_GROUP_NAMES)
    .map((ageGroup) => {
      const ageGroupData = ageData.filter((item) => item.ageGroup === ageGroup);
      const maleData = ageGroupData.find((item) => item.gender === "MALE");
      const femaleData = ageGroupData.find((item) => item.gender === "FEMALE");

      return {
        ageGroup,
        ageGroupName: AGE_GROUP_NAMES[ageGroup],
        male: maleData ? -maleData.population : 0, // Negative value for left side of pyramid
        female: femaleData ? femaleData.population : 0,
      };
    })
    .sort((a, b) => {
      // Sort in reverse to have the oldest age group at the top
      return (
        ageGroupOrder.indexOf(b.ageGroup) - ageGroupOrder.indexOf(a.ageGroup)
      );
    });

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(ageData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b);

  // Process data by ward for charts
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardItems = ageData.filter((item) => item.wardNumber === wardNumber);

    // Aggregate by broader age categories for ward-wise comparison
    const childrenCount = wardItems
      .filter((item) => AGE_CATEGORIES.CHILDREN.includes(item.ageGroup))
      .reduce((sum, item) => sum + item.population, 0);

    const youthCount = wardItems
      .filter((item) => AGE_CATEGORIES.YOUTH.includes(item.ageGroup))
      .reduce((sum, item) => sum + item.population, 0);

    const adultCount = wardItems
      .filter((item) => AGE_CATEGORIES.ADULT.includes(item.ageGroup))
      .reduce((sum, item) => sum + item.population, 0);

    const elderlyCount = wardItems
      .filter((item) => AGE_CATEGORIES.ELDERLY.includes(item.ageGroup))
      .reduce((sum, item) => sum + item.population, 0);

    return {
      ward: `वडा ${wardNumber}`,
      "बाल (०-१४)": childrenCount,
      "युवा (१५-२९)": youthCount,
      "वयस्क (३०-५९)": adultCount,
      "वृद्ध (६० माथि)": elderlyCount,
    };
  });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/age-distribution.svg" // You'll need this image
              width={1200}
              height={400}
              alt="उमेर अनुसार जनसंख्या वितरण"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा पालिकाको विभिन्न वडाहरूमा उमेर समूह अनुसारको जनसंख्या
              सम्बन्धी विस्तृत तथ्याङ्क प्रस्तुत गरिएको छ। उमेर वितरण एक
              महत्त्वपूर्ण जनसांख्यिकी सूचक हो जसले समाजको संरचना, शिक्षा,
              स्वास्थ्य, रोजगारी र सामाजिक सुरक्षा सम्बन्धी नीतिहरू निर्धारण
              गर्न सहयोग गर्दछ।
            </p>
            <p>
              यो तथ्याङ्कले पालिकाको जनसांख्यिकीय लाभांश, निर्भरता अनुपात र
              भविष्यको जनसंख्या वृद्धिको प्रक्षेपण गर्न महत्त्वपूर्ण आधार प्रदान
              गर्दछ। विभिन्न उमेर समूहको आवश्यकता अनुसार विकास योजना तर्जुमा
              गर्न यस तथ्याङ्कको विश्लेषण अत्यन्त महत्त्वपूर्ण हुन्छ।
            </p>

            <h2 id="age-distribution" className="scroll-m-20 border-b pb-2">
              उमेर समूह अनुसार जनसंख्या
            </h2>
            <p>
              पालिकामा विभिन्न उमेर समूहका व्यक्तिहरूको वितरण निम्नानुसार छ:
            </p>
          </div>

          {/* Client component for charts */}
          <AgeWiseCharts
            overallSummaryByAge={overallSummaryByAge}
            overallSummaryByGender={overallSummaryByGender}
            totalPopulation={totalPopulation}
            pyramidData={pyramidData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            ageData={ageData}
            AGE_GROUP_NAMES={AGE_GROUP_NAMES}
            GENDER_NAMES={GENDER_NAMES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="demographic-analysis" className="scroll-m-20 border-b pb-2">
              जनसांख्यिकीय विश्लेषण
            </h2>
            <p>
              पालिकाको जनसंख्याको उमेर संरचनाले निम्न जनसांख्यिकीय सूचकहरू
              प्रदान गर्दछ:
            </p>

            {/* Client component for age analysis section */}
            <AgeAnalysisSection
              overallSummaryByAge={overallSummaryByAge}
              totalPopulation={totalPopulation}
              wardWiseData={wardWiseData}
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
              <li>विभिन्न उमेर समूहका लागि लक्षित कार्यक्रमहरू बनाउन</li>
              <li>
                विद्यालय, स्वास्थ्य संस्थाहरू र सामाजिक सुरक्षाको योजना बनाउन
              </li>
              <li>जनसांख्यिकीय लाभांश उपयोग गर्ने रणनीतिहरू विकास गर्न</li>
              <li>
                वृद्ध जनसंख्याको बढ्दो अनुपातलाई ध्यानमा राखेर नीति निर्माण गर्न
              </li>
            </ul>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
