import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { Metadata } from "next";
import PatientForm from "./_components/new-patient-form";

export const metadata: Metadata = {
  title: "Adicionar Paciente",
  description: "Adicione um novo paciente",
};

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo paciente</CardTitle>
      </CardHeader>
      <CardContent>
        <PatientForm />
      </CardContent>
    </Card>
  );
}
