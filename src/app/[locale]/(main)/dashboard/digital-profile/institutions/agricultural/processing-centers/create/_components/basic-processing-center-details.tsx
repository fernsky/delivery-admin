"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

// Processing center types data
const centerTypes = [
  { value: "COLLECTION_CENTER", label: "संकलन केन्द्र" },
  { value: "STORAGE_FACILITY", label: "भण्डारण केन्द्र" },
  { value: "PROCESSING_UNIT", label: "प्रशोधन इकाई" },
  { value: "MULTIPURPOSE_CENTER", label: "बहुउद्देश्यीय केन्द्र" },
  { value: "MARKET_CENTER", label: "बजार केन्द्र" },
  { value: "COLD_STORAGE", label: "कोल्ड स्टोरेज" },
  { value: "WAREHOUSE", label: "गोदाम" },
  { value: "OTHER", label: "अन्य" },
];

// Ownership types
const ownershipTypes = [
  { value: "GOVERNMENT", label: "सरकारी" },
  { value: "PRIVATE", label: "निजी" },
  { value: "COOPERATIVE", label: "सहकारी" },
  { value: "COMMUNITY", label: "सामुदायिक" },
  { value: "PUBLIC_PRIVATE_PARTNERSHIP", label: "सार्वजनिक-निजी साझेदारी" },
  { value: "NGO_MANAGED", label: "गैरसरकारी संस्था व्यवस्थित" },
  { value: "MIXED", label: "मिश्रित" },
];

interface BasicProcessingCenterDetailsProps {
  form: UseFormReturn<any>;
}

export function BasicProcessingCenterDetails({
  form,
}: BasicProcessingCenterDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>प्रशोधन केन्द्रको नाम</FormLabel>
              <FormControl>
                <Input
                  placeholder="प्रशोधन केन्द्रको नाम लेख्नुहोस्"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="centerType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>प्रशोधन केन्द्रको प्रकार</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="प्रशोधन केन्द्रको प्रकार छान्नुहोस्" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {centerTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>विवरण</FormLabel>
            <FormControl>
              <Textarea
                placeholder="प्रशोधन केन्द्रको विवरण लेख्नुहोस्"
                {...field}
                rows={5}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="wardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>वडा नं</FormLabel>
              <FormControl>
                <Input type="number" placeholder="वडा नम्बर" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ठाउँ/टोल</FormLabel>
              <FormControl>
                <Input placeholder="ठाउँ/टोलको नाम" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ठेगाना</FormLabel>
              <FormControl>
                <Input placeholder="पूर्ण ठेगाना" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="areaInSquareMeters"
          render={({ field }) => (
            <FormItem>
              <FormLabel>क्षेत्रफल (वर्ग मिटरमा)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="वर्ग मिटरमा क्षेत्रफल"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="buildingYearConstructed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>निर्माण वर्ष</FormLabel>
              <FormControl>
                <Input placeholder="निर्माण वर्ष" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="operationStartYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>संचालन सुरु वर्ष</FormLabel>
              <FormControl>
                <Input placeholder="संचालन सुरु वर्ष" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="isOperational"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>संचालनमा छ</FormLabel>
                <FormDescription>
                  प्रशोधन केन्द्र हाल संचालनमा छ
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="operationalStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>संचालन अवस्था</FormLabel>
              <FormControl>
                <Input
                  placeholder="उदाहरण: पूर्ण संचालनमा, मर्मत अधीन..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                केन्द्रको वर्तमान संचालन अवस्थाको विवरण
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="text-lg font-medium mt-8">व्यवस्थापकीय विवरण</div>

      <FormField
        control={form.control}
        name="ownershipType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>स्वामित्वको प्रकार</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="स्वामित्वको प्रकार छान्नुहोस्" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {ownershipTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="ownerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>मालिकको नाम</FormLabel>
              <FormControl>
                <Input placeholder="मालिकको नाम" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ownerContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>मालिकको सम्पर्क</FormLabel>
              <FormControl>
                <Input placeholder="मालिकको सम्पर्क नम्बर" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="managerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>व्यवस्थापकको नाम</FormLabel>
              <FormControl>
                <Input placeholder="व्यवस्थापकको नाम" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="managerContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>व्यवस्थापकको सम्पर्क</FormLabel>
              <FormControl>
                <Input placeholder="व्यवस्थापकको सम्पर्क नम्बर" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="totalStaffCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>कुल कर्मचारी संख्या</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="कुल कर्मचारी संख्या"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="technicalStaffCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>प्राविधिक कर्मचारी संख्या</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="प्राविधिक कर्मचारी संख्या"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
