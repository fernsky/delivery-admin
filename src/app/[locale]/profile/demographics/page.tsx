import { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronRight,
  BarChart3,
  PieChart,
  Users,
  UserCheck,
} from "lucide-react";
import { api } from "@/trpc/server";
import Image from "next/image";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "पालिका जनसांख्यिकी तथ्याङ्क | पालिका प्रोफाइल प्रोफाइल",
  description:
    "पालिकाको जनसांख्यिकी तथ्याङ्क: जनसंख्या, उमेर, लिङ्ग, जात, धर्म, मातृभाषा र वैवाहिक स्थिति सम्बन्धी विस्तृत तथ्याङ्क र विश्लेषण।",
  keywords: [
    "जनसांख्यिकी",
    "जनगणना",
    "जनसंख्या",
    "जात",
    "धर्म",
    "मातृभाषा",
    "वैवाहिक स्थिति",
    "तथ्याङ्क",
  ],
  openGraph: {
    title: "पालिका जनसांख्यिकी तथ्याङ्क | पालिका प्रोफाइल प्रोफाइल",
    description:
      "पालिकाको जनसांख्यिकी तथ्याङ्क: जनसंख्या, उमेर, लिङ्ग, जात, धर्म, मातृभाषा र वैवाहिक स्थिति सम्बन्धी विस्तृत तथ्याङ्क र विश्लेषण।",
    type: "article",
    locale: "ne_NP",
    siteName: "पालिका प्रोफाइल प्रोफाइल",
  },
};

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "प्रमुख जनसांख्यिकी तथ्यहरू", slug: "key-demographics" },
  { level: 2, text: "जनसांख्यिकी श्रेणीहरू", slug: "demographic-categories" },
  { level: 2, text: "जनसंख्या वितरण", slug: "population-distribution" },
];

const demographicCategories = [
  {
    title: "जनसंख्या सारांश",
    description:
      "पालिकाको समग्र जनसंख्या, लिङ्ग अनुपात र घरधुरी सम्बन्धी सारांश तथ्याङ्क।",
    href: "/profile/demographics/summary",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "वडा अनुसार जनसंख्या",
    description:
      "विभिन्न वडाहरूको जनसंख्या, घरधुरी र लिङ्ग अनुपात सम्बन्धी तथ्याङ्क।",
    href: "/profile/demographics/ward-wise-demographic-summary",
    icon: <PieChart className="h-5 w-5" />,
  },
  {
    title: "जात/जनजाति अनुसार जनसंख्या",
    description:
      "विभिन्न जात र जनजातिको जनसंख्या र वितरण सम्बन्धी विस्तृत जानकारी।",
    href: "/profile/demographics/ward-wise-caste-population",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "मातृभाषा अनुसार जनसंख्या",
    description:
      "पालिकामा बोलिने विभिन्न मातृभाषाहरू र तिनका वक्ताहरूको जनसंख्या।",
    href: "/profile/demographics/ward-wise-mother-tongue-population",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "धर्म अनुसार जनसंख्या",
    description:
      "पालिकामा मानिने विभिन्न धर्महरू र तिनका अनुयायीहरूको जनसंख्या।",
    href: "/profile/demographics/ward-wise-religion-population",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "वैवाहिक स्थिति अनुसार जनसंख्या",
    description: "उमेर अनुसार वैवाहिक स्थिति सम्बन्धी तथ्याङ्क र विवाह दर।",
    href: "/profile/demographics/age-wise-marital-status",
    icon: <UserCheck className="h-5 w-5" />,
  },
];

