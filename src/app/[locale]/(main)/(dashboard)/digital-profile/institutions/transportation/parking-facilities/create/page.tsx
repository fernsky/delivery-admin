"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { CreateParkingFacilityForm } from "./_components/create-form";

export default function CreateParkingFacilityPage() {
  const router = useRouter();

  return (
    <ContentLayout
      title="नयाँ पार्किङ सुविधा थप्नुहोस्"
      backHref="/digital-profile/institutions/transportation/parking-facilities"
      actions={
        <Button
          variant="outline"
          onClick={() =>
            router.push(
              "/digital-profile/institutions/transportation/parking-facilities",
            )
          }
        >
          फिर्ता जानुहोस्
        </Button>
      }
    >
      <div className="grid gap-8">
        <CreateParkingFacilityForm />
      </div>
    </ContentLayout>
  );
}
