import Link from "next/link";
import { AppointmentsList } from "~/components/appointments-list";
import { Button } from "~/components/ui/button";

export default async function Page({ params }: { params: { id: string } }) {
  const p = await params;

  return (
    <>
      <div>PatientPage with id: {p.id}</div>
      <AppointmentsList patientId={p.id} />
    </>
  ) 
  
}
