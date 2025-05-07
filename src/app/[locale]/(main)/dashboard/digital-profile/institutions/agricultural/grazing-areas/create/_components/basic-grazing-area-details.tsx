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

// Grazing area types data
const grazingAreaTypes = [
  { value: "OPEN_RANGE", label: "खुल्ला चरन क्षेत्र" },
  { value: "ALPINE_MEADOW", label: "हिमाली घाँसे मैदान" },
  { value: "COMMUNITY_PASTURE", label: "सामुदायिक चरन" },
  { value: "FOREST_UNDERSTORY", label: "वन मुनिको चरन क्षेत्र" },
  { value: "FLOODPLAIN", label: "बाढी मैदान चरन" },
  { value: "SEASONAL_PASTURE", label: "मौसमी चरन" },
  { value: "DRY_SEASON_RESERVE", label: "सुख्खा मौसम आरक्षित क्षेत्र" },
  { value: "ROTATIONAL_PADDOCK", label: "चक्रीय खर्क" },
  { value: "MIXED", label: "मिश्रित" },
  { value: "OTHER", label: "अन्य" },
];

// Terrain types options
const terrainTypes = [
  { value: "FLAT", label: "समतल" },
  { value: "ROLLING", label: "घुम्ने/ओर्लोचढाइ" },
  { value: "HILLY", label: "पहाडी" },
  { value: "MOUNTAINOUS", label: "हिमाली" },
  { value: "VALLEY", label: "उपत्यका" },
  { value: "RIVERINE", label: "नदी किनार" },
  { value: "MIXED", label: "मिश्रित" },
];

// Accessibility options
const accessibilityOptions = [
  { value: "EASILY_ACCESSIBLE", label: "सजिलै पहुँच योग्य" },
  { value: "MODERATELY_ACCESSIBLE", label: "मध्यम पहुँच योग्य" },
  { value: "DIFFICULT_ACCESS", label: "कठिन पहुँच" },
  { value: "SEASONAL_ACCESS", label: "मौसमी पहुँच" },
  { value: "REMOTE", label: "दुर्गम" },
];

interface BasicGrazingAreaDetailsProps {
  form: UseFormReturn<any>;
}

export function BasicGrazingAreaDetails({
  form,
}: BasicGrazingAreaDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>चरन खर्क क्षेत्रको नाम</FormLabel>
              <FormControl>
                <Input
                  placeholder="चरन खर्क क्षेत्रको नाम लेख्नुहोस्"
                  {...field}
                />
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
              <FormLabel>चरन खर्क क्षेत्रको प्रकार</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="चरन खर्क क्षेत्रको प्रकार छान्नुहोस्" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {grazingAreaTypes.map((type) => (
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
                placeholder="चरन खर्क क्षेत्रको विवरण लेख्नुहोस्"
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
                  placeholder="समुद्री सतहबाट उचाई"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="terrain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>भू-बनोट</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="भू-बनोट छान्नुहोस्" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {terrainTypes.map((type) => (
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
        name="accessibility"
        render={({ field }) => (
          <FormItem>
            <FormLabel>पहुँचयोग्यता</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="पहुँचयोग्यता स्तर छान्नुहोस्" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {accessibilityOptions.map((option) => (
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

      <FormField
        control={form.control}
        name="permitRequired"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>अनुमति आवश्यक</FormLabel>
              <FormDescription>
                यो क्षेत्रमा चराईको लागि अनुमति आवश्यक पर्छ?
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      {form.watch("permitRequired") && (
        <FormField
          control={form.control}
          name="permitInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>अनुमति सम्बन्धी जानकारी</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="अनुमति प्रक्रिया र आवश्यकताहरूको विवरण"
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
