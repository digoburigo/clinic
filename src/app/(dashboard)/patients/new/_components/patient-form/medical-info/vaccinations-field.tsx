import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { FormDescription, FormMessage } from "~/components/ui/form";
import { FormControl } from "~/components/ui/form";
import { FormLabel } from "~/components/ui/form";
import { FormField } from "~/components/ui/form";
import { FormItem } from "~/components/ui/form";
import MultipleSelector, { type Option } from "~/components/ui/multiple-selector";

import { api } from "~/trpc/react";
import type { MedicalInfoForm } from "./types";
import { useDebounce } from "@uidotdev/usehooks";
import { Skeleton } from "~/components/ui/skeleton";

export function VaccinationsField() {
  const { control, setValue } = useFormContext<MedicalInfoForm>();

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 300);

  const {
    data,
    isFetching,
  } = api.vaccinationsValues.findMany.useQuery(
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
  );

  const { mutateAsync: createVaccination } =
    api.vaccinationsValues.create.useMutation({
      onSuccess: async (data) => {
        toast.success("Vacina criada com sucesso!");
      },
      onError: (error) => {
        toast.error("Erro ao criar vacina. Tente novamente.");
      },
    });

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
          <FormLabel required>
            Vacinação
          </FormLabel>
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
              loadingIndicator={
                <Skeleton className="w-full h-10" />
              }
              emptyIndicator={
                <p className="text-muted-foreground text-sm w-full text-center leading-10">
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


