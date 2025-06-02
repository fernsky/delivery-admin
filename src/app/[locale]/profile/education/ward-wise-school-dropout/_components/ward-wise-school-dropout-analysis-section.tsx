import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseSchoolDropoutAnalysisSectionProps {
  totalDropouts: number;
  dropoutGroupTotals: Record<string, number>;
  dropoutGroupPercentages: Record<string, number>;
  dropoutCauseTotals: Record<string, number>;
  causeMap: Record<string, string>;
  wardWiseEmploymentDropout: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  highestEmploymentDropoutWard: {
    wardNumber: number;
    percentage: number;
  };
  lowestEmploymentDropoutWard: {
    wardNumber: number;
    percentage: number;
  };
  DROPOUT_CAUSE_GROUPS: Record<string, {
    name: string;
    nameEn: string;
    color: string;
    causes: string[];
  }>;
}

export default function WardWiseSchoolDropoutAnalysisSection({
  totalDropouts,
  dropoutGroupTotals,
  dropoutGroupPercentages,
  dropoutCauseTotals,
  causeMap,
  wardWiseEmploymentDropout,
  highestEmploymentDropoutWard,
  lowestEmploymentDropoutWard,
  DROPOUT_CAUSE_GROUPS,
}: WardWiseSchoolDropoutAnalysisSectionProps) {
  // Calculate school retention index based on dropout groups
  // Lower is better for dropout causes, so we invert the scale
  const retentionIndex = 100 - (
    (dropoutGroupPercentages.EMPLOYMENT * 0.6) + 
    (dropoutGroupPercentages.EDUCATION * 0.2) + 
    (dropoutGroupPercentages.SOCIAL * 0.4) + 
    (dropoutGroupPercentages.OTHER * 0.2)
  ) / 2;
  
  // Determine retention level based on index score
  const retentionLevel = 
    retentionIndex >= 75 ? "उत्तम" :
    retentionIndex >= 60 ? "राम्रो" :
    retentionIndex >= 40 ? "मध्यम" :
    "निम्न";

  // Find most common dropout cause
  let mainDropoutCause = "";
  let mainDropoutCauseCount = 0;
  
  Object.keys(dropoutCauseTotals).forEach(cause => {
    if (dropoutCauseTotals[cause] > mainDropoutCauseCount) {
      mainDropoutCauseCount = dropoutCauseTotals[cause];
      mainDropoutCause = cause;
    }
  });

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / खजुरा गाउँपालिका",
    "data-total-dropouts": totalDropouts.toString(),
    "data-employment-dropout-rate": dropoutGroupPercentages.EMPLOYMENT.toFixed(2),
    "data-highest-employment-dropout-ward": highestEmploymentDropoutWard?.wardNumber.toString() || "",
    "data-lowest-employment-dropout-ward": lowestEmploymentDropoutWard?.wardNumber.toString() || "",
    "data-retention-index": retentionIndex.toFixed(2),
  };

  return (
    <>
      <div 
        className="mt-6 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        {Object.keys(DROPOUT_CAUSE_GROUPS).map((groupKey) => {
          const group = DROPOUT_CAUSE_GROUPS[groupKey as keyof typeof DROPOUT_CAUSE_GROUPS];
          const percentage = dropoutGroupPercentages[groupKey];
          const total = dropoutGroupTotals[groupKey];
          
          return (
            <div 
              key={groupKey}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[180px] relative overflow-hidden"
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${percentage}%`,
                  backgroundColor: group.color,
                  opacity: 0.2,
                  zIndex: 0,
                }}
              ></div>
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {group.name}
                  <span className="sr-only">
                    {group.nameEn}
                  </span>
                </h3>
                <p className="text-2xl font-bold">
                  {localizeNumber(percentage.toFixed(2), "ne")}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {localizeNumber(total.toLocaleString(), "ne")} जना
                  <span className="sr-only">
                    ({total.toLocaleString()} people)
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          विद्यालय छाड्ने कारणहरूको विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed School Dropout Causes Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="highest-employment-dropout"
            data-ward-number={highestEmploymentDropoutWard?.wardNumber}
            data-percentage={highestEmploymentDropoutWard?.percentage.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              रोजगारीका लागि बढी विद्यालय छाड्ने वडा
              <span className="sr-only">
                Ward with Highest Employment-related Dropout Rate in Khajura Rural Municipality
              </span>
            </h4>
            {highestEmploymentDropoutWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor: DROPOUT_CAUSE_GROUPS.EMPLOYMENT.color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा {localizeNumber(highestEmploymentDropoutWard.wardNumber.toString(), "ne")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    रोजगारीका लागि छाड्ने दर: {localizeNumber(highestEmploymentDropoutWard.percentage.toFixed(2), "ne")}%
                    <span className="sr-only">
                      {highestEmploymentDropoutWard.percentage.toFixed(2)}% employment-related dropout rate
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">विशेषताहरू</h5>
              <div className="mt-2 space-y-2">
                <p className="text-sm">
                  यस वडामा रोजगारीका कारण विद्यालय छाड्नेको प्रतिशत सबैभन्दा बढी रहेको छ, जुन पालिकाको औसतभन्दा {localizeNumber((highestEmploymentDropoutWard.percentage - dropoutGroupPercentages.EMPLOYMENT).toFixed(2), "ne")}% ले उच्च छ।
                </p>
                <p className="text-sm">
                  यसले यस वडामा रोजगारीको अवसर वा आर्थिक बाध्यताका कारण विद्यार्थीहरू विद्यालय छाड्न बाध्य भएको संकेत गर्दछ।
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="lowest-employment-dropout"
            data-ward-number={lowestEmploymentDropoutWard?.wardNumber}
            data-percentage={lowestEmploymentDropoutWard?.percentage.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              रोजगारीका लागि कम विद्यालय छाड्ने वडा
              <span className="sr-only">Ward with Low Employment-related Dropout Rate in Khajura</span>
            </h4>
            {lowestEmploymentDropoutWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor: DROPOUT_CAUSE_GROUPS.EDUCATION.color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा {localizeNumber(lowestEmploymentDropoutWard.wardNumber.toString(), "ne")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    रोजगारीका लागि छाड्ने दर: {localizeNumber(lowestEmploymentDropoutWard.percentage.toFixed(2), "ne")}%
                    <span className="sr-only">
                      {lowestEmploymentDropoutWard.percentage.toFixed(2)}% employment-related dropout rate
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">सकारात्मक पक्ष</h5>
              <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm">
                  यस वडामा रोजगारीका कारण विद्यालय छाड्नेको दर न्यून रहेको छ, जसले यहाँ शैक्षिक संस्थाहरूले विद्यार्थीहरूलाई राम्रोसँग टिकाइराख्न सफल भएको देखाउँछ। यस वडाको शैक्षिक प्रतिधारण रणनीति अन्य वडाहरूमा पनि लागू गर्न सकिन्छ।
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">शैक्षिक प्रतिधारण सूचकाङ्क</h4>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-purple-50 border-4 border-blue-200">
                <span className="text-2xl font-bold text-blue-600">
                  {localizeNumber((retentionIndex).toFixed(1), "ne")}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium">{retentionLevel} स्तर</p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>सूचकाङ्क विवरण:</strong> शैक्षिक प्रतिधारण सूचकाङ्क विभिन्न कारणहरूको भारित औसतमा आधारित छ, जसमा रोजगारी सम्बन्धी कारणहरूलाई बढी भार दिइएको छ।
                </span>
              </p>
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>व्याख्या:</strong> {localizeNumber((retentionIndex).toFixed(1), "ne")} अंकले {retentionLevel} शैक्षिक प्रतिधारण दर्शाउँछ। यसमा सुधारका लागि विद्यालय छाड्ने कारणहरूको सम्बोधन गर्ने कार्यक्रमहरू आवश्यक छन्।
                </span>
              </p>
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">छाड्ने कारणहरूको विश्लेषण</h4>

            <div>
              <h5 className="text-sm font-medium">सबैभन्दा बढी उल्लेखित कारणहरू</h5>
              <div className="mt-2 space-y-3">
                {Object.entries(dropoutCauseTotals)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 3)
                  .map(([cause, count], index) => {
                    const percentage = ((count / totalDropouts) * 100).toFixed(2);
                    let color = "#6B7280"; // Default gray
                    
                    // Find which group this cause belongs to
                    for (const [key, group] of Object.entries(DROPOUT_CAUSE_GROUPS)) {
                      if (group.causes.includes(cause)) {
                        color = group.color;
                        break;
                      }
                    }
                    
                    return (
                      <div key={cause}>
                        <div className="flex justify-between text-sm">
                          <span>
                            {causeMap[cause] || cause}
                          </span>
                          <span className="font-medium">
                            {localizeNumber(percentage, "ne")}%
                          </span>
                        </div>
                        <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${parseFloat(percentage)}%`,
                              backgroundColor: color,
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="mt-4 pt-3 border-t">
                <h5 className="font-medium mb-2">रोजगारी सम्बन्धी छाड्ने अवस्था</h5>
                <div className="flex justify-between text-sm">
                  <span>
                    <span 
                      className="inline-block w-2 h-2 rounded-full mr-2" 
                      style={{ backgroundColor: DROPOUT_CAUSE_GROUPS.EMPLOYMENT.color }}
                    ></span>
                    रोजगारी सम्बन्धी कारणहरू
                  </span>
                  <span className="font-medium">
                    {localizeNumber(dropoutGroupPercentages.EMPLOYMENT.toFixed(2), "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${dropoutGroupPercentages.EMPLOYMENT}%`,
                      backgroundColor: DROPOUT_CAUSE_GROUPS.EMPLOYMENT.color,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t">
              <h5 className="font-medium mb-2">सम्बन्धित डेटा</h5>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/profile/education/ward-wise-educational-level"
                  className="text-xs px-2 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  शैक्षिक स्तर
                </Link>
                <Link
                  href="/profile/education/ward-wise-literacy-status"
                  className="text-xs px-2 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  साक्षरताको अवस्था
                </Link>
                <Link
                  href="/profile/education/ward-wise-school-enrollment"
                  className="text-xs px-2 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  विद्यालय भर्ना
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
