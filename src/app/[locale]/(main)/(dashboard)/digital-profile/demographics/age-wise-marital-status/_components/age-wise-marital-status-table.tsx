"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit2,
  Trash2,
  AlertTriangle,
  Filter,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
} from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  AgeGroupEnum,
  MaritalStatusEnum,
  getAgeGroupDisplayName,
  getMaritalStatusDisplayName,
} from "@/server/api/routers/profile/demographics/age-wise-marital-status.schema";

type AgeWiseMaritalStatusData = {
  id: string;
  wardId: string;
  wardNumber?: number;
  wardName?: string | null;
  ageGroup: string;
  maritalStatus: string;
  population?: number | null;
  malePopulation?: number | null;
  femalePopulation?: number | null;
  otherPopulation?: number | null;
  percentage?: string | null;
};

interface AgeWiseMaritalStatusTableProps {
  data: AgeWiseMaritalStatusData[];
  onEdit: (id: string) => void;
}

export default function AgeWiseMaritalStatusTable({
  data,
  onEdit,
}: AgeWiseMaritalStatusTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterWard, setFilterWard] = useState<string>("all");
  const [filterAgeGroup, setFilterAgeGroup] = useState<string>("all");
  const [filterMaritalStatus, setFilterMaritalStatus] = useState<string>("all");
  const [expandedWards, setExpandedWards] = useState<Record<string, boolean>>(
    {},
  );
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const utils = api.useContext();
  const deleteAgeWiseMaritalStatus =
    api.profile.demographics.ageWiseMaritalStatus.delete.useMutation({
      onSuccess: () => {
        toast.success("डाटा सफलतापूर्वक मेटियो");
        utils.profile.demographics.ageWiseMaritalStatus.getAll.invalidate();
      },
      onError: (err) => {
        toast.error(`त्रुटि: ${err.message}`);
      },
    });

  const handleDelete = () => {
    if (deleteId) {
      deleteAgeWiseMaritalStatus.mutate({ id: deleteId });
      setDeleteId(null);
    }
  };

  // Calculate unique wards and ages for filtering
  const uniqueWards = Array.from(
    new Set(data.map((item) => item.wardId)),
  ).sort();

  // Get ward numbers for display
  const wardIdToNumber = data.reduce(
    (acc, item) => {
      if (item.wardId && item.wardNumber) {
        acc[item.wardId] = item.wardNumber;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  // Calculate unique age groups for filtering
  const uniqueAgeGroups = Array.from(
    new Set(data.map((item) => item.ageGroup)),
  ).sort();

  // Calculate unique marital statuses for filtering
  const uniqueMaritalStatuses = Array.from(
    new Set(data.map((item) => item.maritalStatus)),
  ).sort();

  // Filter the data
  const filteredData = data.filter((item) => {
    return (
      (filterWard === "all" || item.wardId === filterWard) &&
      (filterAgeGroup === "all" || item.ageGroup === filterAgeGroup) &&
      (filterMaritalStatus === "all" ||
        item.maritalStatus === filterMaritalStatus)
    );
  });

  // Group data by ward ID
  const groupedByWard = filteredData.reduce(
    (acc, item) => {
      if (!acc[item.wardId]) {
        acc[item.wardId] = {
          wardId: item.wardId,
          wardNumber: item.wardNumber || Number(item.wardId),
          wardName: item.wardName,
          items: [],
        };
      }
      acc[item.wardId].items.push(item);
      return acc;
    },
    {} as Record<
      string,
      {
        wardId: string;
        wardNumber: number;
        wardName?: string | null;
        items: AgeWiseMaritalStatusData[];
      }
    >,
  );

  // Sort ward groups by ward number
  const sortedWardGroups = Object.values(groupedByWard).sort(
    (a, b) => a.wardNumber - b.wardNumber,
  );

  // Toggle ward expansion
  const toggleWardExpansion = (wardId: string) => {
    setExpandedWards((prev) => ({
      ...prev,
      [wardId]: !prev[wardId],
    }));
  };

  // Initialize expanded state for all wards if not set
  if (sortedWardGroups.length > 0 && Object.keys(expandedWards).length === 0) {
    const initialExpandedState = sortedWardGroups.reduce(
      (acc, ward) => {
        acc[ward.wardId] = true; // Start with all wards expanded
        return acc;
      },
      {} as Record<string, boolean>,
    );
    setExpandedWards(initialExpandedState);
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Filters and View Options */}
        <div className="bg-muted/40 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">फिल्टरहरू</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-1" />
                सूची
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                ग्रिड
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col space-y-2 flex-grow">
              <label
                htmlFor="ward-filter"
                className="text-sm font-medium text-muted-foreground"
              >
                वडा अनुसार फिल्टर:
              </label>
              <Select value={filterWard} onValueChange={setFilterWard}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="सबै वडाहरू" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">सबै वडाहरू</SelectItem>
                  {uniqueWards.map((wardId) => (
                    <SelectItem key={wardId} value={wardId}>
                      वडा {wardIdToNumber[wardId] || wardId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-2 flex-grow">
              <label
                htmlFor="age-group-filter"
                className="text-sm font-medium text-muted-foreground"
              >
                उमेर समूह अनुसार फिल्टर:
              </label>
              <Select value={filterAgeGroup} onValueChange={setFilterAgeGroup}>
                <SelectTrigger className="w-full sm:w-[240px]">
                  <SelectValue placeholder="सबै उमेर समूहहरू" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">सबै उमेर समूहहरू</SelectItem>
                  {uniqueAgeGroups.map((ageGroup) => (
                    <SelectItem key={ageGroup} value={ageGroup}>
                      {getAgeGroupDisplayName(ageGroup as any)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-2 flex-grow">
              <label
                htmlFor="marital-status-filter"
                className="text-sm font-medium text-muted-foreground"
              >
                वैवाहिक स्थिति अनुसार फिल्टर:
              </label>
              <Select
                value={filterMaritalStatus}
                onValueChange={setFilterMaritalStatus}
              >
                <SelectTrigger className="w-full sm:w-[240px]">
                  <SelectValue placeholder="सबै वैवाहिक स्थिति" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">सबै वैवाहिक स्थिति</SelectItem>
                  {uniqueMaritalStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {getMaritalStatusDisplayName(status as any)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table Section - Switch between list and grid views */}
        {sortedWardGroups.length === 0 ? (
          <div className="border rounded-lg p-8">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mb-2 opacity-40" />
              <p>कुनै डाटा भेटिएन</p>
              <p className="text-sm">
                कृपया फिल्टरहरू समायोजन गर्नुहोस् वा नयाँ रेकर्ड थप्नुहोस्
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {viewMode === "list" ? (
              // Traditional list view
              sortedWardGroups.map((wardGroup) => {
                const isExpanded = expandedWards[wardGroup.wardId] ?? true;
                const totalPopulation = wardGroup.items.reduce(
                  (sum, item) => sum + (item.population || 0),
                  0,
                );

                return (
                  <div
                    key={`ward-${wardGroup.wardId}`}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div
                      className="bg-muted/60 p-3 font-semibold flex items-center justify-between cursor-pointer hover:bg-muted/80"
                      onClick={() => toggleWardExpansion(wardGroup.wardId)}
                    >
                      <div className="flex items-center">
                        <span className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-2">
                          {wardGroup.wardNumber}
                        </span>
                        <span>
                          वडा नं. {wardGroup.wardNumber}
                          {wardGroup.wardName ? ` - ${wardGroup.wardName}` : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-normal text-muted-foreground hidden md:block">
                          <span className="mr-4">
                            जनसंख्या: {totalPopulation.toLocaleString()}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/20 hover:bg-muted/20">
                              <TableHead className="font-medium">
                                उमेर समूह
                              </TableHead>
                              <TableHead className="font-medium">
                                वैवाहिक स्थिति
                              </TableHead>
                              <TableHead className="text-right font-medium">
                                जनसंख्या
                              </TableHead>
                              <TableHead className="text-right font-medium">
                                पुरुष
                              </TableHead>
                              <TableHead className="text-right font-medium">
                                महिला
                              </TableHead>
                              <TableHead className="text-right font-medium">
                                अन्य
                              </TableHead>
                              <TableHead className="w-10" />
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {wardGroup.items.map((item) => (
                              <TableRow
                                key={item.id}
                                className="hover:bg-muted/30"
                              >
                                <TableCell className="max-w-[200px] truncate">
                                  {getAgeGroupDisplayName(item.ageGroup as any)}
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate">
                                  {getMaritalStatusDisplayName(
                                    item.maritalStatus as any,
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  {item.population?.toLocaleString() || "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                  {item.malePopulation?.toLocaleString() || "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                  {item.femalePopulation?.toLocaleString() ||
                                    "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                  {item.otherPopulation?.toLocaleString() ||
                                    "-"}
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                      >
                                        <span className="sr-only">
                                          मेनु खोल्नुहोस्
                                        </span>
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      className="w-[160px]"
                                    >
                                      <DropdownMenuLabel>
                                        कार्यहरू
                                      </DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() => onEdit(item.id)}
                                      >
                                        <Edit2 className="mr-2 h-4 w-4" />
                                        सम्पादन गर्नुहोस्
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => setDeleteId(item.id)}
                                        className="text-destructive focus:text-destructive"
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        मेट्नुहोस्
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="bg-muted/10">
                              <TableCell colSpan={2} className="font-medium">
                                जम्मा
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {totalPopulation.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {wardGroup.items
                                  .reduce(
                                    (sum, item) =>
                                      sum + (item.malePopulation || 0),
                                    0,
                                  )
                                  .toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {wardGroup.items
                                  .reduce(
                                    (sum, item) =>
                                      sum + (item.femalePopulation || 0),
                                    0,
                                  )
                                  .toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {wardGroup.items
                                  .reduce(
                                    (sum, item) =>
                                      sum + (item.otherPopulation || 0),
                                    0,
                                  )
                                  .toLocaleString()}
                              </TableCell>
                              <TableCell />
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              // Grid view - Marital Status as columns
              <div className="overflow-x-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-white z-10 w-24">
                        वडा / उमेर
                      </TableHead>
                      {/* Generate column headers for each marital status */}
                      {uniqueMaritalStatuses.map((status) => (
                        <TableHead
                          key={status}
                          className="text-center min-w-[150px]"
                        >
                          {getMaritalStatusDisplayName(status as any)}
                        </TableHead>
                      ))}
                      <TableHead className="text-right">कुल जनसंख्या</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Group by ward and age group */}
                    {sortedWardGroups.map((wardGroup) => {
                      // Group items by age group within this ward
                      const ageGroups = wardGroup.items.reduce(
                        (acc, item) => {
                          const key = item.ageGroup;
                          if (!acc[key]) {
                            acc[key] = {
                              ageGroup: item.ageGroup,
                              items: [],
                            };
                          }
                          acc[key].items.push(item);
                          return acc;
                        },
                        {} as Record<
                          string,
                          {
                            ageGroup: string;
                            items: AgeWiseMaritalStatusData[];
                          }
                        >,
                      );

                      // Sort age groups
                      const sortedAgeGroups = Object.values(ageGroups).sort(
                        (a, b) => {
                          const ageOrder = Object.values(AgeGroupEnum.Values);
                          return (
                            ageOrder.indexOf(a.ageGroup as any) -
                            ageOrder.indexOf(b.ageGroup as any)
                          );
                        },
                      );

                      if (filterAgeGroup === "all") {
                        // For each age group in this ward
                        return sortedAgeGroups.map((ageGroupData) => {
                          // Create mapping of marital status to data
                          const statusMap = ageGroupData.items.reduce(
                            (map, item) => {
                              map[item.maritalStatus] = item;
                              return map;
                            },
                            {} as Record<string, AgeWiseMaritalStatusData>,
                          );

                          // Calculate total for this age group
                          const totalPopulation = ageGroupData.items.reduce(
                            (sum, item) => sum + (item.population || 0),
                            0,
                          );

                          return (
                            <TableRow
                              key={`${wardGroup.wardId}-${ageGroupData.ageGroup}`}
                            >
                              <TableCell className="font-medium sticky left-0 bg-white z-10">
                                <div>
                                  <Badge variant="outline" className="mr-2">
                                    {wardGroup.wardNumber}
                                  </Badge>
                                  {getAgeGroupDisplayName(
                                    ageGroupData.ageGroup as any,
                                  )}
                                </div>
                              </TableCell>

                              {/* Render cells for each marital status */}
                              {uniqueMaritalStatuses.map((status) => {
                                const item = statusMap[status];
                                return (
                                  <TableCell
                                    key={`${wardGroup.wardId}-${ageGroupData.ageGroup}-${status}`}
                                    className="text-center"
                                  >
                                    {item ? (
                                      <div className="flex flex-col space-y-1">
                                        <span className="font-medium">
                                          {item.population?.toLocaleString() ||
                                            "-"}
                                        </span>
                                        {item && (
                                          <div className="flex justify-center mt-1 space-x-1">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 w-6 p-0"
                                              onClick={() => onEdit(item.id)}
                                            >
                                              <Edit2 className="h-3 w-3" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                              onClick={() =>
                                                setDeleteId(item.id)
                                              }
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      "-"
                                    )}
                                  </TableCell>
                                );
                              })}

                              <TableCell className="text-right font-medium">
                                {totalPopulation.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          );
                        });
                      } else {
                        // If filtering by age group, show only wards
                        const totalPopulation = wardGroup.items.reduce(
                          (sum, item) => sum + (item.population || 0),
                          0,
                        );

                        // Create mapping of marital status to data for the filtered age group
                        const statusMap = wardGroup.items.reduce(
                          (map, item) => {
                            map[item.maritalStatus] = item;
                            return map;
                          },
                          {} as Record<string, AgeWiseMaritalStatusData>,
                        );

                        return (
                          <TableRow key={`ward-${wardGroup.wardId}`}>
                            <TableCell className="font-medium sticky left-0 bg-white z-10">
                              <div>
                                <Badge variant="outline" className="mr-2">
                                  {wardGroup.wardNumber}
                                </Badge>
                                {wardGroup.wardName ||
                                  `वडा ${wardGroup.wardNumber}`}
                              </div>
                            </TableCell>

                            {/* Render cells for each marital status */}
                            {uniqueMaritalStatuses.map((status) => {
                              const item = statusMap[status];
                              return (
                                <TableCell
                                  key={`${wardGroup.wardId}-${status}`}
                                  className="text-center"
                                >
                                  {item ? (
                                    <div className="flex flex-col space-y-1">
                                      <span className="font-medium">
                                        {item.population?.toLocaleString() ||
                                          "-"}
                                      </span>
                                      {item && (
                                        <div className="flex justify-center mt-1 space-x-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0"
                                            onClick={() => onEdit(item.id)}
                                          >
                                            <Edit2 className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                            onClick={() => setDeleteId(item.id)}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    "-"
                                  )}
                                </TableCell>
                              );
                            })}

                            <TableCell className="text-right font-medium">
                              {totalPopulation.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        );
                      }
                    })}

                    {/* Summary row with totals by marital status */}
                    <TableRow className="bg-muted/20 font-medium">
                      <TableCell className="sticky left-0 bg-muted/20 z-10">
                        कुल जम्मा
                      </TableCell>
                      {uniqueMaritalStatuses.map((status) => {
                        const statusTotal = filteredData
                          .filter((item) => item.maritalStatus === status)
                          .reduce(
                            (sum, item) => sum + (item.population || 0),
                            0,
                          );

                        return (
                          <TableCell
                            key={`total-${status}`}
                            className="text-center"
                          >
                            {statusTotal > 0
                              ? statusTotal.toLocaleString()
                              : "-"}
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-right">
                        {filteredData
                          .reduce(
                            (sum, item) => sum + (item.population || 0),
                            0,
                          )
                          .toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}

        {/* Results summary */}
        {filteredData.length > 0 && (
          <div className="text-sm text-muted-foreground text-right">
            जम्मा वडाहरू: {sortedWardGroups.length} | जम्मा रेकर्डहरू:{" "}
            {filteredData.length}
          </div>
        )}
      </div>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              वैवाहिक स्थिति डाटा मेट्ने?
            </AlertDialogTitle>
            <AlertDialogDescription>
              यो कार्य पूर्ववत हुन सक्दैन। डाटा स्थायी रूपमा हटाइनेछ।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द गर्नुहोस्</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              मेट्नुहोस्
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
