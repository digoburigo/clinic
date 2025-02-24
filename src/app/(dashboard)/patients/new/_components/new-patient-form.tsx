"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useWindowSize } from "@uidotdev/usehooks";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useLocalStorage } from "@uidotdev/usehooks";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { defineStepper } from "~/components/ui/stepper";
import { useTRPC } from "~/trpc/react";
import {
  AddressInfoForm,
  addressInfoSchema,
} from "./patient-form/address-info";
import { MedicalInfoForm } from "./patient-form/medical-info";
import { medicalInfoSchema } from "./patient-form/medical-info/types";
import {
  PersonalInfoForm,
  personalInfoSchema,
} from "./patient-form/personal-info";
import { ReviewInfo } from "./patient-form/review-info";
import { SocialInfoForm, socialInfoSchema } from "./patient-form/social-info";

import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { Prisma } from "@zenstackhq/runtime/models";

export type AllPatientFields = z.infer<typeof medicalInfoSchema> &
  z.infer<typeof addressInfoSchema> &
  z.infer<typeof personalInfoSchema> &
  z.infer<typeof socialInfoSchema>;

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
    schema: addressInfoSchema,
    Component: AddressInfoForm,
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
      labelOrientation={width && width < 1080 ? "horizontal" : "vertical"}
    >
      <FormStepperComponent />
    </StepperProvider>
  );
}

const FormStepperComponent = () => {
  const trpc = useTRPC();
  const router = useRouter();

  const [newPatientForm, saveNewPatientForm] = useLocalStorage(
    "new-patient-form",
    {
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
      allergies: [],
      medications: [],
      comorbidities: [],
      surgeries: [],
      healthPlans: [],
      examResults: [],
    } as unknown as AllPatientFields,
  );

  const methods = useStepper();

  const { mutate: createPatient, isPending } = useMutation(
    trpc.patient.create.mutationOptions({
      onMutate: () => {
        toast.loading("Criando paciente...", {
          id: "patient-creation-loading",
        });
      },
      onSuccess: (data) => {
        form.reset();
        if (typeof window !== "undefined") {
          localStorage.removeItem("new-patient-form");
        }
        toast.success("Paciente criado com sucesso");
        router.push(`/patients/${data?.id}`);
      },
      onError: () => {
        toast.error("Erro ao criar paciente");
      },
      onSettled: () => {
        toast.dismiss("patient-creation-loading");
      },
    }),
  );

  const form = useForm({
    mode: "onBlur",
    disabled: isPending,
    resolver: zodResolver(methods.current.schema),
    defaultValues: {
      name: newPatientForm.name,
      cpf: newPatientForm.cpf,
      cellphone: newPatientForm.cellphone,
      email: newPatientForm.email,
      sex: newPatientForm.sex,
      responsible: newPatientForm.responsible,
      nationality: newPatientForm.nationality,
      race: newPatientForm.race,
      zipcode: newPatientForm.zipcode,
      state: newPatientForm.state,
      city: newPatientForm.city,
      neighborhood: newPatientForm.neighborhood,
      street: newPatientForm.street,
      number: newPatientForm.number,
      complement: newPatientForm.complement,
      occupation: newPatientForm.occupation,
      sexualOrientation: newPatientForm.sexualOrientation,
      civilStatus: newPatientForm.civilStatus,
      bloodType: newPatientForm.bloodType,
      genderIdentity: newPatientForm.genderIdentity,
      vaccinations: newPatientForm.vaccinations,
      allergies: newPatientForm.allergies,
      medications: newPatientForm.medications,
      comorbidities: newPatientForm.comorbidities,
      surgeries: newPatientForm.surgeries,
      healthPlans: newPatientForm.healthPlans,
      examResults: newPatientForm?.examResults?.length
        ? newPatientForm.examResults?.map((exam) => ({
            ...exam,
            date: exam.date ? new Date(exam.date) : new Date(),
          }))
        : [],
    },
  });

  form.watch(() => {
    saveNewPatientForm(form.getValues() as AllPatientFields);
  });

  const onSubmit = (values: z.infer<typeof methods.current.schema>) => {
    if (methods.isLast) {
      const v = form.getValues() as AllPatientFields;

      createPatient({
        data: {
          name: v.name,
          cpf: v.cpf,
          cellphone: v.cellphone,
          email: v.email,
          sex: v.sex,
          responsible: v.responsible,
          nationality: v.nationality,
          race: v.race,
          zipcode: v.zipcode,
          state: v.state,
          city: v.city,
          neighborhood: v.neighborhood,
          street: v.street,
          number: v.number,
          complement: v.complement,
          occupation: v.occupation,
          sexualOrientation: v.sexualOrientation,
          civilStatus: v.civilStatus,
          bloodType: v.bloodType,
          genderIdentity: v.genderIdentity,
          vaccinations: {
            createMany: {
              data: v.vaccinations.map((v) => ({
                vaccinationsValuesId: v.id,
              })) as Prisma.VaccinationsCreateManyPatientInput[],
            },
          },
          allergies: {
            createMany: {
              data: v.allergies?.map((a) => ({
                allergiesValuesId: a.id,
              })) as Prisma.AllergiesCreateManyPatientInput[],
            },
          },
          medications: {
            createMany: {
              data: v.medications?.map((m) => ({
                medicationsValuesId: m.id,
              })) as Prisma.MedicationsCreateManyPatientInput[],
            },
          },
          examResults: {
            createMany: {
              data: v.examResults?.map((r) => ({
                examResultsValuesId: r.type.at(0)?.id,
                result: r.result,
                date: r.date,
              })) as Prisma.ExamResultsCreateManyPatientInput[],
            },
          },
          comorbidities: {
            createMany: {
              data: v.comorbidities?.map((c) => ({
                comorbiditiesValuesId: c.id,
              })) as Prisma.ComorbiditiesCreateManyPatientInput[],
            },
          },
          surgeries: {
            createMany: {
              data: v.surgeries?.map((s) => ({
                surgeriesValuesId: s.id,
              })) as Prisma.SurgeriesCreateManyPatientInput[],
            },
          },
          healthPlans: {
            createMany: {
              data: v.healthPlans?.map((h) => ({
                healthPlansValuesId: h.id,
              })) as Prisma.HealthPlansCreateManyPatientInput[],
            },
          },
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        aria-disabled={isPending}
      >
        <StepperNavigation aria-disabled={isPending}>
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
        <StepperControls aria-disabled={isPending}>
          {!methods.isLast && (
            <Button
              variant="secondary"
              onClick={() => {
                methods.prev();
              }}
              disabled={methods.isFirst || isPending}
            >
              Anterior
            </Button>
          )}
          <Button
            type="button"
            disabled={isPending}
            onClick={() => {
              if (methods.isLast) {
                form.handleSubmit(onSubmit)();
                return;
              }

              methods.beforeNext(async () => {
                const valid = await form.trigger();
                if (!valid) return false;
                return true;
              });
            }}
          >
            {methods.isLast ? "Adicionar" : "Próximo"}
          </Button>
        </StepperControls>
      </form>
    </Form>
  );
};
