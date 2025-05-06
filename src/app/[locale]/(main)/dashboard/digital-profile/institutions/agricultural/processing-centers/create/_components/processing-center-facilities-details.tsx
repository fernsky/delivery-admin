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

// Storage types
const storageTypes = [
  { value: "AMBIENT", label: "सामान्य तापक्रम" },
  { value: "COLD_STORAGE", label: "शीत भण्डार" },
  { value: "CONTROLLED_ATMOSPHERE", label: "नियन्त्रित वातावरण" },
  { value: "SILO", label: "साइलो" },
  { value: "WAREHOUSE", label: "गोदाम" },
  { value: "GRANARY", label: "अन्न भण्डार" },
  { value: "MIXED", label: "मिश्रित" },
  { value: "OTHER", label: "अन्य" },
];

// Processing level types
const processingLevels = [
  { value: "PRIMARY_PROCESSING", label: "प्राथमिक प्रशोधन" },
  { value: "SECONDARY_PROCESSING", label: "द्वितीय प्रशोधन" },
  { value: "TERTIARY_PROCESSING", label: "तृतीय प्रशोधन" },
  { value: "MINIMAL_PROCESSING", label: "न्युनतम प्रशोधन" },
  { value: "COMPREHENSIVE_PROCESSING", label: "व्यापक प्रशोधन" },
  { value: "NOT_APPLICABLE", label: "लागू नहुने" },
];

interface ProcessingCenterFacilitiesDetailsProps {
  form: UseFormReturn<any>;
}

