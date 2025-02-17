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

export const objectiveSchema = z.object({
  objective: z.string().nonempty({
    message: "Informações objetivas é obrigatório.",
  }),
});

export type ObjectiveForm = z.infer<typeof objectiveSchema>;

export function ObjectiveForm() {
  const { control } = useFormContext<ObjectiveForm>();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="objective"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel required>Informações Objetivas</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Digite as informações objetivas do paciente"
                className="min-h-[150px]"
              />
            </FormControl>
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        )}
      />
    </div>
  );
}
