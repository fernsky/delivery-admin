"use client";

import { Users, CheckIcon } from "lucide-react";

interface HistoricalSiteManagementProps {
  historicalSite: any;
}

export function HistoricalSiteManagement({
  historicalSite,
}: HistoricalSiteManagementProps) {
  // Check if there are management details to display
  const hasManagementDetails =
    historicalSite.managedBy ||
    historicalSite.contactPerson ||
    historicalSite.contactPhone ||
    historicalSite.contactEmail ||
    historicalSite.websiteUrl ||
    historicalSite.dailyOpeningTime ||
    historicalSite.dailyClosingTime ||
    historicalSite.isOpenAllDay ||
    historicalSite.weeklyClosedDays ||
    historicalSite.entryFeeNPR !== null;

  if (!hasManagementDetails) {
    return null;
  }

  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="text-base font-medium">व्यवस्थापन र संचालन</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {historicalSite.managedBy && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              व्यवस्थापक
            </h3>
            <p>{historicalSite.managedBy}</p>
          </div>
        )}

        {historicalSite.contactPerson && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              सम्पर्क व्यक्ति
            </h3>
            <p>{historicalSite.contactPerson}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {historicalSite.contactPhone && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              सम्पर्क फोन
            </h3>
            <p>{historicalSite.contactPhone}</p>
          </div>
        )}

        {historicalSite.contactEmail && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              सम्पर्क इमेल
            </h3>
            <p>{historicalSite.contactEmail}</p>
          </div>
        )}
      </div>

      {historicalSite.websiteUrl && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">वेबसाइट</h3>
          <a
            href={historicalSite.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {historicalSite.websiteUrl}
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {historicalSite.isOpenAllDay ? (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              खुला समय
            </h3>
            <div className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-green-600" />
              <span>२४ घण्टा खुला</span>
            </div>
          </div>
        ) : (
          <>
            {historicalSite.dailyOpeningTime && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  खुल्ने समय
                </h3>
                <p>{historicalSite.dailyOpeningTime}</p>
              </div>
            )}

            {historicalSite.dailyClosingTime && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  बन्द हुने समय
                </h3>
                <p>{historicalSite.dailyClosingTime}</p>
              </div>
            )}
          </>
        )}

        {historicalSite.weeklyClosedDays && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              साप्ताहिक बन्द दिनहरू
            </h3>
            <p>{historicalSite.weeklyClosedDays}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {historicalSite.entryFeeNPR !== null &&
          historicalSite.entryFeeNPR !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                प्रवेश शुल्क (नेरू)
              </h3>
              <p>
                {historicalSite.entryFeeNPR > 0
                  ? `रू. ${historicalSite.entryFeeNPR}`
                  : "नि:शुल्क"}
              </p>
            </div>
          )}

        {historicalSite.entryFeeDetailsForeigners && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              विदेशीहरूको लागि प्रवेश शुल्क विवरण
            </h3>
            <p>{historicalSite.entryFeeDetailsForeigners}</p>
          </div>
        )}
      </div>
    </div>
  );
}
