import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import StepperDemo from "~/components/custom-stepper";
import type { Metadata } from "next";
import PatientForm from "./_components/patient-form/patient-form";

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
