"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Plus } from "lucide-react";
import { api } from "@/trpc/react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AgricZonesPage() {
  const router = useRouter();

  // Fetch agricultural zones
  const { data: agricZones, isLoading } =
    api.profile.agricZones.getAll.useQuery({
      page: 1,
      pageSize: 10,
      viewType: "table",
    });

  return (
    <ContentLayout
      title="कृषि क्षेत्रहरू"
      description="सबै कृषि क्षेत्र, पकेट एरिया, र खेतीयोग्य जमिनहरू"
      backHref="/dashboard/digital-profile/institutions"
      actions={
        <Button
          onClick={() =>
            router.push(
              "/dashboard/digital-profile/institutions/agricultural/agric-zones/create",
            )
          }
        >
          <Plus className="mr-2 h-4 w-4" /> नयाँ कृषि क्षेत्र थप्नुहोस्
        </Button>
      }
    >
      <div className="grid gap-6">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="p-4">
              {agricZones?.totalItems === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  कुनै कृषि क्षेत्रहरू भेटिएनन्। नयाँ थप्न माथिको बटनमा क्लिक
                  गर्नुहोस्।
                </div>
              ) : (
                <div className="space-y-4">
                  {agricZones?.items.map((zone) => (
                    <div
                      key={zone.id}
                      className="p-4 border rounded-md cursor-pointer hover:bg-accent"
                      onClick={() =>
                        router.push(
                          `/dashboard/digital-profile/institutions/agricultural/agric-zones/${zone.id}`,
                        )
                      }
                    >
                      <div className="font-medium">{zone.name}</div>
                      <div className="text-sm text-muted-foreground">
                        प्रकार:{" "}
                        {zone.type === "SUPER_ZONE"
                          ? "सुपर जोन"
                          : zone.type === "POCKET_AREA"
                            ? "पकेट क्षेत्र"
                            : zone.type === "PULSES"
                              ? "दलहन"
                              : zone.type === "OILSEEDS"
                                ? "तेलहन"
                                : zone.type === "COMMERCIAL_FLOWER"
                                  ? "व्यावसायिक फूल खेती"
                                  : zone.type === "SEASONAL_CROPS"
                                    ? "मौसमी बाली"
                                    : zone.type === "MIXED"
                                      ? "मिश्रित"
                                      : "अन्य"}
                        {zone.majorCrops &&
                          ` | मुख्य बालीहरू: ${zone.majorCrops}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
