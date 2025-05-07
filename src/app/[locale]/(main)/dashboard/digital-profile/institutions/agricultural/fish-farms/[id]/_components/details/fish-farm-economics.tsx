import { Scale, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FishFarmEconomicsProps {
  fishFarm: any;
}

export function FishFarmEconomics({ fishFarm }: FishFarmEconomicsProps) {
  return (
    <div className="space-y-3 pt-6 border-t mt-6">
      <div className="flex items-center gap-2">
        <Scale className="h-5 w-5 text-primary" />
        <h3 className="text-base font-medium">आर्थिक विवरण</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fishFarm.annualOperatingCostNPR !== null &&
          fishFarm.annualOperatingCostNPR !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                वार्षिक संचालन लागत
              </h3>
              <p>रु. {fishFarm.annualOperatingCostNPR.toLocaleString()}</p>
            </div>
          )}

        {fishFarm.annualRevenueNPR !== null &&
          fishFarm.annualRevenueNPR !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                वार्षिक आम्दानी
              </h3>
              <p>रु. {fishFarm.annualRevenueNPR.toLocaleString()}</p>
            </div>
          )}

        {fishFarm.averageSellingPricePerKg !== null &&
          fishFarm.averageSellingPricePerKg !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                औसत बिक्री मूल्य
              </h3>
              <p>रु. {fishFarm.averageSellingPricePerKg} प्रति के.जी.</p>
            </div>
          )}
      </div>

      <div className="flex items-center gap-2">
        {fishFarm.profitableOperation ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <X className="h-4 w-4 text-red-600" />
        )}
        <span>नाफामूलक संचालन</span>
      </div>

      {fishFarm.marketAccessDetails && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            बजार पहुँच विवरण
          </h3>
          <p>{fishFarm.marketAccessDetails}</p>
        </div>
      )}

      {fishFarm.majorBuyerTypes && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            प्रमुख खरिदकर्ता प्रकारहरू
          </h3>
          <p>{fishFarm.majorBuyerTypes}</p>
        </div>
      )}

      {/* Linked entities */}
      {(fishFarm.linkedProcessingCenters?.length > 0 ||
        fishFarm.linkedWaterBodies?.length > 0) && (
        <div className="space-y-3 pt-4 mt-4">
          <h3 className="text-sm font-medium">जडित संस्थाहरू</h3>

          {fishFarm.linkedProcessingCenters?.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground">
                प्रशोधन केन्द्रहरू
              </h3>
              <div className="flex flex-wrap gap-2">
                {fishFarm.linkedProcessingCenters.map((item: any) => (
                  <Badge key={item.id} variant="outline">
                    {item.name || item.id}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {fishFarm.linkedWaterBodies?.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground">
                जलाशयहरू
              </h3>
              <div className="flex flex-wrap gap-2">
                {fishFarm.linkedWaterBodies.map((item: any) => (
                  <Badge key={item.id} variant="outline">
                    {item.name || item.id}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
