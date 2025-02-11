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

export function HealthPlansField() {
  const { control, setValue } = useFormContext<MedicalInfoForm>();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data, isFetching } = api.healthPlansValues.findMany.useQuery(
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

  const { mutateAsync: createHealthPlan } =
    api.healthPlansValues.create.useMutation({
      onSuccess: async (data) => {
        toast.success("Plano de saúde criado com sucesso!");
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
      name="healthPlans"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel required>Planos de saúde</FormLabel>
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
                  const withId = await createHealthPlan({
                    data: {
                      value: withoutId.value,
                    },
                  });
                  if (!withId) {
                    toast.error(
                      "Erro ao criar plano de saúde. Tente novamente.",
                    );
                    return;
                  }
                  const formattedWithId = {
                    id: withId.id,
                    label: withId.value,
                    value: withId.value,
                  } as Option;
                  setValue("healthPlans", [
                    ...value.filter(
                      (item) => item.value !== formattedWithId.value,
                    ),
                    formattedWithId,
                  ]);
                } else {
                  setValue("healthPlans", [...value]);
                }
              }}
              placeholder="Pesquisar planos de saúde..."
              loadingIndicator={
                <p className="text-muted-foreground w-full text-center leading-10">
                  Carregando...
                </p>
              }
              emptyIndicator={
                <p className="text-muted-foreground w-full text-center leading-10">
                  Nenhum plano de saúde encontrado.
                </p>
              }
            />
          </FormControl>
          {fieldState.error && (
            <FormMessage>{fieldState.error.message}</FormMessage>
          )}
          <FormDescription>
            Digite mais de 2 caracteres para pesquisar planos de saúde.
          </FormDescription>
        </FormItem>
      )}
    />
  );
}
