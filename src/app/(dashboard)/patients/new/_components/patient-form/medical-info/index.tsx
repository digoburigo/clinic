import { AllergiesField } from "./allergies-field";
import { ComorbiditiesField } from "./comorbidities-field";
import { ExamResultsField } from "./exam-results-field";
import { HealthPlansField } from "./health-plans-field";
import { MedicationsField } from "./medications-field";
import { SurgeriesField } from "./surgeries-field";
import { VaccinationsField } from "./vaccinations-field";

export function MedicalInfoForm() {
  return (
    <div className="space-y-3">
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
