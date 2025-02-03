"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useWindowSize } from "@uidotdev/usehooks";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { defineStepper } from "~/components/ui/stepper2";
import { useLocalStorage } from "@uidotdev/usehooks";
import { ClientOnly } from "~/lib/client-only";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import {
  SubjectiveForm,
  subjectiveSchema,
} from "./appointment-form/subject-info";
import {
  ObjectiveForm,
  objectiveSchema,
} from "./appointment-form/objective-info";
import {
  EvaluationForm,
  evaluationSchema,
} from "./appointment-form/evaluation-info";
import { ReviewInfo } from "./appointment-form/review-info";
import { PlanForm, planSchema } from "./appointment-form/plan-info";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { AppointmentMedical } from "./appointment-form/appointment-medical";

const {
  StepperProvider,
  StepperControls,
  StepperNavigation,
  StepperStep,
  StepperTitle,
  useStepper,
} = defineStepper(
  {
    id: "subjective",
    title: "Subjetivo",
    schema: subjectiveSchema,
    Component: SubjectiveForm,
  },
  {
    id: "objective",
    title: "Objetivo",
    schema: objectiveSchema,
    Component: ObjectiveForm,
  },
  {
    id: "evaluation",
    title: "Avaliação",
    schema: evaluationSchema,
    Component: EvaluationForm,
  },
  {
    id: "plan",
    title: "Plano",
    schema: planSchema,
    Component: PlanForm,
  },
  {
    id: "review",
    title: "Revisão",
    schema: z.object({}),
    Component: ReviewInfo,
  },
);

export default function NewAppointmentForm() {
  const { width } = useWindowSize();

  return (
    <StepperProvider
      variant={width && width < 1080 ? "vertical" : "horizontal"}
      labelOrientation={width && width < 1080 ? "horizontal" : "vertical"}
    >
      <ClientOnly>
        <FormStepperComponent />
      </ClientOnly>
    </StepperProvider>
  );
}

const FormStepperComponent = () => {
  const router = useRouter();
  const params = useParams();
  const [newAppointmentForm, saveNewAppointmentForm] = useLocalStorage(
    "new-appointment-form",
    {},
  );

  const methods = useStepper();

  const { mutate: createAppointment, isPending } =
    api.appointment.create.useMutation({
      onMutate: () => {
        toast.loading("Criando consulta...", {
          id: "appointment-creation-loading",
        });
      },
      onSuccess: (data) => {
        form.reset();
        if (typeof window !== "undefined") {
          localStorage.removeItem("new-appointment-form");
        }
        toast.success("Consulta criada com sucesso");
        router.push(`/patients/${params.id}/appointments/${data?.id}`);
      },
      onError: () => {
        toast.error("Erro ao criar consulta");
      },
      onSettled: () => {
        toast.dismiss("appointment-creation-loading");
      },
    });

  const form = useForm({
    mode: "onBlur",
    disabled: isPending,
    resolver: zodResolver(methods.current.schema),
    defaultValues: {
      motive: "",
      subjective: "",
      objective: "",
      evaluation: "",
      plan: "",
      cids: [],
      medications: [],
      allergies: [],
      comorbidities: [],
      ...newAppointmentForm,
    },
  });

  form.watch(() => {
    saveNewAppointmentForm(form.getValues());
  });

  const onSubmit = (values: z.infer<typeof methods.current.schema>) => {
    if (methods.isLast) {
      const v = form.getValues();

      createAppointment({
        data: {
          motive: v.motive,
          subjective: v.subjective,
          objective: v.objective,
          evaluation: v.evaluation,
          plan: v.plan,
          patientId: params.id as string,
          cids: {
            createMany: {
              data: v.cids.map((c: { id: string }) => ({
                cidId: c.id,
              })),
            },
          },
          medications: {
            createMany: {
              data: v.medications.map((m: { id: string }) => ({
                medicationsValuesId: m.id,
                patientId: params.id as string,
              })),
            },
          },
          allergies: {
            createMany: {
              data: v.allergies.map((a: { id: string }) => ({
                allergiesValuesId: a.id,
                patientId: params.id as string,
              })),
            },
          },
          comorbidities: {
            createMany: {
              data: v.comorbidities.map((c: { id: string }) => ({
                comorbiditiesValuesId: c.id,
                patientId: params.id as string,
              })),
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
        <AppointmentMedical />

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
          subjective: ({ Component }) => <Component />,
          objective: ({ Component }) => <Component />,
          evaluation: ({ Component }) => <Component />,
          plan: ({ Component }) => <Component />,
          review: ({ Component }) => <Component />,
        })}
        <StepperControls aria-disabled={isPending}>
          {(!methods.isFirst) && (
            <Button
              variant="secondary"
              onClick={methods.prev}
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
