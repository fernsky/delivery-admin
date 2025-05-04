import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/server";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "धर्म अनुसार जनसंख्या | पालिका प्रोफाइल",
  description:
    "वडा अनुसार धार्मिक समुदायको जनसंख्या वितरण, प्रवृत्ति र विश्लेषण। विस्तृत तथ्याङ्क र विजुअलाइजेसन सहित।",
  keywords: [
    "धर्म",
    "जनसंख्या",
    "हिन्दु",
    "बौद्ध",
    "क्रिश्चियन",
    "इस्लाम",
    "तथ्याङ्क",
    "जनगणना",
  ],
  openGraph: {
    title: "धर्म अनुसार जनसंख्या | पालिका प्रोफाइल",
    description:
      "वडा अनुसार धार्मिक समुदायको जनसंख्या वितरण, प्रवृत्ति र विश्लेषण। विस्तृत तथ्याङ्क र विजुअलाइजेसन सहित।",
    type: "article",
    locale: "ne_NP",
  },
};

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "धार्मिक समुदाय अनुसार जनसंख्या",
    slug: "religion-distribution",
  },
  { level: 2, text: "वडा अनुसार धार्मिक विविधता", slug: "ward-wise-religion" },
  {
    level: 2,
    text: "धर्म अनुसार प्रतिशत वितरण",
    slug: "percentage-distribution",
  },
  { level: 2, text: "तथ्याङ्क स्रोत र विश्लेषण", slug: "data-source" },
];

const RELIGION_COLORS = {
  HINDU: "#FF5733",
  BUDDHIST: "#FFC300",
  CHRISTIAN: "#36A2EB",
  ISLAM: "#4BC0C0",
  KIRANT: "#9966FF",
  NATURE: "#3CB371",
  BON: "#FF6384",
  JAIN: "#FFCE56",
  BAHAI: "#C9CBCF",
  SIKH: "#FF9F40",
  OTHER: "#808080",
};

const RELIGION_NAMES: Record<string, string> = {
  HINDU: "हिन्दू",
  BUDDHIST: "बौद्ध",
  CHRISTIAN: "क्रिश्चियन",
  ISLAM: "इस्लाम",
  KIRANT: "किराँत",
  NATURE: "प्रकृति पुजक",
  BON: "बोन",
  JAIN: "जैन",
  BAHAI: "बहाई",
  SIKH: "सिख",
  OTHER: "अन्य",
};

