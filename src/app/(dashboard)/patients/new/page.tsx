import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import StepperDemo from "~/components/custom-stepper";

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
