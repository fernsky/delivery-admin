"use client";

import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import DashboardBreadcrumb from "@/components/dashboard/breadcrumb";
import CreateForm from "./_components/create-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("FishFarms");

  return {
    title: t("create.pageTitle"),
    description: t("create.pageDescription"),
  };
}

export default async function CreateFishFarmPage() {
  const t = await getTranslations("FishFarms");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <DashboardBreadcrumb
        items={[
          {
            label: t("title"),
            href: "/dashboard/digital-profile/institutions/agricultural/fish-farms",
          },
          {
            label: t("create.title"),
            href: "/dashboard/digital-profile/institutions/agricultural/fish-farms/create",
            active: true,
          },
        ]}
      />

      <div className="flex items-center justify-between">
        <Heading
          title={t("create.title")}
          description={t("create.description")}
        />
      </div>

      <Card className="p-6">
        <CreateForm />
      </Card>
    </div>
  );
}
