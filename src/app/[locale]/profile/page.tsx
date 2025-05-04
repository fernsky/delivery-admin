import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import DomainCard from "../../_components/profile/DomainCard";
import { ArrowRight } from "lucide-react";
import { generateSchemaOrgWebPage } from "../../_lib/profile/schema";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "खजुरा गाउँपालिका प्रोफाइल - सम्पूर्ण विवरण",
    description:
      "खजुरा गाउँपालिकाको सम्पूर्ण विवरण - जनसांख्यिकी, स्वास्थ्य, सहकारी, शिक्षा र अन्य महत्वपूर्ण तथ्याङ्कहरू",
    alternates: {
      canonical: "/profile",
    },
  };
};

export default function ProfilePage({
  params,
}: {
  params: { locale: string };
}) {
  // Define all available domains
  const domains = [
    {
      id: "demographics",
      title: "जनसांख्यिकी विवरण",
      description: "जाति, लिङ्ग, उमेर अनुसारको जनसंख्या विवरण",
      icon: "👥",
      color: "bg-blue-50 text-blue-700",
      subdomains: ["caste", "gender", "age-distribution"],
    },
    {
      id: "health",
      title: "स्वास्थ्य विवरण",
      description: "स्वास्थ्य सेवा, सुविधाहरू र स्वास्थ्य सूचकहरू",
      icon: "🏥",
      color: "bg-green-50 text-green-700",
      subdomains: ["facilities", "indicators"],
    },
    {
      id: "cooperatives",
      title: "सहकारी संस्थाहरू",
      description: "सहकारी संस्थाहरूको विवरण र तथ्याङ्क",
      icon: "🏢",
      color: "bg-yellow-50 text-yellow-700",
      subdomains: ["list", "statistics"],
    },
  ];

  // Schema.org structured data
  const schemaData = generateSchemaOrgWebPage(
    "खजुरा गाउँपालिका प्रोफाइल",
    "खजुरा गाउँपालिकाको सम्पूर्ण विवरण - जनसांख्यिकी, स्वास्थ्य, सहकारी, शिक्षा",
    `https://digprofile.com/khajura/${params.locale}/profile`,
  );

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="prose max-w-none">
        <h1>खजुरा गाउँपालिका प्रोफाइल</h1>
        <p className="lead text-gray-600">
          खजुरा गाउँपालिकाको सम्पूर्ण विवरण र तथ्याङ्कहरू यहाँ उपलब्ध छन्। तलका
          श्रेणीहरूमा क्लिक गरेर विस्तृत जानकारी हेर्नुहोस्।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
        {domains.map((domain) => (
          <DomainCard key={domain.id} domain={domain} locale={params.locale} />
        ))}
      </div>
    </div>
  );
}