export default async function DemographicsPage() {
  // Fetch population summary data
  const summary = await api.profile.demographics.summary.get.query();

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/demographics-hero.svg"
              width={1200}
              height={400}
              alt="जनसांख्यिकी तथ्याङ्क"
              className="w-full h-[250px] object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
              <div className="p-6 text-white">
                <h1 className="text-3xl font-bold mb-2 text-white">
                  जनसांख्यिकी तथ्याङ्क
                </h1>
                <p className="text-lg opacity-90 max-w-xl">
                  पालिकाको जनसंख्या, लिङ्ग, उमेर, जात, धर्म र अन्य जनसांख्यिकी
                  विवरणहरू
                </p>
              </div>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा पालिकाको जनसांख्यिकी तथ्याङ्कहरू प्रस्तुत गरिएका छन्।
              यहाँ जनसंख्या, उमेर समूह, लिङ्ग, जात, धर्म, मातृभाषा र वैवाहिक
              स्थिति जस्ता विभिन्न जनसांख्यिकी विशेषताहरूको विस्तृत विवरण पाउन
              सकिन्छ।
            </p>
            <p>
              यी तथ्याङ्कहरू पालिकाको योजना निर्माण, स्रोत विनियोजन र नीति
              निर्धारणमा महत्वपूर्ण भूमिका खेल्दछन्। साथै, यिनले सामाजिक अध्ययन,
              अनुसन्धान र विकासका प्रयासहरूलाई समेत सहयोग गर्दछन्।
            </p>

            <h2 id="key-demographics" className="scroll-m-20 border-b pb-2">
              प्रमुख जनसांख्यिकी तथ्यहरू
            </h2>
          </div>

          {/* Key demographic indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 my-6">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">कुल जनसंख्या</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-2 px-4">
                <div className="text-3xl font-bold text-primary">
                  {summary?.totalPopulation?.toLocaleString() ||
                    "डाटा उपलब्ध छैन"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">लिङ्ग अनुपात</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-2 px-4">
                <div className="text-3xl font-bold text-primary">
                  {summary?.sexRatio || "डाटा उपलब्ध छैन"}
                </div>
                <p className="text-sm text-muted-foreground">
                  प्रति १०० महिलामा पुरुष
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">कुल घरधुरी</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-2 px-4">
                <div className="text-3xl font-bold text-primary">
                  {summary?.totalHouseholds?.toLocaleString() ||
                    "डाटा उपलब्ध छैन"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">औसत घरधुरी आकार</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-2 px-4">
                <div className="text-3xl font-bold text-primary">
                  {summary?.averageHouseholdSize || "डाटा उपलब्ध छैन"}
                </div>
                <p className="text-sm text-muted-foreground">
                  व्यक्ति प्रति घरधुरी
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="demographic-categories"
              className="scroll-m-20 border-b pb-2"
            >
              जनसांख्यिकी श्रेणीहरू
            </h2>
            <p>
              विभिन्न जनसांख्यिकी तथ्याङ्कहरू निम्न श्रेणीहरूमा हेर्न सकिन्छ:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {demographicCategories.map((category) => (
              <Card key={category.title} className="flex flex-col h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary/10 p-2 rounded">
                      {category.icon}
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="py-2 flex-grow">
                  <p className="text-muted-foreground">
                    {category.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link
                    href={category.href}
                    className="inline-flex items-center text-sm text-primary hover:underline"
                  >
                    विस्तृत हेर्नुहोस् <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="population-distribution"
              className="scroll-m-20 border-b pb-2"
            >
              जनसंख्या वितरण
            </h2>
            <p>
              पालिकाको जनसंख्या उमेर समूह, लिङ्ग अनुपात र स्थानीय वितरणका आधारमा
              बाँडिएको छ। उमेर समूह अनुसार जनसंख्याको वितरणले पालिकामा युवा,
              वयस्क र वृद्ध जनसंख्याको अनुपात देखाउँछ, जुन स्वास्थ्य, शिक्षा र
              सामाजिक सुरक्षा जस्ता सेवाहरूको योजना बनाउन महत्वपूर्ण हुन्छ।
            </p>

            <div className="flex flex-wrap gap-4 my-6 justify-center">
              {/* Population by age groups */}
              <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[250px]">
                <h3 className="text-lg font-medium mb-2">०-१४ वर्ष</h3>
                <p className="text-2xl font-bold text-primary">
                  {summary?.population0To14?.toLocaleString() ||
                    "डाटा उपलब्ध छैन"}
                </p>
                <p className="text-sm text-muted-foreground">
                  कुल जनसंख्याको{" "}
                  {summary?.totalPopulation && summary?.population0To14
                    ? (
                        (summary.population0To14 / summary.totalPopulation) *
                        100
                      ).toFixed(1)
                    : "?"}
                  %
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[250px]">
                <h3 className="text-lg font-medium mb-2">१५-५९ वर्ष</h3>
                <p className="text-2xl font-bold text-primary">
                  {summary?.population15To59?.toLocaleString() ||
                    "डाटा उपलब्ध छैन"}
                </p>
                <p className="text-sm text-muted-foreground">
                  कुल जनसंख्याको{" "}
                  {summary?.totalPopulation && summary?.population15To59
                    ? (
                        (summary.population15To59 / summary.totalPopulation) *
                        100
                      ).toFixed(1)
                    : "?"}
                  %
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[250px]">
                <h3 className="text-lg font-medium mb-2">६० वर्ष वा माथि</h3>
                <p className="text-2xl font-bold text-primary">
                  {summary?.population60AndAbove?.toLocaleString() ||
                    "डाटा उपलब्ध छैन"}
                </p>
                <p className="text-sm text-muted-foreground">
                  कुल जनसंख्याको{" "}
                  {summary?.totalPopulation && summary?.population60AndAbove
                    ? (
                        (summary.population60AndAbove /
                          summary.totalPopulation) *
                        100
                      ).toFixed(1)
                    : "?"}
                  %
                </p>
              </div>
            </div>

            <p>
              थप विस्तृत जनसांख्यिकी विश्लेषण र विशेष श्रेणीका तथ्याङ्कहरू हेर्न
              माथिका लिंकहरूमा क्लिक गर्नुहोस्।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
