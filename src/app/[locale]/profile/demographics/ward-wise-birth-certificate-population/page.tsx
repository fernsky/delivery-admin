import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import BirthCertificateCharts from "./_components/birth-certificate-charts";
import BirthCertificateAnalysisSection from "./_components/birth-certificate-analysis-section";
import BirthCertificateSEO from "./_components/birth-certificate-seo";

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
    const birthCertificateData =
      await api.profile.demographics.wardWiseBirthCertificatePopulation.getAll.query();
    const municipalityName = "खजुरा गाउँपालिका"; // Khajura Rural Municipality

    // Try to get summary data
    let totalCertificateHolders = 0;
    try {
      const summaryData = await api.profile.demographics.wardWiseBirthCertificatePopulation.summary.query();
      totalCertificateHolders = summaryData.totalCertificateHolders;
    } catch (error) {
      // Calculate from raw data if summary API fails
      totalCertificateHolders = birthCertificateData.reduce(
        (sum, item) => sum + (item.birthCertificateHoldersBelow5years || 0),
        0,
      );
    }

    // Create rich keywords with actual data
    const keywordsNP = [
      "खजुरा गाउँपालिका जन्मदर्ता",
      "पाँच वर्षमुनिका बालबालिका जन्मदर्ता",
      "वडा अनुसार जन्मदर्ता विवरण",
      "बालबालिका जन्मदर्ता विश्लेषण",
      "जन्मदर्ता प्रमाणपत्र धारक बालबालिका",
      `खजुरा जन्मदर्ता भएका बालबालिका संख्या ${localizeNumber(totalCertificateHolders.toString(), "ne")}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality birth registration",
      "Children under five birth certificate",
      "Ward-wise birth registration data",
      "Birth certificate analysis",
      "Birth certificate holders in Khajura",
      `Khajura total birth certificates for children ${totalCertificateHolders}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `खजुरा गाउँपालिकाको वडा अनुसार पाँच वर्षमुनिका बालबालिकाहरूको जन्मदर्ता प्रमाणपत्र धारकको वितरण र विश्लेषण। कुल जन्मदर्ता प्रमाणपत्र प्राप्त बालबालिका संख्या ${localizeNumber(totalCertificateHolders.toString(), "ne")} रहेको देखिन्छ। विभिन्न वडाहरूमा जन्मदर्ता प्रमाणपत्र वितरणको विस्तृत विश्लेषण।`;

    const descriptionEN = `Ward-wise distribution and analysis of birth certificate holders among children under five in Khajura Rural Municipality. A total of ${totalCertificateHolders} children under five have birth certificates. Detailed analysis of birth certificate distribution across various wards.`;

    return {
      title: `पाँच वर्षमुनिका बालबालिका जन्मदर्ता | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/demographics/ward-wise-birth-certificate-population",
        languages: {
          en: "/en/profile/demographics/ward-wise-birth-certificate-population",
          ne: "/ne/profile/demographics/ward-wise-birth-certificate-population",
        },
      },
      openGraph: {
        title: `पाँच वर्षमुनिका बालबालिका जन्मदर्ता | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `पाँच वर्षमुनिका बालबालिका जन्मदर्ता | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "पाँच वर्षमुनिका बालबालिका जन्मदर्ता | खजुरा गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "वडा अनुसार पाँच वर्षमुनिका बालबालिकाहरूको जन्मदर्ता प्रमाणपत्र धारकको वितरण र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "जन्मदर्ता प्रमाणपत्र धारक", slug: "birth-certificate-holders" },
  { level: 2, text: "वडा अनुसार जन्मदर्ता वितरण", slug: "ward-wise-birth-certificates" },
  { level: 2, text: "जन्मदर्ता विश्लेषण", slug: "birth-certificate-analysis" },
];

export default async function WardWiseBirthCertificatePopulationPage() {
  // Fetch all birth certificate data using tRPC
  const birthCertificateData =
    await api.profile.demographics.wardWiseBirthCertificatePopulation.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.demographics.wardWiseBirthCertificatePopulation.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Calculate total certificate holders
  const totalCertificateHolders = summaryData?.totalCertificateHolders || 
    birthCertificateData.reduce(
      (sum, item) => sum + (item.birthCertificateHoldersBelow5years || 0),
      0
    );

  // Sort data by ward number for consistent presentation
  const sortedData = [...birthCertificateData].sort((a, b) => a.wardNumber - b.wardNumber);

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(birthCertificateData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Calculate ward-wise analysis
  const wardWiseAnalysis = wardNumbers.map((wardNumber) => {
    const wardData = birthCertificateData.find(
      (item) => item.wardNumber === wardNumber,
    );
    
    return {
      wardNumber,
      birthCertificateHolders: wardData?.birthCertificateHoldersBelow5years || 0,
      percentage: totalCertificateHolders > 0 
        ? ((wardData?.birthCertificateHoldersBelow5years || 0) / totalCertificateHolders * 100).toFixed(2)
        : "0",
    };
  });

  // Find wards with highest and lowest birth certificate registration
  const wardsRanked = [...wardWiseAnalysis].sort((a, b) => 
    b.birthCertificateHolders - a.birthCertificateHolders
  );
  
  const highestWard = wardsRanked[0];
  const lowestWard = wardsRanked[wardsRanked.length - 1];

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <BirthCertificateSEO
        birthCertificateData={birthCertificateData}
        totalCertificateHolders={totalCertificateHolders}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/birth-certificate.svg"
              width={1200}
              height={400}
              alt="पाँच वर्षमुनिका बालबालिका जन्मदर्ता - खजुरा गाउँपालिका (Birth Certificates for Children Under Five - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              खजुरा गाउँपालिकामा पाँच वर्षमुनिका बालबालिकाहरूको जन्मदर्ता
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              जन्मदर्ता प्रमाणपत्र हरेक नागरिकको अधिकार हो र यसले बालबालिकाको पहिचान, शिक्षा, स्वास्थ्य सेवा
              लगायत विभिन्न सरकारी सेवाहरूमा पहुँच सुनिश्चित गर्दछ। यस खण्डमा खजुरा गाउँपालिकामा रहेका
              पाँच वर्षमुनिका बालबालिकाहरूको जन्मदर्ता प्रमाणपत्र धारकको विवरण प्रस्तुत गरिएको छ।
            </p>
            <p>
              खजुरा गाउँपालिकाभरि पाँच वर्षमुनिका जन्मदर्ता प्रमाणपत्र प्राप्त बालबालिकाहरूको कुल संख्या 
              {localizeNumber(totalCertificateHolders.toLocaleString(), "ne")} रहेको देखिन्छ, 
              जसमध्ये सबैभन्दा बढी वडा नं {localizeNumber(highestWard.wardNumber.toString(), "ne")} मा 
              {localizeNumber(highestWard.birthCertificateHolders.toLocaleString(), "ne")} 
              ({localizeNumber(highestWard.percentage, "ne")}%) जना र सबैभन्दा कम वडा नं 
              {localizeNumber(lowestWard.wardNumber.toString(), "ne")} मा 
              {localizeNumber(lowestWard.birthCertificateHolders.toLocaleString(), "ne")} 
              ({localizeNumber(lowestWard.percentage, "ne")}%) जना रहेका छन्।
            </p>

            <h2 id="birth-certificate-holders" className="scroll-m-20 border-b pb-2">
              पाँच वर्षमुनिका जन्मदर्ता प्रमाणपत्र धारक
            </h2>
            <p>
              खजुरा गाउँपालिकामा पाँच वर्षमुनिका बालबालिकाको जन्मदर्ता प्रमाणपत्र वितरण निम्नानुसार रहेको छ:
            </p>
          </div>

          {/* Client component for charts */}
          <BirthCertificateCharts
            birthCertificateData={sortedData}
            totalCertificateHolders={totalCertificateHolders}
            wardNumbers={wardNumbers}
            wardWiseAnalysis={wardWiseAnalysis}
            highestWard={highestWard}
            lowestWard={lowestWard}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="birth-certificate-analysis" className="scroll-m-20 border-b pb-2">
              जन्मदर्ता विश्लेषण
            </h2>
            <p>
              खजुरा गाउँपालिकामा पाँच वर्षमुनिका बालबालिकाको जन्मदर्ता विश्लेषण गर्दा, 
              सबैभन्दा बढी वडा नं {localizeNumber(highestWard.wardNumber.toString(), "ne")} मा 
              {localizeNumber(highestWard.birthCertificateHolders.toLocaleString(), "ne")} जना 
              ({localizeNumber(highestWard.percentage, "ne")}%) रहेको पाइन्छ।
            </p>

            {/* Client component for analysis section */}
            <BirthCertificateAnalysisSection
              wardWiseAnalysis={wardWiseAnalysis}
              totalCertificateHolders={totalCertificateHolders}
              highestWard={highestWard}
              lowestWard={lowestWard}
            />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
