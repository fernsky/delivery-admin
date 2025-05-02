"use client";

import { useState, useMemo } from "react";
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
  XCircle,
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type Gender = "MALE" | "FEMALE" | "OTHER";
type AgeGroup =
  | "AGE_0_4"
  | "AGE_5_9"
  | "AGE_10_14"
  | "AGE_15_19"
  | "AGE_20_24"
  | "AGE_25_29"
  | "AGE_30_34"
  | "AGE_35_39"
  | "AGE_40_44"
  | "AGE_45_49"
  | "AGE_50_54"
  | "AGE_55_59"
  | "AGE_60_64"
  | "AGE_65_69"
  | "AGE_70_74"
  | "AGE_75_AND_ABOVE";

// Define age groups categories
const ageGroupCategories = [
  {
    name: "Children",
    groups: ["AGE_0_4", "AGE_5_9", "AGE_10_14"],
    color: "bg-blue-50",
  },
  {
    name: "Youth",
    groups: ["AGE_15_19", "AGE_20_24", "AGE_25_29"],
    color: "bg-green-50",
  },
  {
    name: "Adults",
    groups: [
      "AGE_30_34",
      "AGE_35_39",
      "AGE_40_44",
      "AGE_45_49",
      "AGE_50_54",
      "AGE_55_59",
    ],
    color: "bg-amber-50",
  },
  {
    name: "Elderly",
    groups: ["AGE_60_64", "AGE_65_69", "AGE_70_74", "AGE_75_AND_ABOVE"],
    color: "bg-orange-50",
  },
];

type WardAgeWisePopulationData = {
  id: string;
  wardNumber: number;
  ageGroup: AgeGroup;
  gender: Gender;
  population: number;
};

interface WardAgeWisePopulationTableProps {
  data: WardAgeWisePopulationData[];
  onEdit: (id: string) => void;
}

