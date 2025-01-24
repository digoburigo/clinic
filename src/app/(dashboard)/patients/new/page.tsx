import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import StepperDemo from "~/components/custom-stepper";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Adicionar Paciente",
  description: "Adicione um novo paciente",
};

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paciente</CardTitle>
      </CardHeader>
      <CardContent>
        <StepperDemo />
      </CardContent>
    </Card>
  );
}
