"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useWindowSize } from "@uidotdev/usehooks";

import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { defineStepper } from "~/components/ui/stepper2";
import { PersonalInfoForm, personalInfoSchema } from "./personal-info";
import { AdressInfoForm, adressInfoSchema } from "./adress-info";
import { SocialInfoForm, socialInfoSchema } from "./social-info";
import { useLocalStorage } from "@uidotdev/usehooks";
import { ClientOnly } from "~/lib/client-only";
import { ReviewInfo } from "./review-info";
import { medicalInfoSchema } from "./medical-info/types";
import { MedicalInfoForm } from "./medical-info";

const {
  StepperProvider,
  StepperControls,
  StepperNavigation,
  StepperStep,
  StepperTitle,
  useStepper,
} = defineStepper(
  {
    id: "personalInfo",
    title: "Informações Pessoais",
    schema: personalInfoSchema,
    Component: PersonalInfoForm,
  },
  {
    id: "adressInfo",
    title: "Endereço",
    schema: adressInfoSchema,
    Component: AdressInfoForm,
  },
  {
    id: "socialInfo",
    title: "Informações Sociais",
    schema: socialInfoSchema,
    Component: SocialInfoForm,
  },
  {
    id: "medicalInfo",
    title: "Informações Médicas",
    schema: medicalInfoSchema,
    Component: MedicalInfoForm,
  },
  {
    id: "review",
    title: "Revisão",
    schema: z.object({}),
    Component: ReviewInfo,
  },
);

export default function PatientForm() {
  const { width } = useWindowSize();

  return (
    <StepperProvider
      variant={width && width < 1080 ? "vertical" : "horizontal"}
    >
      <ClientOnly>
        <FormStepperComponent />
      </ClientOnly>
    </StepperProvider>
  );
}

const FormStepperComponent = () => {
  const [newPatientForm, saveNewPatientForm] = useLocalStorage(
    "new-patient-form",
    {},
  );

  const methods = useStepper();

  const form = useForm({
    mode: "onBlur",
    resolver: zodResolver(methods.current.schema),
    defaultValues: {
      name: "",
      cpf: "",
      cellphone: "",
      email: "",
      sex: "",
      responsible: "",
      nationality: "",
      race: "",
      zipcode: "",
      state: "",
      city: "",
      neighborhood: "",
      street: "",
      number: "",
      complement: "",
      occupation: "",
      sexualOrientation: "",
      civilStatus: "",
      bloodType: "",
      genderIdentity: "",
      vaccinations: [],
      allergies: "",
      medications: "",
      resultsExams: "",
      comorbidities: "",
      surgeries: "",
      healthPlan: "",
      ...newPatientForm,
    },
  });

  form.watch(() => {
    saveNewPatientForm(form.getValues());
  });

  const onSubmit = (values: z.infer<typeof methods.current.schema>) => {
    console.log(`Form values for step ${methods.current.id}:`, values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <StepperNavigation>
          {methods.all.map((step) => (
            <StepperStep
              key={step.id}
              of={step.id}
              type={step.id === methods.current.id ? "submit" : "button"}
              onClick={async () => {
                const valid = await form.trigger();
                if (!valid) return;
                methods.goTo(step.id);
              }}
            >
              <StepperTitle>{step.title}</StepperTitle>
            </StepperStep>
          ))}
        </StepperNavigation>
        {methods.switch({
          personalInfo: ({ Component }) => <Component />,
          adressInfo: ({ Component }) => <Component />,
          socialInfo: ({ Component }) => <Component />,
          medicalInfo: ({ Component }) => <Component />,
          review: ({ Component }) => <Component />,
        })}
        <StepperControls>
          {!methods.isLast && (
            <Button
              variant="secondary"
              onClick={methods.prev}
              disabled={methods.isFirst}
            >
              Anterior
            </Button>
          )}
          <Button
            type="submit"
            onClick={() => {
              if (methods.isLast) {
                methods.reset();
                return;
              }
              methods.beforeNext(async () => {
                const valid = await form.trigger();
                if (!valid) return false;
                return true;
              });
            }}
          >
            {methods.isLast ? "Resetar" : "Próximo"}
          </Button>
        </StepperControls>
      </form>
    </Form>
  );
};
