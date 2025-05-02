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
import { AgeGroupEnum } from "@/server/api/routers/profile/demographics/ward-age-wise-population.schema";

// Create a schema for the form
const formSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.coerce.number().int().min(1, "वडा नम्बर आवश्यक छ"),
  ageGroup: z.enum(
    [
      "AGE_0_4",
      "AGE_5_9",
      "AGE_10_14",
      "AGE_15_19",
      "AGE_20_24",
      "AGE_25_29",
      "AGE_30_34",
      "AGE_35_39",
      "AGE_40_44",
      "AGE_45_49",
      "AGE_50_54",
      "AGE_55_59",
      "AGE_60_64",
      "AGE_65_69",
      "AGE_70_74",
      "AGE_75_AND_ABOVE",
    ],
    { required_error: "उमेर समूह चयन गर्नुहोस्" },
  ),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    required_error: "लिङ्ग चयन गर्नुहोस्",
  }),
  population: z.coerce
    .number()
    .int()
    .nonnegative("जनसंख्या 0 वा सकारात्मक हुनुपर्छ"),
});

type Gender = "MALE" | "FEMALE" | "OTHER";
type AgeGroup = z.infer<typeof AgeGroupEnum>;

interface WardAgeWisePopulationData {
  id: string;
  wardNumber: number;
  ageGroup: AgeGroup;
  gender: Gender;
  population: number;
}

interface WardAgeWisePopulationFormProps {
  editId: string | null;
  onClose: () => void;
  existingData: WardAgeWisePopulationData[];
}

export default function WardAgeWisePopulationForm({
  editId,
  onClose,
  existingData,
}: WardAgeWisePopulationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utils = api.useContext();

  const createMutation =
    api.profile.demographics.wardAgeWisePopulation.create.useMutation({
      onSuccess: () => {
        toast.success("नयाँ उमेर समूह जनसंख्या डाटा सफलतापूर्वक थपियो");
        utils.profile.demographics.wardAgeWisePopulation.getAll.invalidate();
        setIsSubmitting(false);
        onClose();
      },
      onError: (error) => {
        toast.error(`त्रुटि: ${error.message}`);
        setIsSubmitting(false);
      },
    });

  const updateMutation =
    api.profile.demographics.wardAgeWisePopulation.update.useMutation({
      onSuccess: () => {
        toast.success("उमेर समूह जनसंख्या डाटा सफलतापूर्वक अपडेट गरियो");
        utils.profile.demographics.wardAgeWisePopulation.getAll.invalidate();
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
      wardNumber: undefined,
      ageGroup: undefined,
      gender: undefined,
      population: 0,
    },
  });

  // Populate the form when editing
  useEffect(() => {
    if (editId) {
      const recordToEdit = existingData.find((record) => record.id === editId);
      if (recordToEdit) {
        form.reset({
          id: recordToEdit.id,
          wardNumber: recordToEdit.wardNumber,
          ageGroup: recordToEdit.ageGroup,
          gender: recordToEdit.gender,
          population: recordToEdit.population,
        });
      }
    } else {
      form.reset({
        wardNumber: undefined,
        ageGroup: undefined,
        gender: undefined,
        population: 0,
      });
    }
  }, [editId, existingData, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    // Check if a record already exists with this ward, age group, and gender (for new records)
    if (!editId) {
      const duplicate = existingData.find(
        (item) =>
          item.wardNumber === values.wardNumber &&
          item.ageGroup === values.ageGroup &&
          item.gender === values.gender,
      );
      if (duplicate) {
        toast.error(
          `वडा ${values.wardNumber}, उमेर समूह ${getAgeGroupLabel(values.ageGroup)}, र लिङ्ग ${getGenderLabel(values.gender)} को डाटा पहिले नै अवस्थित छ`,
        );
        setIsSubmitting(false);
        return;
      }
    }

    if (editId) {
      updateMutation.mutate({ ...values, id: editId });
    } else {
      createMutation.mutate(values);
    }
  };

  const getGenderLabel = (gender: Gender) => {
    switch (gender) {
      case "MALE":
        return "पुरुष";
      case "FEMALE":
        return "महिला";
      case "OTHER":
        return "अन्य";
      default:
        return gender;
    }
  };

  const getAgeGroupLabel = (ageGroup: AgeGroup) => {
    switch (ageGroup) {
      case "AGE_0_4":
        return "०-४ वर्ष";
      case "AGE_5_9":
        return "५-९ वर्ष";
      case "AGE_10_14":
        return "१०-१४ वर्ष";
      case "AGE_15_19":
        return "१५-१९ वर्ष";
      case "AGE_20_24":
        return "२०-२४ वर्ष";
      case "AGE_25_29":
        return "२५-२९ वर्ष";
      case "AGE_30_34":
        return "३०-३४ वर्ष";
      case "AGE_35_39":
        return "३५-३९ वर्ष";
      case "AGE_40_44":
        return "४०-४४ वर्ष";
      case "AGE_45_49":
        return "४५-४९ वर्ष";
      case "AGE_50_54":
        return "५०-५४ वर्ष";
      case "AGE_55_59":
        return "५५-५९ वर्ष";
      case "AGE_60_64":
        return "६०-६४ वर्ष";
      case "AGE_65_69":
        return "६५-६९ वर्ष";
      case "AGE_70_74":
        return "७०-७४ वर्ष";
      case "AGE_75_AND_ABOVE":
        return "७५+ वर्ष";
      default:
        return ageGroup;
    }
  };

  const ageGroupOptions = [
    { value: "AGE_0_4", label: "०-४ वर्ष" },
    { value: "AGE_5_9", label: "५-९ वर्ष" },
    { value: "AGE_10_14", label: "१०-१४ वर्ष" },
    { value: "AGE_15_19", label: "१५-१९ वर्ष" },
    { value: "AGE_20_24", label: "२०-२४ वर्ष" },
    { value: "AGE_25_29", label: "२५-२९ वर्ष" },
    { value: "AGE_30_34", label: "३०-३४ वर्ष" },
    { value: "AGE_35_39", label: "३५-३९ वर्ष" },
    { value: "AGE_40_44", label: "४०-४४ वर्ष" },
    { value: "AGE_45_49", label: "४५-४९ वर्ष" },
    { value: "AGE_50_54", label: "५०-५४ वर्ष" },
    { value: "AGE_55_59", label: "५५-५९ वर्ष" },
    { value: "AGE_60_64", label: "६०-६४ वर्ष" },
    { value: "AGE_65_69", label: "६५-६९ वर्ष" },
    { value: "AGE_70_74", label: "७०-७४ वर्ष" },
    { value: "AGE_75_AND_ABOVE", label: "७५+ वर्ष" },
  ];

  const genderOptions = [
    { value: "MALE", label: "पुरुष" },
    { value: "FEMALE", label: "महिला" },
    { value: "OTHER", label: "अन्य" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
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

          <FormField
            control={form.control}
            name="ageGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>उमेर समूह</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="उमेर समूह चयन गर्नुहोस्" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ageGroupOptions.map((option) => (
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
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>लिङ्ग</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="लिङ्ग चयन गर्नुहोस्" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {genderOptions.map((option) => (
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
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
