"use client";

import { CardTitle } from "~/components/ui/card";
import { Small } from "~/components/ui/typography";
import { api } from "~/trpc/react";

export function PatientTitle({ patientId }: { patientId: string }) {
  const [patient] = api.patient.findUnique.useSuspenseQuery({
    where: {
      id: patientId,
    },
    include: {
      appointments: true,
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
  });

  return (
    <CardTitle>
      <Small>Paciente: </Small>{" "}
      <span className="font-bold">{patient?.name}</span>
    </CardTitle>
  );
}
