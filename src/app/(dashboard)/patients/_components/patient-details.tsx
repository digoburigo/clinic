"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { PatientEntity } from "~/types/db-entities";
import {
  AddressInfoForm,
  addressInfoSchema,
} from "../new/_components/patient-form/address-info";
import { MedicalInfoForm } from "../new/_components/patient-form/medical-info";
import { medicalInfoSchema } from "../new/_components/patient-form/medical-info/types";
import {
  PersonalInfoForm,
  personalInfoSchema,
} from "../new/_components/patient-form/personal-info";
import {
  SocialInfoForm,
  socialInfoSchema,
} from "../new/_components/patient-form/social-info";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

type PatientTabs = "medical" | "personal" | "address" | "social";

function formatPatient(patient: PatientEntity) {
  return {
    ...patient,
    vaccinations:
      patient?.vaccinations?.map((vaccination) => ({
        ...vaccination.vaccinationsValues,
        label: vaccination.vaccinationsValues.value,
        exists: true,
      })) || [],
    allergies:
      patient?.allergies?.map((allergy) => ({
        ...allergy.allergiesValues,
        label: allergy.allergiesValues.value,
        exists: true,
      })) || [],
    medications:
      patient?.medications?.map((medication) => ({
        ...medication.medicationsValues,
        label: medication.medicationsValues.value,
        exists: true,
      })) || [],
    comorbidities:
      patient?.comorbidities?.map((comorbidity) => ({
        ...comorbidity.comorbiditiesValues,
        label: comorbidity.comorbiditiesValues.value,
        exists: true,
      })) || [],
    examResults:
      patient?.examResults?.map((examResult) => ({
        ...examResult.examResultsValues,
        label: examResult.examResultsValues.value,
        exists: true,
        result: examResult.result,
        date: examResult.date,
      })) || [],
    surgeries:
      patient?.surgeries?.map((surgery) => ({
        ...surgery.surgeriesValues,
        label: surgery.surgeriesValues.value,
        exists: true,
      })) || [],
    healthPlans:
      patient?.healthPlans?.map((healthPlan) => ({
        ...healthPlan.healthPlansValues,
        label: healthPlan.healthPlansValues.value,
        exists: true,
      })) || [],
  };
}

export function PatientDetails({ patientId }: { patientId: string }) {
  const trpc = useTRPC();
  const { data: patient } = useSuspenseQuery(
    trpc.patient.findUnique.queryOptions<PatientEntity>({
      where: {
        id: patientId,
      },
      include: {
        vaccinations: {
          include: {
            vaccinationsValues: {
              select: {
                id: true,
                value: true,
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
        examResults: {
          include: {
            examResultsValues: {
              select: {
                id: true,
                value: true,
              },
            },
          },
        },
        surgeries: {
          include: {
            surgeriesValues: {
              select: {
                id: true,
                value: true,
              },
            },
          },
        },
        healthPlans: {
          include: {
            healthPlansValues: {
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

  const [schemas] = useState<Record<PatientTabs, z.ZodSchema>>(() => ({
    personal: personalInfoSchema,
    address: addressInfoSchema,
    social: socialInfoSchema,
    medical: medicalInfoSchema,
  }));

  const [tab, setTab] = useState<PatientTabs>("personal");
  const [formHasChanged, setFormHasChanged] = useState(false);

  const form = useForm({
    mode: "onBlur",
    resolver: zodResolver(schemas[tab]),
    defaultValues: formatPatient(patient),
  });

  form.watch(() => {
    const formIsEqual = isEqual(form.formState.defaultValues, form.getValues());
    setFormHasChanged(!formIsEqual);
  });

  const queryClient = useQueryClient();

  const { mutateAsync: updatePatientAsync } = useMutation(
    trpc.patient.update.mutationOptions({
      onMutate: () => {
        toast.loading("Atualizando paciente...", {
          id: "patient-update-loading",
        });
      },
      onError: (err) => {
        toast.error("Erro ao atualizar paciente");
      },
      onSettled: () => {
        toast.dismiss("patient-update-loading");
      },
    }),
  );

  const { mutate: updatePatient, isPending } = useMutation(
    trpc.patient.update.mutationOptions({
      onMutate: () => {
        toast.loading("Atualizando paciente...", {
          id: "patient-update-loading",
        });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.patient.findUnique.queryKey({
            where: {
              id: patientId,
            },
          }),
        });
        toast.success("Paciente atualizado com sucesso");
      },
      onError: (err) => {
        toast.error("Erro ao atualizar paciente");
      },
      onSettled: () => {
        toast.dismiss("patient-update-loading");
      },
    }),
  );

  async function onSubmit(values: z.infer<(typeof schemas)[typeof tab]>) {
    const v = form.getValues();

    await updatePatientAsync({
      where: {
        id: patientId,
      },
      data: {
        vaccinations: {
          deleteMany: {
            patientId: patientId,
          },
        },
        allergies: {
          deleteMany: {
            patientId: patientId,
          },
        },
        medications: {
          deleteMany: {
            patientId: patientId,
          },
        },
        examResults: {
          deleteMany: {
            patientId: patientId,
          },
        },
        comorbidities: {
          deleteMany: {
            patientId: patientId,
          },
        },
        surgeries: {
          deleteMany: {
            patientId: patientId,
          },
        },
        healthPlans: {
          deleteMany: {
            patientId: patientId,
          },
        },
      },
    });

    updatePatient({
      where: {
        id: patientId,
      },
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
            data: v.vaccinations.map((v: { id: string }) => ({
              vaccinationsValuesId: v.id,
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
        medications: {
          createMany: {
            data: v.medications.map((m: { id: string }) => ({
              medicationsValuesId: m.id,
            })),
          },
        },
        examResults: {
          createMany: {
            data: v.examResults.map((r: { id: string }) => ({
              examResultsValuesId: r.id,
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
        surgeries: {
          createMany: {
            data: v.surgeries.map((s: { id: string }) => ({
              surgeriesValuesId: s.id,
            })),
          },
        },
        healthPlans: {
          createMany: {
            data: v.healthPlans.map((h: { id: string }) => ({
              healthPlansValuesId: h.id,
            })),
          },
        },
      },
    });
  }

  if (!patient) {
    return <div>Paciente não encontrado</div>;
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
            <Tabs
              defaultValue={tab}
              onValueChange={(value) => setTab(value as PatientTabs)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
                <TabsTrigger value="address">Endereço</TabsTrigger>
                <TabsTrigger value="social">Informações Sociais</TabsTrigger>
                <TabsTrigger value="medical">Informações Médicas</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <PersonalInfoForm />
              </TabsContent>

              <TabsContent value="address">
                <AddressInfoForm />
              </TabsContent>

              <TabsContent value="social">
                <SocialInfoForm />
              </TabsContent>

              <TabsContent value="medical">
                <MedicalInfoForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
