"use client";

import { Award, CheckIcon } from "lucide-react";

interface HeritageStatusDetailsProps {
  historicalSite: any;
}

export function HeritageStatusDetails({
  historicalSite,
}: HeritageStatusDetailsProps) {
  // Check if there is heritage status to display
  const hasHeritageStatus =
    historicalSite.isHeritageSite ||
    historicalSite.heritageDesignation ||
    historicalSite.heritageListingYear ||
    historicalSite.heritageReferenceId;

  if (!hasHeritageStatus) {
    return null;
  }

  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="flex items-center gap-2">
        <Award className="h-5 w-5 text-primary" />
        <h3 className="text-base font-medium">सम्पदा स्थिति</h3>
      </div>

      {historicalSite.isHeritageSite && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4 text-green-600" />
            <span>सम्पदा स्थलको रूपमा मान्यता प्राप्त</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {historicalSite.heritageDesignation && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              सम्पदा पदनाम
            </h3>
            <p>{historicalSite.heritageDesignation}</p>
          </div>
        )}

        {historicalSite.heritageListingYear && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              सम्पदा सूचीकरण वर्ष
            </h3>
            <p>{historicalSite.heritageListingYear}</p>
          </div>
        )}
      </div>

      {historicalSite.heritageReferenceId && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            सम्पदा सन्दर्भ आईडी
          </h3>
          <p>{historicalSite.heritageReferenceId}</p>
        </div>
      )}
    </div>
  );
}
