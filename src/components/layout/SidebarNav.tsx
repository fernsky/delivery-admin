"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const navItems = [
  {
    title: "पालिका प्रोफाइल",
    href: "/profile",
    items: [],
  },
  {
    title: "जनसांख्यिकी",
    href: "/profile/demographics",
    items: [
      {
        title: "जनसंख्या सारांश",
        href: "/profile/demographics/summary",
      },
      {
        title: "वडा अनुसार जनसंख्या",
        href: "/profile/demographics/ward-wise-demographic-summary",
      },
      {
        title: "वडा अनुसार जात/जनजाति जनसंख्या",
        href: "/profile/demographics/ward-wise-caste-population",
      },
      {
        title: "वडा अनुसार मातृभाषा जनसंख्या",
        href: "/profile/demographics/ward-wise-mother-tongue-population",
      },
      {
        title: "वडा अनुसार धर्म जनसंख्या",
        href: "/profile/demographics/ward-wise-religion-population",
      },
      {
        title: "उमेर अनुसार वैवाहिक स्थिति",
        href: "/profile/demographics/age-wise-marital-status",
      },
      {
        title: "उमेर र लिङ्ग अनुसार जनसंख्या",
        href: "/profile/demographics/ward-age-wise-population",
      },
      {
        title: "घरमुलीको लिङ्ग अनुसार जनसंख्या",
        href: "/profile/demographics/ward-wise-househead-gender",
      },
      {
        title: "उमेर र लिङ्ग अनुसार विवाह",
        href: "/profile/demographics/ward-age-gender-wise-married-age",
      },
      {
        title: "उमेर र लिङ्ग अनुसार अनुपस्थित जनसंख्या",
        href: "/profile/demographics/ward-age-gender-wise-absentee",
      },
    ],
  },
  {
    title: "शिक्षा",
    href: "/profile/education",
    items: [
      {
        title: "शैक्षिक स्थिति",
        href: "/profile/education/summary",
      },
      {
        title: "विद्यालय तथा शिक्षकहरू",
        href: "/profile/education/schools",
      },
    ],
  },
  {
    title: "स्वास्थ्य",
    href: "/profile/health",
    items: [
      {
        title: "स्वास्थ्य सुविधाहरू",
        href: "/profile/health/facilities",
      },
      {
        title: "स्वास्थ्य सूचकांक",
        href: "/profile/health/indicators",
      },
    ],
  },
  {
    title: "भौतिक पूर्वाधार",
    href: "/profile/infrastructure",
    items: [
      {
        title: "सडक नेटवर्क",
        href: "/profile/infrastructure/road-network",
      },
      {
        title: "खानेपानी आपूर्ति",
        href: "/profile/infrastructure/water-supply",
      },
    ],
  },
  {
    title: "अर्थतन्त्र",
    href: "/profile/economy",
    items: [
      {
        title: "रोजगारी स्थिति",
        href: "/profile/economy/employment",
      },
      {
        title: "आय स्रोतहरू",
        href: "/profile/economy/income-sources",
      },
    ],
  },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Automatically open the section that contains the current page
  useState(() => {
    const openInitialSection = () => {
      const initialOpenSections: Record<string, boolean> = {};
      navItems.forEach((section) => {
        if (
          pathname === section.href ||
          section.items.some((item) => item.href === pathname) ||
          pathname.startsWith(section.href + "/")
        ) {
          initialOpenSections[section.title] = true;
        }
      });
      setOpenSections(initialOpenSections);
    };

    openInitialSection();
  });

  return (
    <div className="w-full">
      {navItems.map((section) => (
        <div key={section.title} className="mb-2">
          {section.items.length > 0 ? (
            <Collapsible
              open={openSections[section.title]}
              onOpenChange={() => toggleSection(section.title)}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-slate-100 hover:text-slate-900">
                <Link href={section.href}>
                  <span
                    className={cn(
                      "text-base",
                      pathname === section.href ||
                        pathname.startsWith(section.href + "/")
                        ? "font-bold text-primary"
                        : "font-medium text-slate-600",
                    )}
                  >
                    {section.title}
                  </span>
                </Link>
                <ChevronDown
                  className="h-4 w-4 shrink-0 transition-transform duration-200"
                  style={{
                    transform: openSections[section.title]
                      ? "rotate(-180deg)"
                      : "rotate(0deg)",
                  }}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4 pt-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm hover:bg-slate-100 hover:text-slate-900",
                      pathname === item.href
                        ? "font-medium bg-slate-100 text-primary"
                        : "text-slate-600",
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Link
              href={section.href}
              className={cn(
                "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium",
                pathname === section.href
                  ? "font-medium bg-slate-100 text-primary"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              {section.title}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
