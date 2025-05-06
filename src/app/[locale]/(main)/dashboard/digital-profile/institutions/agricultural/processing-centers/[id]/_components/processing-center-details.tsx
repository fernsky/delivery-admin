"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Factory,
  Warehouse,
  Thermometer,
  Droplets,
  Snowflake,
  Clock,
  BarChart3,
  Users,
  GanttChart,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Define TypeScript interface for ProcessingCenter object
interface ProcessingCenter {
  id: string;
  name: string;
  description: string | null;
  centerType: string;

  // Location details
  wardNumber: number | null;
  location: string | null;
  address: string | null;

  // Physical properties
  areaInSquareMeters: number | null;
  buildingYearConstructed: number | null;
  isOperational: boolean | null;
  operationalStatus: string | null;
  operationStartYear: number | null;

  // Storage details
  hasStorageFacility: boolean | null;
  storageType: string | null;
  storageTotalCapacityMT: number | null;
  storageCurrentUsageMT: number | null;
  temperatureControlled: boolean | null;
  temperatureRangeMin: number | null;
  temperatureRangeMax: number | null;
  humidityControlled: boolean | null;

  // Processing capabilities
  hasProcessingUnit: boolean | null;
  processingLevel: string | null;
  processingCapacityMTPerDay: number | null;
  mainProcessingActivities: string | null;
  valueAdditionActivities: string | null;

  // Products and commodities
  primaryCommodities: string | null;
  secondaryCommodities: string | null;
  seasonalAvailability: string | null;

  // Quality control
  hasQualityControlLab: boolean | null;
  qualityStandards: string | null;
  certifications: string | null;

  // Management and ownership
  ownershipType: string | null;
  ownerName: string | null;
  ownerContact: string | null;
  managerName: string | null;
  managerContact: string | null;

  // Staffing
  totalStaffCount: number | null;
  technicalStaffCount: number | null;

  // Connectivity and services
  hasElectricity: boolean | null;
  hasWaterSupply: boolean | null;
  hasWasteManagementSystem: boolean | null;
  hasInternet: boolean | null;

  // Capacity and utilization
  annualThroughputMT: number | null;
  capacityUtilizationPercent: number | null;
  recordedYear: string | null;

  // Economic impact
  employmentGenerated: number | null;
  serviceAreaRadiusKM: number | null;
  farmersServedCount: number | null;
  womenFarmersPercent: number | null;

  // Linkages to other entities
  linkedGrazingAreas: Array<{ id: string; name?: string }>;
  linkedAgricZones: Array<{ id: string; name?: string }>;
  linkedGrasslands: Array<{ id: string; name?: string }>;

  // Financial aspects
  establishmentCostNPR: number | null;
  annualOperatingCostNPR: number | null;
  annualRevenueNPR: number | null;
  profitableOperation: boolean | null;

  // Challenges and needs
  majorConstraints: string | null;
  developmentNeeds: string | null;

  // Geometry fields
  locationPoint: { type: string; coordinates: [number, number] } | null;
  facilityFootprint: {
    type: string;
    coordinates: Array<Array<[number, number]>>;
  } | null;
}

interface ProcessingCenterDetailsProps {
  processingCenter: ProcessingCenter;
}

