"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Check,
  ChevronDownIcon,
  Filter,
  Search,
  X,
  Building,
  Package,
  Factory,
  Users,
  MapPin,
  Warehouse,
  Flask,
  Activity,
  Banana,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FiltersProps {
  centerTypeOptions: { value: string; label: string }[];
  storageTypeOptions: { value: string; label: string }[];
  processingLevelOptions: { value: string; label: string }[];
  ownershipTypeOptions: { value: string; label: string }[];
  initialFilters: {
    centerType?: string;
    storageType?: string;
    processingLevel?: string;
    ownershipType?: string;
    wardNumber?: number;
    searchTerm?: string;
    hasStorageFacility?: boolean;
    hasProcessingUnit?: boolean;
    hasQualityControlLab?: boolean;
    isOperational?: boolean;
    primaryCommodity?: string;
  };
  onFilterChange: (filters: Record<string, any>) => void;
}

export function Filters({
  centerTypeOptions,
  storageTypeOptions,
  processingLevelOptions,
  ownershipTypeOptions,
  initialFilters,
  onFilterChange,
}: FiltersProps) {
  // State for internal filter handling
  const [filters, setFilters] = useState({
    centerType: initialFilters.centerType || "",
    storageType: initialFilters.storageType || "",
    processingLevel: initialFilters.processingLevel || "",
    ownershipType: initialFilters.ownershipType || "",
    wardNumber: initialFilters.wardNumber || "",
    searchTerm: initialFilters.searchTerm || "",
    hasStorageFacility: initialFilters.hasStorageFacility || false,
    hasProcessingUnit: initialFilters.hasProcessingUnit || false,
    hasQualityControlLab: initialFilters.hasQualityControlLab || false,
    isOperational: initialFilters.isOperational || false,
    primaryCommodity: initialFilters.primaryCommodity || "",
  });

  // State for popover open/close
  const [open, setOpen] = useState(false);

  // Count active filters
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (typeof value === "boolean") {
      return value;
    }
    return value !== "" && value !== undefined;
  }).length;

  // Handler for filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    // Convert ward number to number
    const processedFilters = {
      ...filters,
      wardNumber: filters.wardNumber
        ? parseInt(filters.wardNumber.toString())
        : undefined,
    };
    onFilterChange(processedFilters);
    setOpen(false);
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = {
      centerType: "",
      storageType: "",
      processingLevel: "",
      ownershipType: "",
      wardNumber: "",
      searchTerm: "",
      hasStorageFacility: false,
      hasProcessingUnit: false,
      hasQualityControlLab: false,
      isOperational: false,
      primaryCommodity: "",
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  // Handle search directly
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setFilters((prev) => ({ ...prev, searchTerm }));

    // Use a simple debounce for search
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    window.searchTimeout = setTimeout(() => {
      onFilterChange({ ...filters, searchTerm });
    }, 500);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="खोज्नुहोस्..."
          className="pl-8 w-[200px] md:w-[260px]"
          value={filters.searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Filter popover */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            फिल्टरहरू
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 rounded-full px-1 text-xs"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[340px] p-0" align="end">
          <div className="flex items-center justify-between border-b p-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="font-medium">फिल्टरहरू</span>
              {activeFilterCount > 0 && (
                <Badge
                  variant="secondary"
                  className="rounded-full px-1 text-xs"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </div>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                className="h-8 px-2 text-xs"
                onClick={clearFilters}
              >
                सबै हटाउनुहोस्
                <X className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>

          <Command>
            <CommandList>
              <CommandGroup heading="केन्द्रको प्रकार">
                <div className="p-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={filters.centerType}
                      onChange={(e) =>
                        handleFilterChange("centerType", e.target.value)
                      }
                    >
                      <option value="">सबै प्रकारहरू</option>
                      {centerTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CommandGroup>
              <CommandSeparator />

              <CommandGroup heading="सुविधा फिल्टरहरू">
                <div className="p-2 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="hasStorage"
                      checked={filters.hasStorageFacility}
                      onCheckedChange={(value) =>
                        handleFilterChange("hasStorageFacility", value)
                      }
                    />
                    <Label
                      htmlFor="hasStorage"
                      className="flex items-center gap-2"
                    >
                      <Warehouse className="h-4 w-4" />
                      <span>भण्डारण सुविधा</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="hasProcessing"
                      checked={filters.hasProcessingUnit}
                      onCheckedChange={(value) =>
                        handleFilterChange("hasProcessingUnit", value)
                      }
                    />
                    <Label
                      htmlFor="hasProcessing"
                      className="flex items-center gap-2"
                    >
                      <Factory className="h-4 w-4" />
                      <span>प्रशोधन इकाई</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="hasQualityLab"
                      checked={filters.hasQualityControlLab}
                      onCheckedChange={(value) =>
                        handleFilterChange("hasQualityControlLab", value)
                      }
                    />
                    <Label
                      htmlFor="hasQualityLab"
                      className="flex items-center gap-2"
                    >
                      <Flask className="h-4 w-4" />
                      <span>गुणस्तर नियन्त्रण प्रयोगशाला</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isOperational"
                      checked={filters.isOperational}
                      onCheckedChange={(value) =>
                        handleFilterChange("isOperational", value)
                      }
                    />
                    <Label
                      htmlFor="isOperational"
                      className="flex items-center gap-2"
                    >
                      <Activity className="h-4 w-4" />
                      <span>संचालनमा रहेको</span>
                    </Label>
                  </div>
                </div>
              </CommandGroup>
              <CommandSeparator />

              <CommandGroup heading="थप फिल्टरहरू">
                <div className="p-2 space-y-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={filters.storageType}
                      onChange={(e) =>
                        handleFilterChange("storageType", e.target.value)
                      }
                    >
                      <option value="">भण्डारणको प्रकार</option>
                      {storageTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Factory className="h-4 w-4 text-muted-foreground" />
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={filters.processingLevel}
                      onChange={(e) =>
                        handleFilterChange("processingLevel", e.target.value)
                      }
                    >
                      <option value="">प्रशोधन स्तर</option>
                      {processingLevelOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={filters.ownershipType}
                      onChange={(e) =>
                        handleFilterChange("ownershipType", e.target.value)
                      }
                    >
                      <option value="">स्वामित्वको प्रकार</option>
                      {ownershipTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="वडा नम्बर"
                      className="h-9"
                      value={filters.wardNumber}
                      onChange={(e) =>
                        handleFilterChange("wardNumber", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Banana className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="प्राथमिक वस्तु (उदाहरण: धान, मकै)"
                      className="h-9"
                      value={filters.primaryCommodity}
                      onChange={(e) =>
                        handleFilterChange("primaryCommodity", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CommandGroup>
            </CommandList>

            <div className="flex items-center justify-between border-t p-3">
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                रद्द गर्नुहोस्
              </Button>
              <Button size="sm" onClick={applyFilters}>
                फिल्टर लागू गर्नुहोस्
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
