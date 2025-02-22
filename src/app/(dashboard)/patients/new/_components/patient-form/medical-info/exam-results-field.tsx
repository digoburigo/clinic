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

export function ExamResultsField() {
  const trpc = useTRPC();
  const { control, setValue } = useFormContext<MedicalInfoForm>();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { data, isFetching } = useQuery(
    trpc.examResultsValues.findMany.queryOptions(
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

  const { mutateAsync: createResultsExam } = useMutation(
    trpc.examResultsValues.create.mutationOptions({
      onSuccess: async (data) => {
        toast.success("Exame criado com sucesso!");
      },
      onError: (error) => {
        toast.error("Erro ao criar resultado de exame. Tente novamente.");
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
      name="examResults"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Resultados de Exames</FormLabel>
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
                  const withId = await createResultsExam({
                    data: {
                      value: withoutId.value,
                    },
                  });
                  if (!withId) {
                    toast.error(
                      "Erro ao criar resultado de exame. Tente novamente.",
                    );
                    return;
                  }
                  const formattedWithId = {
                    id: withId.id,
                    label: withId.value,
                    value: withId.value,
                  } as Option;
                  setValue("examResults", [
                    ...value.filter(
                      (item) => item.value !== formattedWithId.value,
                    ),
                    formattedWithId,
                  ]);
                } else {
                  setValue("examResults", [...value]);
                }
              }}
              placeholder="Pesquisar resultados de exames..."
              loadingIndicator={
                <p className="text-muted-foreground w-full text-center leading-10">
                  Carregando...
                </p>
              }
              emptyIndicator={
                <p className="text-muted-foreground w-full text-center leading-10">
                  Nenhum resultado de exame encontrado.
                </p>
              }
            />
          </FormControl>
          <FormMessage />
          <FormDescription>
            Digite mais de 2 caracteres para pesquisar resultados de exames.
          </FormDescription>
        </FormItem>
      )}
    />
  );
}
