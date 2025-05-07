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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import {
  IncomeSourceEnum,
  incomeSourceLabels,
} from "@/server/api/routers/profile/economics/ward-wise-household-income-source.schema";

// Create a schema for the form
const formSchema = z.object({
  id: z.string().optional(),
  wardId: z.string().min(1, "वडा आईडी आवश्यक छ"),
  wardNumber: z.coerce
    .number()
    .int()
    .min(1, "वडा नम्बर १ वा सो भन्दा बढी हुनुपर्छ"),
  incomeSource: z.string().min(1, "आय स्रोत श्रेणी आवश्यक छ"),
  households: z.coerce
    .number()
    .int("घरधुरी संख्या पूर्णांक हुनुपर्छ")
    .nonnegative("घरधुरी संख्या नेगेटिभ हुन सक्दैन")
    .default(0),
});

interface WardWiseHouseholdIncomeSourceFormProps {
  editId: string | null;
  onClose: () => void;
  existingData: any[];
}

// Helper function to get income source display options
const getIncomeSourceOptions = () =>
  Object.entries(incomeSourceLabels).map(([value, label]) => ({
    value,
    label,
  }));

export default function WardWiseHouseholdIncomeSourceForm({
  editId,
  onClose,
  existingData,
}: WardWiseHouseholdIncomeSourceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const utils = api.useContext();
  const incomeSourceOptions = getIncomeSourceOptions();

  // Extract unique ward information from existing data
  const uniqueWards = Array.from(
    new Set(
      existingData.map((item) => ({
        id: item.wardId,
        number: item.wardNumber || parseInt(item.wardId),
      })),
    ),
  ).sort((a, b) => a.number - b.number);

  // Get ward numbers that already exist
  const existingWardNumbers = new Set(uniqueWards.map((ward) => ward.number));

  // Setup ward options including existing and new wards
  const wardOptions = [
    ...uniqueWards,
    // Add options for new wards (1-32) that don't exist yet
    ...Array.from({ length: 32 }, (_, i) => i + 1)
      .filter((num) => !existingWardNumbers.has(num))
      .map((num) => ({
        id: num.toString(),
        number: num,
      })),
  ].sort((a, b) => a.number - b.number);

  // Get the existing record if editing
  const { data: editingData, isLoading: isLoadingEditData } =
    api.profile.economics.wardWiseHouseholdIncomeSource.getAll.useQuery(
      undefined,
      {
        enabled: !!editId,
      },
    );

  const addMutation =
    api.profile.economics.wardWiseHouseholdIncomeSource.add.useMutation({
      onSuccess: () => {
        toast.success(
          "नयाँ वडा अनुसार घरधुरीको आय स्रोत डाटा सफलतापूर्वक थपियो",
        );
        utils.profile.economics.wardWiseHouseholdIncomeSource.getAll.invalidate();
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
      incomeSource: "",
      households: 0,
    },
  });

  // Watch for changes to check for duplicates
  const watchWardId = form.watch("wardId");
  const watchIncomeSource = form.watch("incomeSource");

  // Populate the form when editing
  useEffect(() => {
    if (editId && editingData) {
      const recordToEdit = editingData.find((record) => record.id === editId);
      if (recordToEdit) {
        form.reset({
          id: recordToEdit.id,
          wardId: recordToEdit.wardId,
          wardNumber: recordToEdit.wardNumber || parseInt(recordToEdit.wardId),
          incomeSource: recordToEdit.incomeSource,
          households: recordToEdit.households || 0,
        });
      }
    }
  }, [editId, editingData, form]);

  // Check for duplicate entries when form values change
  useEffect(() => {
    setDuplicateError(null);

    if (watchWardId && watchIncomeSource && !editId) {
      const duplicate = existingData.find(
        (item) =>
          item.wardId === watchWardId &&
          item.incomeSource === watchIncomeSource,
      );

      if (duplicate) {
        const wardNumber = duplicate.wardNumber || parseInt(watchWardId);
        const incomeSourceLabel =
          incomeSourceOptions.find((opt) => opt.value === watchIncomeSource)
            ?.label || watchIncomeSource;

        setDuplicateError(
          `वडा ${wardNumber} को लागि "${incomeSourceLabel}" आय स्रोत श्रेणीको डाटा पहिले नै अवस्थित छ`,
        );
      }
    }
  }, [
    watchWardId,
    watchIncomeSource,
    existingData,
    editId,
    incomeSourceOptions,
  ]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Don't submit if there's a duplicate error
    if (duplicateError) {
      toast.error(duplicateError);
      return;
    }

    setIsSubmitting(true);

    // For editing, we'll collect all the income source categories for this ward
    // and submit them together with our updated/new value
    if (editId) {
      // Get all existing entries for this ward
      const wardData = existingData.filter(
        (item) => item.wardId === values.wardId && item.id !== editId,
      );

      // Create an array of all income source categories for this ward
      const dataToSubmit = {
        wardId: values.wardId,
        wardNumber: values.wardNumber,
        data: [
          ...wardData.map((item) => ({
            incomeSource:
              item.incomeSource as keyof typeof IncomeSourceEnum.Values,
            households: item.households,
          })),
          {
            incomeSource:
              values.incomeSource as keyof typeof IncomeSourceEnum.Values,
            households: values.households,
          },
        ],
      };

      addMutation.mutate(dataToSubmit);
    } else {
      // For new entries
      const dataToSubmit = {
        wardId: values.wardId,
        wardNumber: values.wardNumber,
        data: [
          {
            incomeSource:
              values.incomeSource as keyof typeof IncomeSourceEnum.Values,
            households: values.households,
          },
        ],
      };

      addMutation.mutate(dataToSubmit);
    }
  };

  if (editId && isLoadingEditData) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">डाटा लोड गर्दै...</span>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {duplicateError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{duplicateError}</AlertDescription>
              </Alert>
            )}

            <div className="bg-muted/40 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-3">वडा विवरण</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="wardId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>वडा</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Update ward number automatically
                          const selectedWard = wardOptions.find(
                            (ward) => ward.id === value,
                          );
                          if (selectedWard) {
                            form.setValue("wardNumber", selectedWard.number);
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="वडा चयन गर्नुहोस्" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {wardOptions.map((ward) => (
                            <SelectItem key={ward.id} value={ward.id}>
                              वडा {ward.number}{" "}
                              {!existingWardNumbers.has(ward.number) &&
                                "(नयाँ)"}
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
                  name="wardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>वडा नम्बर</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        वडा नम्बर १ देखि ३२ सम्म मात्र हुन सक्छ
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="bg-muted/40 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-3">
                घरधुरी आय स्रोत विवरण
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="incomeSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>आय स्रोत श्रेणी</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="आय स्रोत श्रेणी चयन गर्नुहोस्" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {incomeSourceOptions.map((option) => (
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
                  name="households"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>घरधुरी संख्या</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => {
                            const value =
                              e.target.value === "" ? "0" : e.target.value;
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                रद्द गर्नुहोस्
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !!duplicateError}
                className="min-w-[120px]"
              >
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
      </CardContent>
    </Card>
  );
}
