"use client";

import Link from "next/link";
import { useEffect } from "react";
import { localizeNumber } from "@/lib/utils/localize-number";

interface BirthCertificateAnalysisSectionProps {
  wardWiseAnalysis: Array<{
    wardNumber: number;
    birthCertificateHolders: number;
    percentage: string;
  }>;
  totalCertificateHolders: number;
  highestWard: {
    wardNumber: number;
    birthCertificateHolders: number;
    percentage: string;
  };
  lowestWard: {
    wardNumber: number;
    birthCertificateHolders: number;
    percentage: string;
  };
}

export default function BirthCertificateAnalysisSection({
  wardWiseAnalysis,
  totalCertificateHolders,
  highestWard,
  lowestWard,
}: BirthCertificateAnalysisSectionProps) {
  // Consistent color palette
  const CHART_COLORS = {
    primary: "#0891b2", // Teal color
    secondary: "#7dd3fc", // Light blue
    accent: "#0369a1", // Darker blue
    muted: "#e0f2fe", // Very light blue
  };
  
  // Calculate average birth certificates per ward
  const averageCertificatesPerWard = totalCertificateHolders / wardWiseAnalysis.length;
  
  // Calculate wards above and below average
  const wardsAboveAverage = wardWiseAnalysis.filter(
    ward => ward.birthCertificateHolders > averageCertificatesPerWard
  ).length;
  
  const wardsBelowAverage = wardWiseAnalysis.filter(
    ward => ward.birthCertificateHolders < averageCertificatesPerWard
  ).length;

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    // Add data to document.body for SEO (will be crawled but not visible to users)
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / खजुरा गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-birth-certificates",
        totalCertificateHolders.toString(),
      );

      // Add highest ward data
      document.body.setAttribute(
        "data-highest-certificate-ward",
        highestWard.wardNumber.toString(),
      );
      document.body.setAttribute(
        "data-highest-certificate-count",
        highestWard.birthCertificateHolders.toString(),
      );
      document.body.setAttribute(
        "data-highest-certificate-percentage",
        highestWard.percentage,
      );
      
      // Add lowest ward data
      document.body.setAttribute(
        "data-lowest-certificate-ward",
        lowestWard.wardNumber.toString(),
      );
      document.body.setAttribute(
        "data-lowest-certificate-count",
        lowestWard.birthCertificateHolders.toString(),
      );
    }
  }, [
    totalCertificateHolders,
    highestWard,
    lowestWard,
  ]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {wardWiseAnalysis.slice(0, 8).map((ward, index) => {
          // Calculate percentage
          const percentage = ward.percentage;

          // Determine if this ward is above or below average
          const isAboveAverage = ward.birthCertificateHolders > averageCertificatesPerWard;

          return (
            <div
              key={index}
              className={`bg-muted/50 rounded-lg p-4 text-center min-w-[150px] relative overflow-hidden ${
                ward.wardNumber === highestWard.wardNumber ? "border-2 border-blue-300" : ""
              }`}
              // Add data attributes for SEO crawlers
              data-ward={ward.wardNumber}
              data-birth-certificates={ward.birthCertificateHolders}
              data-percentage={percentage}
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${Math.min(
                    (ward.birthCertificateHolders / highestWard.birthCertificateHolders) * 100,
                    100,
                  )}%`,
                  backgroundColor: isAboveAverage ? CHART_COLORS.primary : CHART_COLORS.secondary,
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  वडा {localizeNumber(ward.wardNumber.toString(), "ne")}
                  {/* Hidden span for SEO with English name */}
                  <span className="sr-only">
                    Ward {ward.wardNumber}
                  </span>
                </h3>
                <p className="text-2xl font-bold">
                  {localizeNumber(ward.birthCertificateHolders.toLocaleString(), "ne")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {localizeNumber(percentage, "ne")}% 
                  <span className="sr-only">
                    ({percentage}%)
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          जन्मदर्ता प्रमाणपत्र विश्लेषण
          <span className="sr-only">Birth Certificate Analysis of Khajura</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="highest-birth-certificate-ward"
            data-percentage={highestWard.percentage}
          >
            <h4 className="font-medium mb-2">
              सबैभन्दा बढी जन्मदर्ता प्रमाणपत्र भएको वडा
              <span className="sr-only">
                Ward with Highest Birth Certificate Registration in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              वडा {localizeNumber(highestWard.wardNumber.toString(), "ne")}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {localizeNumber(highestWard.birthCertificateHolders.toLocaleString(), "ne")} जना ({localizeNumber(highestWard.percentage, "ne")}%)
              <span className="sr-only">
                {highestWard.birthCertificateHolders} children ({highestWard.percentage}%)
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="lowest-birth-certificate-ward"
          >
            <h4 className="font-medium mb-2">
              सबैभन्दा कम जन्मदर्ता प्रमाणपत्र भएको वडा
              <span className="sr-only">Ward with Lowest Birth Certificate Registration in Khajura</span>
            </h4>
            <p className="text-3xl font-bold">
              वडा {localizeNumber(lowestWard.wardNumber.toString(), "ne")}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {localizeNumber(lowestWard.birthCertificateHolders.toLocaleString(), "ne")} जना ({localizeNumber(lowestWard.percentage, "ne")}%)
              <span className="sr-only">
                {lowestWard.birthCertificateHolders} children ({lowestWard.percentage}%)
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 bg-card p-4 rounded border">
          <h4 className="font-medium mb-2">
            जन्मदर्ता वितरण विश्लेषण
            <span className="sr-only">Birth Certificate Distribution Analysis</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium">औसत वितरण</h5>
              <p className="text-sm text-muted-foreground">
                प्रति वडा औसत जन्मदर्ता प्रमाणपत्र संख्या: {localizeNumber(averageCertificatesPerWard.toFixed(1), "ne")}
              </p>
              <div className="w-full bg-muted h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "100%",
                    backgroundColor: CHART_COLORS.secondary,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium">औसत भन्दा माथि र तल</h5>
              <p className="text-sm text-muted-foreground">
                औसत भन्दा बढी: {localizeNumber(wardsAboveAverage.toString(), "ne")} वडा | 
                औसत भन्दा कम: {localizeNumber(wardsBelowAverage.toString(), "ne")} वडा
              </p>
              <div className="flex w-full mt-2 gap-1">
                <div
                  className="h-2 rounded-l-full"
                  style={{
                    width: `${(wardsAboveAverage / wardWiseAnalysis.length) * 100}%`,
                    backgroundColor: CHART_COLORS.primary,
                  }}
                ></div>
                <div
                  className="h-2 rounded-r-full"
                  style={{
                    width: `${(wardsBelowAverage / wardWiseAnalysis.length) * 100}%`,
                    backgroundColor: CHART_COLORS.secondary,
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h5 className="text-sm font-medium">जन्मदर्ता सम्बन्धी विशेषता</h5>
            <p className="mt-2 text-sm text-muted-foreground">
              खजुरा गाउँपालिकामा वडा {localizeNumber(highestWard.wardNumber.toString(), "ne")} र वडा {localizeNumber(lowestWard.wardNumber.toString(), "ne")} को जन्मदर्ता प्रमाणपत्र धारक संख्यामा ठूलो भिन्नता देखिन्छ। 
              यसबाट विभिन्न वडाहरू बीचमा जन्मदर्ता प्रमाणपत्र वितरणमा असमानता रहेको देखिन्छ।
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              गाउँपालिकामा पाँच वर्षमुनिका बालबालिकाहरूको जन्मदर्ता प्रमाणपत्र विस्तारका लागि विशेष कार्यक्रमहरू 
              सञ्चालन गर्नुपर्ने देखिन्छ।
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
