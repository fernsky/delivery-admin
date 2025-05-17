import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import ReligionPieChart from "./charts/religion-pie-chart";
import ReligionBarChart from "./charts/religion-bar-chart";
import WardReligionPieCharts from "./charts/ward-religion-pie-charts";

// Define religion colors for consistency
const RELIGION_COLORS = {
  HINDU: "#FF5733",
  BUDDHIST: "#FFC300",
  KIRANT: "#36A2EB",
  CHRISTIAN: "#4BC0C0",
  ISLAM: "#9966FF",
  NATURE: "#3CB371",
  BON: "#FF6384",
  JAIN: "#FFCE56",
  BAHAI: "#C9CBCF",
  SIKH: "#FF9F40",
  OTHER: "#808080",
};

interface ReligionChartsProps {
  overallSummary: Array<{
    religion: string;
    religionName: string;
    population: number;
  }>;
  totalPopulation: number;
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  wardWiseData: Array<Record<string, any>>;
  wardNumbers: number[];
  religionData: Array<{
    id?: string;
    wardNumber: number;
    religionType: string;
    population: number;
    updatedAt?: string;
    createdAt?: string;
  }>;
  RELIGION_NAMES: Record<string, string>;
}

export default function ReligionCharts({
  overallSummary,
  totalPopulation,
  pieChartData,
  wardWiseData,
  wardNumbers,
  religionData,
  RELIGION_NAMES,
}: ReligionChartsProps) {
  return (
    <>
      {/* Overall religion distribution - with pre-rendered table and client-side chart */}
      <div className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">धर्म अनुसार जनसंख्या वितरण</h3>
          <p className="text-sm text-muted-foreground">
            कुल जनसंख्या: {totalPopulation.toLocaleString()} व्यक्ति
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[400px]">
              <ReligionPieChart
                pieChartData={pieChartData}
                RELIGION_NAMES={RELIGION_NAMES}
                RELIGION_COLORS={RELIGION_COLORS}
              />
            </div>
          </div>

          {/* Server-side pre-rendered table for SEO */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">तालिका</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted sticky top-0">
                    <th className="border p-2 text-left">क्र.सं.</th>
                    <th className="border p-2 text-left">धर्म</th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{i + 1}</td>
                      <td className="border p-2">{item.religionName}</td>
                      <td className="border p-2 text-right">
                        {item.population.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {((item.population / totalPopulation) * 100).toFixed(2)}
                        %
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-semibold bg-muted/70">
                    <td className="border p-2" colSpan={2}>
                      जम्मा
                    </td>
                    <td className="border p-2 text-right">
                      {totalPopulation.toLocaleString()}
                    </td>
                    <td className="border p-2 text-right">100.00%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Excel डाउनलोड
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 p-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            प्रमुख धर्महरू
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overallSummary.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      RELIGION_COLORS[
                        item.religion as keyof typeof RELIGION_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span>{item.religionName}</span>
                    <span className="font-medium">
                      {((item.population / totalPopulation) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.population / totalPopulation) * 100}%`,
                        backgroundColor:
                          RELIGION_COLORS[
                            item.religion as keyof typeof RELIGION_COLORS
                          ] || "#888",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground pt-4">
            {overallSummary.length > 5
              ? `${overallSummary.length - 5} अन्य धर्महरू पनि छन्।`
              : ""}
          </p>
        </div>
      </div>

      {/* Ward-wise distribution - pre-rendered table with client-side chart */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">वडा अनुसार धर्म वितरण</h3>
          <p className="text-sm text-muted-foreground">
            वडा र धर्म अनुसार जनसंख्या वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <ReligionBarChart
              wardWiseData={wardWiseData}
              RELIGION_COLORS={RELIGION_COLORS}
              RELIGION_NAMES={RELIGION_NAMES}
            />
          </div>
        </div>
      </div>

      {/* Detailed ward analysis - with pre-rendered HTML table for SEO */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            वडा अनुसार विस्तृत धार्मिक विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडाको विस्तृत धार्मिक संरचना
          </p>
        </div>

        <div className="p-6">
          <h4 className="text-lg font-medium mb-4">वडागत धर्म तालिका</h4>
          <div className="overflow-auto max-h-[600px]">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2">प्रमुख धर्म</th>
                  <th className="border p-2 text-right">जनसंख्या</th>
                  <th className="border p-2 text-right">वडाको प्रतिशत</th>
                  <th className="border p-2">दोस्रो प्रमुख धर्म</th>
                  <th className="border p-2 text-right">जनसंख्या</th>
                  <th className="border p-2 text-right">वडाको प्रतिशत</th>
                </tr>
              </thead>
              <tbody>
                {wardNumbers.map((wardNumber, i) => {
                  const wardItems = religionData.filter(
                    (item) => item.wardNumber === wardNumber,
                  );
                  const wardTotal = wardItems.reduce(
                    (sum, item) => sum + (item.population || 0),
                    0,
                  );

                  // Sort by population to find primary and secondary religions
                  const sortedItems = [...wardItems].sort(
                    (a, b) => (b.population || 0) - (a.population || 0),
                  );
                  const primaryReligion = sortedItems[0];
                  const secondaryReligion = sortedItems[1];

                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">वडा {wardNumber}</td>
                      <td className="border p-2">
                        {primaryReligion
                          ? RELIGION_NAMES[primaryReligion.religionType] ||
                            primaryReligion.religionType
                          : "-"}
                      </td>
                      <td className="border p-2 text-right">
                        {primaryReligion?.population?.toLocaleString() || "0"}
                      </td>
                      <td className="border p-2 text-right">
                        {wardTotal > 0 && primaryReligion?.population
                          ? (
                              (primaryReligion.population / wardTotal) *
                              100
                            ).toFixed(2) + "%"
                          : "0%"}
                      </td>
                      <td className="border p-2">
                        {secondaryReligion
                          ? RELIGION_NAMES[secondaryReligion.religionType] ||
                            secondaryReligion.religionType
                          : "-"}
                      </td>
                      <td className="border p-2 text-right">
                        {secondaryReligion?.population?.toLocaleString() || "0"}
                      </td>
                      <td className="border p-2 text-right">
                        {wardTotal > 0 && secondaryReligion?.population
                          ? (
                              (secondaryReligion.population / wardTotal) *
                              100
                            ).toFixed(2) + "%"
                          : "0%"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" />
              Excel डाउनलोड
            </Button>
          </div>

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत पाई चार्ट</h4>
          <WardReligionPieCharts
            wardNumbers={wardNumbers}
            religionData={religionData}
            RELIGION_NAMES={RELIGION_NAMES}
            RELIGION_COLORS={RELIGION_COLORS}
          />
        </div>
      </div>
    </>
  );
}
