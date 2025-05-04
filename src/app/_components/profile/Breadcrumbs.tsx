"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const locale = segments[0];
  const breadcrumbs = segments.slice(1);

  // Map for translating path segments to Nepali
  const pathNameMap: Record<string, string> = {
    profile: "प्रोफाइल",
    demographics: "जनसांख्यिकी विवरण",
    health: "स्वास्थ्य विवरण",
    cooperatives: "सहकारी संस्थाहरू",
    caste: "जातीय विवरण",
    gender: "लिङ्ग अनुसार विवरण",
    "age-distribution": "उमेर अनुसार जनसंख्या",
    facilities: "स्वास्थ्य संस्थाहरू",
    indicators: "स्वास्थ्य सूचकहरू",
    list: "सहकारी संस्थाहरूको सूची",
    statistics: "सहकारी तथ्याङ्क",
  };

  const getDisplayName = (segment: string) => {
    return pathNameMap[segment] || segment;
  };

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        <li>
          <Link
            href={`/${locale}`}
            className="hover:text-gray-700 flex items-center"
          >
            <Home className="w-4 h-4" />
            <span className="sr-only">गृहपृष्ठ</span>
          </Link>
        </li>

        {breadcrumbs.map((segment, index) => {
          const href = `/${segments.slice(0, index + 2).join("/")}`;
          const isLast = index === breadcrumbs.length - 1;

          return (
            <React.Fragment key={href}>
              <li className="flex items-center">
                <ChevronRight className="w-4 h-4" />
              </li>
              <li>
                {isLast ? (
                  <span
                    className="text-gray-900 font-medium"
                    aria-current="page"
                  >
                    {getDisplayName(segment)}
                  </span>
                ) : (
                  <Link href={href} className="hover:text-gray-700">
                    {getDisplayName(segment)}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
