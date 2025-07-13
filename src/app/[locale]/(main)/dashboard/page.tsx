"use server";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { validateRequest } from "@/lib/auth/validate-request";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/server";
import Link from "next/link";
import Image from "next/image";

const DashboardPage = async () => {
  const { user } = await validateRequest();
  if (!user) return null;

  // Fetch actual data from APIs
  const [householdCount, businessCount, individualCount] = await Promise.all([
    api.households.getTotalCount.query(),
    api.business.getTotalCount.query(),
    api.individuals.getTotalCount.query(),
  ]);

  return (
    <>
      <ContentLayout title="Dashboard">
        {/* Header with logo, title, and coat of arms */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-4 px-2 sm:py-6 sm:px-4 bg-white rounded-lg shadow-sm mb-8 gap-2 sm:gap-0">
          <Image
            src="/images/pokhara_logo.png"
            alt="Pokhara Logo"
            width={80}
            height={80}
            className="h-16 w-auto sm:h-20"
          />
          <h1 className="text-3xl sm:text-6xl font-bold text-center text-red-600 flex-1">
            पोखरा महानगरपालिका
          </h1>
          <Image
            src="/images/coat_of_arms.png"
            alt="Nepal Coat of Arms"
            width={80}
            height={80}
            className="h-16 w-auto sm:h-20"
          />
        </div>
        <div className="container mx-auto py-6">
          {/* Welcome Section with SVG */}
          <div className="flex flex-col md:flex-row items-center justify-between p-4 sm:p-6 mb-8 bg-white rounded-lg shadow-sm border gap-4">
            <div className="md:w-2/3 mb-4 md:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center md:text-left">
                प्रशासनिक ड्यासबोर्डमा स्वागत छ
              </h1>
              <p className="text-gray-600 mb-4 text-center md:text-left">
                तपाईंको डाटा व्यवस्थापन गर्नुहोस्, तथ्यांक हेर्नुहोस्, र यो
                केन्द्रीय ड्यासबोर्डबाट सबै प्रशासन सुविधाहरूमा पहुँच गर्नुहोस्।
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full items-center md:items-start">
                <Link
                  href="/dashboard/households"
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
                >
                  घरधुरीहरू हेर्नुहोस्
                </Link>
                <Link
                  href="/dashboard/businesses"
                  className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-center"
                >
                  व्यवसायहरू हेर्नुहोस्
                </Link>
                <Link
                  href="/dashboard/individuals"
                  className="w-full sm:w-auto px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition-colors text-center"
                >
                  व्यक्तिहरू हेर्नुहोस्
                </Link>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              {/* Dashboard SVG Graphic */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="180"
                height="180"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
                <path d="M6 6h.01" />
                <path d="M12 6h.01" />
                <path d="M15 12h2" />
                <path d="M15 16h2" />
                <path d="M13 12h.01" />
                <path d="M13 16h.01" />
              </svg>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">कुल घरधुरीहरू</h3>
                  <div className="p-2 bg-blue-100 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-500"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold">
                  {householdCount.total.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 mt-2">सबै वडाहरूमा</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">कुल व्यवसायहरू</h3>
                  <div className="p-2 bg-green-100 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500"
                    >
                      <path d="M3 3h18v18H3zM12 8v8m-4-4h8" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold">
                  {businessCount.total.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  दर्ता गरिएका व्यवसायहरू
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">कुल व्यक्तिहरू</h3>
                  <div className="p-2 bg-purple-100 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-purple-500"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold">
                  {individualCount.total.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  दर्ता गरिएको जनसंख्या
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ContentLayout>
    </>
  );
};

export default DashboardPage;
