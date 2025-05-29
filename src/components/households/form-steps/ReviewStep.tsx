import { useFormContext } from "react-hook-form";
import { Household } from "@/types/household";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ReviewStepProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function ReviewStep({
  onSubmit,
  isSubmitting,
}: ReviewStepProps) {
  const { getValues } = useFormContext<Household>();
  const values = getValues();

  const sections = [
    {
      title: "आधारभूत जानकारी",
      items: [
        { label: "प्रदेश", value: values.province || "उल्लेख नगरिएको" },
        { label: "जिल्ला", value: values.district || "उल्लेख नगरिएको" },
        { label: "स्थानीय तह", value: values.local_level || "उल्लेख नगरिएको" },
        { label: "वडा नं", value: values.ward_no || "उल्लेख नगरिएको" },
        {
          label: "घर संकेत नं",
          value: values.house_symbol_no || "उल्लेख नगरिएको",
        },
        {
          label: "परिवार संकेत नं",
          value: values.family_symbol_no || "उल्लेख नगरिएको",
        },
        { label: "टोल/बस्ती", value: values.locality || "उल्लेख नगरिएको" },
      ],
    },
    {
      title: "परिवार विवरण",
      items: [
        {
          label: "परिवार मूलीको नाम",
          value: values.family_head_name || "उल्लेख नगरिएको",
        },
        {
          label: "सम्पर्क नम्बर",
          value: values.family_head_phone_no || "उल्लेख नगरिएको",
        },
        {
          label: "परिवार सदस्य संख्या",
          value: values.total_members || "उल्लेख नगरिएको",
        },
      ],
    },
    {
      title: "आवास विवरण",
      items: [
        {
          label: "घरको स्वामित्व",
          value: values.house_ownership || "उल्लेख नगरिएको",
        },
        {
          label: "जग्गाको स्वामित्व",
          value: values.land_ownership || "उल्लेख नगरिएको",
        },
        { label: "घरको जग", value: values.house_base || "उल्लेख नगरिएको" },
        {
          label: "घरको बाहिरी भित्ता",
          value: values.house_outer_wall || "उल्लेख नगरिएको",
        },
        { label: "घरको छाना", value: values.house_roof || "उल्लेख नगरिएको" },
        { label: "घरको भुइँ", value: values.house_floor || "उल्लेख नगरिएको" },
      ],
    },
    {
      title: "पानी तथा सरसफाई",
      items: [
        {
          label: "खानेपानी स्रोत",
          value: values.water_source || "उल्लेख नगरिएको",
        },
        {
          label: "शौचालयको प्रकार",
          value: values.toilet_type || "उल्लेख नगरिएको",
        },
        {
          label: "फोहोर व्यवस्थापन",
          value: values.solid_waste_management || "उल्लेख नगरिएको",
        },
      ],
    },
    {
      title: "आर्थिक विवरण",
      items: [
        {
          label: "आय स्रोतहरू",
          value: values.income_sources?.join(", ") || "उल्लेख नगरिएको",
        },
        {
          label: "ऋण लिएको संस्थाहरू",
          value:
            values.organizations_loaned_from?.join(", ") || "उल्लेख नगरिएको",
        },
        {
          label: "स्वास्थ्य बीमा",
          value: values.have_health_insurance === "yes" ? "छ" : "छैन",
        },
      ],
    },
    {
      title: "कृषि तथा पशुपालन",
      items: [
        {
          label: "कृषि गर्नुहुन्छ?",
          value:
            values.are_involved_in_agriculture === "yes" ? "गर्छु" : "गर्दिन",
        },
        {
          label: "पशुपालन गर्नुहुन्छ?",
          value:
            values.are_involved_in_husbandry === "yes" ? "गर्छु" : "गर्दिन",
        },
        {
          label: "माछापालन",
          value: values.have_aquaculture === "yes" ? "छ" : "छैन",
        },
        {
          label: "मौरीपालन",
          value: values.have_apiary === "yes" ? "छ" : "छैन",
        },
      ],
    },
    {
      title: "बसाइँसराई विवरण",
      items: [
        { label: "जन्म स्थान", value: values.birth_place || "उल्लेख नगरिएको" },
        {
          label: "अघिल्लो बसोबास स्थान",
          value: values.prior_location || "उल्लेख नगरिएको",
        },
        {
          label: "यहाँ बसोबास गर्नुको कारण",
          value: values.residence_reason || "उल्लेख नगरिएको",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>फारम समीक्षा</CardTitle>
          <CardDescription>
            तपाईंले भर्नुभएको विवरण तलका कार्डहरूमा समीक्षा गर्नुहोस्। सबै विवरण
            सही भएमा "घरधुरी दर्ता गर्नुहोस्" बटनमा क्लिक गर्नुहोस्।
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="border rounded-md p-4">
              <h3 className="font-semibold mb-2">{section.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {section.items.map((item) => (
                  <div key={item.label} className="flex">
                    <span className="font-medium min-w-[150px]">
                      {item.label}:
                    </span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button onClick={onSubmit} disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                दर्ता गर्दै...
              </>
            ) : (
              "घरधुरी दर्ता गर्नुहोस्"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
