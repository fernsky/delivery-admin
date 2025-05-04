import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import {
  generateSchemaOrgWebPage,
  generateSchemaOrgBreadcrumbList,
} from "../../../_lib/profile/schema";

interface PageProps {
  params: {
    locale: string;
    domain: string;
  };
}

// Define domain metadata
const domains = {
  demographics: {
    title: "जनसांख्यिकी विवरण",
    description:
      "खजुरा गाउँपालिकाको जनसंख्या सम्बन्धी विस्तृत विवरण - जाति, लिङ्ग, उमेर अनुसारको जनसंख्या विवरण",
    icon: "👥",
    color: "bg-blue-50 text-blue-700",
    subdomains: [
      {
        id: "caste",
        title: "जातीय विवरण",
        description:
          "खजुरा गाउँपालिकामा बसोबास गर्ने विभिन्न जातजातिहरूको विवरण",
      },
      {
        id: "gender",
        title: "लिङ्ग अनुसार विवरण",
        description: "खजुरा गाउँपालिकाको लिङ्ग अनुसारको जनसंख्या विवरण",
      },
      {
        id: "age-distribution",
        title: "उमेर अनुसार जनसंख्या",
        description: "खजुरा गाउँपालिकाको उमेर समूह अनुसारको जनसंख्या विवरण",
      },
    ],
  },
  health: {
    title: "स्वास्थ्य विवरण",
    description:
      "खजुरा गाउँपालिकाको स्वास्थ्य सेवा, सुविधाहरू र स्वास्थ्य सम्बन्धी विस्तृत जानकारी",
    icon: "🏥",
    color: "bg-green-50 text-green-700",
    subdomains: [
      {
        id: "facilities",
        title: "स्वास्थ्य संस्थाहरू",
        description: "खजुरा गाउँपालिकामा रहेका स्वास्थ्य संस्थाहरूको विवरण",
      },
      {
        id: "indicators",
        title: "स्वास्थ्य सूचकहरू",
        description: "खजुरा गाउँपालिकाको प्रमुख स्वास्थ्य सूचकहरूको विश्लेषण",
      },
    ],
  },
  cooperatives: {
    title: "सहकारी संस्थाहरू",
    description:
      "खजुरा गाउँपालिकामा रहेका सहकारी संस्थाहरूको विवरण र तथ्याङ्कहरू",
    icon: "🏢",
    color: "bg-yellow-50 text-yellow-700",
    subdomains: [
      {
        id: "list",
        title: "सहकारी संस्थाहरूको सूची",
        description:
          "खजुरा गाउँपालिकामा रहेका सहकारी संस्थाहरूको नामावली र विवरण",
      },
      {
        id: "statistics",
        title: "सहकारी तथ्याङ्क",
        description:
          "खजुरा गाउँपालिकामा रहेका सहकारी संस्थाहरूको संख्यात्मक विश्लेषण",
      },
    ],
  },
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const domain = domains[params.domain as keyof typeof domains];

  if (!domain) {
    return {
      title: "पृष्ठ फेला परेन",
    };
  }

  return {
    title: `${domain.title} | खजुरा गाउँपालिका प्रोफाइल`,
    description: domain.description,
    alternates: {
      canonical: `/${params.locale}/profile/${params.domain}`,
    },
  };
}

export default function DomainPage({ params }: PageProps) {
  const { locale, domain: domainId } = params;
  const domain = domains[domainId as keyof typeof domains];

  if (!domain) {
    notFound();
  }

  // Generate structured data
  const webPageSchema = generateSchemaOrgWebPage(
    `${domain.title} | खजुरा गाउँपालिका प्रोफाइल`,
    domain.description,
    `https://digprofile.com/khajura/${locale}/profile/${domainId}`,
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
  ]);

  return (
    <div>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="prose max-w-none">
        <div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${domain.color} mb-4 text-2xl`}
        >
          {domain.icon}
        </div>
        <h1>{domain.title}</h1>
        <p className="lead text-gray-600">{domain.description}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {domain.subdomains.map((subdomain) => (
          <Link
            key={subdomain.id}
            href={`/${locale}/profile/${domainId}/${subdomain.id}`}
            className="group bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-green-600">
              {subdomain.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {subdomain.description}
            </p>
            <div className="flex items-center text-green-600 text-sm font-medium">
              विस्तृतमा हेर्नुहोस्
              <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
