import { prefetch, trpc } from "~/trpc/server";
import { AppointmentDetails } from "./appointment-details";

export default async function Page({
  params,
}: {
  params: { id: string; appointmentId: string };
}) {
  const p = await params;

  prefetch(
    trpc.appointment.findUnique.queryOptions({
      where: {
        id: p.appointmentId,
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

  return (
    <AppointmentDetails patientId={p.id} appointmentId={p.appointmentId} />
  );
}
