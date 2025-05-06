"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, UsersIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import AgeWiseMaritalStatusChart from "./_components/age-wise-marital-status-chart";
import AgeWiseMaritalStatusTable from "./_components/age-wise-marital-status-table";
import AgeWiseMaritalStatusForm from "./_components/age-wise-marital-status-form";

export default function WardWiseMaritalStatusPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const {
    data: wardMaritalStatusData,
    isLoading,
    isError,
  } = api.profile.demographics.ageWiseMaritalStatus.getAll.useQuery();

  const handleEdit = (id: string) => {
    setEditId(id);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditId(null);
  };

  if (isLoading) {
    return (
      <ContentLayout
        title="वडा वैवाहिक स्थिति विवरण"
        subtitle="वडा अनुसार वैवाहिक स्थितिको विवरण"
        icon={<UsersIcon className="h-6 w-6 text-primary" />}
      >
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </ContentLayout>
    );
  }

  if (isError) {
    return (
      <ContentLayout
        title="वडा वैवाहिक स्थिति विवरण"
        subtitle="वडा अनुसार वैवाहिक स्थितिको विवरण"
        icon={<UsersIcon className="h-6 w-6 text-primary" />}
      >
        <div className="text-center text-red-500 py-10">
          डाटा लोड गर्न समस्या भयो। कृपया पछि फेरि प्रयास गर्नुहोस्।
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="वडा वैवाहिक स्थिति विवरण"
      subtitle="वडा अनुसार वैवाहिक स्थितिको विवरण"
      icon={<UsersIcon className="h-6 w-6 text-primary" />}
      actions={
        <Button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          नयाँ वैवाहिक स्थिति विवरण थप्नुहोस्
        </Button>
      }
    >
      <AgeWiseMaritalStatusChart data={wardMaritalStatusData || []} />

      <AgeWiseMaritalStatusTable
        data={wardMaritalStatusData || []}
        onEdit={handleEdit}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editId
                ? "वैवाहिक स्थिति विवरण सम्पादन"
                : "नयाँ वैवाहिक स्थिति विवरण थप्नुहोस्"}
            </DialogTitle>
          </DialogHeader>
          <AgeWiseMaritalStatusForm
            editId={editId}
            onClose={handleFormClose}
            existingData={wardMaritalStatusData || []}
          />
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
