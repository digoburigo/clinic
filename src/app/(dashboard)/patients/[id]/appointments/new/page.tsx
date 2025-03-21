import { prefetch, trpc } from "~/trpc/server";
import NewAppointmentForm from "./_components/new-appointment-form";

export default async function Page({
  params,
}: {
  params: { id: string; appointmentId: string };
}) {
  const p = await params;

  prefetch(
    trpc.patient.findUnique.queryOptions({
      where: {
        id: p.id,
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
    }),
  );

  return <NewAppointmentForm patientId={p.id} />;
}
