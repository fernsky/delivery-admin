"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LanguageTypeEnum } from "@/server/api/routers/profile/demographics/ward-wise-mother-tongue-population.schema";

// Create a schema for the form
const formSchema = z.object({
  id: z.string().optional(),
  wardId: z.string().min(1, "वडा आईडी आवश्यक छ"),
  wardNumber: z.coerce.number().int().min(1).optional(),
  wardName: z.string().optional(),
  languageType: z.string().min(1, "मातृभाषा आवश्यक छ"),
  population: z.coerce.number().int().nonnegative().optional(),
  percentage: z.string().optional(),
});

interface WardWiseMotherTonguePopulationFormProps {
  editId: string | null;
  onClose: () => void;
  existingData: any[];
}

// Helper function to get language display names
const getLanguageOptions = () => {
  const enumValues = Object.values(LanguageTypeEnum.Values);
  return enumValues.map((value) => ({
    value,
    label: value, // Using the enum value directly as label
  }));
};

export default function WardWiseMotherTonguePopulationForm({
  editId,
  onClose,
  existingData,
}: WardWiseMotherTonguePopulationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utils = api.useContext();
  const languageOptions = getLanguageOptions();

  // Get unique wards from existing data
  const uniqueWards = Array.from(
    new Set(
      existingData.map((item) => ({
        id: item.wardId,
        number: item.wardNumber || parseInt(item.wardId),
      })),
    ),
  ).sort((a, b) => a.number - b.number);

  // Get the existing record if editing
  const { data: editingData, isLoading: isLoadingEditData } =
    api.profile.demographics.wardWiseMotherTonguePopulation.getAll.useQuery(
      undefined,
      {
        enabled: !!editId,
      },
    );

  const createMutation =
    api.profile.demographics.wardWiseMotherTonguePopulation.create.useMutation({
      onSuccess: () => {
        toast.success("नयाँ मातृभाषा जनसंख्या डाटा सफलतापूर्वक थपियो");
        utils.profile.demographics.wardWiseMotherTonguePopulation.getAll.invalidate();
        setIsSubmitting(false);
        onClose();
      },
      onError: (error) => {
        toast.error(`त्रुटि: ${error.message}`);
        setIsSubmitting(false);
      },
    });

  const updateMutation =
    api.profile.demographics.wardWiseMotherTonguePopulation.update.useMutation({
      onSuccess: () => {
        toast.success("मातृभाषा जनसंख्या डाटा सफलतापूर्वक अपडेट गरियो");
        utils.profile.demographics.wardWiseMotherTonguePopulation.getAll.invalidate();
        setIsSubmitting(false);
        onClose();
      },
      onError: (error) => {
        toast.error(`त्रुटि: ${error.message}`);
        setIsSubmitting(false);
      },
    });

  // Set up the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wardId: "",
      wardNumber: undefined,
      wardName: "",
      languageType: "",
      population: undefined,
      percentage: "",
    },
  });

  // Populate the form when editing
  useEffect(() => {
    if (editId && editingData) {
      const recordToEdit = editingData.find((record) => record.id === editId);
      if (recordToEdit) {
        form.reset({
          id: recordToEdit.id,
          wardId: recordToEdit.wardId,
          wardNumber: (recordToEdit as any).wardNumber || undefined,
          wardName: (recordToEdit as any).wardName || "",
          languageType: recordToEdit.languageType,
          population: recordToEdit.population || undefined,
          percentage: (recordToEdit as any).percentage || "",
        });
      }
    }
  }, [editId, editingData, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    // Check if a record already exists with this ward and language (for new records)
    if (!editId) {
      const duplicate = existingData.find(
        (item) =>
          item.wardId === values.wardId &&
          item.languageType === values.languageType,
      );
      if (duplicate) {
        toast.error(
          `वडा ${values.wardNumber || values.wardId} को लागि ${values.languageType} मातृभाषाको डाटा पहिले नै अवस्थित छ`,
        );
        setIsSubmitting(false);
        return;
      }
    }

    // Ensure population has a default value of 0 if it's undefined
    const dataToSubmit = {
      ...values,
      population: values.population ?? 0,
      languageType: values.languageType as keyof typeof LanguageTypeEnum.Values,
    };

    if (editId) {
      updateMutation.mutate(dataToSubmit);
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };

  if (editId && isLoadingEditData) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2">डाटा लोड गर्दै...</span>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="wardId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>वडा</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Update ward number if available
                      const selectedWard = uniqueWards.find(
                        (ward) => ward.id === value,
                      );
                      if (selectedWard) {
                        form.setValue("wardNumber", selectedWard.number);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="वडा चयन गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueWards.map((ward) => (
                        <SelectItem key={ward.id} value={ward.id}>
                          वडा {ward.number}
                        </SelectItem>
                      ))}
                      {/* Allow adding new wards */}
                      {Array.from({ length: 32 }, (_, i) => i + 1)
                        .filter(
                          (num) =>
                            !uniqueWards.some((ward) => ward.number === num),
                        )
                        .map((num) => (
                          <SelectItem key={`new-${num}`} value={num.toString()}>
                            वडा {num} (नयाँ)
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="wardName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>वडाको नाम</FormLabel>
                <FormControl>
                  <Input placeholder="खजुरा वडा १" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">मातृभाषा विवरण</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="languageType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>मातृभाषा</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="मातृभाषा चयन गर्नुहोस्" />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((language) => (
                          <SelectItem
                            key={language.value}
                            value={language.value}
                          >
                            {language.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="population"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>जनसंख्या</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>प्रतिशत (%)</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="0.00%" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            रद्द गर्नुहोस्
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                सबमिट गर्दै...
              </>
            ) : editId ? (
              "अपडेट गर्नुहोस्"
            ) : (
              "सेभ गर्नुहोस्"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
