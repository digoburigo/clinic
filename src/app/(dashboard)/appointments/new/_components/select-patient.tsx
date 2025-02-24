"use client";

import { useState } from "react";
import NewAppointmentForm from "./new-appointment-form";
import { SearchPatientCombobox } from "./search-patient-combobox";

export function SelectPatient() {
  const [patientId, setPatientId] = useState<string | null>(null);

  return (
    <div>
      <SearchPatientCombobox onSelectResult={setPatientId} />
      {patientId ? <NewAppointmentForm patientId={patientId} /> : null}
    </div>
  );
}
