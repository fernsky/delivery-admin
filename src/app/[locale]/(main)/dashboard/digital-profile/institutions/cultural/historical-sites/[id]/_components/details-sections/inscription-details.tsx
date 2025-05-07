"use client";

import { ScrollText, CheckIcon } from "lucide-react";

interface InscriptionDetailsProps {
  historicalSite: any;
}

export function InscriptionDetails({
  historicalSite,
}: InscriptionDetailsProps) {
  // Check if there are inscription details to display
  const hasInscriptionDetails =
    historicalSite.hasInscriptions ||
    historicalSite.inscriptionDetails ||
    historicalSite.hasHistoricalDocuments ||
    historicalSite.documentationDetails;

  if (!hasInscriptionDetails) {
    return null;
  }

  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="flex items-center gap-2">
        <ScrollText className="h-5 w-5 text-primary" />
        <h3 className="text-base font-medium">शिलालेख र कागजात</h3>
      </div>

      {historicalSite.hasInscriptions && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4 text-green-600" />
            <span>शिलालेख छ</span>
          </div>
          {historicalSite.inscriptionDetails && (
            <div className="pl-6">
              <p>{historicalSite.inscriptionDetails}</p>
            </div>
          )}
        </div>
      )}

      {historicalSite.hasHistoricalDocuments && (
        <div className="space-y-2 mt-4">
          <div className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4 text-green-600" />
            <span>ऐतिहासिक कागजातहरू छन्</span>
          </div>
          {historicalSite.documentationDetails && (
            <div className="pl-6">
              <p>{historicalSite.documentationDetails}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
