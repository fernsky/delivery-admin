"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react"; // Updated API import
import { ContentLayout } from "@/components/admin-panel/content-layout"; // Replaced with ContentLayout
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Edit, Trash2, Plus, Search, Loader } from "lucide-react";
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
import { toast } from "sonner";

export default function LocalAreasPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all"); // Use "all" as default instead of empty string
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Get locations data
  const {
    data: locations,
    isLoading,
    refetch,
  } = api.profile.localAreas.locations.getAll.useQuery({
    name: searchTerm || undefined,
    type: typeFilter && typeFilter !== "all" ? typeFilter : undefined, // Only send type filter if not "all"
  });

  // Delete mutation
  const { mutate: deleteLocation, isLoading: isDeleting } =
    api.profile.localAreas.locations.delete.useMutation({
      onSuccess: () => {
        toast.success("स्थान सफलतापूर्वक हटाइयो");
        refetch();
        setIsDeleteDialogOpen(false);
        setLocationToDelete(null);
      },
      onError: (error) => {
        toast.error(`स्थान हटाउन असफल: ${error.message}`);
      },
    });

  // Location types
  const locationTypes = [
    { value: "VILLAGE", label: "गाउँ" },
    { value: "SETTLEMENT", label: "बस्ती" },
    { value: "TOLE", label: "टोल" },
    { value: "WARD", label: "वडा" },
    { value: "SQUATTER_AREA", label: "सुकुम्बासी क्षेत्र" },
  ];

  const handleDeleteClick = (location: { id: string; name: string }) => {
    setLocationToDelete(location);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (locationToDelete) {
      deleteLocation(locationToDelete.id);
    }
  };

  return (
    <ContentLayout
      title="स्थानीय क्षेत्रहरू"
      actions={
        <Link href="/digital-profile/institutions/local-areas/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> नयाँ स्थान
          </Button>
        </Link>
      }
    >
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="स्थानको नाम खोज्नुहोस्..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={typeFilter}
              onValueChange={(value) => setTypeFilter(value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="सबै प्रकार" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सबै प्रकार</SelectItem>
                {locationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>नाम</TableHead>
                <TableHead>प्रकार</TableHead>
                <TableHead>विशेषताहरू</TableHead>
                <TableHead className="w-36 text-right">कार्यहरू</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex justify-center">
                      <Loader className="h-6 w-6 animate-spin text-primary" />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      डाटा लोड हुँदैछ...
                    </p>
                  </TableCell>
                </TableRow>
              ) : locations && locations.length > 0 ? (
                locations.map((location) => {
                  const locationType = locationTypes.find(
                    (t) => t.value === location.type,
                  );

                  return (
                    <TableRow key={location.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-start">
                          {location.primaryMedia && (
                            <div className="mr-3 flex-shrink-0">
                              <img
                                src={location.primaryMedia.url}
                                alt={location.name}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            </div>
                          )}
                          <div>
                            {location.name}
                            {location.pointGeometry && (
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>
                                  {location.pointGeometry.coordinates.join(
                                    ", ",
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {locationType?.label || location.type}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {location.isNewSettlement && (
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                              नयाँ बस्ती
                            </span>
                          )}
                          {location.isTownPlanned && (
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                              नियोजित शहरी क्षेत्र
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              router.push(
                                `/digital-profile/institutions/local-areas/edit/${location.id}`,
                              )
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleDeleteClick({
                                id: location.id,
                                name: location.name,
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <p className="text-muted-foreground">
                      कुनै पनि स्थान फेला परेन
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>के तपाईं निश्चित हुनुहुन्छ?</AlertDialogTitle>
            <AlertDialogDescription>
              स्थान &quot;{locationToDelete?.name}&quot; हटाउने। यो कार्य
              पूर्ववत हुन सक्दैन।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द गर्नुहोस्</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              हटाउनुहोस्
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ContentLayout>
  );
}
