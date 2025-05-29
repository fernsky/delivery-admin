import { useFormContext } from "react-hook-form";
import { Household } from "@/types/household";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FamilyDetailsStep() {
  const { control } = useFormContext<Household>();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>परिवार विवरण</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="family_head_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>परिवार मूलीको नाम *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="परिवार मूलीको नाम प्रविष्ट गर्नुहोस्"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="family_head_phone_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>परिवार मूलीको सम्पर्क नम्बर</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="सम्पर्क नम्बर प्रविष्ट गर्नुहोस्"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="total_members"
            render={({ field }) => (
              <FormItem>
                <FormLabel>परिवारका कुल सदस्य संख्या *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || undefined)
                    }
                    placeholder="कुल सदस्य संख्या प्रविष्ट गर्नुहोस्"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="are_members_elsewhere"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>परिवारका सदस्यहरू अन्यत्र बस्छन्?</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="छनौट गर्नुहोस्" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">छ</SelectItem>
                        <SelectItem value="no">छैन</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="total_elsewhere_members"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>अन्यत्र बस्ने सदस्यहरूको संख्या</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || undefined)
                      }
                      placeholder="सदस्य संख्या प्रविष्ट गर्नुहोस्"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
