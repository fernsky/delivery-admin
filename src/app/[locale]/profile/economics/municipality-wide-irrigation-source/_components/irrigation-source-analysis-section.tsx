import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface IrrigationSourceAnalysisSectionProps {
  overallSummary: Array<{
    source: string;
    sourceName: string;
    coverage: number;
    percentage: number;
  }>;
  totalIrrigatedArea: number;
  irrigationAnalysis: Array<{
    source: string;
    sourceName: string;
    coverage: number;
    percentage: number;
    sustainabilityCategory: string;
    reliability: string;
    efficiencyScore: number;
  }>;
  IRRIGATION_SOURCE_TYPES: Record<string, string>;
  IRRIGATION_SOURCE_TYPES_EN: Record<string, string>;
  IRRIGATION_SOURCE_COLORS: Record<string, string>;
  sustainabilityScore: number;
  diversityIndex: number;
  mostUsedSource: {
    source: string;
    sourceName: string;
    coverage: number;
    percentage: number;
  } | null;
  leastUsedSource: {
    source: string;
    sourceName: string;
    coverage: number;
    percentage: number;
  } | null;
  dependencyRatio: number;
}

export default function IrrigationSourceAnalysisSection({
  overallSummary,
  totalIrrigatedArea,
  irrigationAnalysis,
  IRRIGATION_SOURCE_TYPES,
  IRRIGATION_SOURCE_TYPES_EN,
  IRRIGATION_SOURCE_COLORS,
  sustainabilityScore,
  diversityIndex,
  mostUsedSource,
  leastUsedSource,
  dependencyRatio,
}: IrrigationSourceAnalysisSectionProps) {
  
  // Calculate category-wise coverage
  const sustainableTotal = irrigationAnalysis
    .filter(item => item.sustainabilityCategory === "sustainable")
    .reduce((sum, item) => sum + item.coverage, 0);
    
  const traditionalTotal = irrigationAnalysis
    .filter(item => item.sustainabilityCategory === "traditional")
    .reduce((sum, item) => sum + item.coverage, 0);

  // Find most sustainable irrigation source
  const sustainableSources = irrigationAnalysis.filter(item => item.sustainabilityCategory === "sustainable");
  const mostSustainableSource = sustainableSources.sort((a, b) => b.coverage - a.coverage)[0];
  
  // Find most reliable irrigation source
  const reliableSources = irrigationAnalysis.filter(item => item.reliability === "high");
  const mostReliableSource = reliableSources.sort((a, b) => b.coverage - a.coverage)[0];

  // Calculate average efficiency score
  const averageEfficiencyScore = Math.round(
    irrigationAnalysis.reduce((sum, item) => sum + item.efficiencyScore, 0) / irrigationAnalysis.length
  );

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / खजुरा गाउँपालिका",
    "data-total-irrigated-area": totalIrrigatedArea.toString(),
    "data-most-used-source": mostUsedSource ? 
      `${mostUsedSource.sourceName} / ${IRRIGATION_SOURCE_TYPES_EN[mostUsedSource.source] || mostUsedSource.source}` : "",
    "data-most-used-percentage": mostUsedSource ? mostUsedSource.percentage.toFixed(2) : "0",
    "data-sustainability-score": sustainabilityScore.toString(),
    "data-diversity-index": (diversityIndex * 100).toFixed(2),
  };

  return (
    <>
      <div 
        className="mt-8 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">कुल सिंचित क्षेत्र</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(totalIrrigatedArea.toFixed(1), "ne")}
          </p>
          <p className="text-sm text-muted-foreground mt-1">हेक्टर</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">प्रमुख सिंचाई स्रोत</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(mostUsedSource?.percentage.toFixed(1) || "0", "ne")}%
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {mostUsedSource?.sourceName || ""}
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">सिंचाई दिगोपना स्कोर</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(sustainabilityScore.toString(), "ne")}%
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            पालिका औसत
          </p>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          सिंचाई स्रोतको विस्तृत विश्लेषण
          <span className="sr-only">Detailed Irrigation Source Analysis of Khajura</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="irrigation-source-analysis"
            data-percentage={mostUsedSource?.percentage.toFixed(2) || "0"}
          >
            <h4 className="font-medium mb-2">
              प्रमुख सिंचाई स्रोत वितरण
              <span className="sr-only">
                Main Irrigation Source Distribution in Khajura Rural Municipality
              </span>
            </h4>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-16 rounded"
                style={{
                  backgroundColor: mostUsedSource 
                    ? IRRIGATION_SOURCE_COLORS[mostUsedSource.source as keyof typeof IRRIGATION_SOURCE_COLORS] || "#3498db"
                    : "#3498db"
                }}
              ></div>
              <div>
                <p className="text-2xl font-bold">
                  {mostUsedSource?.sourceName || ""}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {localizeNumber(mostUsedSource?.percentage.toFixed(2) || "0", "ne")}% 
                  ({localizeNumber(mostUsedSource?.coverage.toFixed(1) || "0", "ne")} हेक्टर)
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              {/* Top 4 irrigation sources visualization */}
              {overallSummary.slice(0, 4).map((item, index) => (
                <div key={index} className="mt-3">
                  <div className="flex justify-between text-sm">
                    <span>{index + 1}. {item.sourceName}</span>
                    <span className="font-medium">{localizeNumber(item.percentage.toFixed(1), "ne")}%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(item.percentage, 100)}%`,
                        backgroundColor: IRRIGATION_SOURCE_COLORS[item.source as keyof typeof IRRIGATION_SOURCE_COLORS] || "#3498db",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              सिंचाई दिगोपना विश्लेषण
              <span className="sr-only">Irrigation Sustainability Analysis</span>
            </h4>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span>दिगो सिंचाई स्रोत</span>
                  <span className="font-medium">{localizeNumber(((sustainableTotal / totalIrrigatedArea) * 100).toFixed(1), "ne")}%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${Math.min((sustainableTotal / totalIrrigatedArea) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span>परम्परागत सिंचाई स्रोत</span>
                  <span className="font-medium">{localizeNumber(((traditionalTotal / totalIrrigatedArea) * 100).toFixed(1), "ne")}%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${Math.min((traditionalTotal / totalIrrigatedArea) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium">सर्वाधिक दिगो स्रोत</h5>
                    <p className="text-sm text-muted-foreground">उच्च दिगोपना रेटिङ</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{mostSustainableSource?.sourceName || "N/A"}</p>
                    <p className="text-sm text-green-500 font-medium">
                      {localizeNumber(mostSustainableSource?.coverage.toFixed(1) || "0", "ne")} हेक्टर
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium">सर्वाधिक भरपर्दो स्रोत</h5>
                    <p className="text-sm text-muted-foreground">उच्च भरपर्दोता रेटिङ</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{mostReliableSource?.sourceName || "N/A"}</p>
                    <p className="text-sm text-blue-500 font-medium">
                      {localizeNumber(mostReliableSource?.coverage.toFixed(1) || "0", "ne")} हेक्टर
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">विस्तृत विश्लेषण</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>स्रोत वितरण:</strong> पालिकाभरि सिंचाई स्रोतको वितरण {localizeNumber(
                    ((sustainableTotal / totalIrrigatedArea) * 100).toFixed(1),
                    "ne"
                  )}% दिगो, {localizeNumber(
                    ((traditionalTotal / totalIrrigatedArea) * 100).toFixed(1),
                    "ne"
                  )}% परम्परागत स्रोतमा रहेको देखिन्छ।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                <span>
                  <strong>निर्भरता अनुपात:</strong> {mostUsedSource?.sourceName || ""} मा {localizeNumber(dependencyRatio.toFixed(1), "ne")}% निर्भरता रहेकोले सिंचाई जोखिम व्यवस्थापनमा सुधार आवश्यक छ।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">•</span>
                <span>
                  <strong>सिंचाई दिगोपना स्कोर:</strong> पालिकाको सिंचाई दिगोपना स्कोर {localizeNumber(sustainabilityScore.toString(), "ne")}% रहेको छ, जसलाई {sustainabilityScore >= 60 ? "राम्रो" : sustainabilityScore >= 40 ? "सन्तोषजनक" : "सुधार आवश्यक"} मानिन्छ।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-500">•</span>
                <span>
                  <strong>विविधता सूचकाङ्क:</strong> सिंचाई स्रोत विविधता सूचकाङ्क {localizeNumber((diversityIndex * 100).toFixed(1), "ne")}% रहेको छ, जसले {diversityIndex >= 0.7 ? "उत्कृष्ट" : diversityIndex >= 0.5 ? "राम्रो" : diversityIndex >= 0.3 ? "मध्यम" : "न्यून"} विविधता देखाउँछ।
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">सिंचाई स्रोत तुलनात्मक विश्लेषण</h4>
            
            <div className="space-y-5">
              <div>
                <h5 className="text-sm font-medium mb-1">सबैभन्दा बढी प्रयोग हुने स्रोत</h5>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted h-4 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${mostUsedSource?.percentage || 0}%`,
                        backgroundColor: mostUsedSource ? IRRIGATION_SOURCE_COLORS[mostUsedSource.source as keyof typeof IRRIGATION_SOURCE_COLORS] || "#3498db" : "#3498db"
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium whitespace-nowrap">
                    {mostUsedSource?.sourceName || ""}: {localizeNumber(mostUsedSource?.percentage.toFixed(1) || "0", "ne")}%
                  </span>
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium mb-1">कम प्रयोग हुने स्रोत</h5>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted h-4 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${leastUsedSource?.percentage || 0}%`,
                        backgroundColor: leastUsedSource ? IRRIGATION_SOURCE_COLORS[leastUsedSource.source as keyof typeof IRRIGATION_SOURCE_COLORS] || "#e74c3c" : "#e74c3c"
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium whitespace-nowrap">
                    {leastUsedSource?.sourceName || ""}: {localizeNumber(leastUsedSource?.percentage.toFixed(1) || "0", "ne")}%
                  </span>
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium mb-1">दिगो स्रोत कभरेज</h5>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted h-4 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ 
                        width: `${Math.min((sustainableTotal / totalIrrigatedArea) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium whitespace-nowrap">
                    {localizeNumber(((sustainableTotal / totalIrrigatedArea) * 100).toFixed(1), "ne")}%
                  </span>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-1">औसत प्रभावकारिता स्कोर</h5>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted h-4 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${averageEfficiencyScore}%`,
                        backgroundColor: averageEfficiencyScore >= 75 ? "#2ecc71" : averageEfficiencyScore >= 50 ? "#f39c12" : "#e74c3c"
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium whitespace-nowrap">
                    {localizeNumber(averageEfficiencyScore.toString(), "ne")}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <h5 className="font-medium mb-3">सम्बन्धित डेटा</h5>
              <div className="flex flex-wrap gap-3">
                <Link 
                  href="/profile/economics/ward-wise-irrigated-area" 
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  वडा अनुसार सिंचित क्षेत्र
                </Link>
                <Link 
                  href="/profile/economics/agricultural-production" 
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  कृषि उत्पादन
                </Link>
                <Link 
                  href="/profile/infrastructure/water-supply" 
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  पानी आपूर्ति
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}