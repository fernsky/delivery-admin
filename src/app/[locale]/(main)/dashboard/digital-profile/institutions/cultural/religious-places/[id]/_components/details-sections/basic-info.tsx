"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Landmark } from "lucide-react";

interface ReligiousPlaceBasicInfoProps {
  religiousPlace: any;
}

export function ReligiousPlaceBasicInfo({
  religiousPlace,
}: ReligiousPlaceBasicInfoProps) {
  // Get religious place type label
  const getReligiousPlaceTypeLabel = (type: string) => {
    const types = {
      HINDU_TEMPLE: "हिन्दु मन्दिर",
      BUDDHIST_TEMPLE: "बौद्ध गुम्बा",
      MOSQUE: "मस्जिद",
      CHURCH: "चर्च",
      GURUDWARA: "गुरुद्वारा",
      SHRINE: "मन्दिर",
      MONASTERY: "मठ",
      SYNAGOGUE: "यहुदी मन्दिर",
      JAIN_TEMPLE: "जैन मन्दिर",
      MEDITATION_CENTER: "ध्यान केन्द्र",
      PAGODA: "पगोडा",
      SACRED_GROVE: "पवित्र वन",
      SACRED_POND: "पवित्र पोखरी",
      SACRED_RIVER: "पवित्र नदी",
      SACRED_HILL: "पवित्र पहाड",
      PRAYER_HALL: "प्रार्थना हल",
      RELIGIOUS_COMPLEX: "धार्मिक परिसर",
      OTHER: "अन्य",
    };
    return types[type as keyof typeof types] || type;
  };

  // Get religious significance label
  const getReligiousSignificanceLabel = (significance: string | null) => {
    if (!significance) return "उल्लेख नभएको";

    const significances = {
      LOCAL: "स्थानीय",
      REGIONAL: "क्षेत्रीय",
      NATIONAL: "राष्ट्रिय",
      INTERNATIONAL: "अन्तर्राष्ट्रिय",
    };
    return (
      significances[significance as keyof typeof significances] || significance
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Landmark className="h-5 w-5 text-muted-foreground" />
          आधारभूत जानकारी
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Description */}
        {religiousPlace.description && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">विवरण</h3>
            <p className="text-base">{religiousPlace.description}</p>
          </div>
        )}

        {/* Religious Place Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              धार्मिक स्थलको प्रकार
            </h3>
            <div>
              <Badge variant="outline" className="text-base font-normal">
                {getReligiousPlaceTypeLabel(religiousPlace.type)}
              </Badge>
            </div>
          </div>

          {religiousPlace.religiousSignificance && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                धार्मिक महत्व
              </h3>
              <div>
                <Badge
                  variant="outline"
                  className={`text-base font-normal ${
                    religiousPlace.religiousSignificance === "INTERNATIONAL"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : religiousPlace.religiousSignificance === "NATIONAL"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }`}
                >
                  {getReligiousSignificanceLabel(
                    religiousPlace.religiousSignificance,
                  )}
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Location Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {religiousPlace.wardNumber && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                वडा नं.
              </h3>
              <p>{religiousPlace.wardNumber}</p>
            </div>
          )}

          {religiousPlace.location && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                ठाउँ/टोल
              </h3>
              <p>{religiousPlace.location}</p>
            </div>
          )}

          {religiousPlace.address && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                ठेगाना
              </h3>
              <p>{religiousPlace.address}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
