"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Step, Stepper, useStepper } from "~/components/ui/stepper";
import { toast } from "sonner";
import { FirstStepForm } from "./first-form";
import { SecondStepForm } from "./second-form";
import { ThirdStepForm } from "./third-form";
import { FourthStepForm } from "./fourth-form";

const steps = [
  { label: "Informações Pessoais", description: "Descrição 1" },
  { label: "Informações Sociodemográficas", description: "Descrição 2" },
  { label: "Informações Médicas", description: "Descrição 3" },
  { label: "Histórico Médico", description: "Descrição 4" },
];

export default function StepperDemo() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Stepper variant="circle-alt" initialStep={0} steps={steps}>
        {steps.map((stepProps, index) => {
          if (index === 0) {
            return (
              <Step key={stepProps.label} {...stepProps}>
                <FirstStepForm />
              </Step>
            );
          }
          if (index === 1) {
            return (
              <Step key={stepProps.label} {...stepProps}>
                <SecondStepForm />
              </Step>
            );
          }
          if (index === 2) {
            return (
              <Step key={stepProps.label} {...stepProps}>
                <ThirdStepForm />
              </Step>
            );
          }
          return (
            <Step key={stepProps.label} {...stepProps}>
              <FourthStepForm />
            </Step>
          );
        })}
        <MyStepperFooter />
      </Stepper>
    </div>
  );
}



function MyStepperFooter() {
  const { activeStep, resetSteps, steps } = useStepper();

  if (activeStep !== steps.length) {
    return null;
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button onClick={resetSteps}>Reset Stepper with Form</Button>
    </div>
  );
}
