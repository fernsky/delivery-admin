import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface IrrigatedAreaAnalysisSectionProps {
  totalArea: number;
  totalIrrigatedArea: number;
  totalUnirrigatedArea: number;
  irrigationCoverage: number;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    irrigatedArea: number;
    unirrigatedArea: number;
    totalWardArea: number;
    irrigationCoveragePercentage: number;
    irrigationCoverageScore: number;
  }>;
  AREA_COLORS: Record<string, string>;
  bestIrrigationWard: {
    wardNumber: number;
    irrigatedArea: number;
    unirrigatedArea: number;
    totalWardArea: number;
    irrigationCoveragePercentage: number;
    irrigationCoverageScore: number;
  } | null;
  worstIrrigationWard: {
    wardNumber: number;
    irrigatedArea: number;
    unirrigatedArea: number;
    totalWardArea: number;
    irrigationCoveragePercentage: number;
    irrigationCoverageScore: number;
  } | null;
}

export default function IrrigatedAreaAnalysisSection({
  totalArea,
  totalIrrigatedArea,
  totalUnirrigatedArea,
  irrigationCoverage,
  wardWiseAnalysis,
  AREA_COLORS,
  bestIrrigationWard,
  worstIrrigationWard,
}: IrrigatedAreaAnalysisSectionProps) {
  
  // Calculate average irrigation coverage
  const averageIrrigationCoverage = wardWiseAnalysis.length > 0
    ? wardWiseAnalysis.reduce((sum, ward) => sum + ward.irrigationCoveragePercentage, 0) / wardWiseAnalysis.length
    : 0;
  
  // Find ward with largest irrigated area in hectares
  const largestIrrigatedAreaWard = [...wardWiseAnalysis].sort(
    (a, b) => b.irrigatedArea - a.irrigatedArea
  )[0];

  // Find ward with largest unirrigated area in hectares  
  const largestUnirrigatedAreaWard = [...wardWiseAnalysis].sort(
    (a, b) => b.unirrigatedArea - a.unirrigatedArea
  )[0];

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / खजुरा गाउँपालिका",
    "data-total-area": totalArea.toString(),
    "data-irrigated-area": totalIrrigatedArea.toString(),
    "data-irrigation-coverage": irrigationCoverage.toFixed(2),
  };

  return (
    <>
      <div 
        className="mt-8 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">कुल कृषि क्षेत्र</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(totalArea.toLocaleString(), "ne")}
          </p>
          <p className="text-sm text-muted-foreground mt-1">हेक्टर</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">सिंचित क्षेत्र</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(irrigationCoverage.toFixed(1), "ne")}%
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            ({localizeNumber(totalIrrigatedArea.toLocaleString(), "ne")} हेक्टर)
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">असिंचित क्षेत्र</h4>
          <p className="text-3xl font-bold">
            {localizeNumber((100 - irrigationCoverage).toFixed(1), "ne")}%
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            ({localizeNumber(totalUnirrigatedArea.toLocaleString(), "ne")} हेक्टर)
          </p>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          सिंचाई क्षेत्रको विस्तृत विश्लेषण
          <span className="sr-only">Detailed Irrigation Analysis of Khajura</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="irrigation-coverage-analysis"
            data-percentage={irrigationCoverage.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              खजुरा गाउँपालिकामा सिंचाई स्थिति
              <span className="sr-only">
                Irrigation Status in Khajura Rural Municipality
              </span>
            </h4>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-16 rounded"
                style={{
                  backgroundColor: AREA_COLORS["IRRIGATED"] || "#2ecc71"
                }}
              ></div>
              <div>
                <p className="text-2xl font-bold">
                  {localizeNumber(irrigationCoverage.toFixed(1), "ne")}% सिंचित
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {localizeNumber(totalIrrigatedArea.toLocaleString(), "ne")} हेक्टर कृषि भूमिमा सिंचाई सुविधा उपलब्ध
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">सिंचित क्षेत्र</span>
                <span className="font-medium">{localizeNumber(irrigationCoverage.toFixed(1), "ne")}%</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${irrigationCoverage}%`,
                    backgroundColor: AREA_COLORS["IRRIGATED"] || "#2ecc71",
                  }}
                ></div>
              </div>

              <div className="flex justify-between items-center mt-3">
                <span className="text-sm">असिंचित क्षेत्र</span>
                <span className="font-medium">{localizeNumber((100 - irrigationCoverage).toFixed(1), "ne")}%</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${100 - irrigationCoverage}%`,
                    backgroundColor: AREA_COLORS["UNIRRIGATED"] || "#e67e22",
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              वडागत सिंचाई कभरेज विश्लेषण
              <span className="sr-only">Ward-wise Irrigation Coverage Analysis</span>
            </h4>

            <div className="space-y-3">
              {wardWiseAnalysis.slice(0, 5).map((ward, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm">
                    <span>वडा {localizeNumber(ward.wardNumber.toString(), "ne")}</span>
                    <span className="font-medium">
                      {localizeNumber(ward.irrigationCoveragePercentage.toFixed(1), "ne")}% सिंचित
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ 
                        width: `${ward.irrigationCoveragePercentage}%`,
                        backgroundColor: AREA_COLORS["IRRIGATED"] || "#2ecc71"
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="font-medium">उच्चतम सिंचाई कभरेज</h5>
                  <p className="text-sm text-muted-foreground">सर्वाधिक सिंचाई सुविधा भएको वडा</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">वडा {localizeNumber(bestIrrigationWard?.wardNumber.toString() || "", "ne")}</p>
                  <p className="text-sm text-green-500 font-medium">
                    {localizeNumber(bestIrrigationWard?.irrigationCoveragePercentage.toFixed(1) || "0", "ne")}% सिंचित
                  </p>
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
                <span className="text-green-500">•</span>
                <span>
                  <strong>सिंचाई कभरेज:</strong> खजुरा गाउँपालिकामा औसत {localizeNumber(irrigationCoverage.toFixed(1), "ne")}% कृषि क्षेत्रमा सिंचाई सुविधा उपलब्ध छ, जुन राष्ट्रिय औसत भन्दा कम हो।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                <span>
                  <strong>वडागत भिन्नता:</strong> वडा {localizeNumber(bestIrrigationWard?.wardNumber.toString() || "", "ne")} मा सबैभन्दा बढी {localizeNumber(bestIrrigationWard?.irrigationCoveragePercentage.toFixed(1) || "0", "ne")}% क्षेत्रमा सिंचाई सुविधा छ, जबकि वडा {localizeNumber(worstIrrigationWard?.wardNumber.toString() || "", "ne")} मा सबैभन्दा कम {localizeNumber(worstIrrigationWard?.irrigationCoveragePercentage.toFixed(1) || "0", "ne")}% क्षेत्रमा मात्र सिंचाई छ।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>सबैभन्दा ठूलो सिंचित क्षेत्र:</strong> वडा {localizeNumber(largestIrrigatedAreaWard?.wardNumber.toString() || "", "ne")} मा सबैभन्दा ठूलो सिंचित क्षेत्र ({localizeNumber(largestIrrigatedAreaWard?.irrigatedArea.toFixed(1) || "0", "ne")} हेक्टर) रहेको छ।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500">•</span>
                <span>
                  <strong>सबैभन्दा ठूलो असिंचित क्षेत्र:</strong> वडा {localizeNumber(largestUnirrigatedAreaWard?.wardNumber.toString() || "", "ne")} मा सबैभन्दा ठूलो असिंचित क्षेत्र ({localizeNumber(largestUnirrigatedAreaWard?.unirrigatedArea.toFixed(1) || "0", "ne")} हेक्टर) रहेको छ।
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">वडागत तुलनात्मक विश्लेषण</h4>
            
            <div className="space-y-5">
              <div>
                <h5 className="text-sm font-medium mb-1">सिंचाई कभरेज (सबैभन्दा बढी)</h5>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted h-4 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ 
                        width: `${bestIrrigationWard?.irrigationCoveragePercentage || 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    वडा {localizeNumber(bestIrrigationWard?.wardNumber.toString() || "", "ne")}: {localizeNumber(bestIrrigationWard?.irrigationCoveragePercentage.toFixed(1) || "0", "ne")}%
                  </span>
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium mb-1">सिंचाई कभरेज (सबैभन्दा कम)</h5>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted h-4 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full" 
                      style={{ 
                        width: `${worstIrrigationWard?.irrigationCoveragePercentage || 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    वडा {localizeNumber(worstIrrigationWard?.wardNumber.toString() || "", "ne")}: {localizeNumber(worstIrrigationWard?.irrigationCoveragePercentage.toFixed(1) || "0", "ne")}%
                  </span>
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium mb-1">औसत सिंचाई कभरेज</h5>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted h-4 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ 
                        width: `${averageIrrigationCoverage}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    औसत: {localizeNumber(averageIrrigationCoverage.toFixed(1), "ne")}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <h5 className="font-medium mb-3">सम्बन्धित डेटा</h5>
              <div className="flex flex-wrap gap-3">
                <Link 
                  href="/profile/economics/agriculture" 
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  कृषि विवरण
                </Link>
                <Link 
                  href="/profile/economics/land-use" 
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  भूमि उपयोग
                </Link>
                <Link 
                  href="/profile/economics/ward-wise-land-ownership" 
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  जग्गा स्वामित्व
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
