"use client";

import { Users, CheckIcon } from "lucide-react";

interface ReligiousPlaceManagementProps {
  religiousPlace: any;
}

export function ReligiousPlaceManagement({
  religiousPlace,
}: ReligiousPlaceManagementProps) {
  // Check if there are management details to display
  const hasManagementDetails =
    religiousPlace.managedBy ||
    religiousPlace.contactPerson ||
    religiousPlace.contactPhone ||
    religiousPlace.contactEmail ||
    religiousPlace.websiteUrl ||
    religiousPlace.dailyOpeningTime ||
    religiousPlace.dailyClosingTime ||
    religiousPlace.isOpenAllDay ||
    religiousPlace.weeklyClosedDays ||
    religiousPlace.entryFeeNPR !== null;

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
        {religiousPlace.managedBy && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              व्यवस्थापक
            </h3>
            <p>{religiousPlace.managedBy}</p>
          </div>
        )}

        {religiousPlace.contactPerson && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              सम्पर्क व्यक्ति
            </h3>
            <p>{religiousPlace.contactPerson}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {religiousPlace.contactPhone && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              सम्पर्क फोन
            </h3>
            <p>{religiousPlace.contactPhone}</p>
          </div>
        )}

        {religiousPlace.contactEmail && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              सम्पर्क इमेल
            </h3>
            <p>{religiousPlace.contactEmail}</p>
          </div>
        )}
      </div>

      {religiousPlace.websiteUrl && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">वेबसाइट</h3>
          <a
            href={religiousPlace.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {religiousPlace.websiteUrl}
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {religiousPlace.isOpenAllDay ? (
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
            {religiousPlace.dailyOpeningTime && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  खुल्ने समय
                </h3>
                <p>{religiousPlace.dailyOpeningTime}</p>
              </div>
            )}

            {religiousPlace.dailyClosingTime && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  बन्द हुने समय
                </h3>
                <p>{religiousPlace.dailyClosingTime}</p>
              </div>
            )}
          </>
        )}

        {religiousPlace.weeklyClosedDays && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              साप्ताहिक बन्द दिनहरू
            </h3>
            <p>{religiousPlace.weeklyClosedDays}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {religiousPlace.entryFeeNPR !== null &&
          religiousPlace.entryFeeNPR !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                प्रवेश शुल्क (नेरू)
              </h3>
              <p>
                {religiousPlace.entryFeeNPR > 0
                  ? `रू. ${religiousPlace.entryFeeNPR}`
                  : "नि:शुल्क"}
              </p>
            </div>
          )}

        {religiousPlace.entryFeeDetailsForeigners && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              विदेशीहरूको लागि प्रवेश शुल्क विवरण
            </h3>
            <p>{religiousPlace.entryFeeDetailsForeigners}</p>
          </div>
        )}
      </div>
    </div>
  );
}