export function ProcessingCenterFacilitiesDetails({
  form,
}: ProcessingCenterFacilitiesDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">
        भण्डारण तथा प्रशोधन सम्बन्धी जानकारी
      </div>

      {/* Storage Section */}
      <div className="space-y-4 border p-4 rounded-md">
        <div className="text-md font-medium">भण्डारण सुविधा</div>

        <FormField
          control={form.control}
          name="hasStorageFacility"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>भण्डारण सुविधा उपलब्ध छ</FormLabel>
                <FormDescription>
                  प्रशोधन केन्द्रमा भण्डारण गर्ने सुविधा छ
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {form.watch("hasStorageFacility") && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="storageType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>भण्डारण प्रकार</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="भण्डारण प्रकार छान्नुहोस्" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {storageTypes.map((type) => (
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="storageTotalCapacityMT"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>जम्मा भण्डारण क्षमता (मे.ट.)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="मेट्रिक टनमा"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="storageCurrentUsageMT"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>हालको भण्डारण परिमाण (मे.ट.)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="मेट्रिक टनमा"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="temperatureControlled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>तापक्रम नियन्त्रित</FormLabel>
                    <FormDescription>
                      भण्डारण स्थलमा तापक्रम नियन्त्रण सुविधा छ
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {form.watch("temperatureControlled") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="temperatureRangeMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>न्युनतम तापक्रम (°C)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="डिग्री सेल्सियसमा"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="temperatureRangeMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>अधिकतम तापक्रम (°C)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="डिग्री सेल्सियसमा"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="humidityControlled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>आद्रता नियन्त्रित</FormLabel>
                    <FormDescription>
                      भण्डारण स्थलमा आद्रता नियन्त्रण सुविधा छ
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        )}
      </div>

      {/* Processing Section */}
      <div className="space-y-4 border p-4 rounded-md">
        <div className="text-md font-medium">प्रशोधन सुविधा</div>

        <FormField
          control={form.control}
          name="hasProcessingUnit"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>प्रशोधन इकाई उपलब्ध छ</FormLabel>
                <FormDescription>
                  प्रशोधन केन्द्रमा प्रशोधन गर्ने इकाई छ
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {form.watch("hasProcessingUnit") && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="processingLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>प्रशोधन स्तर</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="प्रशोधन स्तर छान्नुहोस्" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {processingLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
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
              name="processingCapacityMTPerDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>दैनिक प्रशोधन क्षमता (मे.ट.)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="प्रति दिन मेट्रिक टनमा"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mainProcessingActivities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>मुख्य प्रशोधन गतिविधिहरू</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="उदाहरण: सुकाउने, छाँट्ने, प्याकेजिङ्ग"
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
              name="valueAdditionActivities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>मूल्य अभिवृद्धि गतिविधिहरू</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="उदाहरण: सफा गर्ने, ग्रेडिङ्ग, प्याकेजिङ्ग"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>

      {/* Products Section */}
      <div className="space-y-4 border p-4 rounded-md">
        <div className="text-md font-medium">उत्पादन तथा वस्तुहरू</div>

        <FormField
          control={form.control}
          name="primaryCommodities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>प्राथमिक उत्पादनहरू</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="उदाहरण: चामल, मकै, गहुँ, दूध, मासु"
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                केन्द्रमा प्रशोधन हुने मुख्य उत्पादनहरू (अल्पविराम द्वारा
                छुट्याउनुहोस्)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="secondaryCommodities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>द्वितीय उत्पादनहरू</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="अन्य उल्लेखनीय उत्पादनहरू"
                  {...field}
                  rows={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seasonalAvailability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>मौसमी उपलब्धता</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="उदाहरण: वर्षैभरी, वैशाख देखि कार्तिक सम्म"
                  {...field}
                  rows={2}
                />
              </FormControl>
              <FormDescription>
                केन्द्र सबैभन्दा बढी सक्रिय हुने मौसमहरू
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Quality Control Section */}
      <div className="space-y-4 border p-4 rounded-md">
        <div className="text-md font-medium">गुणस्तर नियन्त्रण</div>

        <FormField
          control={form.control}
          name="hasQualityControlLab"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>गुणस्तर नियन्त्रण प्रयोगशाला</FormLabel>
                <FormDescription>
                  केन्द्रमा गुणस्तर नियन्त्रण प्रयोगशाला छ
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="qualityStandards"
            render={({ field }) => (
              <FormItem>
                <FormLabel>गुणस्तर मापदण्डहरू</FormLabel>
                <FormControl>
                  <Input placeholder="उदाहरण: HACCP, ISO 22000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="certifications"
            render={({ field }) => (
              <FormItem>
                <FormLabel>प्रमाणीकरण</FormLabel>
                <FormControl>
                  <Input
                    placeholder="उदाहरण: प्राङ्गारिक, फेयर ट्रेड"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Connectivity and Services Section */}
      <div className="space-y-4 border p-4 rounded-md">
        <div className="text-md font-medium">आधारभूत सुविधाहरू</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="hasElectricity"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>बिजुली</FormLabel>
                  <FormDescription>केन्द्रमा बिजुलीको सुविधा छ</FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasWaterSupply"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>पानीको आपूर्ति</FormLabel>
                  <FormDescription>केन्द्रमा पानीको आपूर्ति छ</FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasWasteManagementSystem"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>फोहोर व्यवस्थापन प्रणाली</FormLabel>
                  <FormDescription>
                    केन्द्रमा फोहोर व्यवस्थापन प्रणाली छ
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasInternet"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>इन्टरनेट सुविधा</FormLabel>
                  <FormDescription>केन्द्रमा इन्टरनेट सुविधा छ</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Economic Section */}
      <div className="space-y-4 border p-4 rounded-md">
        <div className="text-md font-medium">आर्थिक प्रभाव विवरण</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="annualThroughputMT"
            render={({ field }) => (
              <FormItem>
                <FormLabel>वार्षिक थ्रुपुट (मे.ट.)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="वार्षिक प्रशोधन मात्रा"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacityUtilizationPercent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>क्षमता उपयोग प्रतिशत</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0-100%" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="employmentGenerated"
            render={({ field }) => (
              <FormItem>
                <FormLabel>रोजगारी सिर्जना</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="सिर्जित रोजगारी संख्या"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceAreaRadiusKM"
            render={({ field }) => (
              <FormItem>
                <FormLabel>सेवा क्षेत्र त्रिज्या (कि.मि.)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="किलोमिटरमा" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="farmersServedCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>सेवा पाउने किसान संख्या</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="किसान संख्या" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="womenFarmersPercent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>महिला किसान प्रतिशत</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0-100%" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Financial Section */}
      <div className="space-y-4 border p-4 rounded-md">
        <div className="text-md font-medium">वित्तीय विवरण</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="establishmentCostNPR"
            render={({ field }) => (
              <FormItem>
                <FormLabel>स्थापना लागत (रू.)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="नेपाली रुपैयाँमा"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="annualOperatingCostNPR"
            render={({ field }) => (
              <FormItem>
                <FormLabel>वार्षिक संचालन खर्च (रू.)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="नेपाली रुपैयाँमा"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="annualRevenueNPR"
            render={({ field }) => (
              <FormItem>
                <FormLabel>वार्षिक राजश्व (रू.)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="नेपाली रुपैयाँमा"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="profitableOperation"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>नाफामूलक संचालन</FormLabel>
                <FormDescription>
                  केन्द्र नाफामूलक रूपमा संचालन भइरहेको छ
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      {/* Challenges Section */}
      <div className="space-y-4 border p-4 rounded-md">
        <div className="text-md font-medium">चुनौती र आवश्यकता</div>

        <FormField
          control={form.control}
          name="majorConstraints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>प्रमुख बाधाहरू</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="केन्द्रले सामना गरेका प्रमुख बाधाहरू"
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
          name="developmentNeeds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>विकास आवश्यकताहरू</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="केन्द्रको विकासको लागि आवश्यकताहरू"
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
