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

// Grassland management options
const managementTypes = [
  { value: "ROTATIONAL_GRAZING", label: "चक्रीय चराई" },
  { value: "CONTINUOUS_GRAZING", label: "निरन्तर चराई" },
  { value: "DEFERRED_GRAZING", label: "विलम्बित चराई" },
  { value: "HAY_PRODUCTION", label: "घाँस उत्पादन" },
  { value: "CONSERVATION", label: "संरक्षण" },
  { value: "UNMANAGED", label: "अव्यवस्थित" },
  { value: "MIXED", label: "मिश्रित" },
];

interface GrasslandFeaturesDetailsProps {
  form: UseFormReturn<any>;
}

export function GrasslandFeaturesDetails({
  form,
}: GrasslandFeaturesDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">चरन विशेषताहरू</div>

      <div className="grid grid-cols-1 gap-6">
        <FormField
          control={form.control}
          name="dominantSpecies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>प्रमुख घाँसका प्रजातिहरू</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="प्रमुख घाँस/वनस्पति प्रजातिहरू (अल्पविराम द्वारा छुट्याउनुहोस्)"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                उदाहरण: खरी, डुस्सो, दुबो, बंसो, काँस
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="managementType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>व्यवस्थापन प्रकार</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="व्यवस्थापन प्रकार छान्नुहोस्" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {managementTypes.map((option) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="grazingPeriod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>चराई अवधि</FormLabel>
              <FormControl>
                <Input
                  placeholder="जस्तै: वैशाख-कार्तिक, वर्षैभरी"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                वर्षको कुन समयमा चराई गर्न उपयुक्त हुन्छ
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="carryingCapacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>वहन क्षमता (प्रति हेक्टर पशुधन एकाई)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="प्रति हेक्टर पशुधन संख्या"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                प्रति हेक्टर क्षेत्रमा चराउन सकिने औसत पशुधन संख्या
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="annualFodderYield"
          render={({ field }) => (
            <FormItem>
              <FormLabel>वार्षिक घाँस उत्पादन (मेट्रिक टनमा)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="मेट्रिक टनमा वार्षिक उत्पादन"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="yieldYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>उत्पादन वर्ष</FormLabel>
              <FormControl>
                <Input placeholder="जस्तै: २०८०" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        <FormField
          control={form.control}
          name="hasWaterSource"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>पानीको स्रोत</FormLabel>
                <FormDescription>चरन क्षेत्रमा पानीको स्रोत छ</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isFenced"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>बाडा लगाइएको</FormLabel>
                <FormDescription>
                  चरन क्षेत्र वरिपरि बार/तारबार लगाइएको छ
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasGrazingRights"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>चराई अधिकार</FormLabel>
                <FormDescription>
                  निश्चित व्यक्ति/समूह/समुदायको चराई अधिकार छ
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      {form.watch("hasWaterSource") && (
        <FormField
          control={form.control}
          name="waterSourceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>पानीको स्रोतको प्रकार</FormLabel>
              <FormControl>
                <Input placeholder="जस्तै: खोला, कुवा, पोखरी" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <div className="text-lg font-medium mt-8">संरक्षण विवरण</div>

      <FormField
        control={form.control}
        name="hasProtectedStatus"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>संरक्षित अवस्था</FormLabel>
              <FormDescription>
                यो क्षेत्र कुनै प्रकारले संरक्षित छ
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      {form.watch("hasProtectedStatus") && (
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="protectionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>संरक्षणको प्रकार</FormLabel>
                <FormControl>
                  <Input
                    placeholder="जस्तै: वन्यजन्तु आरक्ष, समुदायिक संरक्षित"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="biodiversityValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>जैविक विविधता मूल्य</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="यस क्षेत्रको पारिस्थितिकीय महत्त्व"
                    {...field}
                    rows={3}
                  />
                </FormControl>
                <FormDescription>
                  यस क्षेत्रमा पाइने विशेष प्रजाति वा पारिस्थितिकीय महत्त्वबारे
                  विवरण
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
