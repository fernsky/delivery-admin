"use client";

import { Users, CheckIcon, XIcon } from "lucide-react";

interface ReligiousPlaceVisitorInfoProps {
  religiousPlace: any;
}

export function ReligiousPlaceVisitorInfo({
  religiousPlace,
}: ReligiousPlaceVisitorInfoProps) {
  // Check if there's visitor info to display
  const hasVisitorInfo =
    religiousPlace.estimatedDailyVisitors !== null ||
    religiousPlace.estimatedYearlyVisitors !== null ||
    religiousPlace.guidesAvailable !== undefined ||
    religiousPlace.visitorDressCode ||
    religiousPlace.photoAllowed !== undefined ||
    religiousPlace.peakVisitationMonths;

  if (!hasVisitorInfo) {
    return null;
  }

  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="text-base font-medium">अगन्तुक जानकारी</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {religiousPlace.estimatedDailyVisitors !== null &&
          religiousPlace.estimatedDailyVisitors !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                अनुमानित दैनिक अगन्तुक
              </h3>
              <p>{religiousPlace.estimatedDailyVisitors} जना</p>
            </div>
          )}

        {religiousPlace.estimatedYearlyVisitors !== null &&
          religiousPlace.estimatedYearlyVisitors !== undefined && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                अनुमानित वार्षिक अगन्तुक
              </h3>
              <p>{religiousPlace.estimatedYearlyVisitors} जना</p>
            </div>
          )}

        {religiousPlace.peakVisitationMonths && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              उच्च भ्रमण महिना
            </h3>
            <p>{religiousPlace.peakVisitationMonths}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {religiousPlace.visitorDressCode && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              अगन्तुक पोशाक संहिता
            </h3>
            <p>{religiousPlace.visitorDressCode}</p>
          </div>
        )}

        {religiousPlace.photoAllowed !== undefined && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              फोटो अनुमति
            </h3>
            {religiousPlace.photoAllowed ? (
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-600" />
                <span>अनुमति छ</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <XIcon className="h-4 w-4 text-red-600" />
                <span>अनुमति छैन</span>
              </div>
            )}
            {religiousPlace.photoRestrictions && (
              <p className="text-sm text-gray-600 mt-1">
                {religiousPlace.photoRestrictions}
              </p>
            )}
          </div>
        )}
      </div>

      {religiousPlace.guidesAvailable !== undefined && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            गाइडको उपलब्धता
          </h3>
          <div className="flex items-center gap-2">
            {religiousPlace.guidesAvailable ? (
              <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
              <XIcon className="h-4 w-4 text-gray-400" />
            )}
            <span>
              {religiousPlace.guidesAvailable
                ? "गाइड उपलब्ध छ"
                : "गाइड उपलब्ध छैन"}
            </span>
          </div>
        </div>
      )}

      {religiousPlace.hasOverseasVisitors !== undefined && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            विदेशी पर्यटकहरू
          </h3>
          <div className="flex items-center gap-2">
            {religiousPlace.hasOverseasVisitors ? (
              <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
              <XIcon className="h-4 w-4 text-gray-400" />
            )}
            <span>
              {religiousPlace.hasOverseasVisitors
                ? "विदेशी पर्यटकहरू आउने"
                : "विदेशी पर्यटकहरू कम आउने"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
