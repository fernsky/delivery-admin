"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { CreateProcessingCenterForm } from "./_components/create-form";

export default function CreateProcessingCenterPage() {
  const router = useRouter();

  return (
    <ContentLayout
      title="नयाँ कृषि प्रशोधन केन्द्र थप्नुहोस्"
      backHref="/dashboard/digital-profile/institutions/agricultural/processing-centers"
      actions={
        <Button
          variant="outline"
          onClick={() =>
            router.push(
              "/dashboard/digital-profile/institutions/agricultural/processing-centers",
            )
          }
        >
          फिर्ता जानुहोस्
        </Button>
      }
    >
      <div className="grid gap-8">
        <CreateProcessingCenterForm />
      </div>
    </ContentLayout>
  );
}
