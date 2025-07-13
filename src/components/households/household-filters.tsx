"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { X, Filter, Calendar } from "lucide-react";
import { familyChoices } from "@/constants/family-choices";

interface HouseholdFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

export function HouseholdFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: HouseholdFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: string, value: any) => {
    console.log(`🔧 Filter Update - Key: ${key}, Value:`, value);
    const newFilters = { ...filters };
    if (value === "" || value === null || value === undefined) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    console.log(`🔧 Complete filters object after update:`, newFilters);
    onFiltersChange(newFilters);
  };

  const getActiveFilterCount = () => {
    return Object.keys(filters).filter(
      (key) =>
        filters[key] !== "" &&
        filters[key] !== null &&
        filters[key] !== undefined,
    ).length;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <>
      {/* Filter Button */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          फिल्टर
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-1" />
            सफा गर्नुहोस्
          </Button>
        )}
      </div>

      {/* Custom Filter Sidebar */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg z-50 overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">फिल्टरहरू</h2>
                  <p className="text-sm text-muted-foreground">
                    घरधुरीहरू फिल्टर गर्नुहोस्
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Filter Sections */}
              <Accordion type="multiple" className="space-y-4">
                {/* Basic Information */}
                <AccordionItem value="basic-info">
                  <AccordionTrigger className="text-sm font-medium">
                    मूल जानकारी
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="wardNo">वडा नं.</Label>
                      <Select
                        value={filters.wardNo?.toString() || ""}
                        onValueChange={(value) =>
                          updateFilter("wardNo", value ? parseInt(value) : null)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै वडा" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै वडा</SelectItem>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                            (ward) => (
                              <SelectItem key={ward} value={ward.toString()}>
                                वडा {ward}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="familyHeadName">परिवार मूलीको नाम</Label>
                      <Input
                        id="familyHeadName"
                        placeholder="नाम खोज्नुहोस्"
                        value={filters.familyHeadName || ""}
                        onChange={(e) =>
                          updateFilter("familyHeadName", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="familyHeadPhoneNo">फोन नम्बर</Label>
                      <Input
                        id="familyHeadPhoneNo"
                        placeholder="फोन नम्बर"
                        value={filters.familyHeadPhoneNo || ""}
                        onChange={(e) =>
                          updateFilter("familyHeadPhoneNo", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="locality">स्थानीयता</Label>
                      <Input
                        id="locality"
                        placeholder="स्थानीयता"
                        value={filters.locality || ""}
                        onChange={(e) =>
                          updateFilter("locality", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="houseSymbolNo">घर चिह्न नं.</Label>
                      <Input
                        id="houseSymbolNo"
                        placeholder="घर चिह्न नं."
                        value={filters.houseSymbolNo || ""}
                        onChange={(e) =>
                          updateFilter("houseSymbolNo", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="familySymbolNo">परिवार चिह्न नं.</Label>
                      <Input
                        id="familySymbolNo"
                        placeholder="परिवार चिह्न नं."
                        value={filters.familySymbolNo || ""}
                        onChange={(e) =>
                          updateFilter("familySymbolNo", e.target.value)
                        }
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Family Information */}
                <AccordionItem value="family-info">
                  <AccordionTrigger className="text-sm font-medium">
                    परिवार जानकारी
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="totalMembersMin">
                        कुल सदस्य संख्या (न्यूनतम)
                      </Label>
                      <Input
                        id="totalMembersMin"
                        type="number"
                        placeholder="न्यूनतम संख्या"
                        value={filters.totalMembersMin || ""}
                        onChange={(e) =>
                          updateFilter(
                            "totalMembersMin",
                            e.target.value ? parseInt(e.target.value) : null,
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="totalMembersMax">
                        कुल सदस्य संख्या (अधिकतम)
                      </Label>
                      <Input
                        id="totalMembersMax"
                        type="number"
                        placeholder="अधिकतम संख्या"
                        value={filters.totalMembersMax || ""}
                        onChange={(e) =>
                          updateFilter(
                            "totalMembersMax",
                            e.target.value ? parseInt(e.target.value) : null,
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="areMembersElsewhere">
                        अन्यत्र सदस्यहरू
                      </Label>
                      <Select
                        value={filters.areMembersElsewhere || ""}
                        onValueChange={(value) =>
                          updateFilter("areMembersElsewhere", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          <SelectItem value="छ">छन्</SelectItem>
                          <SelectItem value="छैन">छैनन्</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="totalElsewhereMembersMin">
                        अन्यत्र सदस्य संख्या (न्यूनतम)
                      </Label>
                      <Input
                        id="totalElsewhereMembersMin"
                        type="number"
                        placeholder="न्यूनतम संख्या"
                        value={filters.totalElsewhereMembersMin || ""}
                        onChange={(e) =>
                          updateFilter(
                            "totalElsewhereMembersMin",
                            e.target.value ? parseInt(e.target.value) : null,
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="totalElsewhereMembersMax">
                        अन्यत्र सदस्य संख्या (अधिकतम)
                      </Label>
                      <Input
                        id="totalElsewhereMembersMax"
                        type="number"
                        placeholder="अधिकतम संख्या"
                        value={filters.totalElsewhereMembersMax || ""}
                        onChange={(e) =>
                          updateFilter(
                            "totalElsewhereMembersMax",
                            e.target.value ? parseInt(e.target.value) : null,
                          )
                        }
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* House Details */}
                <AccordionItem value="house-details">
                  <AccordionTrigger className="text-sm font-medium">
                    घर विवरण
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="houseOwnership">घर स्वामित्व</Label>
                      <Select
                        value={filters.houseOwnership || ""}
                        onValueChange={(value) =>
                          updateFilter("houseOwnership", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          {Object.entries(
                            familyChoices.house_ownership || {},
                          ).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="landOwnership">जग्गा स्वामित्व</Label>
                      <Select
                        value={filters.landOwnership || ""}
                        onValueChange={(value) =>
                          updateFilter("landOwnership", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          {Object.entries(
                            familyChoices.land_ownership || {},
                          ).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="houseBase">घरको आधार</Label>
                      <Select
                        value={filters.houseBase || ""}
                        onValueChange={(value) =>
                          updateFilter("houseBase", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          {Object.entries(familyChoices.house_base || {}).map(
                            ([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="houseOuterWall">घरको बाहिरी भित्ता</Label>
                      <Select
                        value={filters.houseOuterWall || ""}
                        onValueChange={(value) =>
                          updateFilter("houseOuterWall", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          {Object.entries(
                            familyChoices.house_outer_wall || {},
                          ).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="houseRoof">घरको छाना</Label>
                      <Select
                        value={filters.houseRoof || ""}
                        onValueChange={(value) =>
                          updateFilter("houseRoof", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          {Object.entries(familyChoices.house_roof || {}).map(
                            ([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="houseFloor">घरको भुइँ</Label>
                      <Select
                        value={filters.houseFloor || ""}
                        onValueChange={(value) =>
                          updateFilter("houseFloor", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          {Object.entries(familyChoices.house_floor || {}).map(
                            ([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="toiletType">शौचालयको प्रकार</Label>
                      <Select
                        value={filters.toiletType || ""}
                        onValueChange={(value) =>
                          updateFilter("toiletType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          {Object.entries(familyChoices.toilet_type || {}).map(
                            ([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="waterSource">पिउने पानीको स्रोत</Label>
                      <Select
                        value={filters.waterSource || ""}
                        onValueChange={(value) =>
                          updateFilter("waterSource", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          {Object.entries(
                            familyChoices.drinking_water_source || {},
                          ).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="primaryCookingFuel">
                        खाना पकाउने इन्धन
                      </Label>
                      <Select
                        value={filters.primaryCookingFuel || ""}
                        onValueChange={(value) =>
                          updateFilter("primaryCookingFuel", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          {Object.entries(familyChoices.cooking_fuel || {}).map(
                            ([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="primaryEnergySource">उर्जा स्रोत</Label>
                      <Select
                        value={filters.primaryEnergySource || ""}
                        onValueChange={(value) =>
                          updateFilter("primaryEnergySource", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          {Object.entries(
                            familyChoices.energy_source || {},
                          ).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Agricultural Information */}
                <AccordionItem value="agricultural-info">
                  <AccordionTrigger className="text-sm font-medium">
                    कृषि जानकारी
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="haveAgriculturalLand">
                        कृषि जग्गा छ कि छैन
                      </Label>
                      <Select
                        value={filters.haveAgriculturalLand || ""}
                        onValueChange={(value) =>
                          updateFilter("haveAgriculturalLand", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          {Object.entries(familyChoices.true_false || {}).map(
                            ([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* <div>
                      <Label htmlFor="areInvolvedInAgriculture">
                        कृषि कार्यमा संलग्न
                      </Label>
                      <Select
                        value={filters.areInvolvedInAgriculture || ""}
                        onValueChange={(value) =>
                          updateFilter("areInvolvedInAgriculture", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          {Object.entries(
                            familyChoices.agri_business || {},
                          ).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div> */}

                    {/* <div>
                      <Label htmlFor="hasAgriculturalInsurance">
                        कृषि बिमा
                      </Label>
                      <Select
                        value={filters.hasAgriculturalInsurance || ""}
                        onValueChange={(value) =>
                          updateFilter("hasAgriculturalInsurance", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          {Object.entries(familyChoices.true_false || {}).map(
                            ([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div> */}

                    <div>
                      <Label htmlFor="areInvolvedInHusbandry">पशुपालन</Label>
                      <Select
                        value={filters.areInvolvedInHusbandry || ""}
                        onValueChange={(value) =>
                          updateFilter("areInvolvedInHusbandry", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          {Object.entries(familyChoices.true_false || {}).map(
                            ([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="haveAquaculture">माछापालन</Label>
                      <Select
                        value={filters.haveAquaculture || ""}
                        onValueChange={(value) =>
                          updateFilter("haveAquaculture", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          {Object.entries(familyChoices.true_false || {}).map(
                            ([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="haveApiary">मौरीपालन</Label>
                      <Select
                        value={filters.haveApiary || ""}
                        onValueChange={(value) =>
                          updateFilter("haveApiary", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          {Object.entries(familyChoices.true_false || {}).map(
                            ([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Economic Information */}
                <AccordionItem value="economic-info">
                  <AccordionTrigger className="text-sm font-medium">
                    आर्थिक जानकारी
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    {/* <div>
                      <Label htmlFor="hasPropertiesElsewhere">
                        अन्यत्र सम्पत्ति
                      </Label>
                      <Select
                        value={filters.hasPropertiesElsewhere || ""}
                        onValueChange={(value) =>
                          updateFilter("hasPropertiesElsewhere", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          {Object.entries(familyChoices.true_false || {}).map(
                            ([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div> */}

                    {/* <div>
                      <Label htmlFor="hasFemaleNamedProperties">
                        महिला नाममा सम्पत्ति
                      </Label>
                      <Select
                        value={filters.hasFemaleNamedProperties || ""}
                        onValueChange={(value) =>
                          updateFilter("hasFemaleNamedProperties", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          {Object.entries(familyChoices.true_false || {}).map(
                            ([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div> */}

                    <div>
                      <Label htmlFor="timeToBank">बैंक पुग्न लाग्ने समय</Label>
                      <Select
                        value={filters.timeToBank || ""}
                        onValueChange={(value) =>
                          updateFilter("timeToBank", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          {Object.entries(familyChoices.time || {}).map(
                            ([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* <div>
                      <Label htmlFor="haveRemittance">रिमिटेन्स</Label>
                      <Select
                        value={filters.haveRemittance || ""}
                        onValueChange={(value) =>
                          updateFilter("haveRemittance", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          {Object.entries(familyChoices.true_false || {}).map(
                            ([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div> */}

                    {/* <div>
                      <Label htmlFor="hasBusiness">व्यवसाय</Label>
                      <Select
                        value={filters.hasBusiness || ""}
                        onValueChange={(value) =>
                          updateFilter("hasBusiness", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          {Object.entries(familyChoices.true_false || {}).map(
                            ([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div> */}

                    <div>
                      <Label htmlFor="haveHealthInsurance">
                        स्वास्थ्य बिमा
                      </Label>
                      <Select
                        value={filters.haveHealthInsurance || ""}
                        onValueChange={(value) =>
                          updateFilter("haveHealthInsurance", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          {Object.entries(familyChoices.true_false || {}).map(
                            ([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="consultingHealthOrganization">
                        स्वास्थ्य संस्था
                      </Label>
                      <Select
                        value={filters.consultingHealthOrganization || ""}
                        onValueChange={(value) =>
                          updateFilter("consultingHealthOrganization", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          {Object.entries(
                            familyChoices.health_organization || {},
                          ).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="timeToHealthOrganization">
                        स्वास्थ्य संस्था पुग्न लाग्ने समय
                      </Label>
                      <Select
                        value={filters.timeToHealthOrganization || ""}
                        onValueChange={(value) =>
                          updateFilter("timeToHealthOrganization", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="सबै" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">सबै</SelectItem>
                          {Object.entries(familyChoices.time || {}).map(
                            ([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-6 pt-4 border-t">
                <Button onClick={() => setIsOpen(false)} className="flex-1">
                  लागू गर्नुहोस्
                </Button>
                <Button variant="outline" onClick={onClearFilters}>
                  सफा गर्नुहोस्
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
