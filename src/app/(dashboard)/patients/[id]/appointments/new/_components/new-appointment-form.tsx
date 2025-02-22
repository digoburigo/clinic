"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalStorage, useWindowSize } from "@uidotdev/usehooks";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Form } from "~/components/ui/form";
import { defineStepper } from "~/components/ui/stepper";
import { ClientOnly } from "~/lib/client-only";
import { api } from "~/trpc/react";
import { PatientEntityNewAppointment } from "~/types/db-entities";
import { AppointmentMedical } from "./appointment-form/appointment-medical";
import {
  EvaluationForm,
  evaluationSchema,
} from "./appointment-form/evaluation-info";
import {
  ObjectiveForm,
  objectiveSchema,
} from "./appointment-form/objective-info";
import { PlanForm, planSchema } from "./appointment-form/plan-info";
import { ReviewInfo, type AllFields } from "./appointment-form/review-info";
import {
  SubjectiveForm,
  subjectiveSchema,
} from "./appointment-form/subject-info";

function formatPatientNewAppointment(patient: PatientEntityNewAppointment) {
  return {
    ...patient,
    allergies:
      patient?.allergies?.map((allergy) => ({
        ...allergy.allergiesValues,
        label: allergy.allergiesValues.value,
        external: true,
      })) || [],
    medications:
      patient?.medications?.map((medication) => ({
        ...medication.medicationsValues,
        label: medication.medicationsValues.value,
        external: true,
      })) || [],
    comorbidities:
      patient?.comorbidities?.map((comorbidity) => ({
        ...comorbidity.comorbiditiesValues,
        label: comorbidity.comorbiditiesValues.value,
        external: true,
      })) || [],
  };
}

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

export default function NewAppointmentForm({
  patientId,
}: {
  patientId: string;
}) {
  const { width } = useWindowSize();

  const [patient] =
    api.patient.findUnique.useSuspenseQuery<PatientEntityNewAppointment>({
      where: {
        id: patientId,
      },
      include: {
        allergies: {
          include: {
            allergiesValues: {
              select: {
                id: true,
                value: true,
              },
            },
          },
        },
        medications: {
          include: {
            medicationsValues: {
              select: {
                id: true,
                value: true,
              },
            },
          },
        },
        comorbidities: {
          include: {
            comorbiditiesValues: {
              select: {
                id: true,
                value: true,
              },
            },
          },
        },
      },
    });

  return (
    <StepperProvider
      variant={width && width < 1080 ? "vertical" : "horizontal"}
      labelOrientation={width && width < 1080 ? "horizontal" : "vertical"}
    >
      <ClientOnly>
        <FormStepperComponent patient={patient} />
      </ClientOnly>
    </StepperProvider>
  );
}

const FormStepperComponent = ({
  patient,
}: {
  patient: PatientEntityNewAppointment;
}) => {
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

  const { data: defaultObjectiveInformation } =
    api.defaultObjectiveInformation.findFirst.useQuery();

  console.log(` patient:`, patient);

  const formatedPatient = useMemo(
    () => formatPatientNewAppointment(patient),
    [patient],
  );

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
    },
    values: {
      ...newAppointmentForm,
      objective: defaultObjectiveInformation?.text?.replace(/\\n/g, "\n") ?? "",
      medications: formatedPatient.medications,
      allergies: formatedPatient.allergies,
      comorbidities: formatedPatient.comorbidities,
    },
  });

  const motive = form.watch("motive");

  form.watch(() => {
    saveNewAppointmentForm(form.getValues());
  });

  const onSubmit = (values: z.infer<typeof methods.current.schema>) => {
    if (methods.isLast) {
      const v = form.getValues() as AllFields;

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
              data: v.cids.map((c) => ({
                cidId: c.id,
              })),
            },
          },
          medications: {
            createMany: {
              data: v.medications.map((m) => ({
                medicationsValuesId: m.id,
              })),
            },
          },
          allergies: {
            createMany: {
              data: v.allergies.map((a) => ({
                allergiesValuesId: a.id,
              })),
            },
          },
          comorbidities: {
            createMany: {
              data: v.comorbidities.map((c) => ({
                comorbiditiesValuesId: c.id,
              })),
            },
          },
        },
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="relative">
          Nova consulta para {patient.name}
          {motive ? (
            <CardDescription className="absolute top-4 left-0 font-medium">
              Motivo: {motive}
            </CardDescription>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent>
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
              {!methods.isFirst && (
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
      </CardContent>
    </Card>
  );
};
