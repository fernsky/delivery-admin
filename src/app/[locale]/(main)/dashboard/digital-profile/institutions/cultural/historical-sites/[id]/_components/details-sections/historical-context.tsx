"use client";

import { BookOpen } from "lucide-react";

interface HistoricalContextDetailsProps {
  historicalSite: any;
}

export function HistoricalContextDetails({
  historicalSite,
}: HistoricalContextDetailsProps) {
  // Check if there are historical context details to display
  const hasHistoricalContext =
    historicalSite.originalFunction ||
    historicalSite.notablePeople ||
    historicalSite.historicalEvents ||
    historicalSite.dynastyOrRulership ||
    historicalSite.changeOfOwnership;

  if (!hasHistoricalContext) {
    return null;
  }

  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />
        <h3 className="text-base font-medium">ऐतिहासिक सन्दर्भ</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {historicalSite.originalFunction && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              मूल प्रयोजन
            </h3>
            <p>{historicalSite.originalFunction}</p>
          </div>
        )}

        {historicalSite.dynastyOrRulership && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              राजवंश वा शासन
            </h3>
            <p>{historicalSite.dynastyOrRulership}</p>
          </div>
        )}
      </div>

      {historicalSite.notablePeople && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            उल्लेखनीय व्यक्तिहरू
          </h3>
          <p>{historicalSite.notablePeople}</p>
        </div>
      )}

      {historicalSite.historicalEvents && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            ऐतिहासिक घटनाहरू
          </h3>
          <p>{historicalSite.historicalEvents}</p>
        </div>
      )}

      {historicalSite.changeOfOwnership && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            स्वामित्व परिवर्तन
          </h3>
          <p>{historicalSite.changeOfOwnership}</p>
        </div>
      )}
    </div>
  );
}
