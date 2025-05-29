"use client";

import { useState } from "react";
import { HOUSEHOLD_STEPS, HouseholdStep } from "@/types/household";
import { HouseholdForm } from "@/components/households/HouseholdForm";
import StepIndicator from "@/components/households/StepIndicator";
import { Button } from "@/components/ui/button";

export default function NewHouseholdPage() {
  const [step, setStep] = useState<HouseholdStep>(HOUSEHOLD_STEPS[0]);
  const currentStepIndex = HOUSEHOLD_STEPS.findIndex((s) => s === step);

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setStep(HOUSEHOLD_STEPS[currentStepIndex - 1]);
    }
  };

  const goToNextStep = () => {
    if (currentStepIndex < HOUSEHOLD_STEPS.length - 1) {
      setStep(HOUSEHOLD_STEPS[currentStepIndex + 1]);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">New Household Registration</h1>

        <StepIndicator
          steps={HOUSEHOLD_STEPS}
          currentStep={step}
          onStepClick={setStep}
        />

        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <HouseholdForm currentStep={step} />

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStepIndex === 0}
            >
              Previous
            </Button>

            <Button
              onClick={goToNextStep}
              disabled={currentStepIndex === HOUSEHOLD_STEPS.length - 1}
            >
              {currentStepIndex === HOUSEHOLD_STEPS.length - 2
                ? "Review"
                : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