export function ProcessingCenterDetails({
  processingCenter,
}: ProcessingCenterDetailsProps) {
  // Helper functions for displaying labels
  const getCenterTypeLabel = (type: string) => {
    const types = {
      COLLECTION_CENTER: "संकलन केन्द्र",
      STORAGE_FACILITY: "भण्डारण केन्द्र",
      PROCESSING_UNIT: "प्रशोधन इकाई",
      MULTIPURPOSE_CENTER: "बहुउद्देश्यीय केन्द्र",
      MARKET_CENTER: "बजार केन्द्र",
      COLD_STORAGE: "कोल्ड स्टोरेज",
      WAREHOUSE: "गोदाम",
      OTHER: "अन्य",
    };
    return types[type as keyof typeof types] || type;
  };

  const getStorageTypeLabel = (type: string | null) => {
    if (!type) return "उल्लेख नभएको";
    const types = {
      AMBIENT: "साधारण तापक्रम",
      COLD_STORAGE: "शीत भण्डार",
      CONTROLLED_ATMOSPHERE: "नियन्त्रित वातावरण",
      SILO: "साइलो",
      WAREHOUSE: "गोदाम",
      GRANARY: "अन्न भण्डार",
      MIXED: "मिश्रित",
      OTHER: "अन्य",
    };
    return types[type as keyof typeof types] || type;
  };

  const getProcessingLevelLabel = (level: string | null) => {
    if (!level) return "उल्लेख नभएको";
    const levels = {
      PRIMARY_PROCESSING: "प्राथमिक प्रशोधन",
      SECONDARY_PROCESSING: "द्वितीय प्रशोधन",
      TERTIARY_PROCESSING: "तृतीय प्रशोधन",
      MINIMAL_PROCESSING: "न्युनतम प्रशोधन",
      COMPREHENSIVE_PROCESSING: "व्यापक प्रशोधन",
      NOT_APPLICABLE: "लागू नहुने",
    };
    return levels[level as keyof typeof levels] || level;
  };

  const getOwnershipTypeLabel = (type: string | null) => {
    if (!type) return "उल्लेख नभएको";
    const types = {
      GOVERNMENT: "सरकारी",
      PRIVATE: "निजी",
      COOPERATIVE: "सहकारी",
      COMMUNITY: "सामुदायिक",
      PUBLIC_PRIVATE_PARTNERSHIP: "सार्वजनिक-निजी साझेदारी",
      NGO_MANAGED: "गैरसरकारी संस्था व्यवस्थित",
      MIXED: "मिश्रित",
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <div className="space-y-6">
      {/* Description Section */}
      {processingCenter.description && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">विवरण</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {processingCenter.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Basic Information */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">आधारभूत जानकारी</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                केन्द्रको प्रकार
              </h4>
              <p className="mt-1">
                <Badge variant="outline">
                  {getCenterTypeLabel(processingCenter.centerType)}
                </Badge>
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">वडा नम्बर</h4>
              <p className="mt-1">
                {processingCenter.wardNumber || "उल्लेख नभएको"}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">स्थान/टोल</h4>
              <p className="mt-1">
                {processingCenter.location || "उल्लेख नभएको"}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">ठेगाना</h4>
              <p className="mt-1">
                {processingCenter.address || "उल्लेख नभएको"}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">क्षेत्रफल</h4>
              <p className="mt-1">
                {processingCenter.areaInSquareMeters
                  ? `${processingCenter.areaInSquareMeters} वर्ग मिटर`
                  : "उल्लेख नभएको"}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">
                निर्माण वर्ष
              </h4>
              <p className="mt-1">
                {processingCenter.buildingYearConstructed || "उल्लेख नभएको"}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">
                संचालन सुरु वर्ष
              </h4>
              <p className="mt-1">
                {processingCenter.operationStartYear || "उल्लेख नभएको"}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">
                संचालन अवस्था
              </h4>
              <div className="mt-1 flex items-center gap-2">
                {processingCenter.isOperational ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>संचालनमा</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span>संचालनमा छैन</span>
                  </>
                )}
                {processingCenter.operationalStatus && (
                  <span className="ml-2 text-gray-500">
                    ({processingCenter.operationalStatus})
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage Facilities */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Warehouse className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">भण्डारण सुविधा</h3>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              {processingCenter.hasStorageFacility ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="font-medium">भण्डारण सुविधा उपलब्ध छ</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">भण्डारण सुविधा उपलब्ध छैन</span>
                </>
              )}
            </div>
          </div>

          {processingCenter.hasStorageFacility && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  भण्डारण प्रकार
                </h4>
                <p className="mt-1">
                  {getStorageTypeLabel(processingCenter.storageType)}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  जम्मा भण्डारण क्षमता
                </h4>
                <p className="mt-1">
                  {processingCenter.storageTotalCapacityMT
                    ? `${processingCenter.storageTotalCapacityMT} मेट्रिक टन`
                    : "उल्लेख नभएको"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  हालको प्रयोग
                </h4>
                <p className="mt-1">
                  {processingCenter.storageCurrentUsageMT
                    ? `${processingCenter.storageCurrentUsageMT} मेट्रिक टन`
                    : "उल्लेख नभएको"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  तापक्रम नियन्त्रण
                </h4>
                <div className="mt-1 flex items-center gap-2">
                  {processingCenter.temperatureControlled ? (
                    <>
                      <Thermometer className="h-4 w-4 text-blue-500" />
                      <span>तापक्रम नियन्त्रित छ</span>

                      {(processingCenter.temperatureRangeMin !== null ||
                        processingCenter.temperatureRangeMax !== null) && (
                        <span className="text-gray-500">
                          (
                          {processingCenter.temperatureRangeMin !== null
                            ? `${processingCenter.temperatureRangeMin}°C`
                            : ""}
                          {processingCenter.temperatureRangeMin !== null &&
                          processingCenter.temperatureRangeMax !== null
                            ? " - "
                            : ""}
                          {processingCenter.temperatureRangeMax !== null
                            ? `${processingCenter.temperatureRangeMax}°C`
                            : ""}
                          )
                        </span>
                      )}
                    </>
                  ) : (
                    <span>तापक्रम नियन्त्रण छैन</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  आद्रता नियन्त्रण
                </h4>
                <div className="mt-1 flex items-center gap-2">
                  {processingCenter.humidityControlled ? (
                    <>
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span>आद्रता नियन्त्रित छ</span>
                    </>
                  ) : (
                    <span>आद्रता नियन्त्रण छैन</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processing Capabilities */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Factory className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">प्रशोधन क्षमता</h3>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              {processingCenter.hasProcessingUnit ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="font-medium">प्रशोधन इकाई उपलब्ध छ</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">प्रशोधन इकाई उपलब्ध छैन</span>
                </>
              )}
            </div>
          </div>

          {processingCenter.hasProcessingUnit && (
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    प्रशोधन स्तर
                  </h4>
                  <p className="mt-1">
                    {getProcessingLevelLabel(processingCenter.processingLevel)}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    दैनिक प्रशोधन क्षमता
                  </h4>
                  <p className="mt-1">
                    {processingCenter.processingCapacityMTPerDay
                      ? `${processingCenter.processingCapacityMTPerDay} मेट्रिक टन प्रति दिन`
                      : "उल्लेख नभएको"}
                  </p>
                </div>
              </div>

              {processingCenter.mainProcessingActivities && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    मुख्य प्रशोधन गतिविधिहरू
                  </h4>
                  <p className="mt-1">
                    {processingCenter.mainProcessingActivities}
                  </p>
                </div>
              )}

              {processingCenter.valueAdditionActivities && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    मूल्य अभिवृद्धि गतिविधिहरू
                  </h4>
                  <p className="mt-1">
                    {processingCenter.valueAdditionActivities}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products and Commodities */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">उत्पादन र वस्तुहरू</h3>
          <div className="grid grid-cols-1 gap-6">
            {processingCenter.primaryCommodities && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  प्राथमिक उत्पादनहरू
                </h4>
                <p className="mt-1">{processingCenter.primaryCommodities}</p>
              </div>
            )}

            {processingCenter.secondaryCommodities && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  द्वितीय उत्पादनहरू
                </h4>
                <p className="mt-1">{processingCenter.secondaryCommodities}</p>
              </div>
            )}

            {processingCenter.seasonalAvailability && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  मौसमी उपलब्धता
                </h4>
                <p className="mt-1">{processingCenter.seasonalAvailability}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quality Control */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">गुणस्तर नियन्त्रण</h3>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              {processingCenter.hasQualityControlLab ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="font-medium">
                    गुणस्तर नियन्त्रण प्रयोगशाला उपलब्ध छ
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">
                    गुणस्तर नियन्त्रण प्रयोगशाला उपलब्ध छैन
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {processingCenter.qualityStandards && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  गुणस्तर मापदण्डहरू
                </h4>
                <p className="mt-1">{processingCenter.qualityStandards}</p>
              </div>
            )}

            {processingCenter.certifications && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  प्रमाणीकरण
                </h4>
                <p className="mt-1">{processingCenter.certifications}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Management and Ownership */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">व्यवस्थापन र स्वामित्व</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                स्वामित्वको प्रकार
              </h4>
              <p className="mt-1">
                {getOwnershipTypeLabel(processingCenter.ownershipType)}
              </p>
            </div>

            {processingCenter.ownerName && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  मालिकको नाम
                </h4>
                <p className="mt-1">{processingCenter.ownerName}</p>
              </div>
            )}

            {processingCenter.ownerContact && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  मालिकको सम्पर्क
                </h4>
                <p className="mt-1">{processingCenter.ownerContact}</p>
              </div>
            )}

            {processingCenter.managerName && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  व्यवस्थापकको नाम
                </h4>
                <p className="mt-1">{processingCenter.managerName}</p>
              </div>
            )}

            {processingCenter.managerContact && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  व्यवस्थापकको सम्पर्क
                </h4>
                <p className="mt-1">{processingCenter.managerContact}</p>
              </div>
            )}

            {(processingCenter.totalStaffCount !== null ||
              processingCenter.technicalStaffCount !== null) && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  कर्मचारी संख्या
                </h4>
                <p className="mt-1">
                  {processingCenter.totalStaffCount !== null
                    ? `कुल ${processingCenter.totalStaffCount} जना`
                    : ""}
                  {processingCenter.totalStaffCount !== null &&
                  processingCenter.technicalStaffCount !== null
                    ? ", "
                    : ""}
                  {processingCenter.technicalStaffCount !== null
                    ? `प्राविधिक ${processingCenter.technicalStaffCount} जना`
                    : ""}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Infrastructure and Services */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">आधारभूत सुविधाहरू</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center justify-center p-4 border rounded-md">
              <div
                className={cn(
                  "p-2 rounded-full mb-2",
                  processingCenter.hasElectricity
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400",
                )}
              >
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <span>बिजुली</span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 border rounded-md">
              <div
                className={cn(
                  "p-2 rounded-full mb-2",
                  processingCenter.hasWaterSupply
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400",
                )}
              >
                <Droplets className="h-6 w-6" />
              </div>
              <span>पानीको आपूर्ति</span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 border rounded-md">
              <div
                className={cn(
                  "p-2 rounded-full mb-2",
                  processingCenter.hasWasteManagementSystem
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400",
                )}
              >
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <span>फोहोर व्यवस्थापन</span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 border rounded-md">
              <div
                className={cn(
                  "p-2 rounded-full mb-2",
                  processingCenter.hasInternet
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400",
                )}
              >
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <span>इन्टरनेट सुविधा</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Capacity and Economic Impact */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">क्षमता र आर्थिक प्रभाव</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processingCenter.annualThroughputMT !== null && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  वार्षिक थ्रुपुट
                </h4>
                <p className="mt-1">
                  {processingCenter.annualThroughputMT} मेट्रिक टन
                </p>
              </div>
            )}

            {processingCenter.capacityUtilizationPercent !== null && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  क्षमता उपयोग
                </h4>
                <p className="mt-1">
                  {processingCenter.capacityUtilizationPercent}%
                </p>
              </div>
            )}

            {processingCenter.recordedYear && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  अभिलेखित वर्ष
                </h4>
                <p className="mt-1">{processingCenter.recordedYear}</p>
              </div>
            )}

            {processingCenter.employmentGenerated !== null && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  रोजगारी सिर्जना
                </h4>
                <p className="mt-1">
                  {processingCenter.employmentGenerated} जना
                </p>
              </div>
            )}

            {processingCenter.serviceAreaRadiusKM !== null && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  सेवा क्षेत्र त्रिज्या
                </h4>
                <p className="mt-1">
                  {processingCenter.serviceAreaRadiusKM} कि.मि.
                </p>
              </div>
            )}

            {processingCenter.farmersServedCount !== null && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  सेवित किसान संख्या
                </h4>
                <p className="mt-1">
                  {processingCenter.farmersServedCount} जना
                </p>
                {processingCenter.womenFarmersPercent !== null && (
                  <p className="text-xs text-gray-500">
                    महिला किसान: {processingCenter.womenFarmersPercent}%
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      {(processingCenter.establishmentCostNPR !== null ||
        processingCenter.annualOperatingCostNPR !== null ||
        processingCenter.annualRevenueNPR !== null) && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">वित्तीय जानकारी</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {processingCenter.establishmentCostNPR !== null && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    स्थापना लागत
                  </h4>
                  <p className="mt-1">
                    रु. {processingCenter.establishmentCostNPR.toLocaleString()}
                  </p>
                </div>
              )}

              {processingCenter.annualOperatingCostNPR !== null && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    वार्षिक संचालन खर्च
                  </h4>
                  <p className="mt-1">
                    रु.{" "}
                    {processingCenter.annualOperatingCostNPR.toLocaleString()}
                  </p>
                </div>
              )}

              {processingCenter.annualRevenueNPR !== null && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    वार्षिक राजश्व
                  </h4>
                  <p className="mt-1">
                    रु. {processingCenter.annualRevenueNPR.toLocaleString()}
                  </p>
                </div>
              )}

              {processingCenter.profitableOperation !== null && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    नाफामूलक संचालन
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    {processingCenter.profitableOperation ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>हो</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span>होइन</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Challenges and Needs */}
      {(processingCenter.majorConstraints ||
        processingCenter.developmentNeeds) && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg font-semibold">चुनौती र आवश्यकता</h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {processingCenter.majorConstraints && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    प्रमुख बाधाहरू
                  </h4>
                  <p className="mt-1 whitespace-pre-line">
                    {processingCenter.majorConstraints}
                  </p>
                </div>
              )}

              {processingCenter.developmentNeeds && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    विकास आवश्यकताहरू
                  </h4>
                  <p className="mt-1 whitespace-pre-line">
                    {processingCenter.developmentNeeds}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SEO Fields (Admin-only view) */}
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            SEO जानकारी (प्रशासकीय दृश्य)
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {processingCenter.metaTitle && (
              <div>
                <h4 className="text-xs font-medium uppercase text-gray-500">
                  Meta Title
                </h4>
                <p className="mt-1">{processingCenter.metaTitle}</p>
              </div>
            )}

            {processingCenter.metaDescription && (
              <div>
                <h4 className="text-xs font-medium uppercase text-gray-500">
                  Meta Description
                </h4>
                <p className="mt-1">{processingCenter.metaDescription}</p>
              </div>
            )}

            {processingCenter.keywords && (
              <div>
                <h4 className="text-xs font-medium uppercase text-gray-500">
                  Keywords
                </h4>
                <p className="mt-1">{processingCenter.keywords}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
