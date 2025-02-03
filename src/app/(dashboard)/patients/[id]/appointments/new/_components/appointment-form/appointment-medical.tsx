import { AllergiesField } from "~/app/(dashboard)/patients/new/_components/patient-form/medical-info/allergies-field";
import { ComorbiditiesField } from "~/app/(dashboard)/patients/new/_components/patient-form/medical-info/comorbidities-field";
import { MedicationsField } from "~/app/(dashboard)/patients/new/_components/patient-form/medical-info/medications-field";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export function AppointmentMedical() {
  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Informações médicas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AllergiesField />

        <MedicationsField />

        <ComorbiditiesField />
      </CardContent>
    </Card>
  );
}
