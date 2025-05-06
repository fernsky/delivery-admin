"use server";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { validateRequest } from "@/lib/auth/validate-request";

const DashboardPage = async () => {
  const { user } = await validateRequest();
  if (!user) return null;
  return (
    <ContentLayout title="Dashboard">
      <p></p>
    </ContentLayout>
  );
};

export default DashboardPage;