export default function WardAgeWisePopulationTable({
  data,
  onEdit,
}: WardAgeWisePopulationTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterWard, setFilterWard] = useState<string>("all");
  const [filterGender, setFilterGender] = useState<string>("all");
  const [showAgeGrouping, setShowAgeGrouping] = useState<boolean>(true);

  const utils = api.useContext();

  const deleteWardAgeWisePopulation =
    api.profile.demographics.wardAgeWisePopulation.delete.useMutation({
      onSuccess: () => {
        toast.success("डाटा सफलतापूर्वक मेटियो");
        utils.profile.demographics.wardAgeWisePopulation.getAll.invalidate();
      },
      onError: (err) => {
        toast.error(`त्रुटि: ${err.message}`);
      },
    });

  const handleDelete = () => {
    if (deleteId) {
      deleteWardAgeWisePopulation.mutate({ id: deleteId });
      setDeleteId(null);
    }
  };

  // Calculate unique wards for filtering
  const uniqueWards = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.wardNumber))).sort(
      (a, b) => a - b,
    );
  }, [data]);

  // Filter the data
  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        (filterWard === "all" || item.wardNumber === parseInt(filterWard)) &&
        (filterGender === "all" || item.gender === filterGender),
    );
  }, [data, filterWard, filterGender]);

  // Process data for the table
  const processedData = useMemo(() => {
    // Group by ward
    const byWard: Record<
      number,
      Record<AgeGroup, Record<Gender, { id: string; population: number }>>
    > = {};

    // Initialize data structure with all wards, age groups, and genders
    uniqueWards.forEach((wardNumber) => {
      byWard[wardNumber] = {} as Record<
        AgeGroup,
        Record<Gender, { id: string; population: number }>
      >;

      // Create entries for all age groups and genders
      ageGroupCategories.forEach((category) => {
        category.groups.forEach((ageGroup) => {
          byWard[wardNumber][ageGroup as AgeGroup] = {
            MALE: { id: "", population: 0 },
            FEMALE: { id: "", population: 0 },
            OTHER: { id: "", population: 0 },
          };
        });
      });
    });

    // Fill in actual data
    filteredData.forEach((item) => {
      if (byWard[item.wardNumber] && byWard[item.wardNumber][item.ageGroup]) {
        byWard[item.wardNumber][item.ageGroup][item.gender] = {
          id: item.id,
          population: item.population,
        };
      }
    });

    return byWard;
  }, [filteredData, uniqueWards]);

  // Calculate totals for all data
  const totals = useMemo(() => {
    // Initialize with all age groups
    const result: {
      byGender: Record<Gender, number>;
      byAgeGroup: Record<AgeGroup, Record<Gender, number>>;
      byWard: Record<number, Record<Gender, number>>;
      grandTotal: number;
    } = {
      byGender: { MALE: 0, FEMALE: 0, OTHER: 0 },
      byAgeGroup: {} as Record<AgeGroup, Record<Gender, number>>,
      byWard: {},
      grandTotal: 0,
    };

    // Initialize age group totals
    ageGroupCategories.forEach((category) => {
      category.groups.forEach((ageGroup) => {
        result.byAgeGroup[ageGroup as AgeGroup] = {
          MALE: 0,
          FEMALE: 0,
          OTHER: 0,
        };
      });
    });

    // Initialize ward totals
    uniqueWards.forEach((ward) => {
      result.byWard[ward] = { MALE: 0, FEMALE: 0, OTHER: 0 };
    });

    // Calculate all totals
    filteredData.forEach((item) => {
      // Add to gender totals
      result.byGender[item.gender] += item.population;
      // Add to age group totals
      if (!result.byAgeGroup[item.ageGroup]) {
        result.byAgeGroup[item.ageGroup] = { MALE: 0, FEMALE: 0, OTHER: 0 };
      }
      result.byAgeGroup[item.ageGroup][item.gender] += item.population;

      // Add to ward totals
      if (!result.byWard[item.wardNumber]) {
        result.byWard[item.wardNumber] = { MALE: 0, FEMALE: 0, OTHER: 0 };
      }
      result.byWard[item.wardNumber][item.gender] += item.population;

      // Add to grand total
      result.grandTotal += item.population;
    });

    return result;
  }, [filteredData, uniqueWards]);

  const getAgeGroupLabel = (ageGroup: AgeGroup) => {
    switch (ageGroup) {
      case "AGE_0_4":
        return "०-४ वर्ष";
      case "AGE_5_9":
        return "५-९ वर्ष";
      case "AGE_10_14":
        return "१०-१४ वर्ष";
      case "AGE_15_19":
        return "१५-१९ वर्ष";
      case "AGE_20_24":
        return "२०-२४ वर्ष";
      case "AGE_25_29":
        return "२५-२९ वर्ष";
      case "AGE_30_34":
        return "३०-३४ वर्ष";
      case "AGE_35_39":
        return "३५-३९ वर्ष";
      case "AGE_40_44":
        return "४०-४४ वर्ष";
      case "AGE_45_49":
        return "४५-४९ वर्ष";
      case "AGE_50_54":
        return "५०-५४ वर्ष";
      case "AGE_55_59":
        return "५५-५९ वर्ष";
      case "AGE_60_64":
        return "६०-६४ वर्ष";
      case "AGE_65_69":
        return "६५-६९ वर्ष";
      case "AGE_70_74":
        return "७०-७४ वर्ष";
      case "AGE_75_AND_ABOVE":
        return "७५+ वर्ष";
      default:
        return ageGroup;
    }
  };

  const getAgeGroupCategoryColor = (ageGroup: AgeGroup) => {
    for (const category of ageGroupCategories) {
      if (category.groups.includes(ageGroup)) {
        return category.color;
      }
    }
    return "";
  };

  const getAgeGroupCategoryName = (ageGroup: AgeGroup): string => {
    for (const category of ageGroupCategories) {
      if (category.groups.includes(ageGroup)) {
        return category.name;
      }
    }
    return "";
  };

  const getGenderLabel = (gender: Gender) => {
    switch (gender) {
      case "MALE":
        return "पुरुष";
      case "FEMALE":
        return "महिला";
      case "OTHER":
        return "अन्य";
      default:
        return gender;
    }
  };

  const getGenderBadgeColor = (gender: Gender) => {
    switch (gender) {
      case "MALE":
        return "bg-blue-100 text-blue-800";
      case "FEMALE":
        return "bg-pink-100 text-pink-800";
      case "OTHER":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getGenderBgColor = (gender: Gender) => {
    switch (gender) {
      case "MALE":
        return "bg-blue-50";
      case "FEMALE":
        return "bg-pink-50";
      case "OTHER":
        return "bg-purple-50";
      default:
        return "";
    }
  };

  const handleAction = (id: string) => {
    if (!id) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>कार्यहरू</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onEdit(id)}>
            <Edit2 className="mr-2 h-4 w-4" />
            सम्पादन गर्नुहोस्
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteId(id)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            मेट्नुहोस्
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Get all age groups in correct order
  const allAgeGroups = useMemo(() => {
    return ageGroupCategories.flatMap(
      (category) => category.groups as AgeGroup[],
    );
  }, []);

  // Summary cards showing totals by gender
  const summaryCards = (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-green-50 border-green-100">
        <CardContent className="pt-4">
          <div className="text-lg font-medium text-green-700">कुल जनसंख्या</div>
          <div className="text-2xl font-bold text-green-800">
            {totals.grandTotal.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-blue-50 border-blue-100">
        <CardContent className="pt-4">
          <div className="text-lg font-medium text-blue-700">पुरुष</div>
          <div className="text-2xl font-bold text-blue-800">
            {totals.byGender.MALE.toLocaleString()}
          </div>
          <div className="text-sm text-blue-600">
            {totals.grandTotal > 0
              ? `${((totals.byGender.MALE / totals.grandTotal) * 100).toFixed(1)}%`
              : "0%"}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-pink-50 border-pink-100">
        <CardContent className="pt-4">
          <div className="text-lg font-medium text-pink-700">महिला</div>
          <div className="text-2xl font-bold text-pink-800">
            {totals.byGender.FEMALE.toLocaleString()}
          </div>
          <div className="text-sm text-pink-600">
            {totals.grandTotal > 0
              ? `${((totals.byGender.FEMALE / totals.grandTotal) * 100).toFixed(1)}%`
              : "0%"}
          </div>
        </CardContent>
      </Card>
      {totals.byGender.OTHER > 0 && (
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="pt-4">
            <div className="text-lg font-medium text-purple-700">अन्य</div>
            <div className="text-2xl font-bold text-purple-800">
              {totals.byGender.OTHER.toLocaleString()}
            </div>
            <div className="text-sm text-purple-600">
              {`${((totals.byGender.OTHER / totals.grandTotal) * 100).toFixed(1)}%`}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="ward-filter" className="text-sm whitespace-nowrap">
            वडा अनुसार फिल्टर:
          </label>
          <Select value={filterWard} onValueChange={setFilterWard}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="सबै वडाहरू" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">सबै वडाहरू</SelectItem>
              {uniqueWards.map((ward) => (
                <SelectItem key={ward} value={ward.toString()}>
                  वडा {ward}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="gender-filter" className="text-sm whitespace-nowrap">
            लिङ्ग अनुसार फिल्टर:
          </label>
          <Select value={filterGender} onValueChange={setFilterGender}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="सबै लिङ्ग" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">सबै लिङ्ग</SelectItem>
              <SelectItem value="MALE">पुरुष</SelectItem>
              <SelectItem value="FEMALE">महिला</SelectItem>
              <SelectItem value="OTHER">अन्य</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm whitespace-nowrap">उमेर समूह:</label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAgeGrouping(!showAgeGrouping)}
          >
            {showAgeGrouping
              ? "श्रेणी बन्द गर्नुहोस्"
              : "श्रेणीहरू देखाउनुहोस्"}
          </Button>
        </div>
      </div>

      {summaryCards}

      {/* Compact table for population by ward and age group */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  rowSpan={2}
                  className="w-20 bg-gray-100 font-medium sticky left-0 z-20"
                >
                  वडा नं.
                </TableHead>
                {filterGender === "all" && (
                  <>
                    <TableHead
                      colSpan={allAgeGroups.length}
                      className="text-center font-medium"
                    >
                      पुरुष
                    </TableHead>
                    <TableHead
                      colSpan={allAgeGroups.length}
                      className="text-center font-medium"
                    >
                      महिला
                    </TableHead>
                    {totals.byGender.OTHER > 0 && (
                      <TableHead
                        colSpan={allAgeGroups.length}
                        className="text-center font-medium"
                      >
                        अन्य
                      </TableHead>
                    )}
                  </>
                )}
                {filterGender !== "all" && (
                  <TableHead
                    colSpan={allAgeGroups.length}
                    className="text-center font-medium"
                  >
                    {getGenderLabel(filterGender as Gender)}
                  </TableHead>
                )}
                <TableHead
                  rowSpan={2}
                  className="text-right font-medium sticky right-0 bg-gray-100 z-20"
                >
                  जम्मा
                </TableHead>
              </TableRow>

              <TableRow>
                {filterGender === "all" || filterGender === "MALE"
                  ? allAgeGroups.map((ageGroup) => (
                      <TableHead
                        key={`male-${ageGroup}`}
                        className={`text-center text-xs px-2 py-1 ${getAgeGroupCategoryColor(ageGroup)} border-r`}
                      >
                        {getAgeGroupLabel(ageGroup)}
                      </TableHead>
                    ))
                  : null}

                {filterGender === "all" || filterGender === "FEMALE"
                  ? allAgeGroups.map((ageGroup) => (
                      <TableHead
                        key={`female-${ageGroup}`}
                        className={`text-center text-xs px-2 py-1 ${getAgeGroupCategoryColor(ageGroup)} border-r`}
                      >
                        {getAgeGroupLabel(ageGroup)}
                      </TableHead>
                    ))
                  : null}

                {(filterGender === "all" || filterGender === "OTHER") &&
                totals.byGender.OTHER > 0
                  ? allAgeGroups.map((ageGroup) => (
                      <TableHead
                        key={`other-${ageGroup}`}
                        className={`text-center text-xs px-2 py-1 ${getAgeGroupCategoryColor(ageGroup)} border-r`}
                      >
                        {getAgeGroupLabel(ageGroup)}
                      </TableHead>
                    ))
                  : null}

                {filterGender !== "all" &&
                filterGender !== "MALE" &&
                filterGender !== "FEMALE" &&
                filterGender !== "OTHER"
                  ? allAgeGroups.map((ageGroup) => (
                      <TableHead
                        key={`unknown-${ageGroup}`}
                        className={`text-center text-xs px-2 py-1 ${getAgeGroupCategoryColor(ageGroup)} border-r`}
                      >
                        {getAgeGroupLabel(ageGroup)}
                      </TableHead>
                    ))
                  : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {uniqueWards.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      3 + allAgeGroups.length * (filterGender === "all" ? 3 : 1)
                    }
                    className="h-24 text-center"
                  >
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <XCircle className="w-8 h-8 mb-2 opacity-50" />
                      कुनै डाटा भेटिएन
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {uniqueWards.map((wardNumber) => {
                    const wardData = processedData[wardNumber] || {};
                    const wardTotal = totals.byWard[wardNumber];
                    const wardTotalPop =
                      (wardTotal?.MALE || 0) +
                      (wardTotal?.FEMALE || 0) +
                      (wardTotal?.OTHER || 0);

                    return (
                      <TableRow key={`ward-${wardNumber}`}>
                        <TableCell className="font-medium sticky left-0 bg-white z-10">
                          वडा {wardNumber}
                        </TableCell>

                        {/* MALE population by age group */}
                        {(filterGender === "all" || filterGender === "MALE") &&
                          allAgeGroups.map((ageGroup) => {
                            const cellData = wardData[ageGroup]?.MALE;
                            return (
                              <TableCell
                                key={`male-${wardNumber}-${ageGroup}`}
                                className={`text-center text-sm ${getAgeGroupCategoryColor(ageGroup)} relative`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{cellData?.population || "-"}</span>
                                  {cellData?.id && (
                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100">
                                      {handleAction(cellData.id)}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                            );
                          })}

                        {/* FEMALE population by age group */}
                        {(filterGender === "all" ||
                          filterGender === "FEMALE") &&
                          allAgeGroups.map((ageGroup) => {
                            const cellData = wardData[ageGroup]?.FEMALE;
                            return (
                              <TableCell
                                key={`female-${wardNumber}-${ageGroup}`}
                                className={`text-center text-sm ${getAgeGroupCategoryColor(ageGroup)} relative`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{cellData?.population || "-"}</span>
                                  {cellData?.id && (
                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100">
                                      {handleAction(cellData.id)}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                            );
                          })}

                        {/* OTHER population by age group */}
                        {(filterGender === "all" || filterGender === "OTHER") &&
                          totals.byGender.OTHER > 0 &&
                          allAgeGroups.map((ageGroup) => {
                            const cellData = wardData[ageGroup]?.OTHER;
                            return (
                              <TableCell
                                key={`other-${wardNumber}-${ageGroup}`}
                                className={`text-center text-sm ${getAgeGroupCategoryColor(ageGroup)} relative`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{cellData?.population || "-"}</span>
                                  {cellData?.id && (
                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100">
                                      {handleAction(cellData.id)}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                            );
                          })}

                        <TableCell className="text-right font-medium sticky right-0 bg-gray-50 z-10">
                          {wardTotalPop > 0
                            ? wardTotalPop.toLocaleString()
                            : "-"}
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {/* Totals row */}
                  <TableRow className="bg-gray-100 font-bold">
                    <TableCell className="sticky left-0 bg-gray-100 z-10">
                      जम्मा
                    </TableCell>

                    {/* MALE total by age group */}
                    {(filterGender === "all" || filterGender === "MALE") &&
                      allAgeGroups.map((ageGroup) => (
                        <TableCell
                          key={`total-male-${ageGroup}`}
                          className={`text-center ${getAgeGroupCategoryColor(ageGroup)}`}
                        >
                          {totals.byAgeGroup[ageGroup]?.MALE > 0
                            ? totals.byAgeGroup[ageGroup]?.MALE.toLocaleString()
                            : "-"}
                        </TableCell>
                      ))}

                    {/* FEMALE total by age group */}
                    {(filterGender === "all" || filterGender === "FEMALE") &&
                      allAgeGroups.map((ageGroup) => (
                        <TableCell
                          key={`total-female-${ageGroup}`}
                          className={`text-center ${getAgeGroupCategoryColor(ageGroup)}`}
                        >
                          {totals.byAgeGroup[ageGroup]?.FEMALE > 0
                            ? totals.byAgeGroup[
                                ageGroup
                              ]?.FEMALE.toLocaleString()
                            : "-"}
                        </TableCell>
                      ))}

                    {/* OTHER total by age group */}
                    {(filterGender === "all" || filterGender === "OTHER") &&
                      totals.byGender.OTHER > 0 &&
                      allAgeGroups.map((ageGroup) => (
                        <TableCell
                          key={`total-other-${ageGroup}`}
                          className={`text-center ${getAgeGroupCategoryColor(ageGroup)}`}
                        >
                          {totals.byAgeGroup[ageGroup]?.OTHER > 0
                            ? totals.byAgeGroup[
                                ageGroup
                              ]?.OTHER.toLocaleString()
                            : "-"}
                        </TableCell>
                      ))}

                    <TableCell className="text-right font-medium sticky right-0 bg-gray-100 z-10">
                      {totals.grandTotal.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              उमेर समूह डाटा मेट्ने?
            </AlertDialogTitle>
            <AlertDialogDescription>
              यो कार्य पूर्ववत हुन सक्दैन। डाटा स्थायी रूपमा हटाइनेछ।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द गर्नुहोस्</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              मेट्नुहोस्
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
