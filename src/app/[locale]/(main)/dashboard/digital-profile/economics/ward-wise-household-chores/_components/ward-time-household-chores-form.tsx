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
  TimeSpentEnum,
  timeSpentLabels,
} from "@/server/api/routers/profile/economics/ward-time-wise-household-chores.schema";

// Create a schema for the form
const formSchema = z.object({
  id: z.string().optional(),
  wardId: z.string().min(1, "वडा आईडी आवश्यक छ"),
  wardNumber: z.coerce
    .number()
    .int()
    .min(1, "वडा नम्बर १ वा सो भन्दा बढी हुनुपर्छ"),
  timeSpent: z.string().min(1, "समय व्यतित श्रेणी आवश्यक छ"),
  population: z.coerce
    .number()
    .int("जनसंख्या पूर्णांक हुनुपर्छ")
    .nonnegative("जनसंख्या नेगेटिभ हुन सक्दैन")
    .default(0),
});

interface WardTimeHouseholdChoresFormProps {
  editId: string | null;
  onClose: () => void;
  existingData: any[];
}

// Helper function to get time spent display options
const getTimeSpentOptions = () =>
  Object.entries(timeSpentLabels).map(([value, label]) => ({ value, label }));

export default function WardTimeHouseholdChoresForm({
  editId,
  onClose,
  existingData,
}: WardTimeHouseholdChoresFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const utils = api.useContext();
  const timeSpentOptions = getTimeSpentOptions();

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
    api.profile.economics.wardTimeWiseHouseholdChores.getAll.useQuery(
      undefined,
      {
        enabled: !!editId,
      },
    );

  const addMutation =
    api.profile.economics.wardTimeWiseHouseholdChores.add.useMutation({
      onSuccess: () => {
        toast.success(
          "नयाँ वडा अनुसार घरायसी काममा बिताइएको समय डाटा सफलतापूर्वक थपियो",
        );
        utils.profile.economics.wardTimeWiseHouseholdChores.getAll.invalidate();
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
      timeSpent: "",
      population: 0,
    },
  });

  // Watch for changes to check for duplicates
  const watchWardId = form.watch("wardId");
  const watchTimeSpent = form.watch("timeSpent");

  // Populate the form when editing
  useEffect(() => {
    if (editId && editingData) {
      const recordToEdit = editingData.find((record) => record.id === editId);
      if (recordToEdit) {
        form.reset({
          id: recordToEdit.id,
          wardId: recordToEdit.wardId,
          wardNumber: recordToEdit.wardNumber || parseInt(recordToEdit.wardId),
          timeSpent: recordToEdit.timeSpent,
          population: recordToEdit.population || 0,
        });
      }
    }
  }, [editId, editingData, form]);

  // Check for duplicate entries when form values change
  useEffect(() => {
    setDuplicateError(null);

    if (watchWardId && watchTimeSpent && !editId) {
      const duplicate = existingData.find(
        (item) =>
          item.wardId === watchWardId && item.timeSpent === watchTimeSpent,
      );

      if (duplicate) {
        const wardNumber = duplicate.wardNumber || parseInt(watchWardId);
        const timeSpentLabel =
          timeSpentOptions.find((opt) => opt.value === watchTimeSpent)?.label ||
          watchTimeSpent;

        setDuplicateError(
          `वडा ${wardNumber} को लागि "${timeSpentLabel}" समय श्रेणीको डाटा पहिले नै अवस्थित छ`,
        );
      }
    }
  }, [watchWardId, watchTimeSpent, existingData, editId, timeSpentOptions]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Don't submit if there's a duplicate error
    if (duplicateError) {
      toast.error(duplicateError);
      return;
    }

    setIsSubmitting(true);

    // For editing, we'll collect all the time spent categories for this ward
    // and submit them together with our updated/new value
    if (editId) {
      // Get all existing entries for this ward
      const wardData = existingData.filter(
        (item) => item.wardId === values.wardId && item.id !== editId,
      );

      // Create an array of all time spent categories for this ward
      const dataToSubmit = {
        wardId: values.wardId,
        wardNumber: values.wardNumber,
        data: [
          ...wardData.map((item) => ({
            timeSpent: item.timeSpent as keyof typeof TimeSpentEnum.Values,
            population: item.population,
          })),
          {
            timeSpent: values.timeSpent as keyof typeof TimeSpentEnum.Values,
            population: values.population,
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
            timeSpent: values.timeSpent as keyof typeof TimeSpentEnum.Values,
            population: values.population,
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
              <h3 className="text-sm font-medium mb-3">घरायसी कामको विवरण</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="timeSpent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>घरायसी काममा बिताइएको समय</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="समय श्रेणी चयन गर्नुहोस्" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSpentOptions.map((option) => (
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
                  name="population"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>जनसंख्या</FormLabel>
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
