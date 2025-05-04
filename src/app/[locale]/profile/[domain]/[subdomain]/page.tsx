import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/trpc/server";
import {
  generateSchemaOrgWebPage,
  generateSchemaOrgBreadcrumbList,
  generateSchemaOrgDataset,
} from "@/app/_lib/profile/schema";
import DomainDataVisualizer from "@/app/_components/profile/DomainDataVisualizer";
import TableOfContents from "@/app/_components/profile/TableOfContents";

interface PageProps {
  params: {
    locale: string;
    domain: string;
    subdomain: string;
  };
}

// Define domain and subdomain metadata
const domains = {
  demographics: {
    title: "जनसांख्यिकी विवरण",
    description:
      "खजुरा गाउँपालिकाको जनसंख्या सम्बन्धी विस्तृत विवरण - जाति, लिङ्ग, उमेर अनुसारको जनसंख्या विवरण",
    icon: "👥",
    color: "bg-blue-50 text-blue-700",
    subdomains: {
      caste: {
        title: "जातीय विवरण",
        description:
          "खजुरा गाउँपालिकामा बसोबास गर्ने विभिन्न जातजातिहरूको विवरण",
        dataType: "wardWiseCastePopulation",
        sections: [
          { id: "overview", title: "समग्र जातीय विवरण" },
          { id: "ward-wise", title: "वडा अनुसार जातीय विवरण" },
          { id: "charts", title: "चार्ट तथा ग्राफहरू" },
          { id: "table", title: "तालिका" },
        ],
      },
      gender: {
        title: "लिङ्ग अनुसार विवरण",
        description: "खजुरा गाउँपालिकाको लिङ्ग अनुसारको जनसंख्या विवरण",
        dataType: "wardWiseHouseHeadGender",
        sections: [
          { id: "overview", title: "समग्र लिङ्ग अनुसार विवरण" },
          { id: "househead", title: "घरमुली लिङ्ग विवरण" },
          { id: "ward-wise", title: "वडा अनुसार लिङ्ग विवरण" },
          { id: "charts", title: "चार्ट तथा ग्राफहरू" },
        ],
      },
      "age-distribution": {
        title: "उमेर अनुसार जनसंख्या",
        description: "खजुरा गाउँपालिकाको उमेर समूह अनुसारको जनसंख्या विवरण",
        dataType: "wardAgeWisePopulation",
        sections: [
          { id: "overview", title: "समग्र उमेर विवरण" },
          { id: "age-groups", title: "उमेर समूह अनुसार जनसंख्या" },
          { id: "ward-wise", title: "वडा अनुसार उमेर समूह जनसंख्या" },
          { id: "charts", title: "चार्ट तथा ग्राफहरू" },
        ],
      },
      religion: {
        title: "धार्मिक विवरण",
        description: "खजुरा गाउँपालिकामा अवलम्बन गरिने धर्महरूको विवरण",
        dataType: "wardWiseReligionPopulation",
        sections: [
          { id: "overview", title: "समग्र धार्मिक विवरण" },
          { id: "ward-wise", title: "वडा अनुसार धार्मिक विवरण" },
          { id: "charts", title: "चार्ट तथा ग्राफहरू" },
        ],
      },
      "mother-tongue": {
        title: "मातृभाषा विवरण",
        description: "खजुरा गाउँपालिकामा बोलिने मातृभाषाहरूको विवरण",
        dataType: "wardWiseMotherTonguePopulation",
        sections: [
          { id: "overview", title: "समग्र मातृभाषा विवरण" },
          { id: "ward-wise", title: "वडा अनुसार मातृभाषा विवरण" },
          { id: "charts", title: "चार्ट तथा ग्राफहरू" },
        ],
      },
    },
  },
  health: {
    title: "स्वास्थ्य विवरण",
    description:
      "खजुरा गाउँपालिकाको स्वास्थ्य सेवा, सुविधाहरू र स्वास्थ्य सम्बन्धी विस्तृत जानकारी",
    icon: "🏥",
    color: "bg-green-50 text-green-700",
    subdomains: {
      facilities: {
        title: "स्वास्थ्य संस्थाहरू",
        description: "खजुरा गाउँपालिकामा रहेका स्वास्थ्य संस्थाहरूको विवरण",
        dataType: "healthFacilities",
        sections: [
          { id: "overview", title: "समग्र स्वास्थ्य संस्था विवरण" },
          { id: "ward-wise", title: "वडा अनुसार स्वास्थ्य संस्थाहरू" },
          { id: "types", title: "प्रकार अनुसार स्वास्थ्य संस्थाहरू" },
          { id: "maps", title: "नक्सामा स्वास्थ्य संस्थाहरू" },
        ],
      },
      indicators: {
        title: "स्वास्थ्य सूचकहरू",
        description: "खजुरा गाउँपालिकाको प्रमुख स्वास्थ्य सूचकहरूको विश्लेषण",
        dataType: "healthIndicators",
        sections: [
          { id: "overview", title: "प्रमुख स्वास्थ्य सूचकहरू" },
          { id: "maternal", title: "मातृ स्वास्थ्य सूचकहरू" },
          { id: "child", title: "बाल स्वास्थ्य सूचकहरू" },
          { id: "ward-wise", title: "वडा अनुसार स्वास्थ्य सूचकहरू" },
        ],
      },
    },
  },
  cooperatives: {
    title: "सहकारी संस्थाहरू",
    description:
      "खजुरा गाउँपालिकामा रहेका सहकारी संस्थाहरूको विवरण र तथ्याङ्कहरू",
    icon: "🏢",
    color: "bg-yellow-50 text-yellow-700",
    subdomains: {
      list: {
        title: "सहकारी संस्थाहरूको सूची",
        description:
          "खजुरा गाउँपालिकामा रहेका सहकारी संस्थाहरूको नामावली र विवरण",
        dataType: "cooperativesList",
        sections: [
          { id: "overview", title: "समग्र सहकारी विवरण" },
          { id: "ward-wise", title: "वडा अनुसार सहकारीहरू" },
          { id: "types", title: "प्रकार अनुसार सहकारीहरू" },
          { id: "directory", title: "सहकारी निर्देशिका" },
        ],
      },
      statistics: {
        title: "सहकारी तथ्याङ्क",
        description:
          "खजुरा गाउँपालिकामा रहेका सहकारी संस्थाहरूको संख्यात्मक विश्लेषण",
        dataType: "cooperativesStats",
        sections: [
          { id: "overview", title: "समग्र सहकारी तथ्याङ्क" },
          { id: "members", title: "सदस्य विवरण" },
          { id: "financial", title: "वित्तीय विवरण" },
          { id: "charts", title: "चार्ट तथा ग्राफहरू" },
        ],
      },
    },
  },
};

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const domain = domains[params.domain as keyof typeof domains];
  if (!domain) {
    return { title: "पृष्ठ फेला परेन" };
  }

  const subdomains = domain.subdomains as Record<
    string,
    { title: string; description: string }
  >;
  const subdomain = subdomains[params.subdomain];
  if (!subdomain) {
    return { title: "पृष्ठ फेला परेन" };
  }

  return {
    title: `${subdomain.title} | ${domain.title} | खजुरा गाउँपालिका प्रोफाइल`,
    description: subdomain.description,
    keywords: [
      "खजुरा गाउँपालिका",
      domain.title,
      subdomain.title,
      "पालिका प्रोफाइल",
      "स्थानीय तह",
      "नेपाल",
    ],
    alternates: {
      canonical: `/${params.locale}/profile/${params.domain}/${params.subdomain}`,
    },
  };
}

