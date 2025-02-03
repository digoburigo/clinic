import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { FormMessage } from "~/components/ui/form";
import { FormControl } from "~/components/ui/form";
import { FormLabel } from "~/components/ui/form";
import { FormField } from "~/components/ui/form";
import { FormItem } from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";

export const planSchema = z.object({
  plan: z.string().optional(),
});
export type PlanForm = z.infer<typeof planSchema>;

export function PlanForm() {
  const { control } = useFormContext<PlanForm>();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="plan"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel htmlFor={field.name} required>
              Informações do Plano
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Digite o plano de tratamento"
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
