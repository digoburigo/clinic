import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import MultipleSelector, {
  type Option,
} from "~/components/ui/multiple-selector";

import { useDebounce } from "@uidotdev/usehooks";
import { Skeleton } from "~/components/ui/skeleton";
import { useTRPC } from "~/trpc/react";
import type { MedicalInfoForm } from "./types";

import { useMutation, useQuery } from "@tanstack/react-query";

export function VaccinationsField() {
  const trpc = useTRPC();
  const { control, setValue } = useFormContext<MedicalInfoForm>();

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 300);

  const { data, isFetching } = useQuery(
    trpc.vaccinationsValues.findMany.queryOptions(
      {
        where: {
          value: {
            contains: debouncedSearch,
          },
        },
      },
      {
        enabled: debouncedSearch.length > 2,
        placeholderData: (prev) => prev,
      },
    ),
  );

  const { mutateAsync: createVaccination } = useMutation(
    trpc.vaccinationsValues.create.mutationOptions({
      onSuccess: async (data) => {
        toast.success("Vacina criada com sucesso!");
      },
      onError: (error) => {
        toast.error("Erro ao criar vacina. Tente novamente.");
      },
    }),
  );

  const formattedOptions =
    data?.map((item) => ({
      id: item.id,
      label: item.value,
      value: item.value,
    })) ?? [];

  return (
    <FormField
      control={control}
      name="vaccinations"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel required>Vacinação</FormLabel>
          <FormControl>
            <MultipleSelector
              {...field}
              isFetching={isFetching}
              options={formattedOptions}
              onSearchSync={(value) => {
                setSearch(value);
                return formattedOptions;
              }}
              creatable
              onChange={async (value) => {
                const vaccinationWithoutId = value.find((item) => !item.id);
                if (vaccinationWithoutId) {
                  const withId = await createVaccination({
                    data: {
                      value: vaccinationWithoutId.value,
                    },
                  });

                  if (!withId) {
                    return;
                  }

                  const formattedWithId = {
                    id: withId.id,
                    label: withId.value,
                    value: withId.value,
                  } as Option;
                  setValue("vaccinations", [
                    ...value.filter(
                      (item) => item.value !== formattedWithId.value,
                    ),
                    formattedWithId,
                  ]);
                } else {
                  setValue("vaccinations", [...value]);
                }
              }}
              placeholder="Pesquisar vacinas..."
              loadingIndicator={<Skeleton className="h-10 w-full" />}
              emptyIndicator={
                <p className="text-muted-foreground w-full text-center text-sm leading-10">
                  Nenhuma vacina encontrada.
                </p>
              }
            />
          </FormControl>
          {fieldState.error && (
            <FormMessage>{fieldState.error.message}</FormMessage>
          )}
          <FormDescription>
            Digite mais de 2 caracteres para pesquisar vacinas.
          </FormDescription>
        </FormItem>
      )}
    />
  );
}
