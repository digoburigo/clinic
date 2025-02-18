import { api } from "~/trpc/server";
import NewAppointmentForm from "./_components/new-appointment-form";

export default async function Page({
  params,
}: {
  params: { id: string; appointmentId: string };
}) {
  const p = await params;

  void api.patient.findUnique.prefetch({
    where: {
      id: p.id,
    },
  });

  return <NewAppointmentForm patientId={p.id} />;
}
