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
import { useDebounce } from "@uidotdev/usehooks";
export function MedicationsField() {
  const { control, setValue } = useFormContext<MedicalInfoForm>();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { data, isFetching } = api.medicationsValues.findMany.useQuery(
    {
      where: {
        value: {
          contains: debouncedSearch,
        },
      },
    },
    {
      enabled: debouncedSearch.length > 2,
    },
  );

  const { mutateAsync: createMedication } =
    api.medicationsValues.create.useMutation({
      onSuccess: async (data) => {
        toast.success("Medicamento criado com sucesso!");
      },
      onError: (error) => {
        toast.error("Erro ao criar medicamento. Tente novamente.");
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
      name="medications"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Medicamentos crônicos</FormLabel>
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
                const withoutId = value.find((item) => !item.id);
                if (withoutId) {
                  const withId = await createMedication({
                    data: {
                      value: withoutId.value,
                    },
                  });
                  if (!withId) {
                    toast.error("Erro ao criar medicamento. Tente novamente.");
                    return;
                  }
                  const formattedWithId = {
                    id: withId.id,
                    label: withId.value,
                    value: withId.value,
                  } as Option;
                  setValue("medications", [
                    ...value.filter(
                      (item) => item.value !== formattedWithId.value,
                    ),
                    formattedWithId,
                  ]);
                } else {
                  setValue("medications", [...value]);
                }
              }}
              placeholder="Pesquisar medicamentos..."
              loadingIndicator={
                <p className="text-muted-foreground w-full text-center leading-10">
                  Carregando...
                </p>
              }
              emptyIndicator={
                <p className="text-muted-foreground w-full text-center leading-10">
                  Nenhum medicamento encontrado.
                </p>
              }
            />
          </FormControl>
          <FormMessage />
          <FormDescription>
            Digite mais de 2 caracteres para pesquisar medicamentos.
          </FormDescription>
        </FormItem>
      )}
    />
  );
}
