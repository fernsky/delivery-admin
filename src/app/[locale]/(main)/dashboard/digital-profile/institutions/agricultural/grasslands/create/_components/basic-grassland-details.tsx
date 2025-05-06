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

// Grassland types data
const grasslandTypes = [
  { value: "NATURAL_MEADOW", label: "प्राकृतिक घाँसे मैदान" },
  { value: "IMPROVED_PASTURE", label: "सुधारिएको चरन क्षेत्र" },
  { value: "RANGELAND", label: "रेञ्जल्याण्ड" },
  { value: "SILVOPASTURE", label: "वन चरन (रूख र घाँस मिश्रित)" },
  { value: "WETLAND_GRAZING", label: "सिमसार चरन क्षेत्र" },
  { value: "ALPINE_GRASSLAND", label: "हिमाली घाँसे मैदान" },
  { value: "COMMON_GRAZING_LAND", label: "सामुदायिक चरन क्षेत्र" },
  { value: "OTHER", label: "अन्य" },
];

// Vegetation density options
const vegetationDensityOptions = [
  { value: "VERY_DENSE", label: "अति घना" },
  { value: "DENSE", label: "घना" },
  { value: "MODERATE", label: "मध्यम" },
  { value: "SPARSE", label: "पातलो" },
  { value: "VERY_SPARSE", label: "अति पातलो" },
];

interface BasicGrasslandDetailsProps {
  form: UseFormReturn<any>;
}

export function BasicGrasslandDetails({ form }: BasicGrasslandDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>चरन क्षेत्रको नाम</FormLabel>
              <FormControl>
                <Input placeholder="चरन क्षेत्रको नाम लेख्नुहोस्" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>चरन क्षेत्रको प्रकार</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="चरन क्षेत्रको प्रकार छान्नुहोस्" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {grasslandTypes.map((type) => (
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
                placeholder="चरन क्षेत्रको विवरण लेख्नुहोस्"
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
          name="areaInHectares"
          render={({ field }) => (
            <FormItem>
              <FormLabel>क्षेत्रफल (हेक्टरमा)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="हेक्टरमा क्षेत्रफल"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="elevationInMeters"
          render={({ field }) => (
            <FormItem>
              <FormLabel>उचाई (मिटरमा)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="मिटरमा समुद्री सतहबाट उचाई"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vegetationDensity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>वनस्पति घनत्व</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="घनत्व छान्नुहोस्" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vegetationDensityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
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
        name="isGovernmentOwned"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>सरकारी स्वामित्व</FormLabel>
              <FormDescription>
                यो क्षेत्र सरकारी स्वामित्वमा छ?
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      <div className="text-lg font-medium mt-8">स्वामित्व/सम्पर्क विवरण</div>

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
              <FormLabel>मालिकको सम्पर्क नम्बर</FormLabel>
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
          name="caretakerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>हेरचाहकर्ताको नाम</FormLabel>
              <FormControl>
                <Input placeholder="हेरचाहकर्ताको नाम" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="caretakerContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>हेरचाहकर्ताको सम्पर्क</FormLabel>
              <FormControl>
                <Input placeholder="हेरचाहकर्ताको सम्पर्क नम्बर" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
