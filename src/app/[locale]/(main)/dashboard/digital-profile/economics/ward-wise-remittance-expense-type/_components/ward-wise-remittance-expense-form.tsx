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

// Create a schema for the form
const formSchema = z.object({
  id: z.string().optional(),
  wardId: z.string().min(1, "वडा आईडी आवश्यक छ"),
  wardNumber: z.coerce.number().int().min(1).optional(),
  remittanceExpense: z.string().min(1, "रेमिट्यान्स खर्च प्रकार आवश्यक छ"),
  households: z.coerce.number().int().nonnegative(),
});

interface WardWiseRemittanceExpenseFormProps {
  editId: string | null;
  onClose: () => void;
  existingData: any[];
}

export default function WardWiseRemittanceExpenseForm({
  editId,
  onClose,
  existingData,
}: WardWiseRemittanceExpenseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utils = api.useContext();

  // Get unique wards from existing data
  const uniqueWards = Array.from(
    new Set(
      existingData.map((item) => ({
        id: item.wardId,
        number: item.wardNumber || parseInt(item.wardId),
      })),
    ),
  ).sort((a, b) => a.number - b.number);

  // Get unique expense types from existing data for suggestions
  const uniqueExpenseTypes = Array.from(
    new Set(existingData.map((item) => item.remittanceExpense)),
  ).sort();

  // Get the existing record if editing
  const { data: editingData, isLoading: isLoadingEditData } =
    api.profile.economics.wardWiseRemittanceExpenses.getAll.useQuery(
      undefined,
      {
        enabled: !!editId,
      },
    );

  const createMutation =
    api.profile.economics.wardWiseRemittanceExpenses.create.useMutation({
      onSuccess: () => {
        toast.success(
          "नयाँ वडा अनुसार रेमिट्यान्स खर्च प्रकार डाटा सफलतापूर्वक थपियो",
        );
        utils.profile.economics.wardWiseRemittanceExpenses.getAll.invalidate();
        setIsSubmitting(false);
        onClose();
      },
      onError: (error) => {
        toast.error(`त्रुटि: ${error.message}`);
        setIsSubmitting(false);
      },
    });

  const updateMutation =
    api.profile.economics.wardWiseRemittanceExpenses.update.useMutation({
      onSuccess: () => {
        toast.success(
          "वडा अनुसार रेमिट्यान्स खर्च प्रकार डाटा सफलतापूर्वक अपडेट गरियो",
        );
        utils.profile.economics.wardWiseRemittanceExpenses.getAll.invalidate();
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
      remittanceExpense: "",
      households: 0,
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
          wardNumber: recordToEdit.wardNumber || undefined,
          remittanceExpense: recordToEdit.remittanceExpense,
          households: recordToEdit.households || 0,
        });
      }
    }
  }, [editId, editingData, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    // Check if a record already exists with this ward and expense type (for new records)
    if (!editId) {
      const duplicate = existingData.find(
        (item) =>
          item.wardId === values.wardId &&
          item.remittanceExpense.toLowerCase() ===
            values.remittanceExpense.toLowerCase(),
      );
      if (duplicate) {
        toast.error(
          `वडा ${values.wardNumber || values.wardId} को लागि "${values.remittanceExpense}" खर्च प्रकारको डाटा पहिले नै अवस्थित छ`,
        );
        setIsSubmitting(false);
        return;
      }
    }

    // Cast remittance expense to the expected type for API
    const dataToSubmit = {
      ...values,
      remittanceExpense: values.remittanceExpense as any, // Cast to any to resolve type incompatibility
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
            name="wardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>वडा नम्बर</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">
            रेमिट्यान्स खर्च प्रकार विवरण
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="remittanceExpense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>खर्च प्रकार</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="खर्च प्रकार चयन वा हाल्नुहोस्" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">
                          नयाँ खर्च प्रकार हाल्नुहोस्...
                        </SelectItem>
                        <SelectItem value="EDUCATION">शिक्षा</SelectItem>
                        <SelectItem value="HEALTH">स्वास्थ्य</SelectItem>
                        <SelectItem value="HOUSEHOLD_USE">
                          घरायसी प्रयोजन
                        </SelectItem>
                        <SelectItem value="FESTIVALS">चाडपर्व</SelectItem>
                        <SelectItem value="LOAN_PAYMENT">
                          ऋण भुक्तानी
                        </SelectItem>
                        <SelectItem value="LOANED_OTHERS">अरुलाई ऋण</SelectItem>
                        <SelectItem value="SAVING">बचत</SelectItem>
                        <SelectItem value="HOUSE_CONSTRUCTION">
                          घर निर्माण
                        </SelectItem>
                        <SelectItem value="LAND_OWNERSHIP">
                          जग्गा खरिद
                        </SelectItem>
                        <SelectItem value="JEWELRY_PURCHASE">
                          गहना खरिद
                        </SelectItem>
                        <SelectItem value="GOODS_PURCHASE">
                          सामान खरिद
                        </SelectItem>
                        <SelectItem value="BUSINESS_INVESTMENT">
                          व्यापार लगानी
                        </SelectItem>
                        <SelectItem value="OTHER">अन्य</SelectItem>
                        <SelectItem value="UNKNOWN">अज्ञात</SelectItem>
                        {uniqueExpenseTypes
                          .filter(
                            (expenseType) =>
                              ![
                                "EDUCATION",
                                "HEALTH",
                                "HOUSEHOLD_USE",
                                "FESTIVALS",
                                "LOAN_PAYMENT",
                                "LOANED_OTHERS",
                                "SAVING",
                                "HOUSE_CONSTRUCTION",
                                "LAND_OWNERSHIP",
                                "JEWELRY_PURCHASE",
                                "GOODS_PURCHASE",
                                "BUSINESS_INVESTMENT",
                                "OTHER",
                                "UNKNOWN",
                              ].includes(expenseType),
                          )
                          .map((expenseType) => (
                            <SelectItem key={expenseType} value={expenseType}>
                              {expenseType}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("remittanceExpense") === "" && (
              <FormField
                control={form.control}
                name="remittanceExpense"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>नयाँ खर्च प्रकार हाल्नुहोस्</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="उदाहरण: शिक्षा, स्वास्थ्य, घरायसी प्रयोजन, आदि"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="households"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>घरपरिवार संख्या</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
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
