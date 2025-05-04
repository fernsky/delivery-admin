import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface SideNavigationProps {
  locale: string;
}

interface NavItem {
  id: string;
  title: string;
  icon: string;
  subItems?: Array<{
    id: string;
    title: string;
  }>;
}

export default function SideNavigation({ locale }: SideNavigationProps) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      id: "demographics",
      title: "जनसांख्यिकी विवरण",
      icon: "👥",
      subItems: [
        { id: "caste", title: "जातीय विवरण" },
        { id: "gender", title: "लिङ्ग अनुसार विवरण" },
        { id: "age-distribution", title: "उमेर अनुसार जनसंख्या" },
      ],
    },
    {
      id: "health",
      title: "स्वास्थ्य विवरण",
      icon: "🏥",
      subItems: [
        { id: "facilities", title: "स्वास्थ्य संस्थाहरू" },
        { id: "indicators", title: "स्वास्थ्य सूचकहरू" },
      ],
    },
    {
      id: "cooperatives",
      title: "सहकारी संस्थाहरू",
      icon: "🏢",
      subItems: [
        { id: "list", title: "सहकारी संस्थाहरूको सूची" },
        { id: "statistics", title: "सहकारी तथ्याङ्क" },
      ],
    },
  ];

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <nav className="space-y-1">
      <Link
        href={`/${locale}/profile`}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
          pathname === `/${locale}/profile`
            ? "bg-green-50 text-green-700"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        🏠 मुख्य प्रोफाइल
      </Link>

      {navItems.map((item) => (
        <div key={item.id} className="space-y-1">
          <Link
            href={`/${locale}/profile/${item.id}`}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isActive(`/${locale}/profile/${item.id}`)
                ? "bg-green-50 text-green-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="mr-2">{item.icon}</span>
            {item.title}
          </Link>

          {/* Subnavigation items */}
          {item.subItems && isActive(`/${locale}/profile/${item.id}`) && (
            <div className="pl-8 space-y-1">
              {item.subItems.map((subItem) => (
                <Link
                  key={subItem.id}
                  href={`/${locale}/profile/${item.id}/${subItem.id}`}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    pathname === `/${locale}/profile/${item.id}/${subItem.id}`
                      ? "bg-green-50 text-green-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  <ChevronRight className="w-3 h-3 mr-2" />
                  {subItem.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
