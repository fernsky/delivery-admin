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

// Ground cover options
const groundCoverOptions = [
  { value: "PRIMARILY_GRASSES", label: "मुख्यतः घाँस" },
  { value: "SHRUB_DOMINANT", label: "झाडी प्रमुख" },
  { value: "MIXED_VEGETATION", label: "मिश्रित वनस्पति" },
  { value: "FORBS_DOMINANT", label: "जडीबुटी प्रमुख" },
  { value: "TREE_SCATTERED", label: "छरिएका रूख" },
  { value: "DEGRADED", label: "बिग्रेको/नष्ट भएको" },
];

// Utilization level options
const utilizationLevelOptions = [
  { value: "UNDERUTILIZED", label: "कम प्रयोगमा" },
  { value: "OPTIMAL_USE", label: "उचित प्रयोगमा" },
  { value: "OVERUTILIZED", label: "अति प्रयोगमा" },
  { value: "SEVERELY_DEGRADED", label: "गम्भीर रूपमा बिग्रेको" },
  { value: "PROTECTED", label: "संरक्षित" },
];

interface GrazingAreaFeaturesDetailsProps {
  form: UseFormReturn<any>;
}

export function GrazingAreaFeaturesDetails({
  form,
}: GrazingAreaFeaturesDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">चरन खर्क विशेषताहरू</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="primaryLivestockType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>मुख्य पशु प्रकार</FormLabel>
              <FormControl>
                <Input
                  placeholder="मुख्य पशुहरू (अल्पविराम द्वारा छुट्याउनुहोस्)"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                उदाहरण: गाई, भैंसी, बाख्रा, भेडा, चौंरी, याक
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="livestockCapacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>पशु क्षमता</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="यो क्षेत्रले धान्न सक्ने कुल पशुधन संख्या"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                यस क्षेत्रले धान्न सक्ने अनुमानित पशुधन संख्या
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="grazingSeasons"
          render={({ field }) => (
            <FormItem>
              <FormLabel>चराई मौसम</FormLabel>
              <FormControl>
                <Input
                  placeholder="जस्तै: गर्मी, हिउँद, बर्षा मौसम"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                कुन मौसममा चराई गरिन्छ (अल्पविराम द्वारा छुट्याउनुहोस्)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="grazingDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>चराई अवधि</FormLabel>
              <FormControl>
                <Input
                  placeholder="जस्तै: 3 महिना, 6 महिना, पूरै वर्ष"
                  {...field}
                />
              </FormControl>
              <FormDescription>एक वर्षमा चराई गर्न सकिने अवधि</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="groundCover"
          render={({ field }) => (
            <FormItem>
              <FormLabel>जमिनको छोपनी</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="जमिनको छोपनी प्रकार छान्नुहोस्" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {groundCoverOptions.map((option) => (
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
          name="utilizationLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>उपयोग स्तर</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="उपयोग स्तर छान्नुहोस्" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {utilizationLevelOptions.map((option) => (
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
        name="rotationalSystem"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>चक्रीय प्रणाली</FormLabel>
              <FormDescription>
                यो क्षेत्रमा चक्रीय चरन प्रणाली प्रयोग गरिन्छ
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      {form.watch("rotationalSystem") && (
        <FormField
          control={form.control}
          name="restPeriod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>आराम अवधि</FormLabel>
              <FormControl>
                <Input placeholder="जस्तै: 2 महिना, 6 हप्ता" {...field} />
              </FormControl>
              <FormDescription>
                चरन क्षेत्रलाई आराम दिइने समयावधि
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <div className="text-lg font-medium mt-8">पानीको स्रोत</div>

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
              <FormLabel>पानीको स्रोत उपलब्ध छ</FormLabel>
              <FormDescription>
                यो क्षेत्रमा पशुहरूको लागि पानीको स्रोत छ
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      {form.watch("hasWaterSource") && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="waterSourceTypes"
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

          <FormField
            control={form.control}
            name="waterAvailability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>पानीको उपलब्धता</FormLabel>
                <FormControl>
                  <Input placeholder="जस्तै: वर्षैभरी, मौसमी" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="waterSourceDistance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>पानीको स्रोतको दूरी (मिटर)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="मिटरमा दूरी" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      <div className="text-lg font-medium mt-8">पूर्वाधार विवरण</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="hasFencing"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>बाड तारबार</FormLabel>
                <FormDescription>
                  क्षेत्रमा बाड वा तारबार लगाइएको छ
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasWindbreaks"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>हावा रोक्ने संरचना</FormLabel>
                <FormDescription>
                  हावा रोक्ने संरचना वा रूखहरू छन्
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasShelters"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>आश्रय स्थल</FormLabel>
                <FormDescription>पशुहरूको लागि आश्रय स्थल छ</FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="infrastructureNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>पूर्वाधार टिप्पणीहरू</FormLabel>
            <FormControl>
              <Textarea
                placeholder="पूर्वाधार सम्बन्धी थप जानकारी"
                {...field}
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="text-lg font-medium mt-8">स्वास्थ्य र दिगोपना</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="invasiveSpecies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>आक्रामक प्रजातिहरू</FormLabel>
              <FormControl>
                <Input
                  placeholder="क्षेत्रमा पाइने आक्रामक प्रजातिहरू"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="erosionIssues"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>माटो क्षरण समस्याहरू</FormLabel>
                <FormDescription>
                  क्षेत्रमा माटो क्षरणका समस्याहरू छन्
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="conservationStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>संरक्षण स्थिति</FormLabel>
              <FormControl>
                <Input placeholder="क्षेत्रको संरक्षण स्थिति" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="restorationEfforts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>पुनर्स्थापना प्रयासहरू</FormLabel>
              <FormControl>
                <Input
                  placeholder="क्षेत्रको पुनर्स्थापना प्रयासहरू"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="text-lg font-medium mt-8">सांस्कृतिक महत्त्व</div>
      <div className="grid grid-cols-1 gap-6">
        <FormField
          control={form.control}
          name="traditionalUse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>परम्परागत उपयोग</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="क्षेत्रको परम्परागत प्रयोगको विवरण"
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="culturalSignificance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>सांस्कृतिक महत्त्व</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="क्षेत्रको सांस्कृतिक महत्त्वको विवरण"
                  {...field}
                  rows={3}
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
