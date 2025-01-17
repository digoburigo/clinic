import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useStepper } from "./ui/stepper";
import { StepperFormActions } from "./custom-stepper";

const SecondFormSchema = z.object({
  estado: z.string().nonempty({
    message: "Estado is required.",
  }),
  municipio: z.string().nonempty({
    message: "Município is required.",
  }),
  cep: z.string().min(8, {
    message: "CEP must be at least 8 characters.",
  }),
  bairro: z.string().nonempty({
    message: "Bairro is required.",
  }),
  logradouro: z.string().nonempty({
    message: "Logradouro is required.",
  }),
  numero: z.string().nonempty({
    message: "Número is required.",
  }),
  complemento: z.string().optional(),
});

export function SecondStepForm() {
  const { nextStep } = useStepper();

  const form = useForm<z.infer<typeof SecondFormSchema>>({
    resolver: zodResolver(SecondFormSchema),
    defaultValues: {
      estado: "",
      municipio: "",
      cep: "",
      bairro: "",
      logradouro: "",
      numero: "",
      complemento: "",
    },
  });

  function onSubmit(data: z.infer<typeof SecondFormSchema>) {
    nextStep();
    toast.success("Parabéns você completou o segundo passo!");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="estado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu estado" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="municipio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Município</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu município" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cep"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu CEP" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bairro"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu bairro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="logradouro"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logradouro</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu logradouro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="numero"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input placeholder="Digite o número" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="complemento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complemento</FormLabel>
              <FormControl>
                <Input placeholder="Digite o complemento (opcional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <StepperFormActions />
      </form>
    </Form>
  );
}
