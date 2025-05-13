"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import {
  ChevronDown,
  FileText,
  Layout,
  Users,
  PieChart,
  BookOpen,
  Activity,
  Building,
} from "lucide-react";

const navItems = [
  {
    title: "पालिका प्रोफाइल",
    href: "/profile",
    icon: <Layout className="w-4 h-4" />,
    items: [],
  },
  {
    title: "जनसांख्यिकी",
    href: "/profile/demographics",
    icon: <Users className="w-4 h-4" />,
    items: [
      {
        title: "जनसंख्या सारांश",
        href: "/profile/demographics/ward-wise-summary",
      },
      {
        title: "वडा अनुसार जनसंख्या",
        href: "/profile/demographics/ward-age-wise-population",
      },
      {
        title: "जात/जनजाति अनुसार जनसंख्या",
        href: "/profile/demographics/ward-wise-caste-population",
      },
      {
        title: "घरमुलीको लिङ्ग अनुसार घरधुरी",
        href: "/profile/demographics/ward-wise-househead-gender",
      },
      {
        title: "मातृभाषा अनुसार जनसंख्या",
        href: "/profile/demographics/ward-wise-mother-tongue-population",
      },
      {
        title: "धर्म अनुसार जनसंख्या",
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
    icon: <BookOpen className="w-4 h-4" />,
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
    icon: <Activity className="w-4 h-4" />,
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
    icon: <Building className="w-4 h-4" />,
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
    icon: <PieChart className="w-4 h-4" />,
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
  useEffect(() => {
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
  }, [pathname]);

  return (
    <div className="w-full space-y-1.5">
      <div className="text-sm text-muted-foreground font-medium mb-2 pl-2">
        तथ्याङ्क वर्गहरू
      </div>
      {navItems.map((section) => (
        <div key={section.title} className="mb-1.5">
          {section.items.length > 0 ? (
            <Collapsible
              open={openSections[section.title]}
              onOpenChange={() => toggleSection(section.title)}
            >
              <CollapsibleTrigger
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                  pathname.startsWith(section.href)
                    ? "bg-accent text-accent-foreground font-medium"
                    : "hover:bg-muted",
                )}
              >
                <div className="flex items-center gap-2">
                  {section.icon}
                  <span>{section.title}</span>
                </div>
                <ChevronDown
                  className="h-4 w-4 shrink-0 transition-transform duration-200"
                  style={{
                    transform: openSections[section.title]
                      ? "rotate(-180deg)"
                      : "rotate(0deg)",
                  }}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-2 pl-4 border-l mt-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors mb-1",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <FileText className="w-3 h-3 opacity-70" />
                    {item.title}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Link
              href={section.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors w-full",
                pathname === section.href
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {section.icon}
              {section.title}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
