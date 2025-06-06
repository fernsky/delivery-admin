import { ColumnDef } from "@tanstack/react-table";
import { BuildingSchema } from "@/server/db/schema";
import { Button } from "@/components/ui/button";
import {
  Eye,
  MapPin,
  Binary,
  Store,
  Users,
  ArrowUpDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Edit2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Business } from "@/server/db/schema/business/business";
import Link from "next/link";

export const businessColumns = (
  onSort: (field: string) => void,
): ColumnDef<Business>[] => [
  {
    accessorKey: "wardId",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="pl-0 text-left font-medium"
        onClick={() => {
          onSort("ward_id");
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
        Ward
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="font-medium">
          Ward {row.getValue("wardId")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "areaCode",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="pl-0 text-left font-medium"
        onClick={() => {
          onSort("area_code");
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        <Binary className="mr-2 h-4 w-4 text-muted-foreground" />
        Area Code
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="font-medium">
          {row.getValue("areaCode") || "—"}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "businessName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="pl-0 text-left font-medium"
        onClick={() => {
          onSort("business_name");
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        <Store className="mr-2 h-4 w-4 text-muted-foreground" />
        Business Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
          {row.getValue("businessName") || "—"}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "enumeratorName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="pl-0 text-left font-medium"
        onClick={() => {
          onSort("enumerator_name");
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
        Collected By
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{row.getValue("enumeratorName")}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="pl-0 text-left font-medium"
        onClick={() => {
          onSort("status");
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusMap = {
        pending: {
          label: "Pending",
          icon: Clock,
          class: "bg-yellow-100 text-yellow-800",
        },
        approved: {
          label: "Approved",
          icon: CheckCircle2,
          class: "bg-green-100 text-green-800",
        },
        rejected: {
          label: "Rejected",
          icon: AlertCircle,
          class: "bg-red-100 text-red-800",
        },
        requested_for_edit: {
          label: "Edit Requested",
          icon: Edit2,
          class: "bg-blue-100 text-blue-800",
        },
      };

      const statusInfo =
        statusMap[status as keyof typeof statusMap] || statusMap.pending;
      const StatusIcon = statusInfo.icon;

      return (
        <Badge className={`${statusInfo.class} gap-1`}>
          <StatusIcon className="h-3.5 w-3.5" />
          {statusInfo.label}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Link href={`/businesses/${row.original.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