// Generate static paths for all domains and subdomains for SSG
export async function generateStaticParams() {
  const locales = ["ne", "en"];
  const paths: Array<{ locale: string; domain: string; subdomain: string }> =
    [];

  for (const locale of locales) {
    for (const [domainKey, domain] of Object.entries(domains)) {
      for (const subdomainKey of Object.keys(domain.subdomains)) {
        paths.push({
          locale,
          domain: domainKey,
          subdomain: subdomainKey,
        });
      }
    }
  }

  return paths;
}

export default async function SubdomainPage({ params }: PageProps) {
  const { locale, domain: domainId, subdomain: subdomainId } = params;

  const domain = domains[domainId as keyof typeof domains];
  if (!domain) {
    notFound();
  }

  const subdomains = domain.subdomains as Record<
    string,
    {
      title: string;
      description: string;
      dataType: string;
      sections: Array<{ id: string; title: string }>;
    }
  >;
  const subdomain = subdomains[subdomainId];
  if (!subdomain) {
    notFound();
  }

  // Fetch data based on the subdomain data type
  let data;
  try {
    if (domainId === "demographics") {
      switch (subdomain.dataType) {
        case "wardWiseCastePopulation":
          data =
            await api.profile.demographics.wardWiseCastePopulation.summary.query();
          break;
        case "wardWiseHouseHeadGender":
          data =
            await api.profile.demographics.wardWiseHouseHeadGender.summary.query();
          break;
        case "wardAgeWisePopulation":
          data =
            await api.profile.demographics.wardAgeWisePopulation.summary.query();
          break;
        case "wardWiseReligionPopulation":
          data =
            await api.profile.demographics.wardWiseReligionPopulation.summary.query();
          break;
        case "wardWiseMotherTonguePopulation":
          data =
            await api.profile.demographics.wardWiseMotherTonguePopulation.summary.query();
          break;
        default:
          // Fallback to summary data
          data = await api.profile.demographics.summary.get.query();
          break;
      }
    }
    // Add similar conditional fetching for other domains when implemented
  } catch (error) {
    console.error(
      `Failed to fetch data for ${domainId}/${subdomainId}:`,
      error,
    );
    data = null;
  }

  // Generate structured data for SEO
  const webPageSchema = generateSchemaOrgWebPage(
    `${subdomain.title} | ${domain.title} | खजुरा गाउँपालिका प्रोफाइल`,
    subdomain.description,
    `https://digprofile.com/khajura/${locale}/profile/${domainId}/${subdomainId}`,
  );

  const breadcrumbSchema = generateSchemaOrgBreadcrumbList([
    { name: "गृहपृष्ठ", item: `https://digprofile.com/khajura/${locale}` },
    {
      name: "प्रोफाइल",
      item: `https://digprofile.com/khajura/${locale}/profile`,
    },
    {
      name: domain.title,
      item: `https://digprofile.com/khajura/${locale}/profile/${domainId}`,
    },
    {
      name: subdomain.title,
      item: `https://digprofile.com/khajura/${locale}/profile/${domainId}/${subdomainId}`,
    },
  ]);

  const datasetSchema = generateSchemaOrgDataset(
    `${subdomain.title} - खजुरा गाउँपालिका`,
    subdomain.description,
    `https://digprofile.com/khajura/${locale}/profile/${domainId}/${subdomainId}`,
    ["पालिका प्रोफाइल", domain.title, subdomain.title],
    "खजुरा गाउँपालिका",
  );

  const sections = subdomain.sections;

  return (
    <div className="flex flex-col lg:flex-row lg:gap-8">
      {/* Main content area */}
      <div className="flex-1">
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
        />

        <div className="prose max-w-none">
          <div
            className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${domain.color} mb-4 text-2xl`}
          >
            {domain.icon}
          </div>
          <h1>{subdomain.title}</h1>
          <p className="lead text-gray-600">{subdomain.description}</p>
        </div>

        {/* Domain-specific data visualization component */}
        <DomainDataVisualizer
          domain={domainId}
          subdomain={subdomainId}
          data={data}
          sections={sections}
          locale={locale}
        />
      </div>

      {/* Right sidebar - Table of Contents */}
      <div className="hidden lg:block lg:w-64 flex-shrink-0">
        <div className="sticky top-24">
          <TableOfContents sections={sections} />
        </div>
      </div>
    </div>
  );
}
