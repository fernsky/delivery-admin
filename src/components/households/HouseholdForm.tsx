"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Household, HouseholdStep, householdSchema } from "@/types/household";
import BasicInformationStep from "./form-steps/BasicInformationStep";
import FamilyDetailsStep from "./form-steps/FamilyDetailsStep";
import HouseDetailsStep from "./form-steps/HouseDetailsStep";
import WaterSanitationStep from "./form-steps/WaterSanitationStep";
import EconomicDetailsStep from "./form-steps/EconomicDetailsStep";
import AgriculturalDetailsStep from "./form-steps/AgriculturalDetailsStep";
import MigrationDetailsStep from "./form-steps/MigrationDetailsStep";
import ReviewStep from "./form-steps/ReviewStep";

interface HouseholdFormProps {
  currentStep: HouseholdStep;
}

export function HouseholdForm({ currentStep }: HouseholdFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<Household>({
    resolver: zodResolver(householdSchema),
    defaultValues: {
      tenant_id: "khajura",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: Household) => {
    try {
      setIsSubmitting(true);
      console.log("Form data to submit:", data);
      // TODO: Implement API call to save the household data
      alert("घरधुरी सफलतापूर्वक दर्ता गरियो!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("घरधुरी दर्ता गर्न असफल भयो। कृपया पुनः प्रयास गर्नुहोस्।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "आधारभूत जानकारी":
        return <BasicInformationStep />;
      case "परिवार विवरण":
        return <FamilyDetailsStep />;
      case "घरको विवरण":
        return <HouseDetailsStep />;
      case "पानी तथा सरसफाई":
        return <WaterSanitationStep />;
      case "आर्थिक विवरण":
        return <EconomicDetailsStep />;
      case "कृषि विवरण":
        return <AgriculturalDetailsStep />;
      case "बसाइँसराई विवरण":
        return <MigrationDetailsStep />;
      case "समीक्षा":
        return (
          <ReviewStep
            onSubmit={() => methods.handleSubmit(onSubmit)()}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {renderStepContent()}
      </form>
    </FormProvider>
  );
}
