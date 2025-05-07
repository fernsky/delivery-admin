import { CalendarIcon, Check, X, Info } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface FishFarmMetaProps {
  fishFarm: any;
}

export function FishFarmMeta({ fishFarm }: FishFarmMetaProps) {
  return (
    <div className="space-y-3 pt-6 border-t mt-6">
      {/* Verification Status */}
      <div className="flex items-center gap-2">
        {fishFarm.isVerified ? (
          <Check className="h-5 w-5 text-green-600" />
        ) : (
          <X className="h-5 w-5 text-gray-400" />
        )}
        <h3 className="text-base font-medium">
          {fishFarm.isVerified ? "प्रमाणित गरिएको" : "प्रमाणित नगरिएको"}
        </h3>
      </div>

      {fishFarm.isVerified && fishFarm.verificationDate && (
        <div className="flex items-center gap-2 ml-7 text-sm text-muted-foreground">
          <CalendarIcon className="h-3 w-3" />
          <span>
            {formatDate(new Date(fishFarm.verificationDate))} मा प्रमाणित गरिएको
          </span>
        </div>
      )}

      {/* Metadata */}
      <div className="space-y-2 pt-4 border-t mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          <span>आइडी: {fishFarm.id}</span>
        </div>
        {fishFarm.createdAt && (
          <div className="flex items-center gap-2 ml-6">
            <CalendarIcon className="h-3 w-3" />
            <span>
              {formatDate(new Date(fishFarm.createdAt))} मा सिर्जना गरिएको
            </span>
          </div>
        )}
        {fishFarm.updatedAt && fishFarm.updatedAt !== fishFarm.createdAt && (
          <div className="flex items-center gap-2 ml-6">
            <CalendarIcon className="h-3 w-3" />
            <span>
              {formatDate(new Date(fishFarm.updatedAt))} मा अद्यावधिक गरिएको
            </span>
          </div>
        )}
      </div>

      {/* SEO Metadata */}
      {(fishFarm.metaTitle ||
        fishFarm.metaDescription ||
        fishFarm.keywords) && (
        <div className="space-y-2 pt-4 border-t mt-4 text-sm">
          <h3 className="font-medium">SEO मेटाडाटा</h3>
          {fishFarm.metaTitle && (
            <div className="ml-6">
              <h4 className="text-xs font-medium text-muted-foreground">
                मेटा शीर्षक
              </h4>
              <p>{fishFarm.metaTitle}</p>
            </div>
          )}
          {fishFarm.metaDescription && (
            <div className="ml-6 mt-2">
              <h4 className="text-xs font-medium text-muted-foreground">
                मेटा विवरण
              </h4>
              <p>{fishFarm.metaDescription}</p>
            </div>
          )}
          {fishFarm.keywords && (
            <div className="ml-6 mt-2">
              <h4 className="text-xs font-medium text-muted-foreground">
                कीवर्डहरू
              </h4>
              <p>{fishFarm.keywords}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
