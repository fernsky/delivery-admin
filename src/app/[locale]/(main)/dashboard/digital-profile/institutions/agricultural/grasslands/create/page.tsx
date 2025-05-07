"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { CreateGrasslandForm } from "./_components/create-form";

export default function CreateGrasslandPage() {
  const router = useRouter();

  return (
    <ContentLayout
      title="नयाँ चरन क्षेत्र थप्नुहोस्"
      backHref="/dashboard/digital-profile/institutions/agricultural/grasslands"
      actions={
        <Button
          variant="outline"
          onClick={() =>
            router.push(
              "/dashboard/digital-profile/institutions/agricultural/grasslands",
            )
          }
        >
          फिर्ता जानुहोस्
        </Button>
      }
    >
      <div className="grid gap-8">
        <CreateGrasslandForm />
      </div>
    </ContentLayout>
  );
}
