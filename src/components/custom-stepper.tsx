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

const steps = [
  { label: "Informações Pessoais", description: "Descrição 1" },
  { label: "informações Sociodemográficas", description: "Descrição 2" },
  { label: "Informações Médicas", description: "Descrição 3" },
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

          return (
            <Step key={stepProps.label} {...stepProps}>
              <SecondStepForm />
            </Step>
          );
        })}
        <MyStepperFooter />
      </Stepper>
    </div>
  );
}

const FirstFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

function FirstStepForm() {
  const { nextStep } = useStepper();

  const form = useForm<z.infer<typeof FirstFormSchema>>({
    resolver: zodResolver(FirstFormSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(data: z.infer<typeof FirstFormSchema>) {
    nextStep();
    toast.success("Parabéns você completou o primeiro passo!");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu nome completo" {...field} />
              </FormControl>

              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu CPF" {...field} />
              </FormControl>

              <FormLabel>Celular</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>

              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu melhor Email" {...field} />
              </FormControl>

              <FormLabel>Sexo</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>

              <FormLabel>Responsável</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>

              <FormLabel>Nacionalidade</FormLabel>
              <FormControl>
                <Input placeholder="Digite sua nacionalidade" {...field} />
              </FormControl>

              <FormLabel>Raça / Cor</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>


              <FormDescription>
                
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <StepperFormActions />
      </form>
    </Form>
  );
}


function StepperFormActions() {
  const {
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
  } = useStepper();

  return (
    <div className="flex w-full justify-end gap-2">
      {hasCompletedAllSteps ? (
        <Button size="sm" onClick={resetSteps}>
          Reset
        </Button>
      ) : (
        <>
          <Button
            disabled={isDisabledStep}
            onClick={prevStep}
            size="sm"
            variant="secondary"
          >
            Prev
          </Button>
          <Button size="sm">
            {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
          </Button>
        </>
      )}
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
