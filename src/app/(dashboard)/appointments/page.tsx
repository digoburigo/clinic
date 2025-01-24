import type { Metadata } from "next";
import { AppointmentsList } from "~/components/appointments-list";

export const metadata: Metadata = {
  title: "Consultas",
  description: "Lista de consultas",
};

export default function Page() {
  return <AppointmentsList patientId="m5gr84i9" />;
}
