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
import { Badge } from "@/components/ui/badge";
import { useSidebarNavStore, NavItem } from "@/store/sidebar-nav-store";
import { useStore } from "@/hooks/use-store";

export const navItems: NavItem[] = [
  {
    title: "खजुरा प्रोफाइल",
    href: "/profile",
    icon: <Layout className="w-4 h-4" />,
    items: [],
  },
  {
    title: "जनसांख्यिक विवरण",
    href: "/profile/demographics",
    icon: <Users className="w-4 h-4" />,
    items: [
      {
        title: "जनसंख्याको सारांश",
        href: "/profile/demographics/ward-wise-summary",
      },
      {
        title: "उमेर र लिङ्ग अनुसार जनसंख्या",
        href: "/profile/demographics/ward-age-wise-population",
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
        title: "जात/जनजाति अनुसार जनसंख्या",
        href: "/profile/demographics/ward-wise-caste-population",
      },
      {
        title: "घरमुलीको लिङ्ग अनुसार घरधुरी",
        href: "/profile/demographics/ward-wise-househead-gender",
      },
      {
        title: "पेशाको आधारमा जनसंख्या",
        href: "/profile/demographics/ward-main-occupations",
      },
      {
        title: "आर्थिक रुपले सक्रिय जनसंख्या",
        href: "/profile/demographics/ward-age-wise-economically-active-population",
      },
      {
        title: "अपाङ्गता कारणका आधारमा जनसंख्या",
        href: "/profile/demographics/ward-wise-disability-cause",
      },
      {
        title: "जन्म स्थानको आधारमा घरधुरी",
        href: "/profile/demographics/ward-wise-birthplace-households",
      },
      {
        title: "बालबालिकाको जन्मदर्ताको आधारमा जनसंख्या",
        href: "/profile/demographics/ward-wise-birth-certificate-population",
      },
      {
        title: "विगत १२ महिनामा मृत्यु भएकाको विवरण",
        href: "/profile/demographics/ward-age-gender-wise-deceased-population",
      },
      {
        title: "मृत्युको कारण अनुसार मृतकको संख्या",
        href: "/profile/demographics/ward-death-causes",
      },
    ],
  },
  {
    title: "आर्थिक अवस्था",
    href: "/profile/economics",
    icon: <PieChart className="w-4 h-4" />,
    items: [
      {
        title: "विशेष सीप भएका मानव संशाधनको विवरण",
        href: "/profile/economics/ward-wise-major-skills",
      },
      {
        title: "घरको स्वामित्वको आधारमा घरधुरी",
        href: "/profile/economics/ward-wise-house-ownership",
      },
      {
        title: "जगको आधारमा घरधुरी",
        href: "/profile/economics/ward-wise-household-base",
      },
      {
        title: "बाहिरी गारोको आधारमा घरधुरी",
        href: "/profile/economics/ward-wise-household-outer-wall",
      },
      {
        title: "वैदेशिक रोजगारीमा गएकाहरूको विवरण",
        href: "/profile/economics/ward-wise-foreign-employment-countries",
      },
      {
        title: "वैदेशिक रोजगारीबाट प्राप्त विप्रेषण",
        href: "/profile/economics/ward-wise-remittance",
      },
      {
        title: "जग्गाको स्वामित्वको आधारमा घरधुरी",
        href: "/profile/economics/ward-wise-land-ownership",
      },
      {
        title: "सिंचाई सुविधाको उपलब्धता",
        href: "/profile/economics/ward-wise-irrigated-area",
      },
      {
        title: "सिंचाईको स्रोतको आधारमा सिंचित जमिन",
        href: "/profile/economics/municipality-wide-irrigation-source",
      },
      {
        title: "अन्नबाली उत्पादन सम्बन्धी विवरण",
        href: "/profile/economics/municipality-wide-food-crops",
      },
      {
        title: "दलहनबाली उत्पादन सम्बन्धी विवरण",
        href: "/profile/economics/municipality-wide-pulses",
      },
      {
        title: "तेलबाली उत्पादन सम्बन्धी विवरण",
        href: "/profile/economics/municipality-wide-oil-seeds",
      },
      {
        title: "फलफुलबाली उत्पादन सम्बन्धी विवरण",
        href: "/profile/economics/municipality-wide-fruits",
      },
      {
        title: "मसलाबाली उत्पादन सम्बन्धी विवरण",
        href: "/profile/economics/municipality-wide-spices",
      },
      {
        title: "तरकारीबाली उत्पादन सम्बन्धी विवरण",
        href: "/profile/economics/municipality-wide-vegetables",
      },
      {
        title: "पशुपन्छीजन्य वस्तुको उत्पादन सम्बन्धी विवरण",
        href: "/profile/economics/municipality-wide-animal-products",
      },
      {
        title: "खाद्यान्न बालीमा लाग्ने रोग विवरण",
        href: "/profile/economics/municipality-wide-crop-diseases",
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
];

export default function SidebarNav() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // Use the custom hook to prevent hydration issues
  const openSections = useStore(useSidebarNavStore, (state) => state.openSections) ?? {};

  const {
    toggleSection,
    autoExpandForPath,
    isPathActive,
    isSectionActive,
  } = useSidebarNavStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-expand sections for current path
  useEffect(() => {
    if (isMounted && pathname) {
      autoExpandForPath(pathname, navItems);
    }
  }, [pathname, isMounted, autoExpandForPath]);

  if (!isMounted) return null;

  return (
    <div className="w-full space-y-2">
      <div className="text-sm font-semibold text-[#123772] mb-3 pl-2">
        तथ्याङ्क वर्गहरू
      </div>
      {navItems.map((section) => {
        const isSectionCurrentlyActive = isSectionActive(section, pathname);
        
        return (
          <div key={section.title} className="mb-2">
            {section.items.length > 0 ? (
              <Collapsible
                open={openSections[section.title]}
                onOpenChange={() => toggleSection(section.title)}
              >
                <CollapsibleTrigger
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all duration-200 group relative",
                    isSectionCurrentlyActive
                      ? "bg-gradient-to-r from-[#0b1f42]/15 to-[#1a4894]/15 text-[#123772] font-semibold shadow-sm border border-[#123772]/20"
                      : "hover:bg-[#123772]/5 text-gray-600 hover:text-[#123772]",
                  )}
                >
                  {/* Active section indicator */}
                  {isSectionCurrentlyActive && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#123772] to-[#1a4894] rounded-r-full" />
                  )}
                  
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "p-1.5 rounded-md transition-all duration-200 group-hover:scale-105",
                        isSectionCurrentlyActive
                          ? "bg-[#123772]/15 text-[#123772] shadow-sm"
                          : "bg-gray-100 group-hover:bg-[#123772]/10",
                      )}
                    >
                      {section.icon}
                    </div>
                    <span className={cn(
                      "font-medium",
                      isSectionCurrentlyActive ? "text-[#123772]" : ""
                    )}>
                      {section.title}
                    </span>
                    {section.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {section.badge}
                      </Badge>
                    )}
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 transition-all duration-200",
                      openSections[section.title] ? "rotate-180" : "rotate-0",
                      isSectionCurrentlyActive
                        ? "text-[#123772]"
                        : "text-gray-400 group-hover:text-[#123772]",
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-2 pl-4 mt-1 border-l-2 border-[#123772]/10 animate-in slide-in-from-top-1 duration-200">
                  <div className="space-y-1 pt-1">
                    {section.items.map((item) => {
                      const isCurrentlyActive = isPathActive(item.href, pathname);
                      
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-all duration-200 group relative",
                            isCurrentlyActive
                              ? "bg-gradient-to-r from-[#123772] to-[#1a4894] text-white font-semibold shadow-md"
                              : "text-gray-600 hover:bg-[#123772]/8 hover:text-[#123772]",
                          )}
                        >
                          <FileText
                            className={cn(
                              "w-3 h-3 transition-colors",
                              isCurrentlyActive
                                ? "text-white"
                                : "text-[#123772] opacity-70 group-hover:opacity-100",
                            )}
                          />
                          <span className="truncate">{item.title}</span>
                          {isCurrentlyActive && (
                            <>
                              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
                              <div className="ml-auto">
                                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                              </div>
                            </>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Link
                href={section.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 w-full group relative",
                  isPathActive(section.href, pathname)
                    ? "bg-gradient-to-r from-[#123772] to-[#1a4894] text-white font-semibold shadow-md"
                    : "text-gray-600 hover:bg-[#123772]/5 hover:text-[#123772]",
                )}
              >
                {/* Active section indicator for single items */}
                {isPathActive(section.href, pathname) && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                )}
                
                <div
                  className={cn(
                    "p-1.5 rounded-md transition-all duration-200 group-hover:scale-105",
                    isPathActive(section.href, pathname) 
                      ? "bg-white/20 shadow-sm" 
                      : "bg-gray-100 group-hover:bg-[#123772]/10",
                  )}
                >
                  {section.icon}
                </div>
                <span className="font-medium">{section.title}</span>
                {section.badge && (
                  <Badge 
                    variant={isPathActive(section.href, pathname) ? "secondary" : "outline"} 
                    className="text-xs ml-auto"
                  >
                    {section.badge}
                  </Badge>
                )}
                {isPathActive(section.href, pathname) && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  </div>
                )}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
