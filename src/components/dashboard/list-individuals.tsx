"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import Link from "next/link";
import { DataTable } from "@/components/shared/data-table/data-table";
import { FilterDrawer } from "@/components/shared/filters/filter-drawer";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { ChevronLeft, ChevronRight, Loader2, Plus, Eye } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMediaQuery } from "react-responsive";
import { User } from "lucia";

export default function ListIndividuals({ user }: { user: User }) {
  
  return (
    <ContentLayout title="Individuals">
      <></>
    </ContentLayout>
  );
}