export default async function WardWiseReligionPopulationPage() {
  // Fetch all religion population data from your tRPC route
  const religionData =
    await api.profile.demographics.wardWiseReligionPopulation.getAll.query();

  // Fetch summary statistics
  const summaryData =
    await api.profile.demographics.wardWiseReligionPopulation.summary.query();

  // Process data for overall summary
  const overallSummary = Object.entries(
    religionData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.religionType]) acc[item.religionType] = 0;
      acc[item.religionType] += item.population || 0;
      return acc;
    }, {}),
  )
    .map(([religion, population]) => ({
      religion,
      religionName: RELIGION_NAMES[religion] || religion,
      population,
    }))
    .sort((a, b) => b.population - a.population);

  // Calculate total population for percentages
  const totalPopulation = overallSummary.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  // Prepare pie chart data with percentages
  const pieChartData = overallSummary.map((item) => ({
    name: item.religionName,
    value: item.population,
    percentage: ((item.population / totalPopulation) * 100).toFixed(2),
  }));

  // Get unique ward IDs
  const wardIds = Array.from(
    new Set(religionData.map((item) => item.wardId)),
  ).sort();

  // Process data for ward-wise visualization
  const wardWiseData = wardIds.map((wardId) => {
    const wardData = religionData.filter((item) => item.wardId === wardId);
    const result: Record<string, any> = { ward: `वडा ${wardId}` };

    wardData.forEach((item) => {
      result[RELIGION_NAMES[item.religionType]] = item.population;
    });

    return result;
  });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/religion-diversity.jpg"
              width={1200}
              height={400}
              alt="धार्मिक विविधता"
              className="w-full h-[250px] object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
              <div className="p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">
                  धर्म अनुसार जनसंख्या वितरण
                </h1>
                <p className="text-lg opacity-90 max-w-xl">
                  पालिकाको वडा अनुसार विभिन्न धार्मिक समुदायको जनसंख्या विवरण
                </p>
              </div>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा पालिकाको विभिन्न वडाहरूमा बसोबास गर्ने विभिन्न धार्मिक
              समुदायको जनसंख्या सम्बन्धी विस्तृत तथ्याङ्क प्रस्तुत गरिएको छ। यो
              तथ्याङ्कले स्थानीय धार्मिक विविधता, सांस्कृतिक बहुलवाद र समाजिक
              संरचना बुझ्न मद्दत गर्नेछ।
            </p>
            <p>
              पालिकाको विभिन्न वडाहरूमा हिन्दू, बौद्ध, क्रिश्चियन, इस्लाम
              लगायतका धार्मिक समूहहरूको उपस्थिति र वितरण सम्बन्धी यस तथ्याङ्कले
              नीति निर्माण, सामाजिक कार्यक्रम र सरकारी सेवाहरूलाई अझ समावेशी र
              सबैलाई सम्बोधन गर्ने बनाउन मद्दत गर्दछ।
            </p>

            <h2
              id="religion-distribution"
              className="scroll-m-20 border-b pb-2"
            >
              धार्मिक समुदाय अनुसार जनसंख्या
            </h2>
            <p>
              पालिकामा विभिन्न धार्मिक समुदायहरूको कुल जनसंख्या निम्नानुसार छ:
            </p>
          </div>

          {/* Overall religion distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="h-[400px]">
              <CardHeader>
                <CardTitle>धार्मिक समुदाय अनुसार जनसंख्या</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percentage }) =>
                          `${name}: ${percentage}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              RELIGION_COLORS[
                                entry.name as keyof typeof RELIGION_COLORS
                              ] ||
                              `#${Math.floor(Math.random() * 16777215).toString(16)}`
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => Number(value).toLocaleString()}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>धार्मिक समुदाय अनुसार जनसंख्या तालिका</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-2 text-left">धर्म</th>
                        <th className="border p-2 text-right">जनसंख्या</th>
                        <th className="border p-2 text-right">प्रतिशत</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overallSummary.map((item, i) => (
                        <tr
                          key={i}
                          className={i % 2 === 0 ? "bg-muted/50" : ""}
                        >
                          <td className="border p-2">{item.religionName}</td>
                          <td className="border p-2 text-right">
                            {item.population.toLocaleString()}
                          </td>
                          <td className="border p-2 text-right">
                            {(
                              (item.population / totalPopulation) *
                              100
                            ).toFixed(2)}
                            %
                          </td>
                        </tr>
                      ))}
                      <tr className="font-bold bg-muted">
                        <td className="border p-2">जम्मा</td>
                        <td className="border p-2 text-right">
                          {totalPopulation.toLocaleString()}
                        </td>
                        <td className="border p-2 text-right">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm">
                    <FileDown className="mr-2 h-4 w-4" />
                    डाउनलोड गर्नुहोस्
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="ward-wise-religion" className="scroll-m-20 border-b pb-2">
              वडा अनुसार धार्मिक विविधता
            </h2>
            <p>
              पालिकाका विभिन्न वडाहरूमा धार्मिक समुदायहरूको वितरण फरक-फरक छ।
              यहाँ प्रत्येक वडामा रहेका विभिन्न धार्मिक समुदायको जनसंख्या
              देखाइएको छ:
            </p>
          </div>

          <Card className="my-6">
            <CardHeader>
              <CardTitle>वडा अनुसार धार्मिक समुदायको जनसंख्या</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] overflow-x-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={wardWiseData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <XAxis dataKey="ward" />
                    <YAxis />
                    <Tooltip />
                    <Legend
                      layout="horizontal"
                      verticalAlign="top"
                      align="center"
                    />
                    {Object.keys(RELIGION_NAMES).map((religion) => (
                      <Bar
                        key={religion}
                        dataKey={RELIGION_NAMES[religion]}
                        stackId="a"
                        fill={
                          RELIGION_COLORS[
                            religion as keyof typeof RELIGION_COLORS
                          ]
                        }
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="table" className="mt-8">
            <TabsList>
              <TabsTrigger value="table">तालिका</TabsTrigger>
              <TabsTrigger value="chart">चार्ट</TabsTrigger>
            </TabsList>

            <TabsContent value="table">
              <Card>
                <CardHeader>
                  <CardTitle>वडा अनुसार धार्मिक समुदायको विवरण</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-auto">
                    <table className="w-full border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border p-2">वडा नं.</th>
                          {Object.values(RELIGION_NAMES).map((name) => (
                            <th key={name} className="border p-2">
                              {name}
                            </th>
                          ))}
                          <th className="border p-2">जम्मा</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wardIds.map((wardId, i) => {
                          const wardItems = religionData.filter(
                            (item) => item.wardId === wardId,
                          );
                          const wardTotal = wardItems.reduce(
                            (sum, item) => sum + (item.population || 0),
                            0,
                          );

                          return (
                            <tr
                              key={i}
                              className={i % 2 === 0 ? "bg-muted/50" : ""}
                            >
                              <td className="border p-2">वडा {wardId}</td>
                              {Object.keys(RELIGION_NAMES).map(
                                (religionType) => {
                                  const item = wardItems.find(
                                    (i) => i.religionType === religionType,
                                  );
                                  return (
                                    <td
                                      key={religionType}
                                      className="border p-2 text-right"
                                    >
                                      {item?.population?.toLocaleString() ||
                                        "0"}
                                    </td>
                                  );
                                },
                              )}
                              <td className="border p-2 text-right font-medium">
                                {wardTotal.toLocaleString()}
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="font-bold bg-muted">
                          <td className="border p-2">जम्मा</td>
                          {Object.keys(RELIGION_NAMES).map((religionType) => {
                            const total = religionData
                              .filter(
                                (item) => item.religionType === religionType,
                              )
                              .reduce(
                                (sum, item) => sum + (item.population || 0),
                                0,
                              );
                            return (
                              <td
                                key={religionType}
                                className="border p-2 text-right"
                              >
                                {total.toLocaleString()}
                              </td>
                            );
                          })}
                          <td className="border p-2 text-right">
                            {totalPopulation.toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">
                      <FileDown className="mr-2 h-4 w-4" />
                      डाउनलोड गर्नुहोस्
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chart">
              <Card>
                <CardHeader>
                  <CardTitle>वडा अनुसार धार्मिक संरचना</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wardIds.map((wardId) => {
                      const wardItems = religionData.filter(
                        (item) => item.wardId === wardId,
                      );
                      const wardData = wardItems
                        .map((item) => ({
                          name:
                            RELIGION_NAMES[item.religionType] ||
                            item.religionType,
                          value: item.population || 0,
                        }))
                        .filter((item) => item.value > 0);

                      return (
                        <div key={wardId} className="h-[300px]">
                          <h3 className="text-lg font-medium mb-2 text-center">
                            वडा {wardId}
                          </h3>
                          <ResponsiveContainer width="100%" height="90%">
                            <PieChart>
                              <Pie
                                data={wardData}
                                cx="50%"
                                cy="50%"
                                innerRadius={30}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) =>
                                  `${name}: ${(percent * 100).toFixed(1)}%`
                                }
                              >
                                {wardData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={
                                      RELIGION_COLORS[
                                        Object.keys(RELIGION_NAMES).find(
                                          (key) =>
                                            RELIGION_NAMES[key] === entry.name,
                                        ) as keyof typeof RELIGION_COLORS
                                      ] ||
                                      `#${Math.floor(Math.random() * 16777215).toString(16)}`
                                    }
                                  />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="percentage-distribution"
              className="scroll-m-20 border-b pb-2"
            >
              धर्म अनुसार प्रतिशत वितरण
            </h2>
            <p>
              पालिकाको कुल जनसंख्यामा विभिन्न धार्मिक समुदायको प्रतिशत अनुपात
              निम्न अनुसार रहेको छ। यो अनुपातले स्थानीय सामाजिक संरचना र
              सांस्कृतिक मिश्रणलाई देखाउँछ।
            </p>

            <div className="mt-4 mb-6 flex flex-wrap gap-4 justify-center">
              {overallSummary.map((item, index) => (
                <div
                  key={index}
                  className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
                >
                  <div
                    className="absolute bottom-0 left-0 right-0"
                    style={{
                      height: `${Math.min((item.population / overallSummary[0].population) * 100, 100)}%`,
                      backgroundColor:
                        RELIGION_COLORS[
                          item.religion as keyof typeof RELIGION_COLORS
                        ] || "#888",
                      opacity: 0.2,
                      zIndex: 0,
                    }}
                  />
                  <div className="relative z-10">
                    <h3 className="text-lg font-medium mb-2">
                      {item.religionName}
                    </h3>
                    <p className="text-2xl font-bold">
                      {((item.population / totalPopulation) * 100).toFixed(2)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.population.toLocaleString()} व्यक्ति
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <h2 id="data-source" className="scroll-m-20 border-b pb-2">
              तथ्याङ्क स्रोत र विश्लेषण
            </h2>
            <p>
              माथि प्रस्तुत गरिएका तथ्याङ्कहरू नेपालको राष्ट्रिय जनगणना र
              पालिकाको आफ्नै सर्वेक्षणबाट संकलन गरिएको हो। यी तथ्याङ्कले निम्न
              कुराहरू देखाउँछ:
            </p>

            <ul>
              <li>
                पालिकामा {overallSummary[0]?.religionName || "हिन्दू"}{" "}
                धर्मावलम्बीहरूको बाहुल्य रहेको छ (कुल जनसंख्याको{" "}
                {(
                  ((overallSummary[0]?.population || 0) / totalPopulation) *
                  100
                ).toFixed(2)}
                %)।
              </li>
              <li>
                दोस्रो ठूलो धार्मिक समुदायको रूपमा{" "}
                {overallSummary[1]?.religionName || "बौद्ध"} धर्मावलम्बीहरू (कुल
                जनसंख्याको{" "}
                {(
                  ((overallSummary[1]?.population || 0) / totalPopulation) *
                  100
                ).toFixed(2)}
                %) रहेका छन्।
              </li>
              {wardIds.length > 3 && (
                <li>
                  वडा {wardIds[0]} र वडा {wardIds[1]} मा धार्मिक विविधता
                  सबैभन्दा बढी देखिन्छ।
                </li>
              )}
            </ul>

            <p>
              धार्मिक विविधताको यो तथ्याङ्कले विशेष गरी सामाजिक एकता, सांस्कृतिक
              मेलमिलाप र धार्मिक सहिष्णुतालाई प्रवर्द्धन गर्ने कार्यक्रमहरू
              सञ्चालन गर्न महत्वपूर्ण जानकारी प्रदान गर्दछ।
            </p>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="text-xl font-medium mb-2">थप जानकारी</h3>
              <p>
                पालिकाको धार्मिक समुदाय सम्बन्धी थप जानकारी वा विस्तृत
                तथ्याङ्कको लागि, कृपया{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  हामीलाई सम्पर्क
                </Link>{" "}
                गर्नुहोस् वा
                <Link
                  href="/profile/demographics"
                  className="text-primary hover:underline"
                >
                  जनसांख्यिकी तथ्याङ्क
                </Link>{" "}
                खण्डमा हेर्नुहोस्।
              </p>
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
