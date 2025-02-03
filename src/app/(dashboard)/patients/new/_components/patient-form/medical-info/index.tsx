import { VaccinationsField } from "./vaccinations-field";
import { AllergiesField } from "./allergies-field";
import { MedicationsField } from "./medications-field";
import { ExamResultsField } from "./exam-results-field";
import { ComorbiditiesField } from "./comorbidities-field";
import { SurgeriesField } from "./surgeries-field";
import { HealthPlansField } from "./health-plans-field";

export function MedicalInfoForm() {
  return (
    <div className="space-y-4">
      <VaccinationsField />

      <HealthPlansField />

      <AllergiesField />

      <MedicationsField />

      <ExamResultsField />

      <ComorbiditiesField />

      <SurgeriesField />
    </div>
  );
}
