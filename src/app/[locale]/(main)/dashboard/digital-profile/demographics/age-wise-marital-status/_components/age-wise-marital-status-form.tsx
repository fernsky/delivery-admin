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
import {
  AgeGroupEnum,
  MaritalStatusEnum,
  getAgeGroupDisplayName,
  getMaritalStatusDisplayName,
} from "@/server/api/routers/profile/demographics/age-wise-marital-status.schema";

// Create a schema for the form
const formSchema = z.object({
  id: z.string().optional(),
  wardId: z.string().min(1, "वडा आईडी आवश्यक छ"),
  wardNumber: z.coerce.number().int().min(1).optional(),
  wardName: z.string().optional(),
  ageGroup: z.string().min(1, "उमेर समूह आवश्यक छ"),
  maritalStatus: z.string().min(1, "वैवाहिक स्थिति आवश्यक छ"),
  population: z.coerce.number().int().nonnegative().optional(),
  malePopulation: z.coerce.number().int().nonnegative().optional(),
  femalePopulation: z.coerce.number().int().nonnegative().optional(),
  otherPopulation: z.coerce.number().int().nonnegative().optional(),
});

interface WardWiseMaritalStatusFormProps {
  editId: string | null;
  onClose: () => void;
  existingData: any[];
}

// Helper function to get age group options
const getAgeGroupOptions = () => {
  const enumValues = Object.values(AgeGroupEnum.Values);
  return enumValues.map((value) => ({
    value,
    label: getAgeGroupDisplayName(value),
  }));
};

// Helper function to get marital status options
const getMaritalStatusOptions = () => {
  const enumValues = Object.values(MaritalStatusEnum.Values);
  return enumValues.map((value) => ({
    value,
    label: getMaritalStatusDisplayName(value),
  }));
};

export default function AgeWiseMaritalStatusForm({
  editId,
  onClose,
  existingData,
}: WardWiseMaritalStatusFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utils = api.useContext();
  const ageGroupOptions = getAgeGroupOptions();
  const maritalStatusOptions = getMaritalStatusOptions();

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
    api.profile.demographics.ageWiseMaritalStatus.getAll.useQuery(undefined, {
      enabled: !!editId,
    });

  const createMutation =
    api.profile.demographics.ageWiseMaritalStatus.create.useMutation({
      onSuccess: () => {
        toast.success("नयाँ वैवाहिक स्थिति डाटा सफलतापूर्वक थपियो");
        utils.profile.demographics.ageWiseMaritalStatus.getAll.invalidate();
        setIsSubmitting(false);
        onClose();
      },
      onError: (error) => {
        toast.error(`त्रुटि: ${error.message}`);
        setIsSubmitting(false);
      },
    });

  const updateMutation =
    api.profile.demographics.ageWiseMaritalStatus.update.useMutation({
      onSuccess: () => {
        toast.success("वैवाहिक स्थिति डाटा सफलतापूर्वक अपडेट गरियो");
        utils.profile.demographics.ageWiseMaritalStatus.getAll.invalidate();
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
      ageGroup: "",
      maritalStatus: "",
      population: undefined,
      malePopulation: undefined,
      femalePopulation: undefined,
      otherPopulation: undefined,
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
          ageGroup: recordToEdit.ageGroup,
          maritalStatus: recordToEdit.maritalStatus,
          population: recordToEdit.population || undefined,
          malePopulation: recordToEdit.malePopulation || undefined,
          femalePopulation: recordToEdit.femalePopulation || undefined,
          otherPopulation: recordToEdit.otherPopulation || undefined,
        });
      }
    }
  }, [editId, editingData, form]);

  // Update total population when gender population changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (
        name === "malePopulation" ||
        name === "femalePopulation" ||
        name === "otherPopulation"
      ) {
        const male = value.malePopulation || 0;
        const female = value.femalePopulation || 0;
        const other = value.otherPopulation || 0;
        form.setValue("population", male + female + other);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    // Check if a record already exists with this ward, age group, and marital status (for new records)
    if (!editId) {
      const duplicate = existingData.find(
        (item) =>
          item.wardId === values.wardId &&
          item.ageGroup === values.ageGroup &&
          item.maritalStatus === values.maritalStatus,
      );
      if (duplicate) {
        toast.error(
          `वडा ${values.wardNumber || values.wardId} को लागि ${getAgeGroupDisplayName(
            values.ageGroup as any,
          )} उमेर समूह र ${getMaritalStatusDisplayName(
            values.maritalStatus as any,
          )} वैवाहिक स्थितिको डाटा पहिले नै अवस्थित छ`,
        );
        setIsSubmitting(false);
        return;
      }
    }

    // Ensure population has a default value of 0 if it's undefined
    const dataToSubmit = {
      ...values,
      population: values.population ?? 0,
      ageGroup: values.ageGroup as keyof typeof AgeGroupEnum.Values,
      maritalStatus:
        values.maritalStatus as keyof typeof MaritalStatusEnum.Values,
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
          <h3 className="text-lg font-medium mb-4">वैवाहिक स्थिति विवरण</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="ageGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>उमेर समूह</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="उमेर समूह चयन गर्नुहोस्" />
                      </SelectTrigger>
                      <SelectContent>
                        {ageGroupOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
              name="maritalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>वैवाहिक स्थिति</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="वैवाहिक स्थिति चयन गर्नुहोस्" />
                      </SelectTrigger>
                      <SelectContent>
                        {maritalStatusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-4">
            <h4 className="text-md font-medium mb-2">जनसंख्या विवरण</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="malePopulation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>पुरुष जनसंख्या</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="femalePopulation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>महिला जनसंख्या</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="otherPopulation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>अन्य जनसंख्या</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="mt-4">
            <FormField
              control={form.control}
              name="population"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>जम्मा जनसंख्या</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      disabled
                      className="bg-muted/40"
                    />
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
