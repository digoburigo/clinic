import { useDebounce } from "@uidotdev/usehooks";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { FormDescription, FormMessage } from "~/components/ui/form";
import { FormControl } from "~/components/ui/form";
import { FormLabel } from "~/components/ui/form";
import { FormField } from "~/components/ui/form";
import { FormItem } from "~/components/ui/form";
import MultipleSelector, { type Option } from "~/components/ui/multiple-select";
import { api } from "~/trpc/react";
import type { MedicalInfoForm } from "./types";

export function VaccinationsField() {
  const { control } = useFormContext<MedicalInfoForm>();

  const [searchVaccinations, setSearchVaccinations] = useState("");
  const debouncedSearchVaccinations = useDebounce(searchVaccinations, 300);

  const { data, refetch } = api.vaccinationValues.findMany.useQuery(
    {
      where: {
        value: {
          contains: debouncedSearchVaccinations,
        },
      },
    },
    {
      enabled: searchVaccinations.length > 2,
    },
  );

  const { mutateAsync: createVaccination } =
    api.vaccinationValues.create.useMutation({
      onSuccess: async () => {
        await refetch();
        toast.success("Vacina criada com sucesso!");
      },
      onError: (error) => {
        toast.error("Erro ao criar vacina. Tente novamente.");
      },
    });

  return (
    <FormField
      control={control}
      name="vaccinations"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Vacinação</FormLabel>
          <FormControl>
            <MultipleSelector
              {...field}
              options={
                data?.map((item) => ({
                  id: item.id,
                  label: item.value,
                  value: item.value,
                })) ?? []
              }
              onSearch={async (value) => {
                if (value.length < 2) {
                  setSearchVaccinations("");
                  return [];
                }
                setSearchVaccinations(value);
                await refetch();
                const formattedData = data?.map(
                  (item) =>
                    ({
                      id: item.id,
                      label: item.value,
                      value: item.value,
                    }) as Option,
                ) as Option[];
                return formattedData ?? [];
              }}
              defaultOptions={[]}
              creatable
              onChange={async (value) => {
                const vaccinationWithoutId = value.find((item) => !item.id);

                if (vaccinationWithoutId) {
                  await createVaccination({
                    data: {
                      value: vaccinationWithoutId.value,
                    },
                  });
                }
              }}
              placeholder="Pesquisar vacinas..."
              loadingIndicator={
                <p className="text-muted-foreground w-full text-center leading-10">
                  Carregando...
                </p>
              }
              emptyIndicator={
                <p className="text-muted-foreground w-full text-center leading-10">
                  Nenhum resultado encontrado.
                </p>
              }
            />
          </FormControl>
          <FormMessage />
          <FormDescription>
            Digite mais de 2 caracteres para pesquisar vacinas.
          </FormDescription>
        </FormItem>
      )}
    />
  );
}
