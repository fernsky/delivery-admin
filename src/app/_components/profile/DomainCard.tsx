import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface DomainProps {
  domain: {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    subdomains: string[];
  };
  locale: string;
}

export default function DomainCard({ domain, locale }: DomainProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="p-5">
        <div
          className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${domain.color} mb-4 text-xl`}
        >
          {domain.icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {domain.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4">{domain.description}</p>
        <Link
          href={`/${locale}/profile/${domain.id}`}
          className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700"
        >
          विस्तृत हेर्नुहोस्
          <ArrowRight className="ml-1 w-4 h-4" />
        </Link>
      </div>

      {/* Quick links to subdomains */}
      <div className="border-t border-gray-100 px-5 py-3">
        <div className="text-xs text-gray-500 mb-2">तत्काल पहुँच:</div>
        <div className="flex flex-wrap gap-2">
          {domain.subdomains.map((subdomain) => (
            <Link
              key={subdomain}
              href={`/${locale}/profile/${domain.id}/${subdomain}`}
              className="text-xs bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded-md text-gray-700 transition-colors"
            >
              {subdomain === "caste"
                ? "जातीय विवरण"
                : subdomain === "gender"
                  ? "लिङ्ग विवरण"
                  : subdomain === "age-distribution"
                    ? "उमेर विवरण"
                    : subdomain}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
