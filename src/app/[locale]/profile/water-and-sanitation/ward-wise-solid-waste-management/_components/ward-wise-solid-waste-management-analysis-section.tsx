import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseSolidWasteManagementAnalysisSectionProps {
  totalHouseholds: number;
  wasteManagementGroupTotals: Record<string, number>;
  wasteManagementGroupPercentages: Record<string, number>;
  wasteManagementTotals: Record<string, number>;
  sourceMap: Record<string, string>;
  wardWiseFormalCollectionPercentage: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  highestFormalCollectionWard: {
    wardNumber: number;
    percentage: number;
  };
  lowestFormalCollectionWard: {
    wardNumber: number;
    percentage: number;
  };
  WASTE_MANAGEMENT_GROUPS: Record<string, {
    name: string;
    nameEn: string;
    color: string;
    sources: string[];
  }>;
}

export default function WardWiseSolidWasteManagementAnalysisSection({
  totalHouseholds,
  wasteManagementGroupTotals,
  wasteManagementGroupPercentages,
  wasteManagementTotals,
  sourceMap,
  wardWiseFormalCollectionPercentage,
  highestFormalCollectionWard,
  lowestFormalCollectionWard,
  WASTE_MANAGEMENT_GROUPS,
}: WardWiseSolidWasteManagementAnalysisSectionProps) {
  // Calculate environmental impact score based on waste management types
  // Different waste management methods have different weights for environmental impact calculation
  const environmentalImpactScore = 
    (wasteManagementGroupPercentages.FORMAL_COLLECTION * 1.0) + 
    (wasteManagementGroupPercentages.SELF_MANAGED * 0.7) + 
    (wasteManagementGroupPercentages.IMPROPER_DISPOSAL * 0.1) + 
    (wasteManagementGroupPercentages.OTHER_METHODS * 0.5);
  
  // Determine environmental impact level based on score
  const environmentalImpactLevel = 
    environmentalImpactScore >= 85 ? "उत्तम (Excellent)" :
    environmentalImpactScore >= 70 ? "राम्रो (Good)" :
    environmentalImpactScore >= 50 ? "मध्यम (Average)" :
    "निम्न (Poor)";

  // Find most common waste management method
  let mainWasteManagementMethod = "";
  let mainWasteManagementCount = 0;
  
  Object.keys(wasteManagementTotals).forEach(method => {
    if (wasteManagementTotals[method] > mainWasteManagementCount) {
      mainWasteManagementCount = wasteManagementTotals[method];
      mainWasteManagementMethod = method;
    }
  });

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / खजुरा गाउँपालिका",
    "data-total-households": totalHouseholds.toString(),
    "data-formal-collection-rate": wasteManagementGroupPercentages.FORMAL_COLLECTION.toFixed(2),
    "data-highest-formal-collection-ward": highestFormalCollectionWard?.wardNumber.toString() || "",
    "data-lowest-formal-collection-ward": lowestFormalCollectionWard?.wardNumber.toString() || "",
    "data-environmental-impact-score": environmentalImpactScore.toFixed(2),
  };

  return (
    <>
      <div 
        className="mt-6 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        {Object.keys(WASTE_MANAGEMENT_GROUPS).map((groupKey) => {
          const group = WASTE_MANAGEMENT_GROUPS[groupKey as keyof typeof WASTE_MANAGEMENT_GROUPS];
          const percentage = wasteManagementGroupPercentages[groupKey];
          const total = wasteManagementGroupTotals[groupKey];
          
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
                  {localizeNumber(total.toLocaleString(), "ne")} घरधुरी
                  <span className="sr-only">
                    ({total.toLocaleString()} households)
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          फोहोरमैला व्यवस्थापनको विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed Solid Waste Management Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="highest-formal-collection"
            data-ward-number={highestFormalCollectionWard?.wardNumber}
            data-percentage={highestFormalCollectionWard?.percentage.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              औपचारिक फोहोर संकलन बढी भएको वडा
              <span className="sr-only">
                Ward with Highest Formal Waste Collection in Khajura Rural Municipality
              </span>
            </h4>
            {highestFormalCollectionWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor: WASTE_MANAGEMENT_GROUPS.FORMAL_COLLECTION.color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा {localizeNumber(highestFormalCollectionWard.wardNumber.toString(), "ne")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    औपचारिक संकलन दर: {localizeNumber(highestFormalCollectionWard.percentage.toFixed(2), "ne")}%
                    <span className="sr-only">
                      {highestFormalCollectionWard.percentage.toFixed(2)}% formal collection rate
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">विशेषताहरू</h5>
              <div className="mt-2 space-y-2">
                <p className="text-sm">
                  यस वडामा औपचारिक फोहोर संकलन प्रणालीको पहुँच सबैभन्दा बढी रहेको छ, जुन पालिकाको औसतभन्दा {localizeNumber((highestFormalCollectionWard.percentage - wasteManagementGroupPercentages.FORMAL_COLLECTION).toFixed(2), "ne")}% ले उच्च छ।
                </p>
                <p className="text-sm">
                  यसले यस वडामा फोहोरमैला व्यवस्थापनको राम्रो संरचना र प्रभावकारी नीति रहेको संकेत गर्दछ।
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="lowest-formal-collection"
            data-ward-number={lowestFormalCollectionWard?.wardNumber}
            data-percentage={lowestFormalCollectionWard?.percentage.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              औपचारिक फोहोर संकलन कम भएको वडा
              <span className="sr-only">Ward with Low Formal Waste Collection in Khajura</span>
            </h4>
            {lowestFormalCollectionWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor: WASTE_MANAGEMENT_GROUPS.IMPROPER_DISPOSAL.color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा {localizeNumber(lowestFormalCollectionWard.wardNumber.toString(), "ne")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    औपचारिक संकलन दर: {localizeNumber(lowestFormalCollectionWard.percentage.toFixed(2), "ne")}%
                    <span className="sr-only">
                      {lowestFormalCollectionWard.percentage.toFixed(2)}% formal collection rate
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">सुधार आवश्यक क्षेत्र</h5>
              <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-sm">
                  यस वडामा औपचारिक फोहोर संकलन सेवा अत्यन्त कम रहेकाले फोहोर व्यवस्थापन सेवा विस्तार गर्नुपर्ने आवश्यकता देखिन्छ। यहाँ नदी वा सडकमा फोहोर फाल्ने प्रवृत्ति बढी हुन सक्ने जोखिम रहेको छ।
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">वातावरणीय प्रभाव सूचकाङ्क</h4>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-green-50 border-4 border-blue-200">
                <span className="text-2xl font-bold text-blue-600">
                  {localizeNumber((environmentalImpactScore).toFixed(1), "ne")}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium">{environmentalImpactLevel}</p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>सूचकाङ्क विवरण:</strong> वातावरणीय प्रभाव सूचकाङ्क विभिन्न फोहोर व्यवस्थापन विधिहरूको भारित औसतमा आधारित छ, जसमा औपचारिक संकलन र स्व-व्यवस्थापनलाई बढी भार दिइएको छ।
                </span>
              </p>
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>व्याख्या:</strong> {localizeNumber((environmentalImpactScore).toFixed(1), "ne")} अंकले {environmentalImpactLevel} वातावरणीय प्रभाव दर्शाउँछ। सुधारका लागि अनुचित निष्कासन विधिहरू न्यूनीकरण गर्दै औपचारिक र वैज्ञानिक फोहोर व्यवस्थापन विधिहरू प्रवर्द्धन गर्नुपर्छ।
                </span>
              </p>
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">फोहोर व्यवस्थापन विधिहरूको विश्लेषण</h4>

            <div>
              <h5 className="text-sm font-medium">सबैभन्दा बढी प्रयोग हुने विधिहरू</h5>
              <div className="mt-2 space-y-3">
                {Object.entries(wasteManagementTotals)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 3)
                  .map(([method, count], index) => {
                    const percentage = ((count / totalHouseholds) * 100).toFixed(2);
                    let color = "#6B7280"; // Default gray
                    
                    // Find which group this method belongs to
                    for (const [key, group] of Object.entries(WASTE_MANAGEMENT_GROUPS)) {
                      if (group.sources.includes(method)) {
                        color = group.color;
                        break;
                      }
                    }
                    
                    return (
                      <div key={method}>
                        <div className="flex justify-between text-sm">
                          <span>
                            {sourceMap[method] || method}
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
                <h5 className="font-medium mb-2">औपचारिक फोहोर संकलनको अवस्था</h5>
                <div className="flex justify-between text-sm">
                  <span>
                    <span 
                      className="inline-block w-2 h-2 rounded-full mr-2" 
                      style={{ backgroundColor: WASTE_MANAGEMENT_GROUPS.FORMAL_COLLECTION.color }}
                    ></span>
                    औपचारिक संकलन
                  </span>
                  <span className="font-medium">
                    {localizeNumber(wasteManagementGroupPercentages.FORMAL_COLLECTION.toFixed(2), "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${wasteManagementGroupPercentages.FORMAL_COLLECTION}%`,
                      backgroundColor: WASTE_MANAGEMENT_GROUPS.FORMAL_COLLECTION.color,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
