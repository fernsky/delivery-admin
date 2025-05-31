import { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronRight,
  Users,
  GraduationCap,
  Activity,
  Building,
  PieChart,
  MapPin,
} from "lucide-react";
import Image from "next/image";

// Force dynamic rendering since child routes use headers
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "पालिका प्रोफाइल प्रोफाइल | स्थानीय तथ्याङ्क",
  description:
    "स्थानीय तथ्याङ्क र जनसांख्यिकी डाटा सहजै हेर्नुहोस्। सरकारी निकाय, अनुसन्धानकर्ता र आम नागरिकको लागि महत्वपूर्ण तथ्याङ्क उपलब्ध छन्।",
  keywords: [
    "पालिका प्रोफाइल",
    "जनसांख्यिकी",
    "स्थानीय तथ्याङ्क",
    "नेपाल",
    "जनगणना",
    "वडा तथ्याङ्क",
  ],
  openGraph: {
    title: "पालिका प्रोफाइल प्रोफाइल | स्थानीय तथ्याङ्क",
    description:
      "स्थानीय तथ्याङ्क र जनसांख्यिकी डाटा सहजै हेर्नुहोस्। सरकारी निकाय, अनुसन्धानकर्ता र आम नागरिकको लागि महत्वपूर्ण तथ्याङ्क उपलब्ध छन्।",
    type: "website",
    locale: "ne_NP",
    siteName: "पालिका प्रोफाइल प्रोफाइल",
  },
};

