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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SEOFieldsProps {
  form: UseFormReturn<any>;
}

export function SEOFields({ form }: SEOFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">SEO जानकारी</div>
      <FormField
        control={form.control}
        name="metaTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>मेटा शीर्षक</FormLabel>
            <FormControl>
              <Input {...field} placeholder="मेटा शीर्षक" />
            </FormControl>
            <FormDescription>
              खोज इन्जिनको नतिजा र ब्राउजरको ट्याबमा देखिने शीर्षक
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="metaDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>मेटा विवरण</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="मेटा विवरण" rows={3} />
            </FormControl>
            <FormDescription>
              खोज इन्जिनको नतिजामा देखिने छोटो विवरण (१५०-१६० अक्षरहरू)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="keywords"
        render={({ field }) => (
          <FormItem>
            <FormLabel>खोजी शब्दहरू</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="अल्पविरामले छुट्याइएका खोजी शब्दहरू"
              />
            </FormControl>
            <FormDescription>
              खोज इन्जिनको लागि महत्वपूर्ण शब्दहरू (अल्पविराम द्वारा छुट्याइएको)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
