"use client";

import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { PublicTransportEditForm } from "../_components/public-transport-edit-form";

export default function EditPublicTransportPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  // Fetch existing public transport data
  const { data: transportData, isLoading: isTransportLoading } =
    api.profile.transportation.publicTransports.getById.useQuery(params.id, {
      enabled: !!params.id,
    });

  if (isTransportLoading) {
    return (
      <ContentLayout title="सार्वजनिक यातायात अपडेट गर्दै...">
        <div className="flex items-center justify-center h-64">
          <Loader className="h-6 w-6 animate-spin" />
        </div>
      </ContentLayout>
    );
  }

  if (!transportData) {
    return (
      <ContentLayout title="सार्वजनिक यातायात फेला परेन">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p>माग गरिएको सार्वजनिक यातायात फेला परेन</p>
          <Button
            onClick={() =>
              router.push(
                "/digital-profile/institutions/transportation/public-transports",
              )
            }
            variant="outline"
          >
            फिर्ता जानुहोस्
          </Button>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title={`"${transportData.name}" सम्पादन गर्दै`}
      backHref="/digital-profile/institutions/transportation/public-transports"
      actions={
        <Button
          variant="outline"
          onClick={() =>
            router.push(
              "/digital-profile/institutions/transportation/public-transports",
            )
          }
        >
          फिर्ता जानुहोस्
        </Button>
      }
    >
      <div className="grid gap-8">
        <PublicTransportEditForm
          initialData={transportData}
          transportId={params.id}
        />
      </div>
    </ContentLayout>
  );
}
