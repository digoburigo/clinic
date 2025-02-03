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

export function ComorbiditiesField() {
  const { control, setValue } = useFormContext<MedicalInfoForm>();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data, isFetching } = api.comorbiditiesValues.findMany.useQuery(
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

  const { mutateAsync: createComorbidity } =
    api.comorbiditiesValues.create.useMutation({
      onSuccess: async (data) => {
        toast.success("Comorbidade criada com sucesso!");
      },
      onError: (error) => {
        toast.error("Erro ao criar comorbidade. Tente novamente.");
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
      name="comorbidities"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Comorbidades</FormLabel>
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
                  const withId = await createComorbidity({
                    data: {
                      value: withoutId.value,
                    },
                  });
                  if (!withId) {
                    toast.error("Erro ao criar comorbidade. Tente novamente.");
                    return;
                  }
                  const formattedWithId = {
                    id: withId.id,
                    label: withId.value,
                    value: withId.value,
                  } as Option;
                  setValue("comorbidities", [
                    ...value.filter(
                      (item) => item.value !== formattedWithId.value,
                    ),
                    formattedWithId,
                  ]);
                } else {
                  setValue("comorbidities", [...value]);
                }
              }}
              placeholder="Pesquisar comorbidades..."
              loadingIndicator={
                <p className="text-muted-foreground w-full text-center leading-10">
                  Carregando...
                </p>
              }
              emptyIndicator={
                <p className="text-muted-foreground w-full text-center leading-10">
                  Nenhuma comorbidade encontrada.
                </p>
              }
            />
          </FormControl>
          <FormMessage />
          <FormDescription>
            Digite mais de 2 caracteres para pesquisar comorbidades.
          </FormDescription>
        </FormItem>
      )}
    />
  );
}
