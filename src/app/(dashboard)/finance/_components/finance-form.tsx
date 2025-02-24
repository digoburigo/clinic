"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { withMask } from "use-mask-input";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

const financeFormSchema = z.object({
  date: z.string().min(1, "Data é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.string().min(1, "Valor é obrigatório"),
  type: z.enum(["income", "expense"], {
    required_error: "Tipo é obrigatório",
  }),
});

type FinanceFormData = z.infer<typeof financeFormSchema>;

const cleanCurrencyValue = (value: string) => {
  return value.replace(/[^\d,]/g, "").replace(",", ".");
};

export default function FinanceForm() {
  const form = useForm<FinanceFormData>({
    resolver: zodResolver(financeFormSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      description: "",
      amount: "",
      type: "income",
    },
  });

  const onSubmit = (data: FinanceFormData) => {
    const cleanedData = {
      ...data,
      amount: cleanCurrencyValue(data.amount),
    };
    console.log(cleanedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel required>Tipo</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-4"
                >
                  <FormItem className="flex items-center space-y-0 space-x-3">
                    <FormControl>
                      <RadioGroupItem value="income" />
                    </FormControl>
                    <FormLabel className="font-normal">Entrada</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-y-0 space-x-3">
                    <FormControl>
                      <RadioGroupItem value="expense" />
                    </FormControl>
                    <FormLabel className="font-normal">Saída</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Data</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Descrição</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Ex: Pagamento de consulta"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Valor</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="0,00"
                    {...field}
                    ref={(e) => {
                      field.ref(e);
                      withMask("R$")(e);
                    }}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div /> {/* Espaço vazio para manter o grid alinhado */}
        </div>

        <Button type="submit" className="w-full">
          Salvar
        </Button>
      </form>
    </Form>
  );
}
