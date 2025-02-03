import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import NewAppointmentForm from "./_components/new-appointment-form";

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova consulta</CardTitle>
      </CardHeader>
      <CardContent>
        <NewAppointmentForm />
      </CardContent>
    </Card>
  );
}
