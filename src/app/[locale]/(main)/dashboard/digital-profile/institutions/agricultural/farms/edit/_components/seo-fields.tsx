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
      <div className="text-lg font-medium">SEO Information</div>
      <FormField
        control={form.control}
        name="metaTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meta Title</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Meta title" />
            </FormControl>
            <FormDescription>
              Title that appears in search engine results and browser tabs
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
            <FormLabel>Meta Description</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Meta description" rows={3} />
            </FormControl>
            <FormDescription>
              Brief description that appears in search engine results (150-160
              characters)
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
            <FormLabel>Keywords</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Keywords separated by commas" />
            </FormControl>
            <FormDescription>
              Important keywords for search engines (separated by commas)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
