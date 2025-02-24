import { useDebounce } from "@uidotdev/usehooks";
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
import { useTRPC } from "~/trpc/react";
import type { MedicalInfoForm } from "./types";

import { useMutation, useQuery } from "@tanstack/react-query";

export function SurgeriesField() {
  const trpc = useTRPC();
  const { control, setValue } = useFormContext<MedicalInfoForm>();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data, isFetching } = useQuery(
    trpc.surgeriesValues.findMany.queryOptions(
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
    ),
  );

  const { mutateAsync: createSurgery } = useMutation(
    trpc.surgeriesValues.create.mutationOptions({
      onSuccess: async (data) => {
        toast.success("Cirurgia criada com sucesso!");
      },
      onError: (error) => {
        toast.error("Erro ao criar cirurgia. Tente novamente.");
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
      name="surgeries"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>Cirurgias</FormLabel>
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
                  const withId = await createSurgery({
                    data: {
                      value: withoutId.value,
                    },
                  });
                  if (!withId) {
                    toast.error("Erro ao criar cirurgia. Tente novamente.");
                    return;
                  }
                  const formattedWithId = {
                    id: withId.id,
                    label: withId.value,
                    value: withId.value,
                  } as Option;
                  setValue("surgeries", [
                    ...value.filter(
                      (item) => item.value !== formattedWithId.value,
                    ),
                    formattedWithId,
                  ]);
                } else {
                  setValue("surgeries", [...value]);
                }
              }}
              placeholder="Pesquisar cirurgias..."
              loadingIndicator={
                <p className="text-muted-foreground w-full text-center leading-10">
                  Carregando...
                </p>
              }
              emptyIndicator={
                <p className="text-muted-foreground w-full text-center leading-10">
                  Nenhuma cirurgia encontrada.
                </p>
              }
            />
          </FormControl>
          {fieldState.error && (
            <FormMessage>{fieldState.error.message}</FormMessage>
          )}
          <FormDescription>
            Digite mais de 2 caracteres para pesquisar cirurgias.
          </FormDescription>
        </FormItem>
      )}
    />
  );
}
