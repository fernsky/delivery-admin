import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import SideNavigation from "../../_components/profile/SideNavigation";
import Breadcrumbs from "../../_components/profile/Breadcrumbs";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "गाउँपालिका प्रोफाइल | खजुरा",
    description:
      "खजुरा गाउँपालिकाको विस्तृत प्रोफाइल - जनसंख्या, स्वास्थ्य, शिक्षा, र अन्य महत्वपूर्ण तथ्याङ्क",
    openGraph: {
      title: "खजुरा गाउँपालिका प्रोफाइल",
      description: "खजुरा गाउँपालिकाको विस्तृत प्रोफाइल र तथ्याङ्क",
      type: "website",
    },
  };
};

export default function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Left sidebar - Navigation */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                प्रोफाइल विवरण
              </h2>
              <SideNavigation locale={params.locale} />
            </div>
          </aside>

          {/* Main content area */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow rounded-lg p-6">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