const categories = [
  {
    title: "जनसांख्यिकी",
    description:
      "जनसंख्या, उमेर, लिङ्ग, जात, धर्म र भाषा सम्बन्धी विस्तृत तथ्याङ्क।",
    href: "/profile/demographics",
    icon: <Users className="h-6 w-6" />,
    color: "bg-blue-100 dark:bg-blue-900",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  {
    title: "शिक्षा",
    description:
      "साक्षरता दर, विद्यालयहरू, शैक्षिक स्थिति र अन्य शिक्षा सम्बन्धी तथ्याङ्क।",
    href: "/profile/education",
    icon: <GraduationCap className="h-6 w-6" />,
    color: "bg-green-100 dark:bg-green-900",
    textColor: "text-green-700 dark:text-green-300",
  },
  {
    title: "स्वास्थ्य",
    description:
      "स्वास्थ्य सुविधाहरू, स्वास्थ्य सूचकांकहरू र सेवा पहुँच सम्बन्धी तथ्याङ्क।",
    href: "/profile/health",
    icon: <Activity className="h-6 w-6" />,
    color: "bg-red-100 dark:bg-red-900",
    textColor: "text-red-700 dark:text-red-300",
  },
  {
    title: "भौतिक पूर्वाधार",
    description: "सडक, बिजुली, खानेपानी र अन्य पूर्वाधार सम्बन्धी जानकारी।",
    href: "/profile/infrastructure",
    icon: <Building className="h-6 w-6" />,
    color: "bg-yellow-100 dark:bg-yellow-900",
    textColor: "text-yellow-700 dark:text-yellow-300",
  },
  {
    title: "अर्थतन्त्र",
    description: "रोजगारी, आर्थिक गतिविधि र व्यापार सम्बन्धी तथ्याङ्क।",
    href: "/profile/economy",
    icon: <PieChart className="h-6 w-6" />,
    color: "bg-purple-100 dark:bg-purple-900",
    textColor: "text-purple-700 dark:text-purple-300",
  },
  {
    title: "सामाजिक",
    description: "भौगोलिक नक्सा, स्थानीय सीमाना र अन्य स्थानिक जानकारी।",
    href: "/profile/maps",
    icon: <MapPin className="h-6 w-6" />,
    color: "bg-indigo-100 dark:bg-indigo-900",
    textColor: "text-indigo-700 dark:text-indigo-300",
  },
];

export default function ProfilePage() {
  return (
    <div className="relative py-4 lg:py-6 pb-16">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <div className="flex flex-col gap-8">
          <section className="py-6">
            <div className="relative rounded-md overflow-hidden mb-8">
              <div className="bg-black relative rounded-md">
                <div className="absolute inset-0 bg-black/60 z-10 rounded-md" />
                <Image
                  src="/images/municipality-profile-hero.svg"
                  width={1200}
                  height={300}
                  alt="पालिका प्रोफाइल दृश्य"
                  className="w-full h-[300px] object-cover rounded-md"
                  priority
                />
              </div>
              <div className="absolute inset-0 flex items-center z-20">
                <div className="p-8">
                  <h1 className="text-4xl font-bold mb-3 text-white drop-shadow-lg">
                    खजुरा प्रोफाइल
                  </h1>
                  <p className="text-lg text-white/90 max-w-xl drop-shadow-lg">
                    तथ्य र तथ्याङ्क मार्फत खजुरा गाउँपालिकालाई चिन्नुहोस्。
                  </p>
                </div>
              </div>
            </div>

            {/* Content with responsive max-width */}
            <div className="prose prose-slate dark:prose-invert max-w-4xl">
              <h2 id="introduction" className="scroll-m-20">
                परिचय
              </h2>
              <p>
                खजुरा गाउँपालिकाको प्रोफाइलमा स्वागत छ! यहाँ तपाईंले खजुरा
                गाउँपालिकाको विस्तृत तथ्याङ्क र विश्लेषणहरू पाउनुहुनेछ। यो
                प्रोफाइल सरकारी निकायहरू, अनुसन्धानकर्ताहरू, विद्यार्थीहरू र
                सम्पूर्ण नागरिकहरूको लागि एक महत्वपूर्ण तथ्याङ्क स्रोत हो。
              </p>

              <h2 id="data-categories" className="scroll-m-20 pt-4">
                तथ्याङ्क श्रेणीहरू
              </h2>
              <p>यस प्रोफाइलमा निम्न श्रेणीहरूमा तथ्याङ्क उपलब्ध छन्:</p>
            </div>
          </section>

          {/* Cards grid - full width */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 not-prose max-w-none">
            {categories.map((category) => (
              <Card key={category.title} className="overflow-hidden">
                <CardHeader className={cn("p-4", category.color)}>
                  <div className="flex justify-between items-center">
                    <div className={cn("p-2 rounded-md", category.textColor)}>
                      {category.icon}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="mb-2">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Link
                    href={category.href}
                    className="inline-flex items-center text-sm text-primary hover:underline"
                  >
                    थप हेर्नुहोस्{" "}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          <section className="py-6">
            {/* Content with responsive max-width */}
            <div className="prose prose-slate dark:prose-invert max-w-4xl">
              <h2 id="how-to-use" className="scroll-m-20">
                प्रोफाइलको प्रयोग विधि
              </h2>
              <p>
                यो प्रोफाइल प्रयोग गर्न सजिलो छ। तपाईंले निम्न तरिकाले तथ्याङ्क
                खोज्न र हेर्न सक्नुहुन्छ:
              </p>
              <ul>
                <li>बायाँ साइडबारको मेनुबाट आवश्यक श्रेणी छनोट गर्नुहोस्।</li>
                <li>
                  तथ्याङ्क टेबलहरू, ग्राफहरू र चार्टहरू मार्फत जानकारी हेर्नुहोस्।
                </li>
                <li>
                  आवश्यकता अनुसार फिल्टरहरू प्रयोग गरेर तपाईंलाई चाहिएको तथ्याङ्क
                  पाउनुहोस्।
                </li>
                <li>तथ्याङ्क डाउनलोड गर्न सम्बन्धित बटनहरू प्रयोग गर्नुहोस्。</li>
              </ul>

              <h2 id="data-sources" className="scroll-m-20">
                तथ्याङ्कका स्रोतहरू
              </h2>
              <p>
                यस प्रोफाइलमा प्रस्तुत गरिएका तथ्याङ्कहरू निम्न स्रोतहरूबाट संकलन
                गरिएका हुन्:
              </p>
              <ul>
                <li>नेपाल सरकारको राष्ट्रिय जनगणना २०७८</li>
                <li>पालिकाको वार्षिक सर्वेक्षण</li>
                <li>केन्द्रीय तथ्याङ्क विभागका प्रकाशनहरू</li>
                <li>स्थानीय स्वास्थ्य र शिक्षा विभागका रेकर्डहरू</li>
                <li>अन्य आधिकारिक सरकारी स्रोतहरू</li>
              </ul>

              <h2 id="contact" className="scroll-m-20">
                सम्पर्क
              </h2>
              <p>
                तथ्याङ्क सम्बन्धी कुनै प्रश्न, सुझाव वा थप जानकारीको लागि, कृपया
                हामीलाई{" "}
                <a href="mailto:info@palika-profile.gov.np">
                  info@palika-profile.gov.np
                </a>{" "}
                मा सम्पर्क गर्नुहोस् वा हाम्रो कार्यालयमा आउनुहोस्。
              </p>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
