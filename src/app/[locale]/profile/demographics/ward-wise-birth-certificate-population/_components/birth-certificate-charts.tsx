import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { localizeNumber } from "@/lib/utils/localize-number";
import BirthCertificateBarChart from "./charts/birth-certificate-bar-chart";
import BirthCertificateComparison from "./charts/birth-certificate-comparison-chart";

// Define consistent chart colors
const CHART_COLORS = {
  primary: "#0891b2", // Teal color
  secondary: "#7dd3fc", // Light blue
  accent: "#0369a1", // Darker blue
  muted: "#e0f2fe", // Very light blue
};

interface BirthCertificateChartsProps {
  birthCertificateData: Array<{
    id?: string;
    wardNumber: number;
    birthCertificateHoldersBelow5years: number;
  }>;
  totalCertificateHolders: number;
  wardNumbers: number[];
  wardWiseAnalysis: Array<{
    wardNumber: number;
    birthCertificateHolders: number;
    percentage: string;
  }>;
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

export default function BirthCertificateCharts({
  birthCertificateData,
  totalCertificateHolders,
  wardNumbers,
  wardWiseAnalysis,
  highestWard,
  lowestWard,
}: BirthCertificateChartsProps) {
  // Prepare data for bar chart
  const barChartData = birthCertificateData.map((item) => ({
    ward: `वडा ${item.wardNumber}`,
    value: item.birthCertificateHoldersBelow5years,
    percentage: totalCertificateHolders > 0 
      ? ((item.birthCertificateHoldersBelow5years / totalCertificateHolders) * 100).toFixed(2) 
      : "0",
  }));

  return (
    <>
      {/* Birth certificate distribution - with pre-rendered table and client-side chart */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Birth Certificate Holders Under 5 Years in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Birth certificate distribution of children under 5 years in Khajura with a total of ${totalCertificateHolders} children`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            पाँच वर्षमुनिका बालबालिकाहरूको जन्मदर्ता वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल जन्मदर्ता प्रमाणपत्र धारक संख्या: {localizeNumber(totalCertificateHolders.toLocaleString(), "ne")} बालबालिका
          </p>
        </div>

        <div className="p-6">
          {/* Server-side pre-rendered table for SEO */}
          <div>
            <h4 className="text-lg font-medium mb-4 text-center">तालिका</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted sticky top-0">
                    <th className="border p-2 text-left">क्र.सं.</th>
                    <th className="border p-2 text-left">वडा नं.</th>
                    <th className="border p-2 text-right">जन्मदर्ता प्रमाणपत्र धारक संख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {birthCertificateData.map((item, i) => {
                    const percentage = totalCertificateHolders > 0 
                      ? ((item.birthCertificateHoldersBelow5years / totalCertificateHolders) * 100).toFixed(2) 
                      : "0";
                    
                    return (
                      <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                        <td className="border p-2">{localizeNumber(i + 1, "ne")}</td>
                        <td className="border p-2">वडा {localizeNumber(item.wardNumber.toString(), "ne")}</td>
                        <td className="border p-2 text-right">
                          {localizeNumber(item.birthCertificateHoldersBelow5years.toLocaleString(), "ne")}
                        </td>
                        <td className="border p-2 text-right">
                          {localizeNumber(percentage, "ne")}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="font-semibold bg-muted/70">
                    <td className="border p-2" colSpan={2}>
                      जम्मा
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(totalCertificateHolders.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber("100.00", "ne")}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Ward-wise distribution - bar chart */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="ward-wise-birth-certificates"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Birth Certificate Holders in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Birth certificate distribution across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार जन्मदर्ता प्रमाणपत्र वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार पाँच वर्षमुनिका बालबालिकाहरूको जन्मदर्ता प्रमाणपत्र धारक वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <BirthCertificateBarChart
              barChartData={barChartData}
              CHART_COLORS={CHART_COLORS}
            />
          </div>
        </div>
      </div>

      {/* Birth certificate comparison - ward comparison */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Birth Certificate Comparison by Ward in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Ward-wise comparison of birth certificates for children under 5 years in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत तुलनात्मक जन्मदर्ता विवरण
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न वडाहरूमा जन्मदर्ता प्रमाणपत्र धारकहरूको तुलनात्मक अध्ययन
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <BirthCertificateComparison
              wardWiseAnalysis={wardWiseAnalysis}
              CHART_COLORS={CHART_COLORS}
              highestWard={highestWard}
              lowestWard={lowestWard}
            />
          </div>
        </div>

        <div className="p-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-2">सबैभन्दा बढी जन्मदर्ता प्रमाणपत्र</div>
              <div className="text-2xl font-bold">
                वडा {localizeNumber(highestWard.wardNumber.toString(), "ne")}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm">जन्मदर्ता संख्या:</span>
                <span className="font-medium">{localizeNumber(highestWard.birthCertificateHolders.toLocaleString(), "ne")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">प्रतिशत:</span>
                <span className="font-medium">{localizeNumber(highestWard.percentage, "ne")}%</span>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-sm font-medium text-muted-foreground mb-2">कुल जन्मदर्ता प्रमाणपत्र धारक संख्या</div>
              <div className="text-3xl font-bold text-center">
                {localizeNumber(totalCertificateHolders.toLocaleString(), "ne")}
              </div>
              <div className="text-sm text-center text-muted-foreground mt-2">
                पाँच वर्षमुनिका बालबालिकाहरू
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-2">सबैभन्दा कम जन्मदर्ता प्रमाणपत्र</div>
              <div className="text-2xl font-bold">
                वडा {localizeNumber(lowestWard.wardNumber.toString(), "ne")}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm">जन्मदर्ता संख्या:</span>
                <span className="font-medium">{localizeNumber(lowestWard.birthCertificateHolders.toLocaleString(), "ne")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">प्रतिशत:</span>
                <span className="font-medium">{localizeNumber(lowestWard.percentage, "ne")}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
