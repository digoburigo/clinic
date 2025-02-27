import { ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import type { Patient } from "@zenstackhq/runtime/models";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { SearchPatient } from "./search-patient";
const POPOVER_WIDTH = "w-[250px]";

export function SearchPatientCombobox({
  onSelectResult,
}: {
  onSelectResult: (patientId: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Patient | undefined>();

  const handleSetActive = React.useCallback((patient: Patient) => {
    setSelected(patient);
    onSelectResult(patient.id);
    // OPTIONAL: close the combobox upon selection
    // setOpen(false);
  }, []);

  const displayName = selected ? selected.name : "Selecione um paciente";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn("mb-4 justify-between", POPOVER_WIDTH)}
        >
          {displayName}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent side="bottom" className={cn("p-0", POPOVER_WIDTH)}>
        <SearchPatient
          selectedResult={selected}
          onSelectResult={handleSetActive}
        />
      </PopoverContent>
    </Popover>
  );
}
