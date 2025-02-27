"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@zenstackhq/runtime/models";
import { isEqual } from "lodash-es";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Form } from "~/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useTRPC } from "~/trpc/react";
import { AllergiesField } from "../../../new/_components/patient-form/medical-info/allergies-field";
import { ComorbiditiesField } from "../../../new/_components/patient-form/medical-info/comorbidities-field";
import { MedicationsField } from "../../../new/_components/patient-form/medical-info/medications-field";
import {
  EvaluationForm,
  evaluationSchema,
} from "../new/_components/appointment-form/evaluation-info";
import {
  ObjectiveForm,
  objectiveSchema,
} from "../new/_components/appointment-form/objective-info";
import {
  PlanForm,
  planSchema,
} from "../new/_components/appointment-form/plan-info";
import {
  SubjectiveForm,
  subjectiveSchema,
} from "../new/_components/appointment-form/subject-info";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

type AppointmentTabs = "subjective" | "objective" | "evaluation" | "plan";

const appointmentEntityInclude = {
  include: {
    cids: {
      include: {
        cid: true,
      },
    },
    allergies: {
      include: {
        allergiesValues: true,
      },
    },
    medications: {
      include: {
        medicationsValues: true,
      },
    },
    comorbidities: {
      include: {
        comorbiditiesValues: true,
      },
    },
  },
} satisfies Prisma.AppointmentDefaultArgs;

export type AppointmentEntity = Prisma.AppointmentGetPayload<
  typeof appointmentEntityInclude
>;

function formatAppointment(appointment: AppointmentEntity) {
  return {
    ...appointment,
    cids:
      appointment?.cids?.map((cid) => ({
        id: cid.cid.id,
        value: cid.cid.code,
        label: `${cid.cid.code} - ${cid.cid.description}`,
      })) || [],
    allergies:
      appointment?.allergies?.map((allergy) => ({
        ...allergy.allergiesValues,
        label: allergy.allergiesValues.value,
      })) || [],
    medications:
      appointment?.medications?.map((medication) => ({
        ...medication.medicationsValues,
        label: medication.medicationsValues.value,
      })) || [],
    comorbidities:
      appointment?.comorbidities?.map((comorbidity) => ({
        ...comorbidity.comorbiditiesValues,
        label: comorbidity.comorbiditiesValues.value,
      })) || [],
  };
}

export function AppointmentDetails({
  appointmentId,
  patientId,
}: {
  appointmentId: string;
  patientId: string;
}) {
  const trpc = useTRPC();
  const { data: appointment } = useSuspenseQuery(
    trpc.appointment.findUnique.queryOptions<AppointmentEntity>({
      where: {
        id: appointmentId,
      },
      include: {
        cids: {
          include: {
            cid: {
              select: {
                id: true,
                code: true,
                description: true,
              },
            },
          },
        },
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
    }),
  );

  const [schemas] = useState<Record<AppointmentTabs, z.ZodSchema>>(() => ({
    subjective: subjectiveSchema,
    objective: objectiveSchema,
    evaluation: evaluationSchema,
    plan: planSchema,
  }));

  const [tab, setTab] = useState<AppointmentTabs>("subjective");
  const [formHasChanged, setFormHasChanged] = useState(false);

  const form = useForm({
    mode: "onBlur",
    resolver: zodResolver(schemas[tab]),
    defaultValues: formatAppointment(appointment),
  });

  form.watch(() => {
    const formIsEqual = isEqual(form.formState.defaultValues, form.getValues());
    setFormHasChanged(!formIsEqual);
  });

  const queryClient = useQueryClient();
  const { mutateAsync: updateAppointmentAsync } = useMutation(
    trpc.appointment.update.mutationOptions({
      onMutate: () => {
        toast.loading("Atualizando consulta...", {
          id: "appointment-update-loading",
        });
      },
      onError: (err) => {
        toast.error("Erro ao atualizar consulta");
      },
      onSettled: () => {
        toast.dismiss("appointment-update-loading");
      },
    }),
  );

  const { mutate: updateAppointment, isPending } = useMutation(
    trpc.appointment.update.mutationOptions({
      onMutate: () => {
        toast.loading("Atualizando consulta...", {
          id: "appointment-update-loading",
        });
      },
      onSuccess: () => {
        toast.success("Consulta atualizada com sucesso");
        queryClient.invalidateQueries({
          queryKey: trpc.appointment.findUnique.queryKey({
            where: {
              id: appointmentId,
            },
          }),
        });
      },
      onError: (err) => {
        toast.error("Erro ao atualizar consulta");
      },
      onSettled: () => {
        toast.dismiss("appointment-update-loading");
      },
    }),
  );

  async function onSubmit(values: z.infer<(typeof schemas)[typeof tab]>) {
    const v = form.getValues();

    await updateAppointmentAsync({
      where: {
        id: appointmentId,
      },
      data: {
        cids: {
          deleteMany: {
            appointmentId: appointmentId,
          },
        },
        allergies: {
          deleteMany: {
            appointmentId: appointmentId,
          },
        },
        medications: {
          deleteMany: {
            appointmentId: appointmentId,
          },
        },
        comorbidities: {
          deleteMany: {
            appointmentId: appointmentId,
          },
        },
      },
    });

    updateAppointment({
      where: {
        id: appointmentId,
      },
      data: {
        subjective: v.subjective,
        objective: v.objective,
        evaluation: v.evaluation,
        plan: v.plan,
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
            })),
          },
        },
        allergies: {
          createMany: {
            data: v.allergies.map((a: { id: string }) => ({
              allergiesValuesId: a.id,
            })),
          },
        },
        comorbidities: {
          createMany: {
            data: v.comorbidities.map((c: { id: string }) => ({
              comorbiditiesValuesId: c.id,
            })),
          },
        },
      },
    });
  }

  if (!appointment) {
    return <div>Consulta não encontrada</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Dados
              {formHasChanged ? (
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Salvando..." : "Salvar"}
                </Button>
              ) : null}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AllergiesField />

              <MedicationsField />

              <ComorbiditiesField />
            </div>

            <Tabs
              defaultValue={tab}
              onValueChange={(value) => setTab(value as AppointmentTabs)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="subjective">Subjetivo</TabsTrigger>
                <TabsTrigger value="objective">Objetivo</TabsTrigger>
                <TabsTrigger value="evaluation">Avaliação</TabsTrigger>
                <TabsTrigger value="plan">Plano</TabsTrigger>
              </TabsList>

              <TabsContent value="subjective">
                <SubjectiveForm />
              </TabsContent>

              <TabsContent value="objective">
                <ObjectiveForm />
              </TabsContent>

              <TabsContent value="evaluation">
                <EvaluationForm />
              </TabsContent>

              <TabsContent value="plan">
                <PlanForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
