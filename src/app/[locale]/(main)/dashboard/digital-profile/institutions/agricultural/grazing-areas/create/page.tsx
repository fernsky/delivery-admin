"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { CreateGrazingAreaForm } from "./_components/create-form";

export default function CreateGrazingAreaPage() {
  const router = useRouter();

  return (
    <ContentLayout
      title="नयाँ चरन खर्क क्षेत्र थप्नुहोस्"
      backHref="/dashboard/digital-profile/institutions/agricultural/grazing-areas"
      actions={
        <Button
          variant="outline"
          onClick={() =>
            router.push(
              "/dashboard/digital-profile/institutions/agricultural/grazing-areas",
            )
          }
        >
          फिर्ता जानुहोस्
        </Button>
      }
    >
      <div className="grid gap-8">
        <CreateGrazingAreaForm />
      </div>
    </ContentLayout>
  );
}
