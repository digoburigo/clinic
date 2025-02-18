import { useFormContext } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";

export const subjectiveSchema = z.object({
  motive: z.string().min(1, {
    message: "Motivo é obrigatório.",
  }),
  subjective: z.string().min(1, {
    message: "Subjetivo é obrigatório.",
  }),
});

export type SubjectiveForm = z.infer<typeof subjectiveSchema>;

export function SubjectiveForm() {
  const { control } = useFormContext<SubjectiveForm>();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="motive"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Motivo</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Informe o motivo da consulta para esse paciente"
                className="min-h-[150px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="subjective"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Subjetivo</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Digite as informações subjetivas"
                className="min-h-[150px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
