import { PatientDetails } from "../_components/patient-details";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { api, HydrateClient } from "~/trpc/server";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { DataTableSkeleton } from "~/components/ui/data-table/data-table-skeleton";
import { PatientAppointmentsList } from "../_components/patient-appointments-list";
import { PatientTitle } from "../_components/patient-title";

export default async function Page({ params }: { params: { id: string } }) {
  const p = await params;

  void api.patient.findUnique.prefetch({
    where: {
      id: p.id,
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
    <HydrateClient>
      <Card>
        <CardHeader>
          <PatientTitle patientId={p.id} />
        </CardHeader>
        <CardContent className="space-y-4">
          <Suspense
            fallback={
              <div className="space-y-16">
                <DataTableSkeleton
                  columnCount={6}
                  searchableColumnCount={1}
                  filterableColumnCount={2}
                  cellWidths={[
                    "10rem",
                    "40rem",
                    "12rem",
                    "12rem",
                    "8rem",
                    "8rem",
                  ]}
                />
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-[300px] w-full" />
                </div>
              </div>
            }
          >
            <PatientAppointmentsList patientId={p.id} />
            <PatientDetails patientId={p.id} />
          </Suspense>
        </CardContent>
      </Card>
    </HydrateClient>
  );
}
