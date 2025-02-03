import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { FormMessage } from "~/components/ui/form";
import { FormControl } from "~/components/ui/form";
import { FormLabel } from "~/components/ui/form";
import { FormField } from "~/components/ui/form";
import { FormItem } from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";

export const subjectiveSchema = z.object({
  motive: z.string().min(1, {
    message: "Motivo deve conter pelo menos 8 caracteres.",
  }),
  subjective: z.string().nonempty({
    message: "Informações subjetivas devem ser preenchidas.",
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
            <FormLabel required>Motivo da consulta</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Digite o motivo da consulta"
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
            <FormLabel required>Informações subjetivas</FormLabel>
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
