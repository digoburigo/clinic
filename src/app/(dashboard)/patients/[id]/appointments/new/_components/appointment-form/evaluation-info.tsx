import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { FormDescription, FormMessage } from "~/components/ui/form";
import { FormControl } from "~/components/ui/form";
import { FormLabel } from "~/components/ui/form";
import { FormField } from "~/components/ui/form";
import { FormItem } from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import MultipleSelector from "~/components/ui/multiple-select";
import { InlineCode } from "~/components/ui/typography";

const optionSchema = z.object({
  id: z.string().optional(),
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

export const evaluationSchema = z.object({
  evaluation: z.string().min(1, {
    message: "Avaliação é obrigatório.",
  }),
  cids: z.array(optionSchema).min(1, {
    message: "CID é obrigatório",
  }),
});

export type EvaluationForm = z.infer<typeof evaluationSchema>;

export function EvaluationForm() {
  const { control, setValue } = useFormContext<EvaluationForm>();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data, isFetching } = api.cid.findMany.useQuery(
    {
      take: 20,
      where: {
        OR: [
          { code: { contains: debouncedSearch } },
          { description: { contains: debouncedSearch } },
        ],
      },
    },
    {
      enabled: debouncedSearch.length > 1,
    },
  );

  const formattedOptions =
    data?.map((item) => ({
      id: item.id,
      label: `${item.code} - ${item.description}`,
      value: item.code,
    })) ?? [];

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="evaluation"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel required>Informações Objetivas</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Digite a avaliação do paciente"
                className="min-h-[150px]"
              />
            </FormControl>
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="cids"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel required>CIDs</FormLabel>
            <FormControl>
              <MultipleSelector
                {...field}
                isFetching={isFetching}
                options={formattedOptions}
                onSearchSync={(value) => {
                  setSearch(value);
                  return formattedOptions;
                }}
                onChange={(value) => {
                  setValue("cids", [...value]);
                }}
                placeholder="Pesquisar CIDs..."
                loadingIndicator={
                  <p className="text-muted-foreground w-full text-center leading-10">
                    Carregando...
                  </p>
                }
                emptyIndicator={
                  <p className="text-muted-foreground w-full text-center leading-10">
                    Nenhum CID encontrado.
                  </p>
                }
              />
            </FormControl>
            <FormDescription>
              Digite o código do CID ou pesquise por descrição. Pressione{" "}
              <InlineCode className="text-xs">Enter</InlineCode> ou clique sobre
              o item para adicionar.
            </FormDescription>
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        )}
      />
    </div>
  );
}
