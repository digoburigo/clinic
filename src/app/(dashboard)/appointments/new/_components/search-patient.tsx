import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";

import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";

import type { Patient } from "@zenstackhq/runtime/models";

import { Check } from "lucide-react";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

interface SearchProps {
  selectedResult?: Patient;
  onSelectResult: (patient: Patient) => void;
}

export function SearchPatient({ selectedResult, onSelectResult }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectResult = (patient: Patient) => {
    onSelectResult(patient);

    // OPTIONAL: reset the search query upon selection
    // setSearchQuery('');
  };

  return (
    <Command
      shouldFilter={false}
      className="h-auto rounded-lg border border-b-0 shadow-md"
    >
      <CommandInput
        value={searchQuery}
        onValueChange={setSearchQuery}
        placeholder="Procurar por paciente"
      />

      <SearchResults
        query={searchQuery}
        selectedResult={selectedResult}
        onSelectResult={handleSelectResult}
      />
    </Command>
  );
}

interface SearchResultsProps {
  query: string;
  selectedResult: SearchProps["selectedResult"];
  onSelectResult: SearchProps["onSelectResult"];
}

function SearchResults({
  query,
  selectedResult,
  onSelectResult,
}: SearchResultsProps) {
  const trpc = useTRPC();
  const debouncedSearchQuery = useDebounce(query, 350);

  const enabled = Boolean(debouncedSearchQuery);

  const {
    data: patients,
    isLoading,
    isError,
  } = useQuery(
    trpc.patient.findMany.queryOptions(
      {
        where: {
          name: { contains: debouncedSearchQuery },
        },
        orderBy: {
          name: "asc",
        },
        take: 20,
      },
      {
        enabled,
      },
    ),
  );

  if (!enabled) return null;

  return (
    <CommandList>
      {isLoading && (
        <div
          className="p-4 text-sm"
          role="status"
          aria-label="Buscando pacientes"
        >
          Searching...
        </div>
      )}

      {!isError && !isLoading && !patients?.length && (
        <div
          className="p-4 text-sm"
          role="status"
          aria-label="Nenhum resultado encontrado"
        >
          Nenhum paciente encontrado
        </div>
      )}

      {isError && (
        <div className="p-4 text-sm" role="alert">
          Erro ao buscar pacientes
        </div>
      )}

      {patients?.map((patient) => {
        return (
          <CommandItem
            key={patient.id}
            onSelect={() => onSelectResult(patient)}
            value={patient.name}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                selectedResult?.id === patient.id ? "opacity-100" : "opacity-0",
              )}
            />
            {patient.name}
          </CommandItem>
        );
      })}
    </CommandList>
  );
}
