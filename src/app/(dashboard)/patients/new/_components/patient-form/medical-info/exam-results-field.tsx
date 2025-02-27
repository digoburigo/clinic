import { useDebounce } from "@uidotdev/usehooks";
import { CalendarIcon, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useTRPC } from "~/trpc/react";
import type { MedicalInfoForm } from "./types";

import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import MultipleSelector, {
  type Option,
} from "~/components/ui/multiple-selector";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

interface ExamResult {
  type: string;
  result: string;
  date: string;
}

export function ExamResultsField() {
  const trpc = useTRPC();
  const { control, setValue } = useFormContext<MedicalInfoForm>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "examResults",
  });
  console.log(`ExamResultsField fields:`, JSON.stringify(fields, null, 2));
  console.log(`New exam structure from append:`, {
    type: [],
    result: "",
    date: new Date(),
  });

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

  const formattedOptions = useMemo(
    () =>
      data?.map((item) => ({
        id: item.id,
        label: item.value,
        value: item.value,
      })) ?? [],
    [data],
  );

  return (
    <FormItem className="space-y-4">
      <div className="flex items-center gap-8">
        <FormLabel>Resultados dos exames</FormLabel>
        <Button
          type="button"
          variant={"outline"}
          size="sm"
          onClick={() => append({ type: [], result: "", date: new Date() })}
        >
          Adicionar exame
        </Button>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <p className="text-muted-foreground text-sm">Exame {index + 1}</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <Trash />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remover exame {index + 1}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2">
            {/* --- TIPO --- */}
            {/* <FormField
              control={control}
              name={`examResults.${index}.type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Sangue" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={control}
              name={`examResults.${index}.type`}
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Tipo</FormLabel>
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
                      maxSelected={1}
                      onChange={async (value) => {
                        console.log("MultipleSelector onChange value:", value);
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

                          console.log(
                            "Setting value with new formatted option:",
                            [
                              ...value.filter(
                                (item) => item.value !== formattedWithId.value,
                              ),
                              formattedWithId,
                            ],
                          );

                          setValue(`examResults.${index}.type`, [
                            ...value.filter(
                              (item) => item.value !== formattedWithId.value,
                            ),
                            formattedWithId,
                          ]);
                        } else {
                          console.log("Setting existing value:", [...value]);
                          setValue(`examResults.${index}.type`, [...value]);
                        }
                      }}
                      placeholder="Pesquisar tipos de exames..."
                      loadingIndicator={<Skeleton className="h-10 w-full" />}
                      emptyIndicator={
                        <p className="text-muted-foreground w-full text-center leading-10">
                          Nenhum resultado de exame encontrado.
                        </p>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>Selecione apenas um tipo.</FormDescription>
                </FormItem>
              )}
            />
            {/* --- FIM TIPO --- */}

            <FormField
              control={control}
              name={`examResults.${index}.result`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resultado</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={control}
              name={`examResults.${index}.date`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={control}
              name={`examResults.${index}.date`}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "d 'de' MMMM 'de' yyyy")
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date: Date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}
    </FormItem>
  );
}
